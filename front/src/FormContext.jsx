// src/FormContext.jsx
import { createContext, useState } from "react";

export const FormContext = createContext();
// Definindo os itens de custo de lavra
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
  { id: 4, description: "Mão de obra indireta (Gastos com terceiros)" },
  {
    id: 5,
    description:
      "Despesas de Administração e/ou vendas (Contas telefone, internet, material escritório, vendas, etc)",
  },
];

export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    // Dados Cadastrais
    razaoSocial: "",
    cnpj: "",
    endereco: "",
    telefone: "",
    email: "",

    // Substância Mineral
    substanciaMineral: "",

    // Estoque
    possuiEstoque: "",
    unidadeEstoque: "",
    estoqueBritado: "",

    // Produção Detonado Britado
    substanciaProduzida: "",
    unidadeDetonadoBritado: "",
    detonadoBritado: [
      {
        mes: "Janeiro",
        quantidadeDetonado: 0,
        britado: 0,
        lavrado: 0,
        vendido: 0,
      },
      {
        mes: "Fevereiro",
        quantidadeDetonado: 0,
        britado: 0,
        lavrado: 0,
        vendido: 0,
      },
      {
        mes: "Março",
        quantidadeDetonado: 0,
        britado: 0,
        lavrado: 0,
        vendido: 0,
      },
      {
        mes: "Abril",
        quantidadeDetonado: 0,
        britado: 0,
        lavrado: 0,
        vendido: 0,
      },
      {
        mes: "Maio",
        quantidadeDetonado: 0,
        britado: 0,
        lavrado: 0,
        vendido: 0,
      },
      {
        mes: "Junho",
        quantidadeDetonado: 0,
        britado: 0,
        lavrado: 0,
        vendido: 0,
      },
      {
        mes: "Julho",
        quantidadeDetonado: 0,
        britado: 0,
        lavrado: 0,
        vendido: 0,
      },
      {
        mes: "Agosto",
        quantidadeDetonado: 0,
        britado: 0,
        lavrado: 0,
        vendido: 0,
      },
      {
        mes: "Setembro",
        quantidadeDetonado: 0,
        britado: 0,
        lavrado: 0,
        vendido: 0,
      },
      {
        mes: "Outubro",
        quantidadeDetonado: 0,
        britado: 0,
        lavrado: 0,
        vendido: 0,
      },
      {
        mes: "Novembro",
        quantidadeDetonado: 0,
        britado: 0,
        lavrado: 0,
        vendido: 0,
      },
      {
        mes: "Dezembro",
        quantidadeDetonado: 0,
        britado: 0,
        lavrado: 0,
        vendido: 0,
      },
    ],

    // Estoque
    temEstoque: "",
    unidadeMedEstoque: "", // Nova propriedade para armazenar a unidade de estoque
    estoqueLavra: 0,
    estoqueFinal: 0,

    // Módulo de Beneficiamento
    unidadeMedida: "",
    salesData: [
      { month: "Janeiro", quantity: "", amount: "" },
      { month: "Fevereiro", quantity: "", amount: "" },
      { month: "Março", quantity: "", amount: "" },
      { month: "Abril", quantity: "", amount: "" },
      { month: "Maio", quantity: "", amount: "" },
      { month: "Junho", quantity: "", amount: "" },
      { month: "Julho", quantity: "", amount: "" },
      { month: "Agosto", quantity: "", amount: "" },
      { month: "Setembro", quantity: "", amount: "" },
      { month: "Outubro", quantity: "", amount: "" },
      { month: "Novembro", quantity: "", amount: "" },
      { month: "Dezembro", quantity: "", amount: "" },
    ],

    // Mão de Obra
    salesByCategory: {},

    // Custos da Lavra
    costData: costItems.map((item) => ({ ...item, value: "" })),

    // Insumos
    insumosSelecionados: [], // Array para armazenar itens selecionados e suas quantidades

    // Matriz Energetica
    matrizEnergetica: "",
    faturaEnergia: "",

    // Impostos/Tributos
    apuracaoMensal: [
      {
        mes: "Janeiro",
        icms: 0,
        pis: 0,
        cofins: 0,
        cfem: 0,
        dataPagamentoCFEM: "",
      },
      {
        mes: "Fevereiro",
        icms: 0,
        pis: 0,
        cofins: 0,
        cfem: 0,
        dataPagamentoCFEM: "",
      },
      {
        mes: "Março",
        icms: 0,
        pis: 0,
        cofins: 0,
        cfem: 0,
        dataPagamentoCFEM: "",
      },
      {
        mes: "Abril",
        icms: 0,
        pis: 0,
        cofins: 0,
        cfem: 0,
        dataPagamentoCFEM: "",
      },
      {
        mes: "Maio",
        icms: 0,
        pis: 0,
        cofins: 0,
        cfem: 0,
        dataPagamentoCFEM: "",
      },
      {
        mes: "Junho",
        icms: 0,
        pis: 0,
        cofins: 0,
        cfem: 0,
        dataPagamentoCFEM: "",
      },
      {
        mes: "Julho",
        icms: 0,
        pis: 0,
        cofins: 0,
        cfem: 0,
        dataPagamentoCFEM: "",
      },
      {
        mes: "Agosto",
        icms: 0,
        pis: 0,
        cofins: 0,
        cfem: 0,
        dataPagamentoCFEM: "",
      },
      {
        mes: "Setembro",
        icms: 0,
        pis: 0,
        cofins: 0,
        cfem: 0,
        dataPagamentoCFEM: "",
      },
      {
        mes: "Outubro",
        icms: 0,
        pis: 0,
        cofins: 0,
        cfem: 0,
        dataPagamentoCFEM: "",
      },
      {
        mes: "Novembro",
        icms: 0,
        pis: 0,
        cofins: 0,
        cfem: 0,
        dataPagamentoCFEM: "",
      },
      {
        mes: "Dezembro",
        icms: 0,
        pis: 0,
        cofins: 0,
        cfem: 0,
        dataPagamentoCFEM: "",
      },
    ],

    // Investimentos
    confirmaInvest: "",
    aquisi: "",
    valorInvest: "",

    // Lista de Compradores
    compradores: [],
    totalVendido: 0,
    arquivoNotasFiscaisUrl: "",

    // Pilha de estéril
    existePilhaEsteril: "",
    quantidadeEsteril: "",
  });

  return (
    <FormContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormContext.Provider>
  );
};

export default FormProvider;
