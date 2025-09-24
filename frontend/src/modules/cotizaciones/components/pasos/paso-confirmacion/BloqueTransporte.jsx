import { useEffect } from "react";
import { extraerDistrito } from "../../../utils/cotizacionUtils";

// Este componente permite al comercial decidir si requiere transporte o no, seleccionar el tipo de transporte y personalizar los costos
// recibidos automáticamente.

export default function BloqueTransporte({ formData, setFormData, errores }) {
  const distrito = extraerDistrito(formData.entidad.obra.direccion);
  const transporte = formData.atributos_opcionales.transporte;
  
  useEffect(() => {
  setFormData((prev) => ({
      ...prev,
      atributos_opcionales: {
        ...prev.atributos_opcionales,
        transporte: {
          ...prev.atributos_opcionales.transporte,
          tiene_transporte: false
        }
      }
    }));
  }, [formData.uso.despiece]);

  return (
    <div className="wizard-section">
      <label>¿Requiere servicio de transporte para el siguiente distrito?</label>
      <p style={{ fontSize: "0.85rem", color: "#666" }}>📍 Distrito detectado: {distrito}</p>

      <select
        value={
            transporte?.tiene_transporte === true
            ? "TRUE"
            : transporte?.tiene_transporte === false
            ? "FALSE"
            : ""
        }
        onChange={(e) =>
            setFormData((prev) => ({
            ...prev,
            atributos_opcionales: {
              ...prev.atributos_opcionales,
              transporte: {
                ...prev.atributos_opcionales.transporte,
                tiene_transporte: e.target.value === "TRUE",
              }
            }
            }))
        }
        >
        <option value="">Seleccionar una opción</option>
        <option value="TRUE">Sí</option>
        <option value="FALSE">No</option>
    </select>
      <div style={{ fontSize: "13px", marginTop: "1rem", color: "#666" }}>
        {errores?.tiene_transporte && <p className="error-text">{errores.tiene_transporte}</p>}
      </div>

      {transporte?.tiene_transporte && (
        <div style={{ marginTop: "1rem" }}>
          <label>🛻 Tipo de transporte</label>
          <select
            value={transporte?.tipo_transporte || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                atributos_opcionales: {
                  ...prev.atributos_opcionales,
                  transporte: {
                    ...prev.atributos_opcionales.transporte,
                    tipo_transporte: e.target.value,
                  }
                }
              }))
            }
          >
            <option value="">Seleccionar tipo de transporte</option>
            <option value="Camión">Camión</option>
            <option value="Camioneta">Camioneta</option>
            <option value="Semi camión">Semi camión</option>
          </select>
          <div style={{ fontSize: "13px", marginTop: "1rem", color: "#666" }}>
            {errores?.tipo_transporte && <p className="error-text">{errores.tipo_transporte}</p>}
          </div>

          {["costo_tarifas_transporte", "costo_distrito_transporte", "costo_pernocte_transporte"].map((campo, i) => (
            <div key={i} style={{ marginTop: "1rem" }}>
              <label>
                💸 {campo === "costo_tarifas_transporte"
                  ? "Precio de envío/devolución (S/)"
                  : campo === "costo_distrito_transporte"
                  ? "Precio en base al distrito (S/)"
                  : "Precio del pernocte (S/)"
                }
              </label>
              <input
                type="number"
                onWheel={(e) => e.target.blur()} 
                min="0" 
                step="0.01" 
                placeholder="0.00" 
                value={transporte[campo] ?? ""} // Muestra el valor actual del campo, si es null o undefined, se muestra el placeholder
                onChange={(e) => {
                  const valor = e.target.value;
                  // Al escribir, se guarda el valor como string temporal para permitir escritura libre (incluso vacío)
                  setFormData((prev) => ({
                    ...prev,
                    atributos_opcionales: {
                      ...prev.atributos_opcionales,
                      transporte: {
                        ...prev.atributos_opcionales.transporte,
                        [campo]: valor // No lo convertimos aún para no interferir con la experiencia de escritura
                      }
                    }
                  }));
                }}
                onBlur={(e) => {
                  const valor = e.target.value;
                  // Cuando el usuario sale del campo (blur), validamos:
                  // Si el campo quedó vacío, guardamos 0.00
                  // Si tiene valor, lo convertimos (parseFloat)
                  setFormData((prev) => ({
                    ...prev,
                    atributos_opcionales: {
                      ...prev.atributos_opcionales,
                      transporte: {
                        ...prev.atributos_opcionales.transporte,
                        [campo]: valor === "" ? 0.00 : parseFloat(valor)
                      }
                    }
                  }));
                }}
              />
            </div>
          ))}

          <div style={{ marginTop: "1rem" }}>
            <strong>🚛 Costo Transporte Total:</strong> S/{" "}
            {(
              Number(transporte.costo_tarifas_transporte || 0) +
              Number(transporte.costo_distrito_transporte || 0) +
              Number(transporte.costo_pernocte_transporte || 0)
            ).toFixed(2)}
          </div>
          
          <div style={{ fontSize: "13px", marginTop: "1rem", color: "#666" }}>
            {errores?.costo_transporte && <p className="error-text">{errores.costo_transporte}</p>}
          </div>
        </div>
      )}
    </div>
  );
}