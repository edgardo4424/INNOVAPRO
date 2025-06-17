import { useEffect, useState } from "react";
import { useWizardContext } from "../../hooks/useWizardCotizacion";
import useDespieceManual  from "../../hooks/useDespieceManual";
import api from "@/shared/services/api";
import Loader from "@/shared/components/Loader";
import { toast } from "react-toastify";

export default function PasoUso() {
  const { formData, setFormData, errores } = useWizardContext(); // Traemmos el contexto del wizard donde se maneja el estado del fomrulario y los errores
  const [usos, setUsos] = useState([]); // Guarda los usos obtenidos del API
  const [loading, setLoading] = useState(true); // Estado de carga para mostrar un loader mientras se obtienen los datos

  useEffect(() => { // Efecto para cargar los usos disponibles desde el API
    const cargarUsos = async () => {
      try {
        const { data } = await api.get("/usos"); 
        setUsos(data);
      } catch (error) {
        console.error("Error al cargar usos", error);
        toast.error("Error al cargar los usos disponibles. Por favor, intenta más tarde.")
      } finally {
        setLoading(false);
      }
    };
    cargarUsos();
  }, []);

  const {
    despieceManual,
    agregarPieza,
    setDespieceManual,
  } = useDespieceManual({
    tipo_cotizacion: formData.tipo_cotizacion,
    onResumeChange: ({ despiece, resumen }) => {
      setFormData(prev => ({
        ...prev,
        despiece,
        resumenDespiece: resumen
      }))
    }
  })
 
  const handleChange = (campo, valor) => { // Función para manejar los cambios en los campos del formulario
    setFormData((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleSeleccionUso = (e) => { // Función para manejar la selección de un uso del equipo
    const idSeleccionado = parseInt(e.target.value);
    const uso = usos.find(u => u.id === idSeleccionado);

    if (!uso) { // Si no se encuentra el uso seleccionado, limpiamos los campos relacionados
      handleChange("uso_id", null);
      handleChange("uso_nombre", "");
      return;
    }

    handleChange("uso_id", uso.id);
    handleChange("uso_nombre", uso.descripcion);
  };

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