// server.js
import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import Papa from "papaparse";
import { fileURLToPath } from "url";
import fs from "fs";
import bodyParser from "body-parser";

// Obtenha o caminho do arquivo atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(bodyParser.json()); // Certifique-se de que o middleware de parsing de corpo está configurado

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
    const csv = Papa.unparse([simplifiedData]);

    const csvPath = path.join(__dirname, "download");
    if (!fs.existsSync(csvPath)) {
      fs.mkdirSync(csvPath);
    }

    const csvFileName = `${simplifiedData["Razão Social"].replace(
      /[^a-zA-Z0-9]/g,
      "_"
    )}_${simplifiedData.CNPJ}.csv`;
    fs.writeFileSync(path.join(csvPath, csvFileName), csv);

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

// Iniciar o servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
