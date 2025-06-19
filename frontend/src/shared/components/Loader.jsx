import React from "react";
import styles from "./loader.module.css";

// Este componente Loader muestra un spinner de carga mientras se obtienen datos o se realizan operaciones asíncronas.

export default function Loader() {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.spinner}></div>
    </div>
  );
}