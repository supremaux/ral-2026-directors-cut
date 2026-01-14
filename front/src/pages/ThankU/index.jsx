import styles from "./ThankU.module.css";
import { Container, Row, Col } from "react-bootstrap";
import coffee from "../../assets/drink-coffee.svg";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function ThankU() {
  return (
    <>
      <Header />
      <section className={styles.thankUSection}>
        <Container>
          <Row>
            <Col ms>
              <figure>
                <img
                  src={coffee}
                  alt="Obrigado por enviar sua declaração!"
                  className={styles.thankUImage}
                />
              </figure>
            </Col>
          </Row>
          <Row>
            <Col ms>
              <h2>Declaração Enviada!</h2>
              <p>
                Parabéns, sua declaração foi enviada com sucesso!
                <br />
                Em caso de dúvidas, entre em contato conosco através do email:{" "}
                <a href="mailto:tassianow@gmail.com">
                  tassianow@gmail.com
                </a>{" "}
              </p>
            </Col>
          </Row>
        </Container>
      </section>
      <Footer />
    </>
  );
}
