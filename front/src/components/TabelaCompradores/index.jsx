// TabelaCompradores.jsx
import React, { useContext, useState, useEffect } from "react";
import styles from "./TabelaCompradores.module.css";
import { Col, Container, Row, Toast, ToastContainer } from "react-bootstrap";
import { MdCloudUpload } from "react-icons/md";
import { FaCheck, FaPlus } from "react-icons/fa";
import { FormContext } from "../../FormContext";
import axios from "axios";

const TabelaCompradores = () => {
  const { formData, setFormData } = useContext(FormContext);
  const [compradores, setCompradores] = useState(
    formData.compradores && formData.compradores.length > 0
      ? formData.compradores
      : [{ cpfCnpj: "", nome: "", quantidade: 0, valorTotal: 0 }],
  );
  const [totalVendido, setTotalVendido] = useState(formData.totalVendido || 0);
  const [erro, setErro] = useState("");
  const [file, setFile] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("danger");

  // Atualiza o contexto global sempre que `compradores` mudar
  useEffect(() => {
    setFormData((prev) => ({ ...prev, compradores, totalVendido }));
  }, [compradores, totalVendido, setFormData]);

  const handleInputChange = (index, campo, valor) => {
    const novosCompradores = [...compradores];
    novosCompradores[index][campo] =
      campo === "quantidade" || campo === "valorTotal"
        ? Number(valor) || 0
        : valor;
    setCompradores(novosCompradores);
  };

  const adicionarLinha = () => {
    setCompradores([
      ...compradores,
      { cpfCnpj: "", nome: "", quantidade: 0, valorTotal: 0 },
    ]);
  };

  const calcularTotalDeclarado = () => {
    return compradores.reduce(
      (total, comprador) => total + comprador.quantidade,
      0,
    );
  };

  const calcularTotalVendido = () => {
    return compradores.reduce(
      (total, comprador) => total + comprador.valorTotal,
      0,
    );
  };

  const validarRequisito = () => {
    const totalDeclarado = calcularTotalDeclarado();
    if (totalVendido > 0 && totalDeclarado < 0.8 * totalVendido) {
      setToastMessage(
        "A listagem não corresponde a um mínimo de 80% do quantitativo vendido.",
      );
      setToastVariant("danger");
      setShowToast(true);
    } else {
      setToastMessage(
        "Validação bem-sucedida! Clique em 'Próxima' para continuar.",
      );
      setToastVariant("success");
      setShowToast(true);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Selecione um arquivo primeiro.");
      return;
    }

    const data = new FormData();
    data.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:3001/upload-notas-fiscais",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      // Atualiza o contexto com o link do arquivo
      setFormData({
        ...formData,
        arquivoNotasFiscaisUrl: `http://localhost:3001${response.data.fileUrl}`,
      });

      alert("Arquivo enviado com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar arquivo:", error);
      alert("Erro ao enviar arquivo.");
    }
  };

  // Atualiza o total vendido sempre que os compradores mudarem
  useEffect(() => {
    const total = calcularTotalVendido();
    setTotalVendido(total);
  }, [compradores]);

  return (
    <Container className={styles.tabelaContainer}>
      <div>
        <div className={styles.totalVendido}>
          <label>
            Total Vendido: &nbsp;
            <input
              type="number"
              value={totalVendido}
              onChange={(e) => setTotalVendido(Number(e.target.value) || 0)}
              readOnly
            />
          </label>
        </div>
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>CPF/CNPJ Comprador</th>
              <th>Nome/Razão Social</th>
              <th>Quantidade (t)</th>
              <th>Valor Total (R$)</th>
            </tr>
          </thead>
          <tbody>
            {compradores.map((comprador, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    value={comprador.cpfCnpj}
                    onChange={(e) =>
                      handleInputChange(index, "cpfCnpj", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={comprador.nome}
                    onChange={(e) =>
                      handleInputChange(index, "nome", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={comprador.quantidade}
                    onChange={(e) =>
                      handleInputChange(index, "quantidade", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={comprador.valorTotal}
                    onChange={(e) =>
                      handleInputChange(index, "valorTotal", e.target.value)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.botoesFinal}>
          <button className="btn btn-primary" onClick={adicionarLinha}>
            <FaPlus /> &nbsp; Adicionar Linha
          </button>
          <button className="btn btn-success" onClick={validarRequisito}>
            <FaCheck /> &nbsp; Validar Requisito
          </button>
          {erro && <p style={{ color: "red" }}>{erro}</p>}
        </div>
        <div className={styles.uploadContainer + " mt-4"}>
          <h4 className="mx-2">Enviar Arquivo de Notas Fiscais &nbsp;</h4>
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpload} className="btn btn-success">
            <MdCloudUpload /> &nbsp; Enviar
          </button>
        </div>
      </div>

      {/* ToastContainer para exibir o Toast */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={5000}
          autohide
          bg={toastVariant}
        >
          <Toast.Header>
            <strong className="me-auto">
              {toastVariant === "success" ? "Sucesso" : "Erro"}
            </strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default TabelaCompradores;
