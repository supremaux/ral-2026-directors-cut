import { BrowserRouter, Routes, Route } from "react-router-dom";
import Master from "./pages/Master";
import Inicio from "./pages/Inicio";
import Dadoscadastrais from "./pages/Dadoscadastrais";
import Termo from "./pages/Termo";
import Substancia from "./pages/Substancia";
import DetonadoBritado from "./pages/DetonadoBritado";
import Estoque from "./pages/Estoque";
import Producao from "./pages/Producao";
import Maodeobra from "./pages/Maodeobra";
import CustodaLavra from "./pages/CustodaLavra";
import Insumos from "./pages/Insumos";
import MatrizEnergetica from "./pages/MatrizEnergetica";
import Impostos from "./pages/Impostos";
import Investimentos from "./pages/Investimentos";
import ListadeCompradores from "./pages/ListadeCompradores";
import Finalizar from "./pages/Finalizar";
import ThankU from "./pages/ThankU";
import Paineladmin from "./pages/Paineladmin";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

export default function AppRoutes() {
  return (
    <>
      {/* Páginas */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Master />}>
            <Route index element={<Inicio />} />
            <Route path="/dadoscadastrais" element={<Dadoscadastrais />} />
            <Route path="/termo" element={<Termo />} />
            <Route path="/substancia" element={<Substancia />} />
            <Route path="/detonadobritado" element={<DetonadoBritado />} />
            <Route path="/estoque" element={<Estoque />} />
            <Route path="/producao" element={<Producao />} />
            <Route path="/maodeobra" element={<Maodeobra />} />
            <Route path="/custodalavra" element={<CustodaLavra />} />
            <Route path="/insumos" element={<Insumos />} />
            <Route path="/matrizenergetica" element={<MatrizEnergetica />} />
            <Route path="/impostos" element={<Impostos />} />
            <Route path="/investimentos" element={<Investimentos />} />
            <Route
              path="/listadecompradores"
              element={<ListadeCompradores />}
            />
            <Route path="/finalizar" element={<Finalizar />} />
          </Route>
          <Route path="/thanku" element={<ThankU />} />
          <Route path="/paineladmin" element={<Paineladmin />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
