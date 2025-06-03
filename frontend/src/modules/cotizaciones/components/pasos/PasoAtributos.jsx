// INNOVA PRO+ v1.2.3 - PasoAtributos dinámico con cantidad_uso
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

        setAtributos(atributosProcesados);
      } catch (error) {
        console.error("Error al cargar los atributos", error);
      } finally {
        setLoading(false);
      }
    };

    cargarAtributos();
  }, [formData.uso_id]);

  const handleChange = (index, llave, valor) => {
    setFormData((prev) => {
      const actuales = Array.isArray(prev.atributos) ? prev.atributos : [];
      const nuevos = [...actuales];
      if (!nuevos[index]) nuevos[index] = {};
      nuevos[index][llave] = valor;

      // Propagar cambios del primer bloque si es nuevo
      if (index === 0) {
        for (let i = 1; i < (formData.cantidad_uso || 1); i++) {
          if (!nuevos[i]) nuevos[i] = {};
          if (!nuevos[i][llave]) nuevos[i][llave] = valor;
        }
      }

      return { ...prev, atributos: nuevos };
    });
  };

  if (loading || atributos.length === 0) {
    return <Loader texto="Cargando atributos..." />;
  }

  const cantidadFormularios = formData.cantidad_uso || 1;

  return (
    <div className="paso-formulario">
      <h3>Paso 4: Atributos del Uso Seleccionado</h3>

      {Array.from({ length: cantidadFormularios }).map((_, index) => (
      <div key={index} className="bloque-equipo">
        <h4>Equipo {index + 1}</h4>
        <div className="atributos-grid">
          {atributos.map((atrib) => (
            <div key={atrib.id} className="wizard-section">
              <label>{atrib.nombre}:</label>
              {atrib.tipo_dato === "select" ? (
                <select
                  value={formData.atributos?.[index]?.[atrib.llave_json] || ""}
                  onChange={(e) => handleChange(index, atrib.llave_json, e.target.value)}
                >
                  <option value="">Seleccione...</option>
                  {atrib.valores_por_defecto.map((opt, i) => (
                    <option key={i} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="number"
                  value={formData.atributos?.[index]?.[atrib.llave_json] || ""}
                  onChange={(e) => handleChange(index, atrib.llave_json, e.target.value)}
                  placeholder={`Ingrese ${atrib.nombre.toLowerCase()}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    ))}

    {/* ✅ Botones al final del formulario */}
    <div className="wizard-section" style={{ textAlign: "center", marginTop: "2rem" }}>
      <p style={{ color: "#ff7b00", fontWeight: "bold", marginBottom: "0.6rem" }}>
        Haz clic en + para cotizar más equipos similares
      </p>
      <div className="botones-cantidad">
        {formData.cantidad_uso > 1 && (
          <button
            type="button"
            title="Quitar equipo"
            className="btn-cantidad"
            onClick={() =>
              setFormData((prev) => {
                const nuevaCantidad = Math.max(1, (prev.cantidad_uso || 1) - 1);
                const nuevosAtributos = Array.isArray(prev.atributos)
                  ? prev.atributos.slice(0, nuevaCantidad)
                  : [];

                return {
                  ...prev,
                  cantidad_uso: nuevaCantidad,
                  atributos: nuevosAtributos,
                };
              })
            }
          >
            −
          </button>
        )}
        <span className="cantidad-label">{formData.cantidad_uso || 1}</span>
        <button
          type="button"
          title="Agregar equipo a cotizar"
          className="btn-cantidad"
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              cantidad_uso: (prev.cantidad_uso || 1) + 1,
            }))
          }
        >
          +
        </button>
      </div>
    </div>

      {errores.atributos && <p className="error-text">{errores.atributos}</p>}
    </div>
    
  );
  
};

export default PasoAtributos;