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
app.use(
  cors({
    origin: ["http://localhost:5173", "https://ral-2026-full.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

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
    console.log("Dados recebidos para geração do relatório:", dados);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Relatório");

    // Adicione um cabeçalho estilizado
    worksheet.mergeCells("A1:E1");
    worksheet.getCell("A1").value = "Relatório Anual de Lavra";
    worksheet.getCell("A1").font = { size: 16, bold: true };
    worksheet.getCell("A1").alignment = { horizontal: "center" };

    // Adicione os dados cadastrais
    worksheet.addRow([]);
    worksheet.addRow(["Razão Social:", dados["Razão Social"]]);
    worksheet.addRow(["CNPJ:", dados.CNPJ]);
    worksheet.addRow(["Substância Mineral:", dados["Substância Mineral"]]);
    worksheet.addRow([]);

    // Termo de Responsabilidade
    worksheet.addRow(["Termo de Responsabilidade:"]);
    worksheet.addRow([dados["Termo de Responsabilidade"] || "Não enviado"]);
    worksheet.addRow([]);

    // Substância Mineral
    worksheet.addRow(["Substância Mineral:"]);
    worksheet.addRow([dados["Substância Mineral"] || "Não enviado"]);
    worksheet.addRow([]);

    // Estoque
    worksheet.addRow(["Estoque:"]);
    worksheet.addRow([
      ["Possui Estoque", dados.temEstoque || ""],
      ["Unidade de Estoque", dados.unidadeMedEstoque || ""],
      ["Estoque Lavrado", JSON.stringify(dados.estoqueLavra || [])],
    ]);
    worksheet.addRow([]);

    // Produção Detonado Britado
    worksheet.addRow(["Produção Detonado Britado:"]);
    worksheet.addRow([
      ["Substância Produzida", dados.substanciaProduzida || ""],
      ["Unidade de Produção", dados.unidadeDetonadoBritado || ""],
      ["Produção - Detonado", JSON.stringify(dados.detonadoBritado || [])],
    ]);
    worksheet.addRow([]);

    // Módulo de Beneficiamento
    worksheet.addRow(["Módulo de Beneficiamento:"]);
    worksheet.addRow([
      ["Unidade de Medida", dados.unidadeMedida || ""],
      ["Venda - Produção", JSON.stringify(dados.salesData || [])],
    ]);
    worksheet.addRow([]);

    // Mão de Obra
    worksheet.addRow(["Mão de Obra:"]);
    worksheet.addRow([JSON.stringify(dados.salesByCategory || [])]);
    worksheet.addRow([]);

    // Custo de Lavra
    worksheet.addRow(["Custo de Lavra:"]);
    worksheet.addRow([JSON.stringify(dados.costData || [])]);
    worksheet.addRow([]);

    // Insumos
    worksheet.addRow(["Insumos:"]);
    worksheet.addRow([JSON.stringify(dados.insumosSelecionados || [])]);
    worksheet.addRow([]);

    // Matriz Energetica
    worksheet.addRow(["Matriz Energetica:"]);
    worksheet.addRow([dados.matrizEnergetica || "Não enviado"]);
    worksheet.addRow([dados.faturaEnergia || "Não enviado"]);
    worksheet.addRow([]);

    // Impostos
    worksheet.addRow(["Impostos:"]);
    worksheet.addRow([JSON.stringify(dados.apuracaoMensal || [])]);
    worksheet.addRow([]);

    // Investimentos
    worksheet.addRow(["Investimentos:"]);
    worksheet.addRow([JSON.stringify(dados.confirmaInvest || [])]);
    worksheet.addRow([JSON.stringify(dados.aquisi || [])]);
    worksheet.addRow([JSON.stringify(dados.valorInvest || [])]);
    worksheet.addRow([]);

    // Lista de Compradores
    worksheet.addRow(["Lista de Compradores:"]);
    worksheet.addRow([JSON.stringify(dados.compradores || [])]);
    worksheet.addRow([JSON.stringify(dados.totalVendido || [])]);
    worksheet.addRow([dados.arquivoNotasFiscaisUrl || "Não enviado"]);
    worksheet.addRow([]);

    // Pilha de Estéril
    worksheet.addRow(["Pilha de Estéril:"]);
    worksheet.addRow([JSON.stringify(dados.existePilhaEsteril || [])]);
    worksheet.addRow([JSON.stringify(dados.quantidadeEsteril || [])]);
    worksheet.addRow([]);

    // Insera novos campos abaixo...

    // Formate as colunas para melhor visualização
    worksheet.columns.forEach((column) => {
      column.width = 20;
    });

    // Gere o buffer do arquivo XLSX
    const buffer = await workbook.xlsx.writeBuffer();
    console.log("Buffer gerado com sucesso. Tamanho:", buffer.length); // Log do tamanho do buffer

    // Nome do arquivo XLSX
    const xlsxFileName = `${dados["Razão Social"].replace(/[^a-zA-Z0-9]/g, "_")}_${dados.CNPJ}.xlsx`;

    // Faça upload do arquivo para o Supabase
    const { data: uploadData, error } = await supabase.storage
      .from("relatorios")
      .upload(`download/${xlsxFileName}`, buffer, {
        contentType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

    if (error) {
      console.error("Erro ao fazer upload:", error);
      return res.status(500).json({ error: "Erro ao fazer upload." });
    }

    // Obtenha a URL pública do arquivo
    const { data: urlData } = supabase.storage
      .from("relatorios")
      .getPublicUrl(`download/${xlsxFileName}`);

    console.log("URL pública do arquivo:", urlData.publicUrl); // Log da URL pública

    res.status(200).json({
      message: "Relatório finalizado e XLSX gerado com sucesso!",
      xlsxUrl: urlData.publicUrl,
    });
  } catch (error) {
    console.error("Erro ao finalizar relatório:", error);
    res.status(500).json({ error: "Erro ao finalizar relatório." });
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
