// src/components/LoadingScreen.jsx
import React from "react";
import styles from "./LoadingScreen.module.css";
import { Spinner } from "react-bootstrap";
import Logo from "../../assets/logo.png";

export const LoadingScreen = () => {
  return (
    <div className={styles.loadingOverlay}>
      <div className={styles.loadingContent}>
        <picture>
          <source media="(max-width: 767px)" srcSet={Logo} />
          <img
            src={Logo}
            alt="Logo"
            className={styles.logo + "img-fluid mb-4"}
            loading="lazy"
            decoding="async"
          />
        </picture>
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
      </div>
    </div>
  );
};

export default LoadingScreen;
