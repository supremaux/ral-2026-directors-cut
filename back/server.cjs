// server.cjs
const express = require("express");
const multer = require("multer");
const papaparse = require("papaparse");
const cors = require("cors");
const bodyParser = require("body-parser");
const { createClient } = require("@supabase/supabase-js");

// Carregando usuários do arquivo JSON
const users = require("./users.json");

// Verifique se users é um array
if (!Array.isArray(users)) {
  console.error("Erro: users.json não é um array.");
  process.exit(1);
}

// Configuração do Supabase
const supabaseUrl = "https://emfmvsbrfawmsuuwavae.supabase.co";
const supabaseKey =
  process.env.SUPABASE_SECRET_KEY ||
  "sb_secret_bIvVbrrcclCl41CcSIbVYA_AhVm-ssU";
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
app.use(bodyParser.json());
app.use(cors());

const upload = multer({ storage: multer.memoryStorage() }); // Armazena o arquivo na memória

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

// Rota para upload de notas fiscais (usando Supabase Storage)
app.post("/upload-notas-fiscais", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("Nenhum arquivo enviado.");
    }

    const file = req.file;
    const fileExt = file.originalname.split(".").pop();
    const fileName = `${Date.now()}-nota-fiscal.${fileExt}`;
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

// Rota para finalizar relatório e gerar CSV (usando Supabase Storage)
app.post("/api/finalizar-relatorio", async (req, res) => {
  try {
    if (!req.body) {
      throw new Error("Nenhum dado recebido.");
    }

    const dados = req.body;
    const simplifiedData = {};
    for (const key in dados) {
      simplifiedData[key] =
        typeof dados[key] === "object"
          ? JSON.stringify(dados[key])
          : dados[key];
    }

    const csv = papaparse.unparse([simplifiedData]);
    const csvFileName = `${simplifiedData["Razão Social"].replace(
      /[^a-zA-Z0-9]/g,
      "_",
    )}_${simplifiedData.CNPJ}.csv`;
    const filePath = `download/${csvFileName}`;

    const { data, error } = await supabase.storage
      .from("download")
      .upload(filePath, csv, { contentType: "text/csv" });

    if (error) {
      console.error("Erro ao fazer upload do CSV:", error);
      return res.status(500).json({ error: "Erro ao finalizar relatório." });
    }

    const { publicURL } = supabase.storage
      .from("download")
      .getPublicUrl(filePath);

    res.status(200).json({
      message: "Relatório finalizado e CSV gerado com sucesso!",
      fileUrl: publicURL,
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

// Rota para listar arquivos de download (usando Supabase Storage)
app.get("/download", async (req, res) => {
  try {
    const { data, error } = await supabase.storage.from("download").list();

    if (error) {
      return res
        .status(500)
        .json({ error: "Não foi possível listar os arquivos." });
    }

    res.json(data);
  } catch (error) {
    console.error("Erro ao listar arquivos de download:", error);
    res.status(500).json({ error: "Erro ao listar arquivos de download." });
  }
});

// Rota para baixar arquivo (usando Supabase Storage)
app.get("/download/:filename", async (req, res) => {
  try {
    const { filename } = req.params;
    const { data, error } = await supabase.storage
      .from("download")
      .download(filename);

    if (error) {
      return res
        .status(500)
        .json({ error: "Não foi possível baixar o arquivo." });
    }

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    res.send(data);
  } catch (error) {
    console.error("Erro ao baixar arquivo:", error);
    res.status(500).json({ error: "Erro ao baixar arquivo." });
  }
});

// Rota para deletar arquivo (usando Supabase Storage)
app.delete("/delete/:filename", async (req, res) => {
  try {
    const { filename } = req.params;
    const { error } = await supabase.storage
      .from("download")
      .remove([filename]);

    if (error) {
      return res
        .status(500)
        .json({ error: "Não foi possível deletar o arquivo." });
    }

    res.send("Arquivo deletado com sucesso!");
  } catch (error) {
    console.error("Erro ao deletar arquivo:", error);
    res.status(500).json({ error: "Erro ao deletar arquivo." });
  }
});

// Rota para fazer login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password,
  );

  if (user) {
    res.status(200).json({ success: true, message: "Login bem-sucedido!" });
  } else {
    res
      .status(401)
      .json({ success: false, message: "Usuário ou senha incorretos!" });
  }
});

// Rota para impedir que usuários não logados vejam a página do engenheiro
app.get("/paineladmin", (req, res) => {
  const token = req.headers.authorization; // Exemplo de obtenção do token de autenticação

  if (!token) {
    return res.status(401).json({ success: false, message: "Acesso negado!" });
  }
  res.status(200).json({ success: true, message: "Acesso permitido!" });
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
