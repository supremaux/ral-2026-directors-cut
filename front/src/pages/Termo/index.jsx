import { Container } from "react-bootstrap";
import styles from "./Termo.module.css";
import Paginacao from "../../components/Paginacao";

export default function Termo() {
  return (
    <>
      <section className={styles.termoSection}>
        <Container>
          <h2>Termo de Responsabilidade</h2>
          <p>
            Todos os campos contidos neste relatório devem ser preenchidos
            corretamente. Advertimos ainda, que a falta de informação ou mesmo
            sua incoerência poderá acarretar em recusa do Relatório Anual de
            Lavra - RAL pelo Departamento Nacional de Produção Mineral, ficando
            o titular ou arrendatário, conforme o caso, passível de autuação com
            base no disposto no parágrafo 5º do artigo 6º, da Portaria DNPM nº.
            11 de 14/01/2005, publicada no Diário Oficial de União de 17/01/2005
          </p>
          <h3>
            ALERTAMOS TAMBÉM QUE A RESPONSABILIDADE DOS DADOS ENVIADOS É TOTAL
            DO EMPREENDIMENTO, ESTANDO, PORTANTO, CIENTE DA VERACIDADE DOS DADOS
            INFORMADOS.
          </h3>
        </Container>
      </section>
      <Paginacao next="/substancia" back="/dadoscadastrais" />
    </>
  );
}
