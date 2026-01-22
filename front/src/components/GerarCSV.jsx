import { Button } from "react-bootstrap";
import { useContext } from "react";
import { FormContext } from "../FormContext";
import { BsCheckCircleFill } from "react-icons/bs";
import axios from "axios";

export const GerarCSV = () => {
  const { formData } = useContext(FormContext);

  const gerarCSV = async () => {
    try {
      // Simplificando os dados para um formato que o papaparse consiga processar
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
        "Unidade de Estoque": formData.unidadeEstoque || "",
        "Estoque Lavrado": JSON.stringify(formData.estoqueLavra || []),

        // Produção Detonado Britado
        "Substância Produzida": formData.substanciaProduzida || "",
        "Unidade de Produção": formData.unidadeDetonadoBritado || "",
        "Produção - Detonado": JSON.stringify(formData.detonadoBritado || []),

        // Módulo de Beneficiamento
        "Unidade de Medida": formData.unidadeMedida || "",
        "Venda - Produção": JSON.stringify(formData.salesData || []),

        // Mão de Obra
        "Mão de Obra": JSON.stringify(formData.salesByCategory || []),

        // Custo de Lavra
        "Custo de Lavra": JSON.stringify(formData.costData || []),

        // Insumos
        "Insumos da Lavra": JSON.stringify(formData.insumosSelecionados || []),

        // Matriz Energetica
        "Matriz Energetica": formData.matrizEnergetica || "",
        "Fatura de Energia": formData.faturaEnergia || "",

        // Impostos
        "Apuração Mensal": JSON.stringify(formData.apuracaoMensal || []),

        // Investimentos
        "Houve Investimento?": formData.confirmaInvest || "",
        "Aquisições do Ano": formData.aquisi || "",
        "Valor Investido": formData.valorInvest || "",

        // Lista de Compradores
        "Nomes dos Compradores": formData.compradores || [],
        "Total Vendido (R$)": formData.totalVendido || 0,
        "Arquivo Notas Fiscais":
          formData.arquivoNotasFiscaisUrl || "Não enviado",

        // Pilha de Estéril
        "Existe Pilha de Estéril?": formData.existePilhaEsteril || "",
        "Quantidade de Estéril": formData.quantidadeEsteril || "",

        // ... outros campos
      };

      const response = await axios.post(
        "http://localhost:3001/api/finalizar-relatorio",
        simplifiedData,
      );
      alert("Relatório finalizado e CSV gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao finalizar relatório:", error);
      alert("Erro ao finalizar relatório.");
    } finally {
      window.location.replace("/thanku");
    }
  };

  return (
    <Button onClick={gerarCSV} variant="success">
      <BsCheckCircleFill /> Finalizar
    </Button>
  );
};

export default GerarCSV;
