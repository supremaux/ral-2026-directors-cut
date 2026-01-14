import { Container, Row, Col } from "react-bootstrap";
import styles from "./DetonadoBritado.module.css";
import TabelaDetonadoBritado from "../../components/TabelaDetonadoBritado";
import Paginacao from "../../components/Paginacao";
import { useContext } from "react";
import { FormContext } from "../../FormContext";
import GerarCSV from "../../components/GerarCSV";

export default function DetonadoBritado() {
  const { formData, setFormData } = useContext(FormContext);
  const { detonadoBritado } = formData;

  const handleDetonadoBritadoChange = (e) => {
    setFormData({
      ...formData,
      unidadeDetonadoBritado: e.target.value, // Adiciona uma nova propriedade para a unidade
    });
  };

  return (
    <>
      <section className={styles.detonadoBritadoSection}>
        <Container>
          <Row>
            <Col>
              <h2>Produção - Detonado</h2>
              <p>
                Neste campo deve ser preenchidos os dados REFERENTES AS
                DETONAÇÕES!
              </p>
            </Col>
          </Row>

          {/* Dropdown novo */}
          <Row className={styles.novoDropdown}>
            <Col>
              <select
                className={styles.select}
                onChange={handleDetonadoBritadoChange}
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
      <Paginacao next="/estoque" back="/substancia" />
    </>
  );
}
