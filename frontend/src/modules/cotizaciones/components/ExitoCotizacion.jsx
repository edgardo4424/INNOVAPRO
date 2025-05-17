// INNOVA PRO+ v1.2.0
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function ExitoCotizacion() {
  const navigate = useNavigate();

  return (
    <motion.div
      className="exito-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <FaCheckCircle className="exito-icon" />
      <h2>¡Cotización registrada con éxito!</h2>
      <p>Tu cotización ha sido generada correctamente. Pronto podrás verla en el listado.</p>

      <div className="exito-actions">
        <button className="btn-primary" onClick={() => navigate("/")}>
          Volver al Dashboard
        </button>

        {/* Actívalo cuando Siberia cree el listado */}
        {/* <button className="btn-secondary" onClick={() => navigate("/cotizaciones/listado")}>
          Ver Listado de Cotizaciones
        </button> */}
      </div>
    </motion.div>
  );
}