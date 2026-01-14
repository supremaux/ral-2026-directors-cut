import { Container } from "react-bootstrap";
import styles from "./SalesTable.module.css";
import React, { useContext } from "react";
import { FormContext } from "../../FormContext";

const SalesTable = () => {
  const { formData, setFormData } = useContext(FormContext);

  const handleChange = (index, field, value) => {
    const updatedSalesData = [...formData.salesData];
    updatedSalesData[index][field] = value;
    setFormData({
      ...formData,
      salesData: updatedSalesData,
    });
  };

  const calculateTotal = (field) => {
    return formData.salesData.reduce((sum, data) => {
      const value = parseFloat(data[field]) || 0;
      return sum + value;
    }, 0);
  };

  return (
    <Container className={styles.salesTableContainer}>
      <div style={{ padding: "20px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#e6f2ff" }}>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Mês</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Quantidade Vendida
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Quantidade Vendida (R$)
              </th>
            </tr>
          </thead>
          <tbody>
            {formData.salesData.map((data, index) => (
              <tr key={data.month}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {data.month}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  <input
                    type="number"
                    value={data.quantity}
                    onChange={(e) =>
                      handleChange(index, "quantity", e.target.value)
                    }
                  />
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  <input
                    type="number"
                    value={data.amount}
                    onChange={(e) =>
                      handleChange(index, "amount", e.target.value)
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
                {calculateTotal("quantity")}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                R$ {calculateTotal("amount").toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Container>
  );
};

export default SalesTable;
