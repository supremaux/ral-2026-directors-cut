const express = require("express");
const multer = require("multer");
const cors = require("cors");
const bodyParser = require("body-parser");
const PapaParse = require("papaparse");
const Papa = require("papaparse");
const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

// Inicialize o app do Express
const app = express();
app.use(cors());
app.use(express.json());

// Checagem de saída
app.get("/api/health", (req, res) => {
  console.log("Backend está rodando!");
  res.status(200).json({ status: "ok" });
});

// Configuração do CORS
const corsOptions = {
  origin: [
    "https://ral-2026-directors-cut.vercel.app",
    "http://localhost:5173",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

// Configuração do Multer
const upload = multer({ storage: multer.memoryStorage() });

// Configuração do Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Variáveis de ambiente SUPABASE_URL ou SUPABASE_SECRET_KEY não estão definidas.",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Teste a conexão com o Supabase
async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.storage.listBuckets();
    if (error) {
      console.error("Erro ao listar buckets:", error);
    } else {
      console.log("Buckets disponíveis:", data);
    }
  } catch (error) {
    console.error("Erro ao conectar ao Supabase:", error);
  }
}

testSupabaseConnection();

// Identificando o bucket upload
const bucketName = "upload"; // Certifique-se de que este nome está correto

// Rota para upload de termos (usando Supabase Storage)
app.post("/upload-termo", async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).send("Nenhum arquivo enviado.");
    }
    const file = req.files.file;
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-termo.${fileExt}`;
    const filePath = `upload/${fileName}`;

    const { data, error } = await supabase.storage
      .from("upload")
      .upload(filePath, file.data, { contentType: file.mimetype });

    if (error) {
      console.error("Erro ao fazer upload:", error);
      return res.status(500).json({ error: "Erro ao fazer upload." });
    }

    const { publicURL } = supabase.storage
      .from("upload")
      .getPublicUrl(filePath);

    res.status(200).json({ fileUrl: publicURL });
  } catch (error) {
    console.error("Erro no servidor:", error);
    res.status(500).json({ error: "Erro no servidor." });
  }
});

// Rota para upload de faturas (usando Supabase Storage)
app.post("/upload-fatura", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      console.log("Nenhum arquivo recebido no backend.");
      return res.status(400).send("Nenhum arquivo enviado.");
    }

    const file = req.file;
    const fileExt = file.originalname.split(".").pop();
    const fileName = `${Date.now()}-fatura.${fileExt}`;
    const filePath = `faturas/${fileName}`; // Caminho dentro do bucket 'relatorios'

    const { data, error } = await supabase.storage
      .from("relatorios") // Usando o bucket 'relatorios'
      .upload(filePath, file.buffer, { contentType: file.mimetype });

    if (error) {
      console.error("Erro ao fazer upload:", error);
      return res
        .status(500)
        .json({ error: "Erro ao fazer upload.", details: error.message });
    }

    const { data: urlData } = supabase.storage
      .from("relatorios") // Usando o bucket 'relatorios'
      .getPublicUrl(filePath);

    console.log("URL pública gerada:", urlData.publicUrl);
    res.status(200).json({ fileUrl: urlData.publicUrl });
  } catch (error) {
    console.error("Erro no servidor:", error);
    res
      .status(500)
      .json({ error: "Erro no servidor.", details: error.message });
  }
});

// Rota para upload de notas fiscais
app.post(
  "/api/upload-notas-fiscais",
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        console.log("Nenhum arquivo recebido no backend.");
        return res.status(400).send("Nenhum arquivo enviado.");
      }

      const file = req.file;
      const fileExt = file.originalname.split(".").pop();
      const fileName = `${Date.now()}-nota-fiscal.${fileExt}`;
      const filePath = `notas_fiscais/${fileName}`;

      const { data, error } = await supabase.storage
        .from("relatorios")
        .upload(filePath, file.buffer, { contentType: file.mimetype });

      if (error) {
        console.error("Erro ao fazer upload:", error);
        return res
          .status(500)
          .json({ error: "Erro ao fazer upload.", details: error.message });
      }

      const { data: urlData } = supabase.storage
        .from("relatorios")
        .getPublicUrl(filePath);

      console.log("URL pública gerada:", urlData.publicUrl);
      res.status(200).json({ fileUrl: urlData.publicUrl });
    } catch (error) {
      console.error("Erro no servidor:", error);
      res
        .status(500)
        .json({ error: "Erro no servidor.", details: error.message });
    }
  },
);

// Rota para finalizar relatório e gerar XLSX (usando Supabase Storage)
app.post("/api/finalizar-relatorio", async (req, res) => {
  try {
    const dados = req.body;
    console.log("Dados recebidos:", JSON.stringify(dados, null, 2));

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Relatório Anual de Lavra");

    // Função para garantir que um valor seja numérico
    const toNumber = (value) => {
      if (value === undefined || value === null || value === "") {
        return 0;
      }
      return Number(value);
    };

    // Função para garantir que um valor seja string
    const toString = (value) => {
      if (value === undefined || value === null) {
        return "Não informado";
      }
      return String(value);
    };

    // Adicione um cabeçalho estilizado
    worksheet.mergeCells("A1:E1");
    worksheet.getCell("A1").value = "Relatório Anual de Lavra";
    worksheet.getCell("A1").font = { size: 16, bold: true };
    worksheet.getCell("A1").alignment = { horizontal: "center" };

    // Adicione os dados cadastrais
    worksheet.addRow([]);
    worksheet.addRow(["Dados Cadastrais:"]).font = { bold: true };
    worksheet.addRow(["Razão Social:", toString(dados["Razão Social"])]);
    worksheet.addRow(["CNPJ:", toString(dados.CNPJ)]);
    worksheet.addRow(["Endereço:", toString(dados.Endereço)]);
    worksheet.addRow(["Telefone:", toString(dados.Telefone)]);
    worksheet.addRow(["E-mail:", toString(dados["E-mail"])]);
    worksheet.addRow([]);

    // Substância Mineral
    worksheet.addRow(["Substância Mineral:"]).font = { bold: true };
    worksheet.addRow([
      "Substância Mineral:",
      toString(dados["Substância Mineral"]),
    ]);
    worksheet.addRow([]);

    // Termo de Responsabilidade
    worksheet.addRow(["Termo de Responsabilidade:"]).font = { bold: true };
    worksheet.addRow([toString(dados["Termo Assinado"] || "Não enviado")]);
    worksheet.addRow([]);

    // Estoque
    worksheet.addRow(["Estoque:"]).font = { bold: true };
    worksheet.addRow(["Possui Estoque:", toString(dados["Possui Estoque"])]);
    worksheet.addRow([
      "Unidade de Estoque:",
      toString(dados["Unidade de Estoque"]),
    ]);
    worksheet.addRow(["Estoque Lavrado:", toString(dados["Estoque Lavrado"])]);
    worksheet.addRow([]);

    // Produção Detonado Britado
    worksheet.addRow(["Produção Detonado Britado:"]).font = { bold: true };
    worksheet.addRow([]);

    // Cabeçalho da tabela de produção
    worksheet.addRow([
      "Mês",
      "Quantidade Detonada",
      "Britado",
      "Lavrado",
      "Vendido",
    ]);

    // Dados de produção
    let producao = [];
    try {
      producao =
        typeof dados["Produção - Detonado"] === "string"
          ? JSON.parse(dados["Produção - Detonado"])
          : [];
    } catch (error) {
      console.error("Erro ao processar Produção - Detonado:", error);
    }

    producao.forEach((item) => {
      worksheet.addRow([
        toString(item.mes),
        toNumber(item.quantidadeDetonado),
        toNumber(item.britado),
        toNumber(item.lavrado),
        toNumber(item.vendido),
      ]);
    });
    worksheet.addRow([]);

    // Custo de Lavra
    worksheet.addRow(["Custos de Lavra:"]).font = { bold: true };
    worksheet.addRow([]);

    // Cabeçalho da tabela de custos
    worksheet.addRow(["Descrição", "Valor (R$/ano)"]);

    // Dados de custos
    let custos = [];
    try {
      custos =
        typeof dados["Custo de Lavra"] === "string"
          ? JSON.parse(dados["Custo de Lavra"])
          : [];
    } catch (error) {
      console.error("Erro ao processar Custo de Lavra:", error);
    }

    custos.forEach((item) => {
      worksheet.addRow([toString(item.description), toNumber(item.value)]);
    });
    worksheet.addRow([]);

    // Impostos
    worksheet.addRow(["Impostos/Tributos:"]).font = { bold: true };
    worksheet.addRow([]);

    // Cabeçalho da tabela de impostos
    worksheet.addRow(["Mês", "ICMS", "PIS", "COFINS", "CFEM"]);

    // Dados de impostos
    let impostos = [];
    try {
      impostos =
        typeof dados["Apuração Mensal"] === "string"
          ? JSON.parse(dados["Apuração Mensal"])
          : [];
    } catch (error) {
      console.error("Erro ao processar Apuração Mensal:", error);
    }

    impostos.forEach((item) => {
      worksheet.addRow([
        toString(item.mes),
        toNumber(item.icms),
        toNumber(item.pis),
        toNumber(item.cofins),
        toNumber(item.cfem),
      ]);
    });
    worksheet.addRow([]);

    // Mão de Obra
    worksheet.addRow(["Mão de Obra:"]).font = { bold: true };
    worksheet.addRow([]);

    // Cabeçalho da tabela de mão de obra
    worksheet.addRow(["Categoria", "Empregado", "Terceirizado"]);

    // Dados de mão de obra
    let maoDeObra = {};
    try {
      const maoDeObraString = dados["Mão de Obra"] || "{}";
      maoDeObra = JSON.parse(maoDeObraString);
    } catch (error) {
      console.error("Erro ao processar Mão de Obra:", error);
    }

    Object.entries(maoDeObra).forEach(([categoria, valores]) => {
      const employed = parseFloat(valores.employed) || 0;
      const outsourced = parseFloat(valores.outsourced) || 0;
      worksheet.addRow([categoria, employed, outsourced]);
    });
    worksheet.addRow([]);

    // Insumos
    worksheet.addRow(["Insumos:"]).font = { bold: true };
    worksheet.addRow([]);

    // Cabeçalho da tabela de insumos
    worksheet.addRow(["Descrição", "Quantidade"]);

    // Dados de insumos
    let insumos = [];
    try {
      insumos =
        typeof dados["Insumos da Lavra"] === "string"
          ? JSON.parse(dados["Insumos da Lavra"])
          : [];
    } catch (error) {
      console.error("Erro ao processar Insumos da Lavra:", error);
    }

    insumos.forEach((item) => {
      worksheet.addRow([
        toString(item.item || item.description),
        toNumber(item.quantidade),
      ]);
    });
    worksheet.addRow([]);

    // Matriz Energética e Fatura de Energia
    worksheet.addRow(["Matriz Energética e Fatura de Energia:"]).font = {
      bold: true,
    };
    worksheet.addRow([]);

    // Exibir Matriz Energética
    worksheet.addRow([
      "Matriz Energética:",
      dados["Matriz Energetica"] || "Não informada",
    ]);

    // Exibir Fatura de Energia
    const faturaEnergia = dados["Fatura de Energia"] || "Não enviada";
    worksheet.addRow(["Fatura de Energia:", faturaEnergia]);
    worksheet.addRow([]);

    console.log("Dados recebidos no backend:", JSON.stringify(dados, null, 2));
    console.log("Fatura de Energia:", dados["Fatura de Energia"]);

    // Investimentos
    worksheet.addRow(["Investimentos:"]).font = { bold: true };
    worksheet.addRow([
      "Houve Investimento?",
      toString(dados["Houve Investimento?"]),
    ]);
    worksheet.addRow([
      "Setor de Aquisições:",
      toString(dados["Setor de Aquisições"]),
    ]);
    worksheet.addRow(["Valor Investido:", toString(dados["Valor Investido"])]);
    worksheet.addRow([]);

    // Lista de Compradores
    worksheet.addRow(["Lista de Compradores:"]).font = { bold: true };
    worksheet.addRow([]);

    // Cabeçalho da tabela de compradores
    worksheet.addRow(["CPF/CNPJ", "Nome", "Quantidade", "Valor Total"]);

    // Dados de compradores
    let compradores = [];
    try {
      compradores =
        typeof dados["Nomes dos Compradores"] === "string"
          ? JSON.parse(dados["Nomes dos Compradores"])
          : [];
    } catch (error) {
      console.error("Erro ao processar Nomes dos Compradores:", error);
    }

    compradores.forEach((comprador) => {
      worksheet.addRow([
        toString(comprador.cpfCnpj),
        toString(comprador.nome),
        toNumber(comprador.quantidade),
        toNumber(comprador.valorTotal),
      ]);
    });
    worksheet.addRow([
      "Total Vendido (R$):",
      toNumber(dados["Total Vendido (R$)"]),
    ]);

    // Exibir Link do Arquivo de Notas Fiscais
    const arquivoNotasFiscaisUrl =
      dados["Arquivo Notas Fiscais"] || "Não enviado";
    worksheet.addRow(["Link do arquivo de notas fiscais:"]);
    worksheet.addRow([arquivoNotasFiscaisUrl]);
    worksheet.addRow([]);

    console.log("Arquivo Notas Fiscais:", dados["Arquivo Notas Fiscais"]);
    console.log(
      "Tipo de dados de Arquivo Notas Fiscais:",
      typeof dados["Arquivo Notas Fiscais"],
    );

    // Pilha de Estéril
    worksheet.addRow(["Pilha de Estéril:"]).font = { bold: true };
    worksheet.addRow([
      "Existe Pilha de Estéril?",
      toString(dados["Existe Pilha de Estéril?"]),
    ]);
    worksheet.addRow([
      "Quantidade de Estéril:",
      toString(dados["Quantidade de Estéril"]),
    ]);
    worksheet.addRow([]);

    // Gere o buffer do arquivo XLSX
    const buffer = await workbook.xlsx.writeBuffer();
    console.log("Buffer gerado com sucesso. Tamanho:", buffer.length);

    if (!buffer || buffer.length === 0) {
      console.error("Buffer vazio ou inválido!");
      return res
        .status(500)
        .json({ error: "Buffer vazio ou inválido ao gerar o arquivo XLSX." });
    }

    // Nome do arquivo XLSX
    const xlsxFileName = `${(dados["Razão Social"] || "sem_razao_social").replace(/[^a-zA-Z0-9]/g, "_")}_${dados.CNPJ || "sem_cnpj"}.xlsx`;

    // Faça upload do arquivo para o Supabase
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("relatorios")
      .upload(`download/${xlsxFileName}`, buffer, {
        contentType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

    if (uploadError) {
      console.error("Erro ao fazer upload:", uploadError);
      return res
        .status(500)
        .json({ error: "Erro ao fazer upload.", details: uploadError.message });
    }

    // Obtenha a URL pública do arquivo
    const { data: urlData } = supabase.storage
      .from("relatorios")
      .getPublicUrl(`download/${xlsxFileName}`);

    if (!urlData.publicUrl) {
      console.error("URL pública não gerada!");
      return res.status(500).json({ error: "URL pública não gerada." });
    }

    res.status(200).json({
      message: "Relatório finalizado e XLSX gerado com sucesso!",
      xlsxUrl: urlData.publicUrl,
    });
  } catch (error) {
    console.error("Erro completo ao finalizar relatório:", error);
    res
      .status(500)
      .json({ error: "Erro ao finalizar relatório.", details: error.message });
  }
});

// Rota para listar arquivos (usando Supabase Storage)
app.get("/api/list-files", async (req, res) => {
  try {
    console.log(
      "Tentando listar arquivos no bucket 'relatorios' na pasta 'download'",
    );

    const { data, error } = await supabase.storage
      .from("relatorios")
      .list("download/", { limit: 100 });

    if (error) {
      console.error("Erro ao listar arquivos:", error);
      return res
        .status(500)
        .json({ error: "Erro ao listar arquivos.", details: error.message });
    }

    console.log("Arquivos listados com sucesso:", data);
    res.status(200).json(data);
  } catch (error) {
    console.error("Erro inesperado ao listar arquivos:", error);
    res.status(500).json({
      error: "Erro inesperado ao listar arquivos.",
      details: error.message,
    });
  }
});

// Rota para listar arquivos no bucket relatorios/pasta download
app.get("/api/list-files", async (req, res) => {
  try {
    const { data, error } = await supabase.storage
      .from("relatorios")
      .list("download/", { limit: 100 });

    if (error) {
      console.error("Erro ao listar arquivos:", error);
      return res.status(500).json({ error: "Erro ao listar arquivos." });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Erro ao listar arquivos:", error);
    res.status(500).json({ error: "Erro ao listar arquivos." });
  }
});

// Rota para baixar um arquivo específico
app.get("/api/list-files", async (req, res) => {
  try {
    console.log(
      "Tentando listar arquivos no bucket 'relatorios' na pasta 'download'",
    );

    const { data, error } = await supabase.storage
      .from("relatorios")
      .list("download/", { limit: 100 });

    if (error) {
      console.error("Erro ao listar arquivos:", error);
      return res
        .status(500)
        .json({ error: "Erro ao listar arquivos.", details: error.message });
    }

    console.log("Arquivos listados com sucesso:", data);
    res.status(200).json(data);
  } catch (error) {
    console.error("Erro inesperado ao listar arquivos:", error);
    res.status(500).json({
      error: "Erro inesperado ao listar arquivos.",
      details: error.message,
    });
  }
});

// Rota para deletar um arquivo específico
app.delete("/api/delete-file/:filename", async (req, res) => {
  try {
    const { filename } = req.params;
    const { error } = await supabase.storage
      .from("relatorios")
      .remove([`download/${filename}`]);

    if (error) {
      console.error("Erro ao deletar arquivo:", error);
      return res.status(500).json({ error: "Erro ao deletar arquivo." });
    }

    res.status(200).json({ message: "Arquivo deletado com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar arquivo:", error);
    res.status(500).json({ error: "Erro ao deletar arquivo." });
  }
});

// Carregar usuários do arquivo JSON
const usersPath = path.join(__dirname, "users.json");
const users = JSON.parse(fs.readFileSync(usersPath, "utf8"));

// Rota de login
app.post("/api/login", (req, res) => {
  try {
    console.log("Recebendo requisição de login:", req.body);
    const { username, password } = req.body;

    const user = users.find(
      (u) => u.username === username && u.password === password,
    );

    if (user) {
      console.log("Login bem-sucedido para:", username);
      res.status(200).json({ success: true, message: "Login bem-sucedido!" });
    } else {
      console.log("Usuário ou senha incorretos para:", username);
      res
        .status(401)
        .json({ success: false, message: "Usuário ou senha incorretos!" });
    }
  } catch (error) {
    console.error("Erro no servidor:", error);
    res
      .status(500)
      .json({ success: false, message: "Erro interno no servidor." });
  }
});

// Rota para fazer logout
app.post("/logout", (req, res) => {
  res.status(200).json({ success: true, message: "Logout bem-sucedido!" });
});

// Iniciar o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
