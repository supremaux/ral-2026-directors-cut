// server.cjs
const express = require("express");
const multer = require("multer");
const papaparse = require("papaparse");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

// Carregando usuários do arquivo JSON
const users = require("./users.json");

// Verifique se users é um array
if (!Array.isArray(users)) {
  console.error("Erro: users.json não é um array.");
  process.exit(1);
}

// Diretório atual
const downloadDir = path.join(__dirname, "download");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Configurar o Multer para salvar arquivos na pasta 'uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads/"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Rota para upload de termos
app.post("/upload-termo", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("Nenhum arquivo enviado.");
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  res.status(200).json({ fileUrl });
});

// Rota para upload de faturas
app.post("/upload-fatura", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("Nenhum arquivo enviado.");
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  res.status(200).json({ fileUrl });
});

// Rota para finalizar relatório e gerar CSV
app.post("/api/finalizar-relatorio", async (req, res) => {
  try {
    if (!req.body) {
      throw new Error("Nenhum dado recebido.");
    }

    const dados = req.body;

    // Garantir que todos os campos sejam strings ou números simples
    const simplifiedData = {};
    for (const key in dados) {
      simplifiedData[key] =
        typeof dados[key] === "object"
          ? JSON.stringify(dados[key])
          : dados[key];
    }

    // Certifique-se de que os dados estão em um formato que o papaparse consiga processar
    const csv = papaparse.unparse([simplifiedData]);

    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir);
    }

    const csvFileName = `${simplifiedData["Razão Social"].replace(
      /[^a-zA-Z0-9]/g,
      "_"
    )}_${simplifiedData.CNPJ}.csv`;
    fs.writeFileSync(path.join(downloadDir, csvFileName), csv);

    res
      .status(200)
      .json({ message: "Relatório finalizado e CSV gerado com sucesso!" });
  } catch (error) {
    console.error("Erro ao finalizar relatório:", error);
    res.status(500).json({ error: "Erro ao finalizar relatório." });
  }
});

// Tornar a pasta 'uploads' acessível estaticamente
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rota para listar arquivos
app.get("/files", (req, res) => {
  const directoryPath = path.join(__dirname, "uploads");
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).send("Não foi possível listar os arquivos.");
    }
    const fileUrls = files.map((file) => `/uploads/${file}`);
    res.json(fileUrls);
  });
});

// Painel do engenheiro
// Listar arquivos
app.get("/download", (req, res) => {
  fs.readdir(downloadDir, (err, files) => {
    if (err) {
      return res.status(500).send("Unable to scan files!");
    }
    res.json(files);
  });
});

// Baixar arquivo
app.get("/download/:filename", (req, res) => {
  const filePath = path.join(downloadDir, req.params.filename);
  res.download(filePath);
});

// Deletar arquivo
app.delete("/delete/:filename", (req, res) => {
  const filePath = path.join(downloadDir, req.params.filename);
  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).send("Unable to delete the file");
    }
    res.send("File deleted successfully");
  });
});

// Rota para fazer login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
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
});

// Rota para fazer logout
app.post("/logout", (req, res) => {
  res.status(200).json({ success: true, message: "Logout bem-sucedido!" });
});

// Iniciar o servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
