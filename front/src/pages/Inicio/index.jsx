import { Button, Col, Container, Row } from "react-bootstrap";
import styles from "./Inicio.module.css";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

export default function Inicio() {
  return (
    <>
      <section className={styles.inicioRal}>
        <Container className="w-100 text-center d-flex flex-column justify-content-center align-items-center">
          <h2>Aviso de Confidencialidade</h2>
          <p>
            As informações fornecidas neste sistema destinam-se exclusivamente
            ao atendimento das obrigações legais relativas ao Relatório Anual de
            Lavra (RAL) junto à Agência Nacional de Mineração (ANM). Todos os
            dados são tratados com sigilo e confidencialidade, utilizados apenas
            para a finalidade proposta e protegidos conforme a Lei nº
            13.709/2018, Lei Geral de Proteção de Dados Pessoais (LGPD). Ao
            prosseguir, o usuário declara ciência e concordância com estes
            termos.
          </p>
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
              Começar &nbsp; <FaArrowRight />
            </strong>
          </Button>
        </Container>
      </section>
    </>
  );
}
