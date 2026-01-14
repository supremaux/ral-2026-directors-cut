import React from "react";
import styles from "./Dadoscada.module.css";
import { Col, Container, Form, Row } from "react-bootstrap";
import Paginacao from "../../components/Paginacao";
import { FormContext } from "../../FormContext";

export default function Dadoscadastrais() {
  const { formData, setFormData } = React.useContext(FormContext);

  const handleRazaoSocial = (e) => {
    setFormData({ ...formData, razaoSocial: e.target.value });
  };
  const handleCNPJ = (e) => {
    setFormData({ ...formData, cnpj: e.target.value });
  };
  const handleEndereco = (e) => {
    setFormData({ ...formData, endereco: e.target.value });
  };
  const handleTelefone = (e) => {
    setFormData({ ...formData, telefone: e.target.value });
  };
  const handleEmail = (e) => {
    setFormData({ ...formData, email: e.target.value });
  };

  return (
    <>
      <section className={styles.dadosForm}>
        <Container className={styles.form}>
          <Row>
            <Col>
              <h2>Dados Cadastrais</h2>
              <p>Por favor, preencha os dados abaixo:</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form>
                <Form.Group className="mb-3" controlId="formNome">
                  <Form.Label>
                    <strong>Razão Social</strong>
                  </Form.Label>
                  <Form.Control
                    onChange={handleRazaoSocial}
                    type="text"
                    placeholder="Digite sua Razão Social"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formNumero">
                  <Form.Label>
                    <strong>CNPJ</strong>
                  </Form.Label>
                  <Form.Control
                    onChange={handleCNPJ}
                    type="text"
                    placeholder="Digite seu CNPJ"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formEndereco">
                  <Form.Label>
                    <strong>Endereço</strong>
                  </Form.Label>
                  <Form.Control
                    onChange={handleEndereco}
                    type="text"
                    placeholder="Digite seu Endereço"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formNumero">
                  <Form.Label>
                    <strong>Telefone</strong>
                  </Form.Label>
                  <Form.Control
                    onChange={handleTelefone}
                    type="text"
                    placeholder="Digite seu Telefone"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>
                    <strong>E-mail</strong>
                  </Form.Label>
                  <Form.Control
                    onChange={handleEmail}
                    type="text"
                    placeholder="Digite seu E-mail"
                  />
                </Form.Group>
              </Form>
            </Col>
          </Row>
        </Container>
      </section>
      <Paginacao next="/Termo" back="/" />
    </>
  );
}
