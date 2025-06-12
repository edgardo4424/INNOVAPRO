// INNOVA PRO+ v1.2.1
import { useState } from "react";
import PasoContacto from "../components/pasos/PasoContacto.jsx";
import PasoFinal from "../components/pasos/PasoFinal.jsx";
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
  { id: 2, titulo: "Uso del Equipo", componente: PasoUso },
  { id: 3, titulo: "Atributos del Equipo", componente: PasoAtributos },
  { id: 4, titulo: "Confirmación Final", componente: PasoConfirmacion },
  { id: 5, titulo: "Revisión y Envío", componente: PasoFinal },
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

  const exito = pasoActual === pasos.length;

  function extraerDistrito(direccion) {
        if (!direccion) return "";
        const partes = direccion.split(",").map(p => p.trim());
        const posibles = partes.slice().reverse(); // empezamos desde el final
        for (let parte of posibles) {
          const sinNumeros = parte.replace(/[0-9]/g, "").trim();
          if (sinNumeros.length > 1 && !sinNumeros.includes("PERÚ")) {
            return sinNumeros.toUpperCase();
            
          }
        }
        return "";
      }

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
            onClick={() => {
              if (!exito) setPasoActual(index)
            }}
            style={{ cursor: exito ? "default" : "pointer", opacity: exito ? 0.5 : 1 }}
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

      {!exito && (
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
                  /* atributos_formulario: Array.isArray(formData.atributos)
                  ? formData.atributos.map((bloque, index) => ({
                      ...bloque,
                      numero_formulario_uso: index + 1,
                    }))
                  : [], */
                  zonas: Array.isArray(formData.zonas) ? formData.zonas : [],
                  cotizacion: {
                    cliente_id: formData.cliente_id,
                    obra_id: formData.obra_id,
                    contacto_id: formData.contacto_id,
                    
                    filial_id: formData.filial_id,
                    
                    tipo_cotizacion: formData.tipo_cotizacion,
                    tiene_transporte: formData.tiene_transporte,
                    tipo_transporte: formData.tipo_transporte,
                    costo_tarifas_transporte: formData.costo_tarifas_transporte || 0,
                    costo_distrito_transporte: formData.costo_distrito_transporte || 0,
                    costo_pernocte_transporte: formData.costo_pernocte_transporte || 0,

                    tiene_pernos: formData.tiene_pernos,

                    tiene_instalacion: formData.tiene_instalacion,
                    tipo_instalacion: formData.tipo_instalacion || null,

                    precio_instalacion_completa: formData.precio_instalacion_completa || 0,
                    precio_instalacion_parcial: formData.precio_instalacion_parcial || 0,
                    nota_instalacion: formData.nota_instalacion || "",

                    porcentaje_descuento: formData.descuento || 0,
                    igv_porcentaje: 18,

                    tiempo_alquiler_dias: formData.duracion_alquiler,

                    distrito_transporte: extraerDistrito(formData.obra_direccion)
                  },

                  despiece: formData.despiece,
                };
                console.log("DATOS ENVIADOS AL BACKEND",payload);
                await crearCotizacion(payload);
                setPasoActual(pasos.length);
              } catch (error) {
                console.error("Error al guardar cotización", error.response?.data?.message || error.message);
              }
              setGuardando(false);
            }}
          >
            {guardando ? "Guardando..." : "Guardar Cotización"}
          </button>
        )}
      </div>
      )}
    </div>
  );
};

export default RegistrarCotizacionWizard;