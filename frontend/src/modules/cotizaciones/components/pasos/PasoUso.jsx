// INNOVA PRO+ v1.3.1
import { useEffect, useState } from "react";
import { useWizardContext } from "../../hooks/useWizardCotizacion";
import api from "@/shared/services/api";
import Loader from "@/shared/components/Loader";

export default function PasoUso() {
  const { formData, setFormData, errores } = useWizardContext();
  const [usos, setUsos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarUsos = async () => {
      try {
        const { data } = await api.get("/usos");
        setUsos(data);
      } catch (error) {
        console.error("Error al cargar usos", error);
      } finally {
        setLoading(false);
      }
    };
    cargarUsos();
  }, []);

  const handleChange = (campo, valor) => {
    setFormData((prev) => ({ ...prev, [campo]: valor }));
  };

  if (loading) return <Loader texto="Cargando usos disponibles..." />;

  return (
    <div className="paso-formulario">
      <h3>Paso 2: Detalles de la Cotización</h3>
      
      <div className="wizard-section">
        <label>Uso / Tipo de equipo:</label>
        <select
          value={formData.uso_id || ""}
          onChange={(e) => {
            const selected = usos.find(u => u.id === parseInt(e.target.value))
            handleChange("uso_id", selected.id)
            handleChange("uso_nombre", selected.descripcion)
          }}
        >
          <option value="">Seleccione un uso...</option>
          {usos.map((u) => (
            <option key={u.id} value={u.id}>
              {u.descripcion}
            </option>
          ))}
        </select>

        {errores.uso_id && <p className="error-text">{errores.uso_id}</p>}
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

        {errores.tipo_cotizacion && <p className="error-text">{errores.tipo_cotizacion}</p>}
      </div>
        
      {formData.tipo_cotizacion === "Alquiler" && (
        <div className="wizard-section">
          <label>Duración del alquiler (días):</label>
          <input
            type="number"
            value={formData.duracion_alquiler || ""}
            onChange={(e) => handleChange("duracion_alquiler", e.target.value)}
          />
          {errores.duracion_alquiler && <p className="error-text">{errores.duracion_alquiler}</p>}
        </div>
      )}
      
    </div>
  );
}