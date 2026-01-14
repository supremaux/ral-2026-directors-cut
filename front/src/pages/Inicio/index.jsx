import { Button, Col, Container, Row } from "react-bootstrap";
import styles from "./Inicio.module.css";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

export default function Inicio() {
  return (
    <>
      <section className={styles.inicioRal}>
        <Container>
          <Row>
            <Col>
              <h2>O que é o RAL?</h2>
            </Col>
          </Row>
          <Row>
            <Col>
              <p>
                O Relatório Anual de Lavra (RAL) é um documento obrigatório,
                exigido pela legislação mineral, que deve ser entregue
                anualmente à Agência Nacional de Mineração (ANM) por todos os
                titulares ou arrendatários de títulos de lavra ou guia de
                utilização, independentemente de estarem em atividade ou não
                durante o ano-base. O RAL consolida informações sobre as
                atividades realizadas em uma mina, incluindo dados de produção,
                transporte, modificações nas reservas, características do
                minério, quadro mensal de atividades, equipe, investimentos e
                pesquisa.
              </p>
            </Col>
          </Row>
          <Row>
            <Col className={styles.botaoDeclarar}>
              <Button
                as={Link}
                to="/Dadoscadastrais"
                href="/Dadoscadastrais"
                variant="primary"
                size="lg"
                rel="noopener noreferrer"
                type="submit"
              >
                <strong>
                  Declarar &nbsp; <FaArrowRight />
                </strong>
              </Button>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}
