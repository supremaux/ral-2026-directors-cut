// PilhaEsteril.jsx
import React, { useContext, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import styles from "./PilhaEsteril.module.css";
import Paginacao from "../../components/Paginacao";
import { FormContext } from "../../FormContext";

export default function PilhaEsteril() {
  const { formData, setFormData } = useContext(FormContext);
  const [mensagem, setMensagem] = useState("");

  const handleExistePilhaEsterilChange = (e) => {
    const valor = e.target.value;
    setFormData({
      ...formData,
      existePilhaEsteril: valor,
      quantidadeEsteril: valor === "nao" ? "" : formData.quantidadeEsteril,
    });
    if (valor === "nao") {
      setMensagem("Clique no botão 'Próxima' para continuar.");
    } else {
      setMensagem("");
    }
  };

  const handleQuantidadeEsterilChange = (e) => {
    setFormData({
      ...formData,
      quantidadeEsteril: e.target.value,
    });
  };

  return (
    <>
      <section className={styles.pilhaEsterilSection}>
        <Container>
          <Row>
            <Col>
              <h2>Pilha de Estéril</h2>
              <p>Existe pilha de estéril?</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <select
                className={styles.select}
                onChange={handleExistePilhaEsterilChange}
                value={formData.existePilhaEsteril}
              >
                <option value="" disabled>
                  Selecione uma opção
                </option>
                <option value="sim">Sim</option>
                <option value="nao">Não</option>
              </select>
            </Col>
          </Row>
          {formData.existePilhaEsteril === "sim" && (
            <Row className={styles.quantidadeEsterilRow}>
              <Col>
                <label>
                  Quantidade de estéril depositado no ano base (ton):
                  <input
                    type="number"
                    value={formData.quantidadeEsteril}
                    onChange={handleQuantidadeEsterilChange}
                    required
                  />
                </label>
              </Col>
            </Row>
          )}
          {mensagem && <p className={styles.mensagem}>{mensagem}</p>}
        </Container>
      </section>
      <Paginacao next="/finalizar" back="/listadecompradores" />
    </>
  );
}
