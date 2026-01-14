import React, { useState, useEffect, useContext } from "react";
import styles from "./TabelaInsumos.module.css";
import { FormContext } from "../../FormContext";

export const TabelaInsumos = () => {
  const { formData, setFormData } = useContext(FormContext);

  // Inicializa insumos a partir do contexto global, se existir
  const [insumos, setInsumos] = useState(
    formData.insumos || [
      { item: "Diesel", quantidade: 0 },
      { item: "Explosivos encartuchados", quantidade: 0 },
      { item: "Explosivos Bombeado", quantidade: 0 },
      { item: "ANFO", quantidade: 0 },
      { item: "Cordel", quantidade: 0 },
      { item: "Tubo de choque/Linha silenciosa", quantidade: 0 },
      { item: "Estopim espoletado", quantidade: 0 },
      { item: "Retardo", quantidade: 0 },
      { item: "Booster", quantidade: 0 },
    ]
  );

  // Atualiza o contexto global sempre que insumos mudar
  useEffect(() => {
    setFormData((prev) => ({ ...prev, insumos }));
  }, [insumos, setFormData]);

  const handleQuantidadeChange = (index, value) => {
    const updatedInsumos = insumos.map((insumo, i) =>
      i === index ? { ...insumo, quantidade: Number(value) || 0 } : insumo
    );
    setInsumos(updatedInsumos);
  };

  const calcularTotal = React.useMemo(
    () => insumos.reduce((total, insumo) => total + insumo.quantidade, 0),
    [insumos]
  );

  return (
    <div>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantidade</th>
          </tr>
        </thead>
        <tbody>
          {insumos.map((insumo, index) => (
            <tr key={index}>
              <td>{insumo.item}</td>
              <td>
                <input
                  type="number"
                  value={insumo.quantidade}
                  onChange={(e) =>
                    handleQuantidadeChange(index, e.target.value)
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
              <strong>{calcularTotal}</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TabelaInsumos;
