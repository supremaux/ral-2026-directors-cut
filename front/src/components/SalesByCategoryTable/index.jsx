import React, { useContext, useMemo, useCallback } from "react";
import styles from "./SalesByCategoryTable.module.css";
import { Container } from "react-bootstrap";
import { FormContext } from "../../FormContext";

const SalesByCategoryTable = () => {
  const { formData, setFormData } = useContext(FormContext);

  const categories = [
    "Engenheiro de Minas",
    "Outros Técnicos",
    "Outro Técnico de Nível Médio",
    "Administrativo",
    "Operários",
  ];

  const custoFunc = useMemo(
    () =>
      categories.map((category) => ({
        category,
        employed: formData.salesByCategory[category]?.employed || "0",
        outsourced: formData.salesByCategory[category]?.outsourced || "0",
      })),
    [formData.salesByCategory]
  );

  const handleChange = useCallback(
    (index, field, value) => {
      const category = custoFunc[index].category;
      setFormData((prevFormData) => ({
        ...prevFormData,
        salesByCategory: {
          ...prevFormData.salesByCategory,
          [category]: {
            ...prevFormData.salesByCategory[category],
            [field]: value,
          },
        },
      }));
    },
    [setFormData, custoFunc]
  );

  const calculateTotal = useCallback(
    (field) =>
      custoFunc.reduce((sum, data) => sum + parseFloat(data[field]) || 0, 0),
    [custoFunc]
  );

  const totalEmployed = calculateTotal("employed");
  const totalOutsourced = calculateTotal("outsourced");
  const grandTotal = totalEmployed + totalOutsourced;

  return (
    <Container className={styles.tableRoll}>
      <div style={{ padding: "20px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#e6f2ff" }}>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Categoria
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Empregado
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Terceirizado
              </th>
            </tr>
          </thead>
          <tbody>
            {custoFunc.map((data, index) => (
              <tr key={data.category}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {data.category}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  <input
                    type="number"
                    value={data.employed}
                    onChange={(e) =>
                      handleChange(index, "employed", e.target.value)
                    }
                  />
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  <input
                    type="number"
                    value={data.outsourced}
                    onChange={(e) =>
                      handleChange(index, "outsourced", e.target.value)
                    }
                  />
                </td>
              </tr>
            ))}
            <tr style={{ fontWeight: "bold" }}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                TOTAL
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {totalEmployed}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {totalOutsourced}
              </td>
            </tr>
            <tr style={{ fontWeight: "bold" }}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                TOTAL GERAL
              </td>
              <td
                colSpan="2"
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                {grandTotal}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Container>
  );
};

export default SalesByCategoryTable;
