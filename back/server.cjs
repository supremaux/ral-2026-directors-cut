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

// Inicialize o app do Express
const app = express();
app.use(cors());
app.use(bodyParser.json());

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
const supabaseUrl = "https://emfmvsbrfawmsuuwavae.supabase.co";
const supabaseKey =
  process.env.SUPABASE_SECRET_KEY ||
  "sb_secret_bIvVbrrcclCl41CcSIbVYA_AhVm-ssU";
const supabase = createClient(supabaseUrl, supabaseKey);

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
      return res.status(400).send("Nenhum arquivo enviado.");
    }

    const file = req.file;
    const fileExt = file.originalname.split(".").pop();
    const fileName = `${Date.now()}-fatura.${fileExt}`;
    const filePath = `upload/${fileName}`;

    const supabase = createClient(
      "https://emfmvsbrfawmsuuwavae.supabase.co",
      process.env.SUPABASE_SECRET_KEY ||
        "sb_secret_bIvVbrrcclCl41CcSIbVYA_AhVm-ssU",
    );

    const { data, error } = await supabase.storage
      .from("upload")
      .upload(filePath, file.buffer, { contentType: file.mimetype });

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
      const filePath = `upload/${fileName}`;

      const { data, error } = await supabase.storage
        .from("upload")
        .upload(filePath, file.buffer, { contentType: file.mimetype });

      if (error) {
        console.error("Erro ao fazer upload:", error);
        return res.status(500).json({ error: "Erro ao fazer upload." });
      }

      const { data: urlData } = supabase.storage
        .from("upload")
        .getPublicUrl(filePath);

      console.log("URL pública gerada:", urlData.publicUrl);
      res.status(200).json({ fileUrl: urlData.publicUrl });
    } catch (error) {
      console.error("Erro no servidor:", error);
      res.status(500).json({ error: "Erro no servidor." });
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

    // Adicione um cabeçalho estilizado
    worksheet.mergeCells("A1:E1");
    worksheet.getCell("A1").value = "Relatório Anual de Lavra";
    worksheet.getCell("A1").font = { size: 16, bold: true };
    worksheet.getCell("A1").alignment = { horizontal: "center" };

    // Adicione os dados cadastrais
    worksheet.addRow([]);
    worksheet.addRow(["Dados Cadastrais:"]).font = { bold: true };
    worksheet.addRow([
      "Razão Social:",
      dados["Razão Social"] || "Não informado",
    ]);
    worksheet.addRow(["CNPJ:", dados.CNPJ || "Não informado"]);
    worksheet.addRow(["Endereço:", dados.Endereço || "Não informado"]);
    worksheet.addRow(["Telefone:", dados.Telefone || "Não informado"]);
    worksheet.addRow(["E-mail:", dados["E-mail"] || "Não informado"]);
    worksheet.addRow([]);

    // Substância Mineral
    worksheet.addRow(["Substância Mineral:"]).font = { bold: true };
    worksheet.addRow([
      "Substância Mineral:",
      dados["Substância Mineral"] || "Não informado",
    ]);
    worksheet.addRow([]);

    // Termo de Responsabilidade
    worksheet.addRow(["Termo de Responsabilidade:"]).font = { bold: true };
    worksheet.addRow([dados["Termo Assinado"] || "Não enviado"]);
    worksheet.addRow([]);

    // Estoque
    worksheet.addRow(["Estoque:"]).font = { bold: true };
    worksheet.addRow([
      "Possui Estoque:",
      dados["Possui Estoque"] || "Não informado",
    ]);
    worksheet.addRow([
      "Unidade de Estoque:",
      dados["Unidade de Estoque"] || "Não informado",
    ]);
    worksheet.addRow([
      "Estoque Lavrado:",
      dados["Estoque Lavrado"] || "Não informado",
    ]);
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
        item.mes || "Não informado",
        item.quantidadeDetonado || 0,
        item.britado || 0,
        item.lavrado || 0,
        item.vendido || 0,
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
      worksheet.addRow([item.description || "Não informado", item.value || 0]);
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
        item.mes || "Não informado",
        item.icms || 0,
        item.pis || 0,
        item.cofins || 0,
        item.cfem || 0,
      ]);
    });
    worksheet.addRow([]);

    // Mão de Obra
    worksheet.addRow(["Mão de Obra:"]).font = { bold: true };
    worksheet.addRow([]);

    // Dados de mão de obra
    let maoDeObra = {};
    try {
      maoDeObra =
        typeof dados["Mão de Obra"] === "string"
          ? JSON.parse(dados["Mão de Obra"])
          : {};
    } catch (error) {
      console.error("Erro ao processar Mão de Obra:", error);
    }

    Object.entries(maoDeObra).forEach(([cargo, quantidade]) => {
      worksheet.addRow([cargo || "Não informado", quantidade || 0]);
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
        item.description || "Não informado",
        item.quantity || 0,
      ]);
    });
    worksheet.addRow([]);

    // Investimentos
    worksheet.addRow(["Investimentos:"]).font = { bold: true };
    worksheet.addRow([
      "Houve Investimento?",
      dados["Houve Investimento?"] || "Não informado",
    ]);
    worksheet.addRow([
      "Aquisições do Ano:",
      dados["Setor de Aquisições"] || "Não informado",
    ]);
    worksheet.addRow([
      "Valor Investido:",
      dados["Valor Investido"] || "Não informado",
    ]);
    worksheet.addRow([]);

    // Lista de Compradores
    worksheet.addRow(["Lista de Compradores:"]).font = { bold: true };
    worksheet.addRow([]);

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
        comprador.cpfCnpj || "Não informado",
        comprador.nome || "Não informado",
        comprador.quantidade || 0,
        comprador.valorTotal || 0,
      ]);
    });
    worksheet.addRow(["Total Vendido (R$):", dados["Total Vendido (R$)"] || 0]);
    worksheet.addRow([]);

    // Pilha de Estéril
    worksheet.addRow(["Pilha de Estéril:"]).font = { bold: true };
    worksheet.addRow([
      "Existe Pilha de Estéril?",
      dados["Existe Pilha de Estéril?"] || "Não informado",
    ]);
    worksheet.addRow([
      "Quantidade de Estéril:",
      dados["Quantidade de Estéril"] || "Não informado",
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
app.get("/files", async (req, res) => {
  try {
    const { data, error } = await supabase.storage.from("upload").list();

    if (error) {
      return res
        .status(500)
        .json({ error: "Não foi possível listar os arquivos." });
    }

    const fileUrls = data.map((file) => {
      const { publicURL } = supabase.storage
        .from("upload")
        .getPublicUrl(file.name);
      return publicURL;
    });

    res.json(fileUrls);
  } catch (error) {
    console.error("Erro ao listar arquivos:", error);
    res.status(500).json({ error: "Erro ao listar arquivos." });
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
app.get("/api/download-file/:filename", async (req, res) => {
  try {
    const { filename } = req.params;
    console.log("Tentando baixar o arquivo:", filename);

    // Baixar o arquivo do Supabase
    const { data, error } = await supabase.storage
      .from("relatorios")
      .download(`download/${filename}`);

    if (error) {
      console.error("Erro ao baixar arquivo:", error);
      return res.status(500).json({ error: "Erro ao baixar arquivo." });
    }

    // Verificar se o arquivo foi baixado corretamente
    if (!data) {
      console.error("Arquivo não encontrado ou vazio.");
      return res.status(404).json({ error: "Arquivo não encontrado." });
    }

    // Enviar o arquivo como resposta
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    res.send(data);
  } catch (error) {
    console.error("Erro ao baixar arquivo:", error);
    res.status(500).json({ error: "Erro ao baixar arquivo." });
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

// Carregue o users.json com caminho absoluto
const users = require(path.join(__dirname, "users.json"));
console.log("Usuários carregados:", users); // Log para debug

// Rota de login
app.post("/api/login", (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("Tentativa de login:", username, password); // Log para debug

    const user = users.find(
      (u) => u.username === username && u.password === password,
    );

    if (user) {
      console.log("Login bem-sucedido para:", username); // Log para debug
      res.status(200).json({ success: true, message: "Login bem-sucedido!" });
    } else {
      console.log("Usuário ou senha incorretos para:", username); // Log para debug
      res
        .status(401)
        .json({ success: false, message: "Usuário ou senha incorretos!" });
    }
  } catch (error) {
    console.error("Erro no servidor:", error); // Log para debug
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
