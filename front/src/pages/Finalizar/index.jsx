import { Container, Row, Col, FormCheck } from "react-bootstrap";
import styles from "./Finalizar.module.css";
import { Link } from "react-router-dom";
import { GerarCSV } from "../../components/GerarCSV";

export default function Finalizar() {
  return (
    <section className={styles.finalizar}>
      <Container>
        <Row>
          <Col>
            <h2>Finalizar</h2>
            <p>
              Você está na etapa final do preenchimento do RAL. Por favor,
              revise todas as informações inseridas nas etapas anteriores para
              garantir que estão corretas e completas. Se houver alguma
              informação faltante ou incoerente, clique no botão{" "}
              <strong>Anterior</strong> para retornar à etapa correspondente e
              fazer as correções necessárias.
            </p>
            <p>
              Aperte o botão <strong>Finalizar</strong> para encerrar o
              preenchimento do RAL.
            </p>
          </Col>
        </Row>
      </Container>
      <Container className={styles.containerCheckbox}>
        <Row>
          <Col>
            <FormCheck>
              <FormCheck.Input type="checkbox" required />{" "}
              <FormCheck.Label>
                Declaro que todas as informações fornecidas são verdadeiras e
                completas.
              </FormCheck.Label>
            </FormCheck>
          </Col>
        </Row>
        <Row>
          <Col>
            <GerarCSV
              as={Link}
              to="/thanku" // Add the closing quotation mark here
              href="/thanku"
              rel="noopener noreferrer"
              type="submit"
            />
          </Col>
        </Row>
      </Container>
    </section>
  );
}
