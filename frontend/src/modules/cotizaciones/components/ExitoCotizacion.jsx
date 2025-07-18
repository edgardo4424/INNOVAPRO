import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useWizardContext } from "../context/WizardCotizacionContext";

// Este componente muestra un mensaje de éxito al finalizar el proceso de cotización.
// Permite al usuario volver al dashboard o ver el listado de cotizaciones.

export default function ExitoCotizacion() {
  const navigate = useNavigate();
  const { resetFormData } = useWizardContext(); // Obtenemos la función para resetear el formulario

  return (
    <motion.div
      className="exito-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="exito-card">
        <FaCheckCircle className="exito-icon" />
        <h2 className="exito-titulo">¡Cotización registrada con éxito!</h2>
        <p className="exito-subtitulo">
          Tu cotización ha sido generada correctamente. Pronto podrás verla en el listado.
        </p>

      <div className="exito-actions">
        <button className="btn-primary" onClick={() => navigate("/") && resetFormData()}>
          Volver al Dashboard
        </button>
        <button className="btn-secondary" onClick={() => navigate("/cotizaciones") && resetFormData()}>
          Ver Listado de Cotizaciones
        </button> 
      </div>
      </div>
    </motion.div>
  );
}