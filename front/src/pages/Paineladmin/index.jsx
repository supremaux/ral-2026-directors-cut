import styles from "./Paineladmin.module.css";
import { Container, Row } from "react-bootstrap";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";
import ListarArquivos from "../../components/ListarArquivos/ListarArquivos";
import { FaPowerOff } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";

export default function Paineladmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Verifica se o usuário está logado
  useEffect(() => {
    const auth = localStorage.getItem("auth");
    setIsAuthenticated(!!auth);
  }, []);

  // Nova função de logout
  const handleRedirect = () => {
    localStorage.removeItem("auth");
    window.location.replace("/login");
    navigate("/login");
  };

  return (
    <>
      <Header />
      <section className={styles.paineladminSection}>
        <Container>
          <ListarArquivos />
          <Row className={styles.sair + " text-end mt-5"}>
            <Link
              to="/logout"
              href="/logout"
              as={Link}
              className="text-decoration-none text-black text-size-14 text-blue:hover"
              onClick={handleRedirect}
            >
              <h3>
                <FaPowerOff /> Sair
              </h3>
            </Link>
          </Row>
        </Container>
      </section>
      <Footer />
    </>
  );
}
