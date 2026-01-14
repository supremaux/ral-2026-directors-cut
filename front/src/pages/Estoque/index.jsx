import { Container, Row, Col } from "react-bootstrap";
import styles from "./Estoque.module.css";
import { useContext } from "react";
import { FormContext } from "../../FormContext";
import Paginacao from "../../components/Paginacao";

export default function Estoque() {
  const { formData, setFormData } = useContext(FormContext);

  const confirmaEstoque = (e) => {
    setFormData({
      ...formData,
      possuiEstoque: e.target.value, // Atualiza o estado com a opção selecionada
    });
  };

  const handleChange = (index, value) => {
    const newEstoque = [...formData.estoque];
    newEstoque[index].quantidade = value;
    setFormData({
      ...formData,
      estoque: newEstoque,
    });
  };

  return (
    <>
      <section className={styles.estoqueSection}>
        <Container>
          <Row>
            <Col>
              <h2>Estoque</h2>
              <p>Possui estoque?</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <select
                className={styles.select}
                onChange={confirmaEstoque}
                value={formData.possuiEstoque || ""}
              >
                <option value="" disabled>
                  Selecione uma opção
                </option>
                <option value="sim">Sim</option>
                <option value="nao">Não</option>
              </select>
            </Col>
          </Row>
          {formData.possuiEstoque === "sim" && (
            <Row>
              <Col>
                <table
                  border="1"
                  style={{ borderCollapse: "collapse", width: "100%" }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{ padding: "8px", backgroundColor: "#f2f2f2" }}
                      >
                        Mês
                      </th>
                      <th
                        style={{ padding: "8px", backgroundColor: "#f2f2f2" }}
                      >
                        Quantidade
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.estoque.map((item, index) => (
                      <tr
                        key={index}
                        style={{
                          backgroundColor:
                            index % 2 === 0 ? "#f9f9f9" : "#e6e6e6",
                        }}
                      >
                        <td style={{ padding: "8px" }}>{item.mes}</td>
                        <td style={{ padding: "8px" }}>
                          <input
                            type="number"
                            value={item.quantidade}
                            onChange={(e) =>
                              handleChange(index, e.target.value)
                            }
                            style={{ width: "100%" }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Col>
            </Row>
          )}
        </Container>
      </section>
      <Paginacao next="/producao" back="/detonadobritado" />
    </>
  );
}
