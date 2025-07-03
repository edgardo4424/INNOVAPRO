import { useEffect } from "react";
import { useZonasCotizacion } from "../../cotizaciones/hooks/paso-atributos/useZonasCotizacion";
import styles from "./DespieceTarea.module.css";

export default function DespieceTarea({ formData, setFormData }) {
  const usoId = Number(formData.usoId);

  const {
    atributos,
    zonas,
    agregarZona,
    eliminarZona,
    agregarEquipo,
    eliminarEquipo,
    handleChange,
    setZonas,
    } = useZonasCotizacion(usoId);

  // Actualizar zonas en formData
  useEffect(() => {
    setFormData((prev) => ({ ...prev, zonas }));
  }, [zonas]);

  if (!usoId || !atributos.length) 
    return <p>Seleccione un tipo de equipo para ver los atributos.</p>;

  return (
    <div className={styles.despieceBloque}>
      <h4>🔧 Selección de Uso / Tipo de Equipo</h4>

      <div className={styles.wrapper}>
        {zonas.map((zona, zonaIndex) => (
          <div key={zonaIndex} className={styles.zonaContainer}>
            <div className={styles.inputGroup}>
              <label>🗂️ Nota zona:</label>
              <input
                value={zona.nota_zona}
                onChange={(e) => {
                  const nueva = e.target.value;
                  setZonas((prev) =>
                    prev.map((z, i) =>
                      i === zonaIndex ? { ...z, nota_zona: nueva } : z
                    )
                  );
                }}
              />
            </div>

            {zona.atributos_formulario.map((equipo, equipoIndex) => (
              <div key={equipoIndex} className={styles.equipoBox}>
                <label className={styles.controlLabel}>Equipo {equipoIndex + 1}</label>

                <div className={styles.inputGroup}>
                  {atributos.map((atrib) => (
                    <div key={atrib.id} className={styles.formGroup}>
                      <label>{atrib.nombre}:</label>
                      {atrib.tipo_dato === "select" ? (
                        <select
                          value={equipo[atrib.llave_json] || ""}
                          onChange={(e) =>
                            handleChange(zonaIndex, equipoIndex, atrib.llave_json, e.target.value)
                          }
                        >
                          <option value="">Seleccione...</option>
                          {atrib.valores_por_defecto.map((v, i) => (
                            <option key={i} value={v}>
                              {v}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="number"
                          value={equipo[atrib.llave_json] || ""}
                          onChange={(e) =>
                            handleChange(zonaIndex, equipoIndex, atrib.llave_json, e.target.value)
                          }
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Botones de equipos */}
            <div className={styles.botonesCantidad}>
              <button type="button" onClick={() => eliminarEquipo(zonaIndex)}>− Equipo</button>
              <button type="button" onClick={() => agregarEquipo(zonaIndex)}>+ Equipo</button>
            </div>

            <hr />
          </div>
        ))}
      </div>

      {/* Botones zonas */}
      <div className={styles.acciones}>
        <button type="button" onClick={eliminarZona}>− Zona</button>
        <button type="button" onClick={agregarZona}>+ Zona</button>
      </div>
    </div>
  );
}