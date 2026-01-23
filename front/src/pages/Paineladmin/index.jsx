// Paineladmin.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row } from "react-bootstrap";
import styles from "./Paineladmin.module.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ListarArquivos from "../../components/ListarArquivos/ListarArquivos";
import { FaPowerOff } from "react-icons/fa";

export default function Paineladmin() {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (!auth) {
      navigate("/paineladmin");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/login");
  };

  return (
    <>
      <Header />
      <section className={styles.paineladminSection}>
        <Container>
          <ListarArquivos />
          <Row className={styles.sair + " text-end mt-5"}>
            <button onClick={handleLogout} className="btn btn-danger">
              <FaPowerOff /> Sair
            </button>
          </Row>
        </Container>
      </section>
      <Footer />
    </>
  );
}
