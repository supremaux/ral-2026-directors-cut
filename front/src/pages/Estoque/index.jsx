// Estoque.jsx
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
      possuiEstoque: e.target.value,
    });
  };

  const handleUnidadeEstoqueChange = (e) => {
    setFormData({
      ...formData,
      unidadeEstoque: e.target.value,
    });
  };

  const handleEstoqueLavraChange = (e) => {
    setFormData({
      ...formData,
      estoqueLavra: Number(e.target.value) || 0,
    });
  };

  const handleEstoqueBritadoChange = (e) => {
    setFormData({
      ...formData,
      estoqueBritado: Number(e.target.value) || 0,
    });
  };

  // Verifica se a substância mineral é Basalto, Granito ou Calcário
  const substanciasComEstoqueBritado = ["basalto", "granito", "calcario"];
  const deveExibirEstoqueBritado = substanciasComEstoqueBritado.includes(
    formData.substanciaMineral,
  );

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
                <div style={{ marginTop: "20px" }}>
                  <h4>Unidade de Medida</h4>
                  <select
                    className={styles.select}
                    onChange={handleUnidadeEstoqueChange}
                    value={formData.unidadeEstoque || ""}
                  >
                    <option value="" disabled>
                      Selecione uma unidade
                    </option>
                    <option value="m3">m³</option>
                    <option value="toneladas">Toneladas</option>
                  </select>
                </div>
                <div style={{ marginTop: "20px" }}>
                  <h4>Estoque Anual</h4>
                  <div style={{ marginBottom: "15px" }}>
                    <label>
                      Estoque na Lavra ({formData.unidadeEstoque || "unidade"}):
                    </label>
                    <input
                      type="number"
                      value={formData.estoqueLavra}
                      onChange={handleEstoqueLavraChange}
                      style={{ width: "100%", padding: "8px" }}
                    />
                  </div>
                  {deveExibirEstoqueBritado && (
                    <div style={{ marginBottom: "15px" }}>
                      <label>
                        Estoque Britado ({formData.unidadeEstoque || "unidade"}
                        ):
                      </label>
                      <input
                        type="number"
                        value={formData.estoqueBritado}
                        onChange={handleEstoqueBritadoChange}
                        style={{ width: "100%", padding: "8px" }}
                      />
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          )}
        </Container>
      </section>
      <Paginacao next="/detonadobritado" back="/substancia" />
    </>
  );
}
