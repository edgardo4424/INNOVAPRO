// INNOVA PRO+ v1.2.1
import { useEffect, useState } from "react";
import { useWizardContext } from "../../hooks/useWizardCotizacion";
import api from "@/shared/services/api";
import Loader from "@/shared/components/Loader";

export default function PasoFilial() {
  const { formData, setFormData } = useWizardContext();
  const [filiales, setFiliales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarFiliales = async () => {
      try {
        const { data } = await api.get("/filiales");
        setFiliales(data);
      } catch (error) {
        console.error("Error al cargar filiales", error);
      } finally {
        setLoading(false);
      }
    };
    cargarFiliales();
  }, []);

  if (loading) return <Loader texto="Cargando filiales..." />;

  return (
    <div className="paso-formulario">
      <h3>Paso 2: Selección de la Filial</h3>
      <label>Filial de Innova:</label>
      <select
        value={formData.filial_id || ""}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, filial_id: parseInt(e.target.value) }))
        }
      >
        <option value="">Seleccione una filial...</option>
        {filiales.map((f) => (
          <option key={f.id} value={f.id}>
            {f.razon_social}
          </option>
        ))}
      </select>
    </div>
  );
}