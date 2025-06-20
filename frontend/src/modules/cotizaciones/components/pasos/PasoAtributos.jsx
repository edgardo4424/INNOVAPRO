import { useEffect } from "react";
import { useWizardContext } from "../../context/WizardCotizacionContext";
import Loader from "../../../../shared/components/Loader";
import { useZonasCotizacion } from "../../hooks/paso-atributos/useZonasCotizacion";

// Este componente representa el tercer paso del wizard para registrar una cotización.
// Permite describir mediante atributos dinámicos las zonas con sus respectivos equipos.
// Utiliza el contexto del wizard para manejar el estado del formulario y los errores. 
// Utiliza el hook useZonasCotizacion para la carga de los atributos del uso disponible desde el API al iniciar y 
// actualiza el estado del formulario según la selección del usuario.

const PasoAtributos = () => {
  const { formData, setFormData, errores } = useWizardContext(); // Traemos el contexto del wizard donde se maneja el estado del formulario y los errores
  const {
    zonas,
    atributos,
    loading,
    handleChange,
    agregarZona,
    eliminarZona,
    agregarEquipo,
    eliminarEquipo,
    setZonas
  } = useZonasCotizacion(formData.uso_id); // Hook personalizado para manejar zonas y atributos

  // Actualizar zonas en el formData global cada vez que cambian
  useEffect(() => {
    setFormData((prev) => ({ ...prev, zonas }));
  }, [zonas]);

  if (loading || atributos.length === 0) return <Loader texto="Cargando atributos por zona..." />;

  const actualizarNotaZona = (zonaIndex, nuevaNota) => {
    setZonas((prev) => 
      prev.map((zona, index) =>
        index === zonaIndex ? { ...zona, nota_zona: nuevaNota } : zona
      )
    )
  }

  const renderCampoAtributo = (atributo, zonaIndex, equipoIndex) => {
    const valorActual = zonas[zonaIndex].atributos_formulario[equipoIndex]?.[atributo.llave_json] || "";

    if (atributo.tipo_dato === "select") {
      return (
        <select 
          value={valorActual}
          onChange={(e) =>
            handleChange(zonaIndex, equipoIndex, atributo.llave_json, e.target.value) // Actualiza el valor del atributo 
          }
        >
          <option value="">Seleccione...</option>
          {atributo.valores_por_defecto.map((opt, i) => ( // Mapeamos las opciones del select
            <option key ={i} value={opt}> 
              {opt}
            </option>
          ))}
          </select>
      )
    }

    return ( 
      <input
        type="number"
        value={valorActual}
        onChange={(e) => 
          handleChange(zonaIndex, equipoIndex, atributo.llave_json, e.target.value) // Actualiza el valor del atributo
        }
        placeholder={`Ingrese ${atributo.nombre.toLowerCase()}`}
      />
    )
  }

  return (
    <div className="paso-formulario">
      <h3>Paso 4: Atributos por Zona</h3>

      <p className="mensaje-revision-final">
        Define las zonas del proyecto y los equipos requeridos en cada una para generar una cotización precisa.
      </p>

      {zonas.map((zona, zonaIndex) => (
        <div key={zonaIndex} className="bloque-zona">
          <h3>🗂️ Zona {zonaIndex + 1}</h3>

          <div className="wizard-section">
            <label>📝 Nota de zona:</label>
            <input
              type="text"
              placeholder="Ej: Fachada norte, ducto posterior..."
              value={zona.nota_zona || ""}
              onChange={(e) => actualizarNotaZona(zonaIndex, e.target.value)}
            />
          </div>


          {zona.atributos_formulario.map((equipo, equipoIndex) => (
            <div key={equipoIndex} className="bloque-equipo">
              <h4>Equipo {equipoIndex + 1}</h4>
              <div className="atributos-grid">
                {atributos.map((atrib) => (
                  <div key={atrib.id} className="wizard-section">
                    <label>{atrib.nombre}:</label>
                    {renderCampoAtributo(atrib, zonaIndex, equipoIndex)} {/* Renderiza el campo según su tipo */}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Botones para modificar cantidad de equipos por zona */}
          <div className="botones-cantidad">
            <button
              type="button"
              className="btn-cantidad"
              onClick={() => eliminarEquipo(zonaIndex)}
              disabled={zona.atributos_formulario.length <= 1}
            >
              −
            </button>
            <span className="cantidad-label">
              {zona.atributos_formulario.length} equipo(s)
            </span>
            <button
              type="button"
              className="btn-cantidad"
              onClick={() => agregarEquipo(zonaIndex)}
            >
              +
            </button>
          </div>

          <hr style={{ margin: "2rem 0" }} />
        </div>
      ))}

      {/* Botones para agregar/eliminar zonas */}
      <div className="wizard-section" style={{ textAlign: "center", marginTop: "2rem" }}>
        <p style={{ color: "#ff7b00", fontWeight: "bold", marginBottom: "0.6rem" }}>
          Puedes agregar más zonas si el proyecto lo requiere.
        </p>
        <div className="botones-cantidad">
          <button
            type="button"
            className="btn-cantidad"
            onClick={eliminarZona}
            disabled={zonas.length <= 1}
          >
            − Zona
          </button>
          <span className="cantidad-label">{zonas.length} zona(s)</span>
          <button type="button" className="btn-cantidad" onClick={agregarZona}>
            + Zona
          </button>
        </div>
      </div>

      {errores?.atributos_formulario && (
        <p className="error-text" style={{ textAlign: "center" }}>
          ⚠ {errores.atributos_formulario}
        </p>
      )}
    </div>
  );
};

export default PasoAtributos;