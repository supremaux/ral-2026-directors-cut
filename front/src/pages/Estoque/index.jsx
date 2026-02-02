import { Container, Row, Col } from "react-bootstrap";
import styles from "./Estoque.module.css";
import { useContext, useRef } from "react";
import { FormContext } from "../../FormContext";
import { NumericFormat } from "react-number-format";
import Paginacao from "../../components/Paginacao";

export default function Estoque() {
  const { formData, setFormData } = useContext(FormContext);
  const estoqueLavraRef = useRef(null);
  const estoqueFinalRef = useRef(null);

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

  const handleEstoqueLavraChange = (values) => {
    const { floatValue } = values;
    setFormData({
      ...formData,
      estoqueLavra: floatValue || 0.0,
    });
  };

  const handleestoqueFinalChange = (values) => {
    const { floatValue } = values;
    setFormData({
      ...formData,
      estoqueFinal: floatValue || 0.0,
    });
  };

  const isAllowed = (values) => {
    const { floatValue } = values;
    return floatValue >= 0; // Permite apenas valores positivos
  };

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
                      {formData.unidadeMedEstoque || "unidade"})
                    </label>
                    <NumericFormat
                      getInputRef={estoqueLavraRef}
                      value={formData.estoqueLavra}
                      onValueChange={handleEstoqueLavraChange}
                      thousandSeparator="."
                      decimalSeparator=","
                      decimalScale={2}
                      fixedDecimalScale={true}
                      allowNegative={false}
                      isAllowed={isAllowed}
                      onFocus={(e) => e.target.select()}
                      customInput={({ onChange, ...props }) => (
                        <input
                          {...props}
                          onChange={onChange}
                          style={{ width: "100%", padding: "8px" }}
                        />
                      )}
                    />
                  </div>
                  {deveExibirestoqueFinal && (
                    <div style={{ marginBottom: "15px" }}>
                      <label>
                        Estoque Britado (
                        {formData.unidadeMedEstoque || "unidade"})
                      </label>
                      <NumericFormat
                        getInputRef={estoqueFinalRef}
                        value={formData.estoqueFinal}
                        onValueChange={handleestoqueFinalChange}
                        thousandSeparator="."
                        decimalSeparator=","
                        decimalScale={2}
                        fixedDecimalScale={true}
                        allowNegative={false}
                        isAllowed={isAllowed}
                        onFocus={(e) => e.target.select()}
                        customInput={({ onChange, ...props }) => (
                          <input
                            {...props}
                            onChange={onChange}
                            style={{ width: "100%", padding: "8px" }}
                          />
                        )}
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
