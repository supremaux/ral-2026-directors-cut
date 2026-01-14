import { Container, Row, Col } from "react-bootstrap";
import styles from "./NotFound.module.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function NotFound() {
  return (
    <section>
      <Header />
      <Container fluid className={styles.container404}>
        <Row>
          <Col ms>
            <h2>Página não Encontrada!</h2>
            <p>404</p>
          </Col>
        </Row>
      </Container>
      <Footer />
    </section>
  );
}
