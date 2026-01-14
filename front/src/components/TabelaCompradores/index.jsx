import React, { useContext, useState } from "react";
import styles from "./TabelaCompradores.module.css";
import { Col, Container, Row } from "react-bootstrap";
import { FormContext } from "../../FormContext";

const TabelaCompradores = () => {
  const { formData, setFormData } = useContext(FormContext);

  const [novosCompradores, setNovosCompradores] = useState([]);

  const apuraCompradores = () => {
    setFormData({ ...formData, compradores, totalVendido, novosCompradores });
    setCompradores([]);
    setNovosCompradores([]);
  };

  const [compradores, setCompradores] = useState([
    { cpfCnpj: "", nome: "", municipio: "", quantidade: 0, valorTotal: 0 },
    { cpfCnpj: "", nome: "", municipio: "", quantidade: 0, valorTotal: 0 },
    { cpfCnpj: "", nome: "", municipio: "", quantidade: 0, valorTotal: 0 },
  ]);

  const [totalVendido, setTotalVendido] = useState(0);
  const [erro, setErro] = useState("");

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
      { cpfCnpj: "", nome: "", municipio: "", quantidade: 0, valorTotal: 0 },
    ]);
  };

  const calcularTotalDeclarado = () => {
    return compradores.reduce(
      (total, comprador) => total + comprador.quantidade,
      0
    );
  };

  const validarRequisito = () => {
    const totalDeclarado = calcularTotalDeclarado();
    if (totalVendido > 0 && totalDeclarado < 0.8 * totalVendido) {
      setErro(
        "A listagem não corresponde a um mínimo de 80% do quantitativo vendido."
      );
    } else {
      setErro("");
    }
  };

  return (
    <Container className={styles.tabelaContainer}>
      <div>
        <div className={styles.totalVendido}>
          <label>
            Total Vendido:
            <input
              type="number"
              value={totalVendido}
              onChange={(e) => setTotalVendido(Number(e.target.value) || 0)}
            />
          </label>
        </div>
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>CPF/CNPJ Comprador</th>
              <th>Nome/Razão Social</th>
              <th>Município</th>
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
                    type="text"
                    value={comprador.municipio}
                    onChange={(e) =>
                      handleInputChange(index, "municipio", e.target.value)
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
          <button onClick={adicionarLinha}>Adicionar Linha</button>
          <button onClick={validarRequisito}>Validar Requisito</button>
          {erro && <p style={{ color: "red" }}>{erro}</p>}
        </div>
      </div>
    </Container>
  );
};

export default TabelaCompradores;
