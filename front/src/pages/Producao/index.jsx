import { Col, Container, Row, Form } from "react-bootstrap";
import styles from "./Producao.module.css";
import SalesTable from "../../components/SalesTable";
import Paginacao from "../../components/Paginacao";
import { useContext } from "react";
import { FormContext } from "../../FormContext";

export default function Producao() {
  const { formData, setFormData } = useContext(FormContext);

  const handleUnidadeChange = (e) => {
    setFormData({
      ...formData,
      unidadeMedida: e.target.value, // Atualiza a propriedade para a unidade
    });
  };

  return (
    <>
      <section className={styles.producaoOpt}>
        <Container>
          <Row>
            <Col>
              <h2>Produção - Detonado</h2>
              <p>
                Neste campo devem ser preenchidos os dados referentes às
                detonações!
              </p>
            </Col>
          </Row>
        </Container>
        {/* Dropdown novo */}
        <Container className={styles.novoDropdown}>
          <Row>
            <Col>
              <Form>
                <Form.Select
                  className={styles.select}
                  value={formData.unidadeMedida || ""}
                  onChange={handleUnidadeChange}
                >
                  <option value="" disabled>
                    Selecione uma Unidade
                  </option>
                  <option value="m3">m³</option>
                  <option value="toneladas">Toneladas</option>
                </Form.Select>
              </Form>
            </Col>
          </Row>
        </Container>
        {/* Tabela */}
        <Container className={styles.tabelaOpt}>
          <Row>
            <Col>
              <SalesTable />
            </Col>
          </Row>
        </Container>
      </section>
      <Paginacao next="/maodeobra" back="/estoque" />
    </>
  );
}
