import styles from "./Paginacao.module.css";
import { Button, Container, Row, Col } from "react-bootstrap";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { BsCaretLeftFill } from "react-icons/bs";
import { BsCaretRightFill } from "react-icons/bs";
import { BsChevronBarRight } from "react-icons/bs";
import { BsFillHouseFill } from "react-icons/bs";

export default function Paginacao({ next, back }) {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (navigate) {
      navigate(back);
    }
  };

  const handleGoNext = () => {
    if (navigate) {
      navigate(next);
    }
  };

  return (
    <>
      {/* Paginação */}
      <Container class="my-4">
        <h3 className="text-center small">
          Clique no botão <strong>Próxima</strong> para ir para a próxima etapa!
        </h3>
      </Container>
      <Container className={styles.paginacao}>
        <Row>
          <Col>
            <ButtonGroup aria-label="Paginação">
              <Button
                variant="secondary"
                onClick={handleGoBack}
                rel="noopener noreferrer"
                type="button"
              >
                <BsCaretLeftFill /> Anterior
              </Button>
              <Button
                variant="secondary"
                as={Link}
                to="/"
                href="/"
                rel="noopener noreferrer"
                type="button"
              >
                <BsFillHouseFill /> &nbsp; Início
              </Button>
              <Button
                variant="secondary"
                as={Link}
                to="/finalizar"
                href="/finalizar"
                rel="noopener noreferrer"
                type="button"
              >
                Final &nbsp;
                <BsChevronBarRight />
              </Button>
              <Button
                variant="secondary"
                onClick={handleGoNext}
                rel="noopener noreferrer"
                type="button"
              >
                Próxima
                <BsCaretRightFill />
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Container>
    </>
  );
}

Paginacao.propTypes = {
  next: PropTypes.string.isRequired,
  back: PropTypes.string.isRequired,
};
