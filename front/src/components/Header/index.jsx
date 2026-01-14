import { Col, Container, Row } from "react-bootstrap";
import styles from "./Header.module.css";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import Inicio from "../../pages/Inicio";

export default function Header() {
  return (
    <>
      {/* Topbar*/}
      <section className={styles.topBar}>
        <Container>
          <Row>
            <Col ms className={styles.title}>
              <h1>Relatório Anual de Lavra</h1>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Título e Logo*/}
      <section className={styles.headerParte2}>
        <Container>
          <Row>
            <Col xs={6} sm={8}>
              <Link to="/" className={styles.link}>
                <h2>Declaração</h2>
              </Link>
            </Col>
            <Col xs={6} sm={4} className={styles.logo}>
              <Link
                to="https://minaset.com.br/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={logo}
                  alt="Minaset logo featuring a stylized blue circular arrow with the word MINASET in bold gray letters below, conveying a modern and professional tone"
                />
              </Link>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}
