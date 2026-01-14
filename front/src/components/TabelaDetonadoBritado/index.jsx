import styles from "./TabelaDetonadoBritado.module.css";
import { useContext } from "react";
import { FormContext } from "../../FormContext";

export default function TabelaDetonadoBritado() {
  const { formData, setFormData } = useContext(FormContext);

  const handleChange = (index, field, value) => {
    const newDetonadoBritado = [...formData.detonadoBritado];
    newDetonadoBritado[index][field] = value;
    setFormData({
      ...formData,
      detonadoBritado: newDetonadoBritado,
    });
  };

  const calcularTotais = () => {
    if (!formData.detonadoBritado) {
      return { totalDetonado: 0, totalBritado: 0 };
    }

    const reducer = (acc, { quantidadeDetonado, britado }) => {
      acc.totalDetonado += parseFloat(quantidadeDetonado) || 0;
      acc.totalBritado += parseFloat(britado) || 0;
      return acc;
    };

    const { totalDetonado, totalBritado } = formData.detonadoBritado.reduce(
      reducer,
      {
        totalDetonado: 0,
        totalBritado: 0,
      }
    );

    return { totalDetonado, totalBritado };
  };

  const { totalDetonado, totalBritado } = calcularTotais();

  return (
    <div style={{ overflowX: "auto" }}>
      <table border="1" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ padding: "8px", backgroundColor: "#f2f2f2" }}>Mês</th>
            <th style={{ padding: "8px", backgroundColor: "#f2f2f2" }}>
              Quantidade DETONADO
            </th>
            <th style={{ padding: "8px", backgroundColor: "#f2f2f2" }}>
              BRITADO
            </th>
          </tr>
        </thead>
        <tbody>
          {formData.detonadoBritado.map((item, index) => (
            <tr
              key={index}
              style={{
                backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#e6e6e6",
              }}
            >
              <td style={{ padding: "8px" }}>{item.mes}</td>
              <td style={{ padding: "8px" }}>
                <input
                  type="number"
                  value={item.quantidadeDetonado}
                  onChange={(e) =>
                    handleChange(index, "quantidadeDetonado", e.target.value)
                  }
                  style={{ width: "100%" }}
                />
              </td>
              <td style={{ padding: "8px" }}>
                <input
                  type="number"
                  value={item.britado}
                  onChange={(e) =>
                    handleChange(index, "britado", e.target.value)
                  }
                  style={{ width: "100%" }}
                />
              </td>
            </tr>
          ))}
          <tr style={{ fontWeight: "bold", backgroundColor: "#d3d3d3" }}>
            <td style={{ padding: "8px" }}>TOTAL</td>
            <td style={{ padding: "8px" }}>{totalDetonado.toFixed(2)}</td>
            <td style={{ padding: "8px" }}>R$ {totalBritado.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
      {console.log("Tabela detonadoBritado:", formData.detonadoBritado)}
    </div>
  );
}
