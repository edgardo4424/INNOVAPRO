import { useWizardContext } from "../../context/WizardCotizacionContext";
import { usePasoUso } from "../../hooks/paso-uso/usePasoUso";
import useDespieceManual  from "../../hooks/useDespieceManual";
import Loader from "@/shared/components/Loader";

// Este componente representa el segundo paso del wizard para registrar una cotización.
// Permite seleccionar el uso del equipo y el tipo de cotización (alquiler o venta).
// Utiliza el contexto del wizard para manejar el estado del formulario y los errores. 
// Carga los usos disponibles desde el API al iniciar y actualiza el estado del formulario según la selección del usuario.

export default function PasoUso() {
  const { formData, setFormData, errores } = useWizardContext(); // Traemmos el contexto del wizard donde se maneja el estado del fomrulario y los errores
  
  const { usos, loading, handleChange, handleSeleccionUso } = usePasoUso({ // Usamos el hook personalizado para cargar los usos disponibles
    formData,
    setFormData
  })

  useDespieceManual({
    tipo_cotizacion: formData.tipo_cotizacion,
    onResumeChange: ({ despiece, resumen }) => {
      setFormData(prev => ({
        ...prev,
        despiece,
        resumenDespiece: resumen,
      }))
    }
  })

  if (loading) return <Loader texto="Cargando usos disponibles..." />;

  return (
    <div className="paso-formulario">
      <h3>Paso 2: Detalles de la Cotización</h3>
      
      <div className="wizard-section">
        <label>Uso / Tipo de equipo:</label>
        <select
          value={formData.uso_id || ""} 
          onChange={handleSeleccionUso}
        >
          <option value="">Seleccione un uso...</option>
          {usos.map((u) => (
            <option key={u.id} value={u.id}>
              {u.descripcion}
            </option>
          ))}
        </select>
        <div style={{ marginTop: "1rem" }}>
          {errores?.uso_id && <p className="error-text">⚠ {errores.uso_id}</p>}
        </div>
      </div>

      <div className="wizard-section">
        <label>Tipo de cotización:</label>
        <select
          value={formData.tipo_cotizacion || ""}
          onChange={(e) => handleChange("tipo_cotizacion", e.target.value)}
        >
          <option value="">Seleccione...</option>
          <option value="Alquiler">Alquiler</option>
          <option value="Venta">Venta</option>
        </select>
        {errores?.tipo_cotizacion && <p className="error-text">⚠ {errores.tipo_cotizacion}</p>}
      </div>
        
      {formData.tipo_cotizacion === "Alquiler" && (
        <div className="wizard-section">
          <label>Duración del alquiler (días):</label>
          <input
            type="number"
            min="1"
            value={formData.duracion_alquiler || ""}
            onChange={(e) => handleChange("duracion_alquiler", parseInt(e.target.value))}
          />
          <div style={{ marginTop: "1rem" }}>
            {errores?.duracion_alquiler && <p className="error-text">⚠ {errores.duracion_alquiler}</p>}
          </div>
        </div>
      )}
      
    </div>
  );
}