// Producao.jsx
import {
  Col,
  Container,
  Row,
  Form,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import styles from "./Producao.module.css";
import SalesTable from "../../components/SalesTable";
import Paginacao from "../../components/Paginacao";
import { useContext, useEffect, useState } from "react";
import { FormContext } from "../../FormContext";

export default function Producao() {
  const { formData, setFormData } = useContext(FormContext);
  const [showToast, setShowToast] = useState(false);

  // Lista de substâncias que não precisam preencher esta etapa
  const substanciasSemProducao = ["areia", "cascalho", "saibro", "argila"];

  // Função para verificar a substância e exibir o Toast
  useEffect(() => {
    if (formData.substanciaMineral) {
      const substanciaLower = formData.substanciaMineral.toLowerCase();
      if (substanciasSemProducao.includes(substanciaLower)) {
        setShowToast(true);
      } else {
        setShowToast(false);
      }
    }
  }, [formData.substanciaMineral]);

  const handleUnidadeChange = (e) => {
    setFormData({
      ...formData,
      unidadeMedida: e.target.value,
    });
  };

  return (
    <>
      <section className={styles.producaoOpt}>
        <Container>
          <Row>
            <Col>
              <h2>Módulo de Beneficiamento</h2>
              <p>Declarar aqui os valores referentes à venda do produto:</p>
            </Col>
          </Row>
        </Container>

        {/* Dropdown e tabela só são exibidos se não houver Toast */}
        {!showToast ? (
          <>
            <Container className={styles.novoDropdown}>
              <Row>
                <Col>
                  <Form>
                    <Form.Select
                      className={styles.select}
                      value={formData.unidadeMedida || ""}
                      onChange={handleUnidadeChange}
                    >
                      <option value="" disabled>
                        Selecione uma Unidade
                      </option>
                      <option value="m3">m³</option>
                      <option value="toneladas">Toneladas</option>
                    </Form.Select>
                  </Form>
                </Col>
              </Row>
            </Container>

            <Container className={styles.tabelaOpt}>
              <Row>
                <Col>
                  <SalesTable />
                </Col>
              </Row>
            </Container>
          </>
        ) : null}
      </section>

      {/* ToastContainer para exibir o Toast */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={5000}
          autohide
          bg="warning"
        >
          <Toast.Header>
            <strong className="me-auto">Aviso</strong>
          </Toast.Header>
          <Toast.Body>
            Esta etapa não precisa ser preenchida para a substância selecionada.
            Clique no botão "Próxima" para continuar.
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <Paginacao next="/maodeobra" back="/detonadobritado" />
    </>
  );
}
