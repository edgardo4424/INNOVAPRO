// INNOVA PRO+ v1.2.0
import { useEffect, useState } from "react";
import { useWizardContext } from "../../hooks/useWizardCotizacion";
import atributosMock from "../../data/atributosMock";
import Loader from "../../../../shared/components/Loader"

const PasoAtributos = () => {
  const { formData, setFormData, errores } = useWizardContext();
  const [atributos, setAtributos] = useState([]);

  useEffect(() => {
    // Simulación de carga desde backend
    setTimeout(() => {
      setFormData((prev) => ({ ...prev, uso_id: 2 })); // Fijamos uso_id = ANDAMIO TRABAJO
      setAtributos(atributosMock);
    }, 300);
  }, []);

  const handleChange = (llave, valor) => {
    setFormData((prev) => ({
      ...prev,
      atributos: {
        ...prev.atributos,
        [llave]: valor,
      },
    }));
  };

  if (atributos.length === 0) return <Loader texto="Cargando atributos..." />;

  return (
    <div className="paso-formulario">
      <h3>Paso 2: Atributos del Andamio</h3>

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