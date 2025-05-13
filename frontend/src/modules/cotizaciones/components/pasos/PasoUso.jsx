// INNOVA PRO+ v1.2.1
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

  if (loading) return <Loader texto="Cargando usos disponibles..." />;

  return (
    <div className="paso-formulario">
      <h3>Paso 3: ¿Qué deseas cotizar?</h3>
      <label>Uso / Tipo de equipo:</label>
      <select
        value={formData.uso_id || ""}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, uso_id: parseInt(e.target.value) }))
        }
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
  );
}