import { Container, Row, Col } from "react-bootstrap";
import styles from "./Maodeobra.module.css";
import SalesByCategoryTable from "../../components/SalesByCategoryTable";
import Paginacao from "../../components/Paginacao";

export default function Maodeobra() {
  return (
    <>
      <section className={styles.maodeobraSection}>
        <Container>
          <Row>
            <Col>
              <h2>Mão de Obra</h2>
              <p>
                Preencher a tabela abaixo com o número de funcionários e sua
                categoria de contratação
              </p>
            </Col>
          </Row>
        </Container>
        <Container>
          <Row>
            <Col className={styles.maodeobraTable}>
              <SalesByCategoryTable />
            </Col>
          </Row>
        </Container>
      </section>
      <Paginacao next="/custodalavra" back="/producao" />
    </>
  );
}
