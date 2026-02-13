// componentes/GerarCSV.jsx
import { Button } from "react-bootstrap";
import { useContext } from "react";
import { FormContext } from "../FormContext";
import { BsCheckCircleFill } from "react-icons/bs";
import axios from "axios";

axios.defaults.headers.post["Content-Type"] = "application/json";

export const GerarCSV = () => {
  const { formData } = useContext(FormContext);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

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
        "Estoque Lavrado": formData.estoqueLavra
          ? JSON.stringify(formData.estoqueLavra)
          : "[]",

        // Produção Detonado Britado
        "Substância Produzida": formData.substanciaProduzida || "",
        "Unidade de Produção": formData.unidadeDetonadoBritado || "",
        "Produção - Detonado": formData.detonadoBritado
          ? JSON.stringify(formData.detonadoBritado)
          : "[]",

        // Módulo de Beneficiamento
        "Unidade de Medida": formData.unidadeMedida || "",
        "Venda - Produção": formData.salesData
          ? JSON.stringify(formData.salesData)
          : "[]",

        // Mão de Obra
        "Mão de Obra": formData.salesByCategory
          ? JSON.stringify(formData.salesByCategory)
          : "[]",

        // Custo de Lavra
        "Custo de Lavra": formData.costData
          ? JSON.stringify(formData.costData)
          : "[]",

        // Insumos
        "Insumos da Lavra": formData.insumosSelecionados
          ? JSON.stringify(formData.insumosSelecionados)
          : "[]",

        // Matriz Energetica
        "Matriz Energetica": formData.matrizEnergetica || "",
        "Fatura de Energia": formData.faturaEnergia || "",

        // Impostos
        "Apuração Mensal": formData.apuracaoMensal
          ? JSON.stringify(formData.apuracaoMensal)
          : "[]",

        // Investimentos
        "Houve Investimento?": formData.confirmaInvest || "",
        "Setor de Aquisições": formData.aquisi || "",
        "Valor Investido": formData.valorInvest || "",

        // Lista de Compradores
        "Nomes dos Compradores": formData.compradores
          ? JSON.stringify(formData.compradores)
          : "[]",
        "Total Vendido (R$)": formData.totalVendido
          ? JSON.stringify(formData.totalVendido)
          : "0",
        "Arquivo Notas Fiscais":
          formData.arquivoNotasFiscaisUrl || "Não enviado",

        // Pilha de Estéril
        "Existe Pilha de Estéril?": formData.existePilhaEsteril || "",
        "Quantidade de Estéril": formData.quantidadeEsteril || "",

        // ... outros campos
      };

      console.log(
        "Dados a serem enviados:",
        JSON.stringify(simplifiedData, null, 2),
      );

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
