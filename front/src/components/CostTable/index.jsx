import styles from "./CostTable.module.css";
import { useState, useContext, useEffect } from "react";
import { FormContext } from "../../FormContext";

export default function CostTable() {
  const { formData, setFormData } = useContext(FormContext);

  // Definindo os itens de custo
  const costItems = [
    {
      id: 1,
      description:
        "Material Empregado diretamente na produção (óleos, combustível, compras de manutenção, etc)",
    },
    {
      id: 2,
      description:
        "Mão de obra utilizada diretamente na produção (Salários de funcionários)",
    },
    {
      id: 3,
      description:
        "Outras despesas diretas (Gastos com terceiros, serviços de manutenção, etc)",
    },
    {
      id: 4,
      description: "Mão de obra indireta (Gastos com terceiros)",
    },
    {
      id: 5,
      description:
        "Despesas de Administração e/ou vendas (Contas telefone, internet, material escritório, vendas, etc)",
    },
    {
      id: 6,
      description:
        "Outras despesas indiretas (Quaisquer gastos com terceiros não indicados acima)",
    },
  ];

  // Inicializando costData com valores vazios
  const [costData, setCostData] = useState(
    costItems.map((item) => ({ ...item, value: "" }))
  );

  // Atualizando o contexto global sempre que costData mudar
  useEffect(() => {
    setFormData((prev) => ({ ...prev, costData }));
  }, [costData, setFormData]);

  // Função para lidar com a mudança de valores
  const handleChange = (id, value) => {
    const updatedCostData = costData.map((item) =>
      item.id === id ? { ...item, value } : item
    );
    setCostData(updatedCostData);
  };

  // Função para calcular o total
  const calculateTotal = () => {
    return costData.reduce((sum, item) => {
      const itemValue = parseFloat(item.value) || 0;
      return sum + itemValue;
    }, 0);
  };

  return (
    <div style={{ padding: "20px" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#e6f2ff" }}>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                textAlign: "left",
              }}
            >
              Itens custo da lavra
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                textAlign: "left",
              }}
            >
              Valor (R$/ano)
            </th>
          </tr>
        </thead>
        <tbody>
          {costData.map((item) => (
            <tr key={item.id}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.description}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                <input
                  type="number"
                  value={item.value}
                  onChange={(e) => handleChange(item.id, e.target.value)}
                  style={{ width: "100%" }}
                />
              </td>
            </tr>
          ))}
          <tr style={{ fontWeight: "bold" }}>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>TOTAL</td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              R$ {calculateTotal().toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
