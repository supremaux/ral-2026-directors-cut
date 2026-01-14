import Styles from "./Master.module.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Outlet } from "react-router-dom";
import Paginacao from "../../components/Paginacao";

export default function Master() {
  return (
    <main>
      {/* Header component at the top of the page */}
      <Header />
      {/* Outlet component that renders the current route */}
      <Outlet />
      {/* Footer component at the bottom of the page */}
      <Footer />
    </main>
  );
}
