// INNOVA PRO+ v1.2.2
import { useEffect, useState } from "react";
import { useWizardContext } from "../../hooks/useWizardCotizacion";
import Loader from "../../../../shared/components/Loader";
import { obtenerAtributosPorUso } from "../../services/cotizacionesService";

const PasoAtributos = () => {
  const { formData, setFormData, errores } = useWizardContext();
  const [atributos, setAtributos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarAtributos = async () => {
      if (!formData.uso_id) return;
      setLoading(true);
      try {
        const data = await obtenerAtributosPorUso(formData.uso_id);

        // ✅ Asegurarnos de que valores_por_defecto esté parseado como array
        const atributosProcesados = data.map((atrib) => {
          let valores = [];
          try {
            valores = Array.isArray(atrib.valores_por_defecto)
              ? atrib.valores_por_defecto
              : JSON.parse(atrib.valores_por_defecto || "[]");
          } catch (error) {
            console.warn(`❌ Error parseando valores_por_defecto en '${atrib.nombre}'`, error);
          }
          return { ...atrib, valores_por_defecto: valores };
        });

        console.log("🔍 Atributos procesados:", atributosProcesados);
        setAtributos(atributosProcesados);
      } catch (error) {
        console.error("Error al cargar los atributos", error);
      } finally {
        setLoading(false);
      }
    };

    cargarAtributos();
  }, [formData.uso_id]);

  const handleChange = (llave, valor) => {
    setFormData((prev) => ({
      ...prev,
      atributos: {
        ...prev.atributos,
        [llave]: valor,
      },
    }));
  };

  if (loading || atributos.length === 0) {
    return <Loader texto="Cargando atributos..." />;
  }

  return (
    <div className="paso-formulario">
      <h3>Paso 4: Atributos del Uso Seleccionado</h3>

      <div className="atributos-grid">
        {atributos.map((atrib) => (
          <div key={atrib.id} className="wizard-section">
            <label>{atrib.nombre}:</label>

            {atrib.tipo_dato === "select" ? (
              <select
                value={formData.atributos[atrib.llave_json] || ""}
                onChange={(e) => handleChange(atrib.llave_json, e.target.value)}
              >
                <option value="">Seleccione...</option>
                {atrib.valores_por_defecto.map((opt, i) => (
                  <option key={i} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="number"
                value={formData.atributos[atrib.llave_json] || ""}
                onChange={(e) => handleChange(atrib.llave_json, e.target.value)}
                placeholder={`Ingrese ${atrib.nombre.toLowerCase()}`}
              />
            )}
          </div>
        ))}

        {errores.atributos && <p className="error-text">{errores.atributos}</p>}
      </div>
    </div>
  );
};

export default PasoAtributos;