import { Col, Container, Row } from "react-bootstrap";
import styles from "./CustodaLavra.module.css";
import CostTable from "../../components/CostTable";
import Paginacao from "../../components/Paginacao";

export default function CustodaLavra() {
  return (
    <>
      <section className={styles.custodaLavraSection}>
        <Container>
          <Row>
            <Col>
              <h2>Custo da Lavra</h2>
              <p>Preencher a tabela com os custos :</p>
            </Col>
          </Row>
        </Container>
        <Container>
          <Row>
            <Col className={styles.custodaLavraTable}>
              <CostTable />
            </Col>
          </Row>
        </Container>
      </section>
      <Paginacao next="/insumos" back="/maodeobra" />
    </>
  );
}
