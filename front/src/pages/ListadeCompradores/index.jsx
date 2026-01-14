import { Container, Row, Col } from "react-bootstrap";
import styles from "./ListadeCompradores.module.css";
import TabelaCompradores from "../../components/TabelaCompradores";
import Paginacao from "../../components/Paginacao";

export default function ListadeCompradores() {
  return (
    <>
      <section className={styles.compradoresLista}>
        <Container>
          <Row>
            <Col>
              <h2>Lista de Compradores</h2>
            </Col>
          </Row>
          <Row className={styles.textos}>
            <Col>
              <p>
                Aqui deve ser preenchida a listagem com todos os compradores,
                segundo os dados abaixo.{" "}
                <strong>
                  PODE SER ENVIADO TAMBÉM ATRAVES DO SEU SISTEMA DE EMISSAÕ DE
                  NOTA FISCAL A LISTAGEM DOS MAIORES COMPRADORES!
                </strong>
              </p>
              <h3>
                A LISTAGEM ABAIXO TEM QUE CORREPONDER AO UM MINIMO DE 80% DO
                QUANTITATIVO VENDIDO
              </h3>
              <p>
                <strong>
                  Antes de enviar, clique em "Validar Requisito" para verificar
                  se a listagem corresponde a um mínimo de 80% do quantitativo
                  vendido.
                </strong>
              </p>
            </Col>
          </Row>
        </Container>

        {/* Tabela*/}
        <Container fluid className={styles.tabelaCompradores}>
          <Row>
            <TabelaCompradores />
          </Row>
        </Container>
      </section>
      <Paginacao next="/finalizar" back="/investimentos" />
    </>
  );
}
