import axios from "axios";

// Configuração base da API
const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://ral-2026-directors-cut.vercel.app",
  headers: {
    "Content-Type": "application/json",
  },
});

// Função para upload de arquivos
const handleUpload = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await api.post("/upload-fatura", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Upload bem-sucedido:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao enviar arquivo:", error);
    throw error;
  }
};

// Função para listar arquivos
const fetchFiles = async () => {
  try {
    const response = await api.get("/api/list-files");
    console.log("Arquivos listados:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao listar arquivos:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export { handleUpload, fetchFiles };
