// ListarArquivos.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Button } from "react-bootstrap";
import styles from "./ListarArquivos.module.css";
import { useNavigate } from "react-router-dom";
import { IoMdCloudDownload } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

export const ListarArquivos = () => {
  const [files, setFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const filesPerPage = 20;
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (!auth) {
      navigate("/login");
      return;
    }
    setIsAuthenticated(true);
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    if (!isAuthenticated || loading) return;

    const fetchFiles = async () => {
      try {
        const response = await axios.get("/api/list-files");
        if (Array.isArray(response.data)) {
          setFiles(
            response.data.map((file) => ({
              name: file.name,
              date: new Date(
                file.metadata?.created_at || Date.now(),
              ).toLocaleString(),
            })),
          );
        }
      } catch (error) {
        console.error("Erro ao listar arquivos:", error);
        alert("Erro ao listar arquivos. Tente novamente mais tarde.");
      }
    };

    fetchFiles();
  }, [isAuthenticated, loading]);

  const handleDownload = async (fileName) => {
    try {
      console.log("Iniciando download do arquivo:", fileName); // Log do nome do arquivo

      const response = await axios.get(`/api/download-file/${fileName}`, {
        responseType: "blob", // Importante para baixar arquivos binários
      });

      console.log("Resposta recebida. Tamanho:", response.data.size); // Log do tamanho da resposta

      // Crie um link temporário para download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Erro ao baixar arquivo:", error);
      alert("Erro ao baixar arquivo. Tente novamente mais tarde.");
    }
  };

  const handleDelete = async (fileName) => {
    try {
      await axios.delete(`/api/delete-file/${fileName}`);
      setFiles(files.filter((file) => file.name !== fileName));
      alert("Arquivo deletado com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar arquivo:", error);
      alert("Erro ao deletar arquivo. Tente novamente mais tarde.");
    }
  };

  const filteredFiles = files.filter(
    (file) =>
      file.name && file.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentFiles = filteredFiles.slice(indexOfFirstFile, indexOfLastFile);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (!isAuthenticated || loading) {
    return <div>Carregando...</div>;
  }

  return (
    <section>
      <Container className="mb-5">
        <Row>
          <Col>
            <h2>Arquivos Disponíveis para Download</h2>
          </Col>
          <Col>
            <Button
              onClick={() => {
                localStorage.removeItem("auth");
                navigate("/login");
              }}
              variant="danger"
            >
              Sair
            </Button>
          </Col>
          <Col>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Pesquisar..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </Col>
        </Row>
      </Container>
      <Container>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome do Arquivo</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {currentFiles.length > 0 ? (
                currentFiles.map((file, index) => (
                  <tr key={index}>
                    <td>{file.name}</td>
                    <td>{file.date}</td>
                    <td>
                      <button
                        onClick={() => handleDownload(file.name)}
                        className={styles.downloadButton}
                      >
                        <IoMdCloudDownload /> Download
                      </button>
                      <button
                        onClick={() =>
                          window.open(
                            `/api/download-file/${file.name}`,
                            "_blank",
                          )
                        }
                        className={styles.viewButton}
                      >
                        <FaEye /> Visualizar
                      </button>
                      <button
                        onClick={() => handleDelete(file.name)}
                        className={styles.deleteButton}
                      >
                        <MdDeleteForever /> Deletar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">Nenhum arquivo encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {filteredFiles.length > filesPerPage && (
          <div className={styles.paginationContainer}>
            {Array.from(
              { length: Math.ceil(filteredFiles.length / filesPerPage) },
              (_, i) => (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={styles.paginationButton}
                >
                  {i + 1}
                </button>
              ),
            )}
          </div>
        )}
      </Container>
    </section>
  );
};

export default ListarArquivos;
