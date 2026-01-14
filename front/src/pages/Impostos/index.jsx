import { Container, Row, Col } from "react-bootstrap";
import styles from "./Impostos.module.css";
import TabelaApuracaoMensal from "../../components/TabelaApuracaoMensal";
import Paginacao from "../../components/Paginacao";

export default function Impostos() {
  return (
    <>
      <section className={styles.impostos}>
        <Container>
          <Row>
            <Col>
              <h2>Impostos/Tributos</h2>
              <p>
                Preencher a tabela abaixo com os valores mensais (R$)
                correspondentes ao mês
              </p>
            </Col>
          </Row>
        </Container>
        <Container className={styles.tabelaMobile}>
          <Row>
            <Col>
              <TabelaApuracaoMensal />
            </Col>
          </Row>
        </Container>
      </section>
      <Paginacao next="/investimentos" back="/matrizenergetica" />
    </>
  );
}
