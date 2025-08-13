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

  // Manejamos los cambios respectivos a los datos de la cotización en este paso
  const handleChangeCotizacion = (campo, valor) => { // Función para manejar los cambios en los campos del formulario
    setFormData((prev) => ({ 
      ...prev, 
      cotizacion: {
        ...prev.cotizacion,
        [campo]: valor,
      }
    })); // Actualizamos el estado del formulario con el nuevo valor del campo
  };

  useDespieceManual({
    tipo_cotizacion: formData.cotizacion.tipo,
    onResumeChange: ({ despiece, resumen }) => {
      setFormData(prev => ({
        ...prev,
        uso: {
          ...prev.uso,
          despiece,
          resumenDespiece: resumen,
        },
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
          value={formData.uso.id || ""} 
          onChange={handleSeleccionUso}
        >
          <option value="">Seleccione un uso...</option>
          {usos.map((uso) => (
            <option key={uso.id} value={uso.id}>
              {uso.descripcion}
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
          value={formData.cotizacion.tipo || ""}
          onChange={(e) => handleChangeCotizacion("tipo", e.target.value)}
        >
          <option value="">Seleccione...</option>
          <option value="Alquiler">Alquiler</option>
          <option value="Venta">Venta</option>
        </select>
        <div style={{ marginTop: "1rem" }}>
          {errores?.tipo_cotizacion && <p className="error-text">⚠ {errores.tipo_cotizacion}</p>}
        </div>
      </div>
        
      {formData.cotizacion.tipo === "Alquiler" && (
        <div className="wizard-section">
          <label>Duración del alquiler (días):</label>
          <input
            type="number"
            onWheel={(e) => e.target.blur()}
            min="1"
            value={formData.cotizacion.duracion_alquiler || ""}
            onChange={(e) => handleChangeCotizacion("duracion_alquiler", parseInt(e.target.value))}
          />
          <div style={{ marginTop: "1rem" }}>
            {errores?.duracion_alquiler && <p className="error-text">⚠ {errores.duracion_alquiler}</p>}
          </div>
        </div>
      )}
      
    </div>
  );
}