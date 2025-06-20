import { AnimatePresence, motion } from "framer-motion";

// Este componente es un layout para un wizard de cotización.
// Muestra un título, una lista de pasos, el contenido del paso actual y botones de navegación.
// Permite navegar entre los pasos, mostrar un estado de guardado y manejar la finalización del wizard.

export default function WizardLayout({
  titulo,
  pasos,
  pasoActual,
  children,
  exito,
  onPasoClick,
  onAtras,
  onSiguiente,
  onGuardar,
  guardando
}) {
  // Extraemos el componente del paso actual según el estado de pasoActual.
  // Si el paso actual es igual a la longitud de los pasos, significa que se ha completado el wizard.
  // En ese caso, se muestra el componente de éxito.
  const ComponentePaso = pasos[pasoActual]?.componente;

  return (
    <div className="wizard-container">
      <motion.h2 className="wizard-title" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        {titulo}
      </motion.h2>

      <div className="wizard-steps">
        {pasos.map((paso, index) => (
          <div
            key={paso.id}
            className={`step ${index === pasoActual ? "activo" : ""}`}
            onClick={() => !exito && onPasoClick(index)}
            style={{ cursor: exito ? "default" : "pointer", opacity: exito ? 0.5 : 1 }}
          >
            {paso.titulo}
          </div>
        ))}
      </div>

      <div className="wizard-body">
        {guardando ? (
          <div className="wizard-loading">
            <div className="spinner" />
            <p>Guardando cotización...</p>
          </div>
        ) : exito ? (
          children
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={pasoActual} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
              <ComponentePaso />
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {!exito && (
        <div className="wizard-footer">
          {pasoActual > 0 && <button onClick={onAtras} className="btn-secondary">Anterior</button>}
          {pasoActual < pasos.length - 1 ? (
            <button onClick={onSiguiente} className="btn-primary">Siguiente</button>
          ) : (
            <button onClick={onGuardar} className="btn-success">{guardando ? "Guardando..." : "Guardar Cotización"}</button>
          )}
        </div>
      )}
    </div>
  );
}