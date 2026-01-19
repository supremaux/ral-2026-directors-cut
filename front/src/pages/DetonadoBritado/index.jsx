// DetonadoBritado.jsx
import { Container, Row, Col } from "react-bootstrap";
import styles from "./DetonadoBritado.module.css";
import TabelaDetonadoBritado from "../../components/TabelaDetonadoBritado";
import Paginacao from "../../components/Paginacao";
import { useContext } from "react";
import { FormContext } from "../../FormContext";

export default function DetonadoBritado() {
  const { formData, setFormData } = useContext(FormContext);

  const handleSubstanciaChange = (e) => {
    setFormData({
      ...formData,
      substanciaMineral: e.target.value,
    });
  };

  const handleUnidadeChange = (e) => {
    setFormData({
      ...formData,
      unidadeDetonadoBritado: e.target.value,
    });
  };

  return (
    <>
      <section className={styles.detonadoBritadoSection}>
        <Container>
          <Row>
            <Col>
              <h2>Produção</h2>
              <p>
                Neste campo devem ser preenchidos os dados referentes à
                produção!
              </p>
            </Col>
          </Row>

          {/* Dropdown para Substância Mineral */}
          <Row className={styles.novoDropdown}>
            <Col>
              <select
                className={styles.select}
                onChange={handleSubstanciaChange}
                value={formData.substanciaMineral || ""}
              >
                <option value="" disabled>
                  Selecione uma Substância
                </option>
                <option value="basalto">Basalto (Brita)</option>
                <option value="granito">Granito (Brita)</option>
                <option value="calcario">Calcário</option>
                <option value="areia">Areia</option>
                <option value="cascalho">Cascalho</option>
                <option value="argila">Argila</option>
                <option value="arenito">Arenito</option>
                <option value="saibro">Saibro</option>
              </select>
            </Col>
          </Row>

          {/* Dropdown para Unidade */}
          <Row className={styles.novoDropdown}>
            <Col>
              <select
                className={styles.select}
                onChange={handleUnidadeChange}
                value={formData.unidadeDetonadoBritado || ""}
              >
                <option value="" disabled>
                  Selecione uma Unidade
                </option>
                <option value="m3">m3</option>
                <option value="toneladas">Toneladas</option>
              </select>
            </Col>
          </Row>

          <Row>
            <Col>
              <TabelaDetonadoBritado />
            </Col>
          </Row>
        </Container>
      </section>
      <Paginacao next="/producao" back="/estoque" />
    </>
  );
}
