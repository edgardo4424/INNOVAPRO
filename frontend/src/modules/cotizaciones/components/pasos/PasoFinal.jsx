// INNOVA PRO+ v1.3.1
import { useWizardContext } from "../../hooks/useWizardCotizacion";

export default function PasoFinal() {
  const { formData } = useWizardContext();

  const {
    contacto_id,
    cliente_id,
    obra_id,
    filial_id,
    uso_id,
    tipo_cotizacion,
    descuento,
    requiereAprobacion,
    resumenDespiece
  } = formData;

  const total = parseFloat(
    tipo_cotizacion === "Alquiler"
      ? resumenDespiece?.precio_subtotal_alquiler_soles
      : resumenDespiece?.precio_subtotal_venta_soles
  );

  const totalConDescuento = (total * (1 - (descuento || 0) / 100)).toFixed(2);

  return (
    <div className="paso-formulario">
      <h3>Paso 6: Revisión y Confirmación</h3>

      <div className="wizard-section">
        <h4>🧑 Información General</h4>
        <div className="wizard-key-value"><strong>👤 Contacto:</strong> {formData.contacto_nombre || `ID #${contacto_id}`}</div>
        <div className="wizard-key-value"><strong>🏢 Cliente:</strong> {formData.cliente_nombre || `ID #${cliente_id}`}</div>
        <div className="wizard-key-value"><strong>🏗️ Obra:</strong> {formData.obra_nombre || `ID #${obra_id}`}</div>
        <div className="wizard-key-value"><strong>🏭 Filial:</strong> {formData.filial_nombre || `ID #${filial_id}`}</div>
      </div>

      <div className="wizard-section">
        <h4>⚙️ Cotización</h4>
        <div className="wizard-key-value"><strong>⚙️ Uso:</strong> {formData.uso_nombre || `ID #${uso_id}`}</div>
        <div className="wizard-key-value"><strong>📦 Tipo de cotización:</strong> {tipo_cotizacion}</div>
        <div className="wizard-key-value"><strong>Descuento:</strong> {formData.descuento || 0}%</div>
        {formData.requiereAprobacion && (
          <div className="wizard-key-value" style={{ color: "#e74c3c" }}>
            ⚠️ Esta cotización requiere aprobación de Gerencia por el descuento aplicado.
          </div>
        )}
      </div>

      {/* SERVICIOS ADICIONALES */}
      <div className="wizard-section">
        <h4>➕ Servicios adicionales</h4>

        {formData.tiene_pernos_disponibles && (
          <div className="wizard-key-value">
            <strong>🔩 Pernos de expansión:</strong> {formData.tiene_pernos ? "Sí, se incluirán" : "No se incluirán"}
          </div>
        )}

        {formData.tiene_transporte && (
          <div className="wizard-key-value">
            <strong>🚚 Transporte incluido:</strong> S/ {formData.costo_transporte?.toFixed(2) || "0.00"}
          </div>
        )}

        {formData.tipo_instalacion === "COMPLETA" && (
          <div className="wizard-key-value">
            <strong>🛠️ Instalación completa:</strong> S/ {formData.precio_instalacion_completa?.toFixed(2) || "0.00"}
          </div>
        )}

        {formData.tipo_instalacion === "PARCIAL" && (
          <>
            <div className="wizard-key-value">
              <strong>🛠️ Instalación completa (referencia):</strong> S/ {formData.precio_instalacion_completa?.toFixed(2) || "0.00"}
            </div>
            <div className="wizard-key-value">
              <strong>🧰 Instalación parcial:</strong> S/ {formData.precio_instalacion_parcial?.toFixed(2) || "0.00"}
            </div>
            <div className="wizard-key-value" style={{ flexDirection: "column", alignItems: "flex-start" }}>
              <strong>📝 Nota sobre instalación parcial:</strong>
              <p style={{ marginTop: "0.3rem", color: "#555", fontSize: "14px" }}>
                {formData.nota_instalacion || "No especificada."}
              </p>
            </div>
          </>
        )}
      </div>

      
      <div className="wizard-total">
        <strong>💰 Total final:</strong> <span> S/ {totalConDescuento}</span>
      </div>

      {(formData.tipo_instalacion || formData.tiene_transporte) && (
        <div className="wizard-total" style={{ marginTop: "1rem", color: "#666", fontSize: "15px" }}>
          <strong>🧾 Total referencial con servicios:</strong>{" "}
          <span style={{ color: "#009688" }}>
            S/ {(
              parseFloat(totalConDescuento) +
              (formData.tiene_transporte ? (formData.costo_transporte || 0) : 0) +
              (formData.tipo_instalacion === "COMPLETA" || formData.tipo_instalacion === "PARCIAL"
                ? (formData.precio_instalacion_completa || 0)
                : 0)
            ).toFixed(2)}
          </span>
        </div>
      )}

      <p style={{ fontSize: "13px", marginTop: "0.4rem", color: "#666" }}>
        <em>
          Este monto incluye el total con transporte e instalación completa como referencia. 
          El precio real a pagar se encuentra en el total final.
        </em>
      </p>


      <div className="mensaje-revision-final">
        Revisa bien todos los datos antes de guardar. Esta será la información registrada en su cotización.
      </div>
    </div>
  );
}