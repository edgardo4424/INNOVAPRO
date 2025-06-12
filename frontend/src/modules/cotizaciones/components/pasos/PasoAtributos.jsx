// INNOVA PRO+ v1.3.0 - Paso de atributos por zona
import { useEffect } from "react";
import { useWizardContext } from "../../hooks/useWizardCotizacion";
import Loader from "../../../../shared/components/Loader";
import { useZonasCotizacion } from "../../hooks/useZonasCotizacion";

const PasoAtributos = () => {
  const { formData, setFormData, errores } = useWizardContext();
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
  } = useZonasCotizacion(formData.uso_id);

  // Almacenar zonas en formData global al avanzar
  useEffect(() => {
    setFormData((prev) => ({ ...prev, zonas }));
  }, [zonas]);

  if (loading || atributos.length === 0) return <Loader texto="Cargando atributos por zona..." />;

  return (
    <div className="paso-formulario">
      <h3>Paso 4: Atributos por Zona</h3>

      <p className="wizard-explicacion">
        En este paso puedes definir las zonas de trabajo del proyecto y los equipos que se utilizarán en cada una.
        Esto permitirá una cotización más precisa, ya que cada zona puede tener necesidades distintas.
      </p>

      {zonas.map((zona, zonaIndex) => (
        <div key={zonaIndex} className="bloque-zona">
          <h3>🗂️ Zona {zonaIndex + 1}</h3>

          {zona.atributos_formulario.map((equipo, equipoIndex) => (
            <div key={equipoIndex} className="bloque-equipo">
              <h4>Equipo {equipoIndex + 1}</h4>
              <div className="atributos-grid">
                {atributos.map((atrib) => (
                  <div key={atrib.id} className="wizard-section">
                    <label>{atrib.nombre}:</label>
                    {atrib.tipo_dato === "select" ? (
                      <select
                        value={zonas[zonaIndex].atributos_formulario[equipoIndex]?.[atrib.llave_json] || ""}
                        onChange={(e) =>
                          handleChange(zonaIndex, equipoIndex, atrib.llave_json, e.target.value)
                        }
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
                        value={zonas[zonaIndex].atributos_formulario[equipoIndex]?.[atrib.llave_json] || ""}
                        onChange={(e) =>
                          handleChange(zonaIndex, equipoIndex, atrib.llave_json, e.target.value)
                        }
                        placeholder={`Ingrese ${atrib.nombre.toLowerCase()}`}
                      />
                    )}
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
          Agrega todas las zonas necesarias para el proyecto
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
      {console.log("Atributos enviados al backend", atributos)}

      {errores.atributos && <p className="error-text">{errores.atributos}</p>}
    </div>
  );
};

export default PasoAtributos;