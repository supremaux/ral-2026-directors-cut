import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import styles from "./Footer.module.css";

const getAnoAtual = () => {
  return new Date().getFullYear();
};

export default function Footer() {
  const anoAtual = () => {
    const year = new Date().getFullYear();
  };
  const year = getAnoAtual();

  return (
    <footer className={styles.bottomBar}>
      <Container>
        <Row>
          <Col ms>
            <p>
              © {year} Minaset - Engenharia de minas e segurança do trabalho |
              UI/UX Design by Suprema
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
