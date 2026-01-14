import { Button, Col, Container, Row } from "react-bootstrap";
import styles from "./Termo.module.css";
import Paginacao from "../../components/Paginacao";
import UploadButton from "../../components/UploadButton";
import { BsCloudDownloadFill } from "react-icons/bs";

export default function Termo() {
  return (
    <>
      <section className={styles.termoSection}>
        <Container>
          <Row>
            <Col>
              <h2>Termo de Responsabilidade</h2>
            </Col>
          </Row>
          <Row>
            <Col>
              <p>
                Todos os campos contidos neste relatório devem ser preenchidos
                corretamente. Advertimos ainda, que a falta de informação ou
                mesmo sua incoerência poderá acarretar em recusa do Relatório
                Anual de Lavra - RAL pelo Departamento Nacional de Produção
                Mineral, ficando o titular ou arrendatário, conforme o caso,
                passível de autuação com base no disposto no parágrafo 5º do
                artigo 6º, da Portaria DNPM nº. 11 de 14/01/2005, publicada no
                Diário Oficial de União de 17/01/2005
              </p>
            </Col>
          </Row>
          <Row>
            <Col>
              <p>
                ALERTAMOS TAMBÉM QUE A RESPONSABILIDADE DOS DADOS ENVIADOS É
                TOTAL DO EMPREENDIMENTO, ESTANDO, PORTANTO, CIENTE DA VERACIDADE
                DOS DADOS INFORMADOS.
              </p>
            </Col>
          </Row>
          <Row>
            <Col>
              <h3>
                Faça o download do termo abaixo, preencha, assine e envie
                através do botão de upload
              </h3>
            </Col>
          </Row>
        </Container>

        {/* Botões de download e upload do termo */}
        <Container className={styles.botoesTermo}>
          <Row>
            <Col>
              <Button
                as="a"
                href="/termo-exemplo.pdf"
                target="_blank"
                variant="primary"
                size="lg"
                rel="noopener noreferrer"
              >
                <strong>
                  <BsCloudDownloadFill /> &nbsp; Baixar o Termo
                </strong>
              </Button>
            </Col>
          </Row>
        </Container>
        <Container className="mt-4 text-align-center w-100 d-flex justify-content-center">
          <UploadButton />
        </Container>
      </section>
      <Paginacao next="/substancia" back="/dadoscadastrais" />
    </>
  );
}
