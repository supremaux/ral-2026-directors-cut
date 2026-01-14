import { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import styles from "./ListarArquivos.module.css";
import { useNavigate } from "react-router-dom";
import { IoMdCloudDownload } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

export const ListarArquivos = () => {
  const [files, setFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAuthenticated, setIsauthenticated] = useState(false);
  const filesPerPage = 20;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/login");
  };

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get("http://localhost:3001/download");
        setFiles(
          response.data.map((file) => ({
            name: file,
            date: new Date().toLocaleString(),
          }))
        );
      } catch (error) {
        console.error("Erro ao listar arquivos:", error);
      }
    };

    fetchFiles();
  }, []);

  const handleDelete = async (fileName) => {
    try {
      await axios.delete(`http://localhost:3001/delete/${fileName}`);
      setFiles(files.filter((file) => file.name !== fileName));
      alert("Arquivo deletado com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar arquivo:", error);
      alert("Erro ao deletar arquivo.");
    }
  };

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentFiles = filteredFiles.slice(indexOfFirstFile, indexOfLastFile);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <section>
      <Container className="mb-5">
        <Row>
          <Col>
            <h2>Arquivos Disponíveis para Download</h2>
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
              {currentFiles.map((file, index) => (
                <tr key={index}>
                  <td>{file.name}</td>
                  <td>{file.date}</td>
                  <td>
                    <a
                      href={`http://localhost:3001/download/${file.name}`}
                      download
                      className={styles.downloadButton}
                    >
                      <IoMdCloudDownload /> Download
                    </a>
                    <button
                      onClick={() =>
                        window.open(
                          `http://localhost:3001/download/${file.name}`,
                          "_blank"
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
              ))}
            </tbody>
          </table>
        </div>
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
            )
          )}
        </div>
      </Container>
    </section>
  );
};

export default ListarArquivos;
