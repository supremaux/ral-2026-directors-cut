// TabelaInsumos.jsx
import { useState, useEffect, useContext } from "react";
import styles from "./TabelaInsumos.module.css";
import { HiOutlineClipboardList } from "react-icons/hi";
import { FaTrash } from "react-icons/fa";
import { FormContext } from "../../FormContext";

export const TabelaInsumos = () => {
  const { formData, setFormData } = useContext(FormContext);

  // Lista de todos os itens possíveis
  const todosInsumos = [
    { item: "Detergente (kg)", valor: "detergente" },
    { item: "Vasilhame de Polipropileno (uni)", valor: "vasilhame" },
    { item: "Copos Plásticos (uni)", valor: "copos" },
    { item: "Tampas Plásticas para garrafão (uni)", valor: "tampas_garrafao" },
    { item: "Tampas Plásticas para PET (uni)", valor: "tampas_pet" },
    { item: "Tampas para copos (uni)", valor: "tampas_copos" },
    { item: "Caixas de papelão (uni)", valor: "caixas" },
    { item: "Rótulos de papel (uni)", valor: "rotulos_papel" },
    { item: "Rótulos em polietileno (uni)", valor: "rotulos_polietileno" },
    { item: "Lacre para garrafões (uni)", valor: "lacre" },
    { item: "Cordel Detonante (m)", valor: "cordel" },
    { item: "Diesel (litro)", valor: "diesel" },
    { item: "Estopim (m)", valor: "estopim" },
    {
      item: "Explosivos Encartuchados (kg)",
      valor: "explosivos_encartuchados",
    },
    { item: "Explosivos Granulados (kg)", valor: "explosivos_granulados" },
    { item: "Retardo (uni)", valor: "retardo" },
    { item: "Booster (uni)", valor: "booster" },
    { item: "Mangueiras (m)", valor: "mangueiras" },
    { item: "Pneus (uni)", valor: "pneus" },
    { item: "Tubo de choque/linha silenciosa (unid)", valor: "tubo_choque" },
  ];

  // Estado local para itens selecionados e suas quantidades
  const [insumosSelecionados, setInsumosSelecionados] = useState(
    formData.insumosSelecionados || [],
  );

  // Estado para controlar quais itens estão marcados na lista
  const [itensMarcados, setItensMarcados] = useState(
    insumosSelecionados.map((insumo) => insumo.valor),
  );

  // Atualiza o contexto global sempre que insumosSelecionados mudar
  useEffect(() => {
    setFormData((prev) => ({ ...prev, insumosSelecionados }));
  }, [insumosSelecionados, setFormData]);

  // Atualiza os itens marcados sempre que insumosSelecionados mudar
  useEffect(() => {
    setItensMarcados(insumosSelecionados.map((insumo) => insumo.valor));
  }, [insumosSelecionados]);

  // Adiciona ou remove um item da lista de selecionados
  const handleToggleInsumo = (item) => {
    const valor = item.valor;
    if (itensMarcados.includes(valor)) {
      // Remove o item se já estiver marcado
      const updatedInsumos = insumosSelecionados.filter(
        (insumo) => insumo.valor !== valor,
      );
      setInsumosSelecionados(updatedInsumos);
    } else {
      // Adiciona o item se não estiver marcado
      setInsumosSelecionados([
        ...insumosSelecionados,
        { ...item, quantidade: 0 },
      ]);
    }
  };

  // Atualiza a quantidade de um item selecionado
  const handleQuantidadeChange = (index, value) => {
    const updatedInsumos = insumosSelecionados.map((insumo, i) =>
      i === index ? { ...insumo, quantidade: Number(value) || 0 } : insumo,
    );
    setInsumosSelecionados(updatedInsumos);
  };

  // Remove um item da lista de selecionados
  const handleRemoverInsumo = (index) => {
    const updatedInsumos = insumosSelecionados.filter((_, i) => i !== index);
    setInsumosSelecionados(updatedInsumos);
  };

  return (
    <div className={styles.container}>
      <h3>
        <HiOutlineClipboardList /> &nbsp; Selecionar Insumos
      </h3>

      {/* Lista de checkboxes para selecionar itens */}
      <div className={styles.listaCheckbox}>
        <h4>Selecione os insumos utilizados:</h4>
        <div className={styles.checkboxGrid}>
          {todosInsumos.map((item) => (
            <div key={item.valor} className={styles.checkboxItem}>
              <label>
                <input
                  type="checkbox"
                  checked={itensMarcados.includes(item.valor)}
                  onChange={() => handleToggleInsumo(item)}
                />
                {item.item}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Lista de itens selecionados e seus campos de quantidade */}
      <div className={styles.listaInsumos}>
        {insumosSelecionados.length > 0 ? (
          <>
            <h4>Insumos Selecionados:</h4>
            <table className={styles.tabelaInsumos}>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantidade</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {insumosSelecionados.map((insumo, index) => (
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
                    <td>
                      <button
                        onClick={() => handleRemoverInsumo(index)}
                        className={styles.botaoRemover}
                      >
                        <FaTrash /> &nbsp; Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <p>Nenhum item selecionado.</p>
        )}
      </div>
    </div>
  );
};

export default TabelaInsumos;
