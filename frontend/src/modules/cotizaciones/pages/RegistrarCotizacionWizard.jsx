// INNOVA PRO+ v1.2.1
import { useState } from "react";
import PasoContacto from "../components/pasos/PasoContacto.jsx";
import PasoFilial from "../components/pasos/PasoFilial.jsx";
import PasoUso from "../components/pasos/PasoUso.jsx";
import PasoAtributos from "../components/pasos/PasoAtributos";
import PasoConfirmacion from "../components/pasos/PasoConfirmacion";
import ExitoCotizacion from "../components/ExitoCotizacion";
import useWizardCotizacion from "../hooks/useWizardCotizacion.jsx";
import "../styles/wizard.css";
import "../styles/exito.css";
import { AnimatePresence, motion } from "framer-motion";
import { crearCotizacion } from "../services/cotizacionesService.js";
import { useAuth } from "../../../context/AuthContext.jsx";

const pasos = [
  { id: 1, titulo: "Contacto", componente: PasoContacto },
  { id: 2, titulo: "Filial", componente: PasoFilial },
  { id: 3, titulo: "Uso del Equipo", componente: PasoUso },
  { id: 4, titulo: "Atributos del Andamio", componente: PasoAtributos },
  { id: 5, titulo: "Confirmación Final", componente: PasoConfirmacion },
];

const RegistrarCotizacionWizard = () => {
  const { user } = useAuth();
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
            onClick={async () => {
              setGuardando(true);
              try {
                const payload = {
                  uso_id: formData.uso_id,
                  atributos_formulario: formData.atributos,
                  cotizacion: {
                    cliente_id: formData.cliente_id, // Asignado automáticamente en PasoContacto
                    obra_id: formData.obra_id,
                    contacto_id: formData.contacto_id,
                    usuario_id: user.id,
                    filial_id: formData.filial_id || 1,
                    estados_cotizacion_id: formData.requiereAprobacion ? 3 : 1,
                    tipo_cotizacion: "Alquiler",
                    tiene_transporte: false,
                    tiene_instalacion: false,
                    porcentaje_descuento: formData.descuento || 0,
                    igv_porcentaje: 18,
                  },
                  despiece: formData.despiece,
                };

                console.log(payload);

                await crearCotizacion(payload);
                setPasoActual(pasos.length);
              } catch (error) {
                console.error("Error al guardar cotización", error);
              }
              setGuardando(false);
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