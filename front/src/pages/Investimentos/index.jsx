import React, { useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import styles from "./Investimentos.module.css";
import Paginacao from "../../components/Paginacao";
import { FormContext } from "../../FormContext";

export default function Investimentos() {
  const { formData, setFormData } = useContext(FormContext);

  const handleConfirmaInvest = (e) => {
    setFormData({
      ...formData,
      confirmaInvest: e.target.value,
    });
  };

  const handleAquisi = (e) => {
    setFormData({
      ...formData,
      aquisi: e.target.value,
    });
  };

  const handleValorInvest = (e) => {
    setFormData({
      ...formData,
      valorInvest: e.target.value,
    });
  };

  return (
    <>
      <section className={styles.investimentos}>
        <Container>
          <Row>
            <Col>
              <h2>Investimentos</h2>
            </Col>
          </Row>
        </Container>
        {/* Primeira pergunta */}
        <Container className={styles.containerPergunta1}>
          <Row>
            <Col md={6}>
              <p>Houveram investimentos na indústria no ano base?</p>
            </Col>
            {/* Dropdown novo */}
            <Col md={6}>
              <select
                className={styles.select}
                value={formData.confirmaInvest || ""}
                onChange={handleConfirmaInvest}
              >
                <option value="" disabled>
                  Selecione uma opção
                </option>
                <option value="sim">Sim</option>
                <option value="nao">Não</option>
              </select>
            </Col>
          </Row>
        </Container>
        {/* Segunda pergunta */}
        <Container className={styles.containerPergunta2}>
          <Row>
            <Col md={6}>
              <p>Qual setor/aquisição ou projeto?</p>
            </Col>
            <Col md={6}>
              <textarea
                onChange={handleAquisi}
                className={styles.textarea}
                placeholder="Digite aqui os setores, aquisições ou projetos"
                value={formData.aquisi || ""}
                wrap="hard"
              />
            </Col>
          </Row>
        </Container>
        {/* Terceira pergunta */}
        <Container className={styles.containerPergunta3}>
          <Row>
            <Col md={6}>
              <p>Qual o valor investido?</p>
            </Col>
            <Col md={6}>
              <input
                onChange={handleValorInvest}
                type="text"
                className={styles.input}
                placeholder="Digite o valor investido"
                value={formData.valorInvest || ""}
              />
            </Col>
          </Row>
        </Container>
      </section>
      <Paginacao next="/listadecompradores" back="/impostos" />
    </>
  );
}
