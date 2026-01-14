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
        "Razão Social": formData.razaoSocial || "",
        CNPJ: formData.cnpj || "",
        Endereço: formData.endereco || "",
        Telefone: formData.telefone || "",
        "E-mail": formData.email || "",
        "Substância Mineral": formData.substanciaMineral || "",
        "Termo Assinado": formData.termoAssinadoUrl || "Não enviado",
        "Produção - Detonado": JSON.stringify(formData.detonadoBritado || []),
        "Estoque Britado": JSON.stringify(formData.estoqueBritado || []),
        "Quantidade em Estoque Britado": JSON.stringify(
          [formData.quantidadeEstoqueBritado, formData.estoqueBritado] || []
        ),
        estoqueBritado: JSON.stringify(formData.estoque || []),
        confirmaEstoque: formData.confirmaEstoque || "",
        possuiEstoque: formData.possuiEstoque || "",
        unidadeProducao: formData.unidadeProducao || "",
        unidadeMedida: formData.unidadeMedida || "",
        salesData: JSON.stringify(formData.salesData || []),
        salesByCategory: JSON.stringify(formData.salesByCategory || []),
        costData: JSON.stringify(formData.costData || []),
        insumos: JSON.stringify(formData.insumos || []),
        matrizEnergetica: formData.matrizEnergetica || "",
        apuracaoMensal: JSON.stringify(formData.apuracaoMensal || []),
        confirmaInvest: formData.confirmaInvest || "",
        aquisi: formData.aquisi || "",
        valorInvest: formData.valorInvest || "",
        compradores: JSON.stringify(formData.compradores || []),
        totalVendido: formData.totalVendido || "",
        novosCompradores: formData.novosCompradores || "",
      };

      const response = await axios.post(
        "http://localhost:3001/api/finalizar-relatorio",
        simplifiedData
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
