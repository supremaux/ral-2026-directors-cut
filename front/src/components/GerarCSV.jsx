// componentes/GerarCSV.jsx
import { Button } from "react-bootstrap";
import { useContext } from "react";
import { FormContext } from "../FormContext";
import { BsCheckCircleFill } from "react-icons/bs";
import axios from "axios";

axios.defaults.headers.post["Content-Type"] = "application/json";

export const GerarCSV = () => {
  const { formData } = useContext(FormContext);

  // Substitua pela URL correta do seu backend
  const API_URL = "http://localhost:3001";

  // GerarCSV.jsx
  const gerarRelatorio = async () => {
    try {
      const simplifiedData = {
        // Dados Cadastrais
        "Razão Social": formData.razaoSocial || "",
        CNPJ: formData.cnpj || "",
        Endereço: formData.endereco || "",
        Telefone: formData.telefone || "",
        "E-mail": formData.email || "",

        // Termo de Responsabilidade
        "Termo Assinado": formData.termoAssinadoUrl || "Não enviado",

        // Substância Mineral
        "Substância Mineral": formData.substanciaMineral || "",

        // Estoque
        "Possui Estoque": formData.temEstoque || "",
        "Unidade de Estoque": formData.unidadeMedEstoque || "",
        "Estoque Lavrado": formData.estoqueLavra || "",

        // Produção Detonado Britado
        "Substância Produzida": formData.substanciaProduzida || "",
        "Unidade de Produção": formData.unidadeDetonadoBritado || "",
        "Produção - Detonado": Array.isArray(formData.detonadoBritado)
          ? JSON.stringify(formData.detonadoBritado)
          : "[]",

        // Produção Lavrado
        "Substância Lavrado": formData.substanciaLavra || "",
        "Unidade de Medida": formData.unidadeMedida || "",
        "Venda - Produção": Array.isArray(formData.salesData)
          ? JSON.stringify(formData.salesData)
          : "[]",

        // Mão de Obra
        "Mão de Obra": Array.isArray(formData.salesByCategory)
          ? JSON.stringify(formData.salesByCategory)
          : "{}",

        // Custo de Lavra
        "Custo de Lavra": Array.isArray(formData.costData)
          ? JSON.stringify(formData.costData)
          : "[]",

        // Insumos
        "Insumos da Lavra": Array.isArray(formData.insumosSelecionados)
          ? JSON.stringify(formData.insumosSelecionados)
          : "[]",

        // Matriz Energética e Fatura de Energia
        "Matriz Energetica": formData.matrizEnergetica || "",
        "Fatura de Energia": formData.faturaEnergia || "",

        // Apuração Mensal
        "Apuração Mensal": Array.isArray(formData.apuracaoMensal)
          ? JSON.stringify(formData.apuracaoMensal)
          : "[]",

        // Investimento
        "Houve Investimento?": formData.confirmaInvest || "",
        "Setor de Aquisições": formData.aquisi || "",
        "Valor Investido": formData.valorInvest || "",

        // Vendas
        "Nomes dos Compradores": Array.isArray(formData.compradores)
          ? JSON.stringify(formData.compradores)
          : "[]",
        "Total Vendido (R$)": formData.totalVendido || 0,
        "Arquivo Notas Fiscais":
          formData.arquivoNotasFiscaisUrl || "Não enviado",

        // Pilha de Estéril
        "Existe Pilha de Estéril?": formData.existePilhaEsteril || "",
        "Quantidade de Estéril": formData.quantidadeEsteril || "",
      };

      console.log("Dados a serem enviados:", simplifiedData);

      const response = await axios.post(
        `${API_URL}/api/finalizar-relatorio`,
        simplifiedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.xlsxUrl) {
        console.log("URL de download:", response.data.xlsxUrl);
        window.open(response.data.xlsxUrl, "_blank");
      } else {
        alert("Relatório finalizado com sucesso!");
      }
    } catch (error) {
      console.error(
        "Erro ao finalizar relatório:",
        error.response?.data || error.message,
      );
      alert(
        `Erro ao finalizar relatório: ${error.response?.data?.details || error.message}`,
      );
    }
  };

  return (
    <Button onClick={gerarRelatorio} variant="success">
      <BsCheckCircleFill /> Finalizar
    </Button>
  );
};

export default GerarCSV;
