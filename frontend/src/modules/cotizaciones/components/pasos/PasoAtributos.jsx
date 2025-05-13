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
        setAtributos(data);
      } catch (error) {
        console.error("Error al cargar los atributos", error);
      } finally {
        setLoading(false);
      }
    };

    cargarAtributos();
  }, [formData.uso_id]); // 🔁 Se vuelve a ejecutar cada vez que cambia el uso seleccionado

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

      {atributos.map((atrib) => (
        <div key={atrib.id}>
          <label>{atrib.nombre}:</label>

          {atrib.tipo_dato === "select" ? (
            <select
              value={formData.atributos[atrib.llave_json] || ""}
              onChange={(e) => handleChange(atrib.llave_json, e.target.value)}
            >
              <option value="">Seleccione...</option>
              {atrib.opciones?.map((opt, i) => (
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
  );
};

export default PasoAtributos;