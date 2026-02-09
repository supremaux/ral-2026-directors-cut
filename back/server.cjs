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

    // Crie um novo workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Relatório Anual de Lavra");

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

    // Adicione a tabela de produção detonada/britada
    worksheet.addRow(["Produção Detonada e Britada"]);
    worksheet.addRow([
      "Mês",
      "Quantidade Detonada",
      "Britado",
      "Lavrado",
      "Vendido",
    ]);

    // Parseie os dados de produção
    const producao = JSON.parse(dados["Produção - Detonado"]);
    producao.forEach((item) => {
      worksheet.addRow([
        item.mes,
        item.quantidadeDetonado,
        item.britado,
        item.lavrado,
        item.vendido,
      ]);
    });

    // Adicione a tabela de custos de lavra
    worksheet.addRow([]);
    worksheet.addRow(["Custos de Lavra"]);
    worksheet.addRow(["Descrição", "Valor (R$/ano)"]);

    // Parseie os dados de custos
    const custos = JSON.parse(dados["Custo de Lavra"]);
    custos.forEach((item) => {
      worksheet.addRow([item.description, item.value]);
    });

    // Adicione a tabela de impostos
    worksheet.addRow([]);
    worksheet.addRow(["Impostos/Tributos"]);
    worksheet.addRow(["Mês", "ICMS", "PIS", "COFINS", "CFEM"]);

    // Parseie os dados de impostos
    const impostos = JSON.parse(dados["Apuração Mensal"]);
    impostos.forEach((item) => {
      worksheet.addRow([item.mes, item.icms, item.pis, item.cofins, item.cfem]);
    });

    // Formate as colunas para melhor visualização
    worksheet.columns.forEach((column) => {
      column.width = 20;
    });

    // Salve o arquivo XLSX em um buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Nome do arquivo XLSX
    const xlsxFileName = `${dados["Razão Social"].replace(/[^a-zA-Z0-9]/g, "_")}_${dados.CNPJ}.xlsx`;

    // Faz upload do XLSX para o Supabase Storage
    const { data: uploadData, error } = await supabase.storage
      .from("relatorios")
      .upload(xlsxFileName, buffer, {
        contentType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

    if (error) {
      console.error("Erro ao fazer upload do XLSX:", error);
      return res.status(500).json({
        error: "Erro ao fazer upload do XLSX.",
        details: error.message,
      });
    }

    // Obtém a URL pública do arquivo
    const { data: urlData } = supabase.storage
      .from("relatorios")
      .getPublicUrl(xlsxFileName);

    res.status(200).json({
      message: "Relatório finalizado e XLSX gerado com sucesso!",
      xlsxUrl: urlData.publicUrl,
    });
  } catch (error) {
    console.error("Erro ao finalizar relatório:", error);
    res.status(500).json({
      error: "Erro ao finalizar relatório.",
      details: error.message,
    });
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
    const { data, error } = await supabase.storage
      .from("relatorios")
      .download(`download/${filename}`);

    if (error) {
      console.error("Erro ao baixar arquivo:", error);
      return res.status(500).json({ error: "Erro ao baixar arquivo." });
    }

    res.setHeader("Content-Type", "text/csv");
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
