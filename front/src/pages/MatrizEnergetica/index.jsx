import React, { useContext } from "react";
import { Col, Container, Row, Form } from "react-bootstrap";
import styles from "./MatrizEnergetica.module.css";
import exemplo from "../../assets/exemplo-matriz-energetica.webp";
import UpFaturaEnergia from "../../components/UpFaturaEnergia";
import Paginacao from "../../components/Paginacao";
import { FormContext } from "../../FormContext";

export default function MatrizEnergetica() {
  const { formData, setFormData } = useContext(FormContext);

  const handleMatrizEnergeticaChange = (e) => {
    setFormData({
      ...formData,
      matrizEnergetica: e.target.value,
    });
  };

  return (
    <>
      <section className={styles.matrizEnergetica}>
        <Container>
          <Row>
            <Col className={styles.colInput}>
              <h2>Matriz Energética</h2>
              <p>Informar a quantidade de kWh consumido durante o ano base.</p>
              <Form>
                <Form.Group controlId="matrizEnergeticaInput">
                  <Form.Label>Quantidade de Kwh</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Quantidade de Kwh"
                    value={formData.matrizEnergetica || ""}
                    onChange={handleMatrizEnergeticaChange}
                    className={styles.input}
                  />
                </Form.Group>
              </Form>
            </Col>
          </Row>
        </Container>
        <Container className={styles.containerExemplo}>
          <Row>
            <Col>
              <p>Veja este Exemplo</p>
              <figure>
                <img
                  src={exemplo}
                  alt="Exemplo de fatura de energia elétrica"
                  className={styles.exemploImage}
                  loading="lazy"
                />
                <figcaption className={styles.figcaption}>
                  Fatura de Energia Elétrica
                </figcaption>
              </figure>
            </Col>
          </Row>
        </Container>
        <Container className={styles.containerUpload}>
          <Row>
            <Col>
              <p>
                Caso possa, clique neste botão para enviar a conta de energia de
                dezembro do ano base, onde no verso há o consumo registrado
                anual.
              </p>
              <UpFaturaEnergia />
            </Col>
          </Row>
        </Container>
      </section>
      <Paginacao next="/impostos" back="/insumos" />
    </>
  );
}
