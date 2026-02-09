// componentes/GerarCSV.jsx
import { Button } from "react-bootstrap";
import { useContext } from "react";
import { FormContext } from "../FormContext";
import { BsCheckCircleFill } from "react-icons/bs";
import axios from "axios";

export const GerarCSV = () => {
  const { formData } = useContext(FormContext);

  const gerarRelatorio = async () => {
    try {
      const simplifiedData = {
        "Razão Social": formData.razaoSocial || "",
        CNPJ: formData.cnpj || "",
        Endereço: formData.endereco || "",
        Telefone: formData.telefone || "",
        "E-mail": formData.email || "",
        "Substância Mineral": formData.substanciaMineral || "",
        "Produção - Detonado": JSON.stringify(formData.detonadoBritado || []),
        "Custo de Lavra": JSON.stringify(formData.costData || []),
        "Apuração Mensal": JSON.stringify(formData.apuracaoMensal || []),
        // ... outros campos
      };

      const response = await axios.post(
        "/api/finalizar-relatorio",
        simplifiedData,
      );

      if (response.data.xlsxUrl) {
        alert(
          `Relatório finalizado e XLSX gerado com sucesso! URL: ${response.data.xlsxUrl}`,
        );
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
    } finally {
      window.location.replace("/thanku");
    }
  };

  return (
    <Button onClick={gerarRelatorio} variant="success">
      <BsCheckCircleFill /> Finalizar
    </Button>
  );
};

export default GerarCSV;
