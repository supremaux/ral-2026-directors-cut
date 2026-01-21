import axios from "axios";

const handleUpload = async (file) => {
  const formData = new FormData();
  formData.append("file", file); // 'file' deve ser o mesmo nome usado no backend (upload.single('file'))

  try {
    const response = await axios.post(
      "http://localhost:3001/upload-fatura",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    console.log("Upload bem-sucedido:", response.data);
  } catch (error) {
    console.error("Erro ao enviar arquivo:", error);
  }
};

export default handleUpload;
