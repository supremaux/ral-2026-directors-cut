import { useState } from "react";
import { Container, Form, Row, Col } from "react-bootstrap";
import axios from "axios";
import { TbLockPassword } from "react-icons/tb";
import styles from "./Login.module.css";
import Logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [usernameValue, setUsernameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const navigate = useNavigate();

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/login`,
        {
          username: usernameValue,
          password: passwordValue,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      console.log("Resposta do login:", response.data);
      if (response.data.success) {
        localStorage.setItem("auth", "true"); // Salva o estado de autenticação
        navigate("/paineladmin"); // Redireciona para a página de painel admin
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error(
        "Erro ao fazer login:",
        error.response?.data || error.message,
      );
      alert("Erro ao fazer login. Tente novamente mais tarde.");
    }
  };

  return (
    <>
      <section className={styles.loginSection}>
        <Container className="d-flex flex-column align-items-center justify-content-center">
          <div className={styles.loginCard} id="card">
            <span className={styles.logo}>
              <picture>
                <img src={Logo} alt="Logo" />
              </picture>
            </span>
            <Form
              className={styles.form + " mt-3 w-100"}
              onSubmit={handleSubmit}
            >
              <Form.Group>
                <Form.Label>Usuário</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Usuário"
                  value={usernameValue}
                  onChange={(e) => setUsernameValue(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Senha</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Senha"
                  value={passwordValue}
                  onChange={(e) => setPasswordValue(e.target.value)}
                />
              </Form.Group>
              <Row className="my-3">
                <Col>
                  <Form.Group>
                    <Form.Check type="checkbox" label="Lembrar-me" />
                  </Form.Group>
                </Col>
                <Col>
                  <button type="submit" className="btn btn-primary">
                    <TbLockPassword />
                    &nbsp;Entrar
                  </button>
                </Col>
              </Row>
            </Form>
          </div>
          <Row className="my-3">
            <a href="https://wa.me/5567998951171">
              <p className="text-white text-decoration-none">
                Esqueci minha senha
              </p>
            </a>
          </Row>
        </Container>
      </section>
    </>
  );
}
