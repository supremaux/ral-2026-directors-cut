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
      temEstoque: e.target.value,
    });
  };

  const handleunidadeMedEstoqueChange = (e) => {
    setFormData({
      ...formData,
      unidadeMedEstoque: e.target.value,
    });
  };

  const handleEstoqueLavraChange = (e) => {
    setFormData({
      ...formData,
      estoqueLavra: Number(e.target.value) || 0,
    });
  };

  const handleestoqueFinalChange = (e) => {
    setFormData({
      ...formData,
      estoqueFinal: Number(e.target.value) || 0,
    });
  };

  // Verifica se a substância mineral é Basalto, Granito ou Calcário
  const substanciasComestoqueFinal = ["basalto", "granito", "calcario"];
  const deveExibirestoqueFinal = substanciasComestoqueFinal.includes(
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
                value={formData.temEstoque || ""}
              >
                <option value="" disabled>
                  Selecione uma opção
                </option>
                <option value="sim">Sim</option>
                <option value="nao">Não</option>
              </select>
            </Col>
          </Row>
          {formData.temEstoque === "sim" && (
            <Row>
              <Col>
                <div style={{ marginTop: "20px" }}>
                  <h4>Unidade de Medida</h4>
                  <select
                    className={styles.select}
                    onChange={handleunidadeMedEstoqueChange}
                    value={formData.unidadeMedEstoque || ""}
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
                      Estoque na Lavra (
                      {formData.unidadeMedEstoque || "unidade"}):
                    </label>
                    <input
                      type="number"
                      value={formData.estoqueLavra}
                      onChange={handleEstoqueLavraChange}
                      style={{ width: "100%", padding: "8px" }}
                    />
                  </div>
                  {deveExibirestoqueFinal && (
                    <div style={{ marginBottom: "15px" }}>
                      <label>
                        Estoque Britado (
                        {formData.unidadeMedEstoque || "unidade"}
                        ):
                      </label>
                      <input
                        type="number"
                        value={formData.estoqueFinal}
                        onChange={handleestoqueFinalChange}
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
