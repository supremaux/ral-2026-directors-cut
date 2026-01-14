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
          <h2>Substância Mineral</h2>
          <p>Qual a substância mineral do processo?</p>
        </Container>
        {/* Dropdown novo - Form.Select */}
        <Container className={styles.novoDropdown}>
          <select
            className={styles.select}
            onChange={handleSubstanciaMineralChange}
            value={formData.substanciaMineral}
          >
            <option value="">Selecione a Substância Mineral</option>
            <option value="aguaMineral">Água Mineral</option>
            <option value="Areia">Areia</option>
            <option value="Basalto">Basalto</option>
            <option value="Granito">Granito</option>
            <option value="Arenito">Arenito</option>
            <option value="Cascalho">Cascalho</option>
            <option value="Argila">Argila</option>
            <option value="Marmore">Mármore</option>
            <option value="Saibro">Saibro</option>
            <option value="Calcario">Calcário</option>
          </select>
          {console.log("Dados enviados:", formData)}
        </Container>
      </section>
      <Paginacao next="/detonadobritado" back="/termo" />
    </>
  );
}
