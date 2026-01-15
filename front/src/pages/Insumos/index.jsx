import { Container, Row, Col } from "react-bootstrap";
import styles from "./Insumos.module.css";
import TabelaInsumos from "../../components/TabelaInsumos";
import Paginacao from "../../components/Paginacao";

export default function Insumos() {
  return (
    <>
      <section className={styles.insumosSection}>
        <Container>
          <Row>
            <Col ms>
              <h2>Insumos</h2>
              <p>
                Selecione o item específico, e adicione sua respectiva
                quantidade. Caso necessário, podem ser acrescentados mais itens
                não listados!
              </p>
            </Col>
          </Row>
        </Container>
        <Container>
          <Row>
            <Col ms className={styles.insumosTable}>
              <TabelaInsumos />
            </Col>
          </Row>
        </Container>
      </section>
      <Paginacao next="/matrizenergetica" back="/custodalavra" />
    </>
  );
}
