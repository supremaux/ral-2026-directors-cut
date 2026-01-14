import React, { useContext, useState, useEffect } from "react";
import { FormContext } from "../../FormContext";

const TabelaApuracaoMensal = () => {
  const { formData, setFormData } = useContext(FormContext);

  const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const [apuracao, setApuracao] = useState(
    () =>
      formData.apuracaoMensal ||
      meses.map((mes) => ({
        mes,
        icms: 0,
        pis: 0,
        cofins: 0,
        cfem: 0,
        dataPagamentoCFEM: "",
      }))
  );

  // Atualiza o contexto global sempre que 'apuracao' mudar
  useEffect(() => {
    setFormData((prev) => ({ ...prev, apuracaoMensal: apuracao }));
  }, [apuracao, setFormData]);

  const handleValorChange = (index, campo, valor) => {
    const novaApuracao = [...apuracao];
    novaApuracao[index][campo] =
      campo === "dataPagamentoCFEM" ? valor : Number(valor) || 0;
    setApuracao(novaApuracao);
  };

  const calcularTotal = (campo) => {
    return apuracao.reduce((total, mes) => total + (mes[campo] || 0), 0);
  };

  return (
    <div>
      <table border="1" cellPadding="5" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Mês de Apuração</th>
            <th>ICMS</th>
            <th>PIS</th>
            <th>COFINS</th>
            <th>CFEM</th>
            <th>Data de pagamento do CFEM</th>
          </tr>
        </thead>
        <tbody>
          {apuracao.map((mes, index) => (
            <tr key={index}>
              <td>{mes.mes}</td>
              <td>
                <input
                  type="number"
                  value={mes.icms}
                  onChange={(e) =>
                    handleValorChange(index, "icms", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  value={mes.pis}
                  onChange={(e) =>
                    handleValorChange(index, "pis", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  value={mes.cofins}
                  onChange={(e) =>
                    handleValorChange(index, "cofins", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  value={mes.cfem}
                  onChange={(e) =>
                    handleValorChange(index, "cfem", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="date"
                  value={mes.dataPagamentoCFEM}
                  onChange={(e) =>
                    handleValorChange(
                      index,
                      "dataPagamentoCFEM",
                      e.target.value
                    )
                  }
                />
              </td>
            </tr>
          ))}
          <tr>
            <td>
              <strong>TOTAL</strong>
            </td>
            <td>
              <strong>R$ {calcularTotal("icms").toFixed(2)}</strong>
            </td>
            <td>
              <strong>R$ {calcularTotal("pis").toFixed(2)}</strong>
            </td>
            <td>
              <strong>R$ {calcularTotal("cofins").toFixed(2)}</strong>
            </td>
            <td>
              <strong>R$ {calcularTotal("cfem").toFixed(2)}</strong>
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TabelaApuracaoMensal;
