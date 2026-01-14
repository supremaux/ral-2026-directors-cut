import styles from "./Substancia.module.css";
import { Button, Col, Container, Row } from "react-bootstrap";
import Paginacao from "../../components/Paginacao";
import { useContext } from "react";
import { FormContext } from "../../FormContext";
import { GerarCSV } from "../../components/GerarCSV";
import { FaArrowRight } from "react-icons/fa";

export default function Substancia() {
  const { formData, setFormData } = useContext(FormContext);

  const handleSubstanciaMineralChange = (e) => {
    setFormData({
      ...formData,
      substanciaMineral: e.target.value,
    });
  };

  const sendData = () => {
    console.log("Substância Mineral selecionada:", formData.substanciaMineral);
  };

  return (
    <>
      <section className={styles.substanciaOptions}>
        <Container>
          <Row>
            <Col>
              <h2>Substância Mineral</h2>
              <p>Qual a substância mineral do processo?</p>
            </Col>
          </Row>
        </Container>
        {/* Dropdown novo - Form.Select */}
        <Container className={styles.novoDropdown}>
          <Row>
            <Col>
              <select
                className={styles.select}
                onChange={handleSubstanciaMineralChange}
                value={formData.substanciaMineral}
              >
                <option value="">Selecione a Substância Mineral</option>
                <option value="Basalto">Basalto</option>
                <option value="Granito">Granito</option>
                <option value="Arenito">Arenito</option>
                <option value="Cascalho">Cascalho</option>
              </select>
            </Col>
          </Row>
          <Row></Row>
          <Button
            className="btn mt-3"
            type="submit"
            onClick={sendData}
            variant="primary"
            size="lg"
          >
            {" "}
            Salvar e Continuar &nbsp; <FaArrowRight />
          </Button>
          {console.log("Dados enviados:", formData)}
        </Container>
      </section>
      <Paginacao next="/detonadobritado" back="/termo" />
    </>
  );
}
