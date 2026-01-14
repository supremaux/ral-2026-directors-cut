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
                Preencher a tabela abaixo com o item específico, com sua
                qunatidade e valor em R$. Caso necessário pode ser acrescentados
                mais itens não listados!
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
