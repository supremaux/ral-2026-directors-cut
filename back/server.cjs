const express = require("express");
const multer = require("multer");
const cors = require("cors");
const bodyParser = require("body-parser");
const PapaParse = require("papaparse");
const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

// Inicialize o app do Express
const app = express();
app.use(cors());
app.use(express.json());

// Middleware para processar formulários
app.use(express.urlencoded({ extended: true }));

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
    const filePath = `faturas/${fileName}`;

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

    // (Código para gerar o arquivo XLSX permanece o mesmo)
    // ...
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
    console.log("Iniciando listagem de arquivos...");
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

// Rota para baixar um arquivo específico
app.get("/api/download-file/:filename", async (req, res) => {
  try {
    const { filename } = req.params;
    console.log("Tentando baixar o arquivo:", filename);

    const { data, error } = await supabase.storage
      .from("relatorios")
      .download(`download/${filename}`);

    if (error) {
      console.error("Erro ao baixar arquivo:", error);
      return res
        .status(500)
        .json({ error: "Erro ao baixar arquivo.", details: error.message });
    }

    if (!data) {
      console.error("Arquivo não encontrado ou vazio.");
      return res.status(404).json({ error: "Arquivo não encontrado." });
    }

    console.log("Arquivo baixado com sucesso. Tamanho:", data.byteLength);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    res.send(data);
  } catch (error) {
    console.error("Erro ao baixar arquivo:", error);
    res
      .status(500)
      .json({ error: "Erro ao baixar arquivo.", details: error.message });
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
console.log("Caminho para users.json:", usersPath);

const users = JSON.parse(fs.readFileSync(usersPath, "utf8"));
console.log("Usuários carregados:", users);

// Rota de login
app.post("/api/login", (req, res) => {
  try {
    console.log("Recebendo requisição de login:", req.body);
    const { username, password } = req.body;

    if (!username || !password) {
      console.log("Usuário ou senha não fornecidos.");
      return res
        .status(400)
        .json({ success: false, message: "Usuário ou senha não fornecidos." });
    }

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
      .json({
        success: false,
        message: "Erro interno no servidor.",
        details: error.message,
      });
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

// Tratamento de Erros
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});
