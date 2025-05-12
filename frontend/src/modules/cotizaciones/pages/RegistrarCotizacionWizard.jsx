import { useState } from "react";
import PasoCliente from "../components/pasos/PasoCliente";
import PasoAtributos from "../components/pasos/PasoAtributos";
import PasoConfirmacion from "../components/pasos/PasoConfirmacion";
import ExitoCotizacion from "../components/ExitoCotizacion";
import useWizardCotizacion from "../hooks/useWizardCotizacion.jsx";
import "../styles/wizard.css";
import "../styles/exito.css";
import { AnimatePresence, motion } from "framer-motion";

const pasos = [
  { id: 1, titulo: "Datos del Cliente", componente: PasoCliente },
  { id: 2, titulo: "Atributos del Andamio", componente: PasoAtributos },
  { id: 3, titulo: "Confirmación Final", componente: PasoConfirmacion },
];

const RegistrarCotizacionWizard = () => {
  const [pasoActual, setPasoActual] = useState(0);
  const { formData, errores, validarPaso, setErrores } = useWizardCotizacion();
  const [guardando, setGuardando] = useState(false);

  const ComponentePaso = pasos[pasoActual]?.componente;

  const avanzarPaso = () => {
    const erroresPaso = validarPaso(pasoActual);
    if (Object.keys(erroresPaso).length > 0) {
      setErrores(erroresPaso);
      return;
    }
    setErrores({});
    setPasoActual((prev) => prev + 1);
  };

  const retrocederPaso = () => {
    setErrores({});
    setPasoActual((prev) => prev - 1);
  };

  return (
    <div className="wizard-container">
      <motion.h2
        className="wizard-title"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Registrar Cotización
      </motion.h2>

      <div className="wizard-steps">
        {pasos.map((paso, index) => (
          <div
            key={paso.id}
            className={`step ${index === pasoActual ? "activo" : ""}`}
          >
            {paso.titulo}
          </div>
        ))}
      </div>

      <div className="wizard-body">
        {guardando ? (
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <div className="spinner" style={{ margin: "1rem auto" }} />
            <p>Guardando cotización...</p>
          </div>
        ) : pasoActual === pasos.length ? (
          <ExitoCotizacion />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={pasoActual}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <ComponentePaso />
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <div className="wizard-footer">
        {pasoActual > 0 && (
          <button onClick={retrocederPaso} className="btn-secondary">
            Anterior
          </button>
        )}
        {pasoActual < pasos.length - 1 ? (
          <button onClick={avanzarPaso} className="btn-primary">
            Siguiente
          </button>
        ) : (
          <button
            className="btn-success"
            onClick={() => {
              setGuardando(true);
              setTimeout(() => {
                setGuardando(false);
                setPasoActual(pasos.length);
              }, 1500);
            }}
          >
            {guardando ? "Guardando..." : "Guardar Cotización"}
          </button>
        )}
      </div>
    </div>
  );
};

export default RegistrarCotizacionWizard;