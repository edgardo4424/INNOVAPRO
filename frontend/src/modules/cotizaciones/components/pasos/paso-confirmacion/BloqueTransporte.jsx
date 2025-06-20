import { extraerDistrito } from "../../../utils/cotizacionUtils";

// Este componente permite al comercial si requiere transporte o no, seleccionar el tipo de transporte y personalizar los costos
// recibidos automáticamente.

export default function BloqueTransporte({ formData, setFormData, errores }) {
  const distrito = extraerDistrito(formData.obra_direccion);

  return (
    <div className="wizard-section">
      <label>¿Requiere servicio de transporte para el siguiente distrito?</label>
      <p style={{ fontSize: "0.85rem", color: "#666" }}>📍 Distrito detectado: {distrito}</p>

      <select
        value={
            formData.tiene_transporte === true
            ? "TRUE"
            : formData.tiene_transporte === false
            ? "FALSE"
            : ""
        }
        onChange={(e) =>
            setFormData((prev) => ({
            ...prev,
            tiene_transporte: e.target.value === "TRUE",
            costo_transporte: 0,
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

      {formData.tiene_transporte && (
        <div style={{ marginTop: "1rem" }}>
          <label>🛻 Tipo de transporte</label>
          <select
            value={formData.tipo_transporte || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                tipo_transporte: e.target.value,
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
                min="0"
                step="0.01"
                value={formData[campo] || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [campo]: parseFloat(e.target.value),
                  }))
                }
              />
            </div>
          ))}

          <div style={{ marginTop: "1rem" }}>
            <strong>🚛 Costo Transporte Total:</strong> S/{" "}
            {(
              Number(formData.costo_tarifas_transporte || 0) +
              Number(formData.costo_distrito_transporte || 0) +
              Number(formData.costo_pernocte_transporte || 0)
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