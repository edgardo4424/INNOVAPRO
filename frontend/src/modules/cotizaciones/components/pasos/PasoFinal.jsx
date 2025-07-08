import { useWizardContext } from "../../context/WizardCotizacionContext";

// Este componente representa el último paso del Wizard
// Su función es mostrar un resumen organizado y limpio de todo los datos relevantes seleccionados durante 
// el proceso de cotización. Todo ésto para confirmar antes de guardar la cotización.

export default function PasoFinal() {
  const { formData } = useWizardContext();

  const {
    contacto_id,
    contacto_nombre,
    cliente_id,
    cliente_nombre,
    obra_id,
    obra_nombre,
    filial_id,
    filial_nombre,
    uso_id,
    uso_nombre,
    tipo_cotizacion,
    descuento,
    requiereAprobacion,
    resumenDespiece,
    tiene_pernos_disponibles,
    tiene_pernos,
    tiene_transporte,
    tipo_instalacion,
    precio_instalacion_completa,
    precio_instalacion_parcial,
    nota_instalacion,
    costo_tarifas_transporte,
    costo_distrito_transporte,
    costo_pernocte_transporte,
    tiene_instalacion
  } = formData;

  // Cálculo del total base
  const calcularTotalBase = () => {
    if (tipo_cotizacion === "Alquiler") {
      if (uso_id === 3 && formData.detalles_escaleras) {
        const { precio_tramo, tramos_2m, tramos_1m } = formData.detalles_escaleras;
        const tramos = (tramos_2m || 0) + (tramos_1m || 0);
        return parseFloat((precio_tramo * tramos).toFixed(2));
      }
      return parseFloat(resumenDespiece?.precio_subtotal_alquiler_soles || 0);
    } else {
      return parseFloat(resumenDespiece?.precio_subtotal_venta_soles || 0);
    }
  };

  const total = calcularTotalBase();


  // Aplicación de descuento en caso tenga
  const totalConDescuento = (total * (1 - (descuento || 0) / 100)).toFixed(2);

  // Precio final de transporte
  const precio_final_transporte = 
    Number(formData.costo_tarifas_transporte || 0) + 
    Number(formData.costo_distrito_transporte || 0)+ 
    Number(formData.costo_pernocte_transporte || 0);

  // Cálculo del total con servicios incluidos
  const totalReferencial = (
    parseFloat(totalConDescuento) +
    (tiene_transporte ? precio_final_transporte : 0) +
    (tipo_instalacion === "COMPLETA" || tipo_instalacion === "PARCIAL"
      ? (precio_instalacion_completa || 0)
      : 0)
  ).toFixed(2);
             

  return (
    <div className="paso-formulario">
      <h3>Paso 6: Revisión y Confirmación</h3>

      <div className="wizard-section">
        <h4>🧑 Información General</h4>
        <div className="wizard-key-value"><strong>👤 Contacto:</strong> {contacto_nombre || `ID #${contacto_id}`}</div>
        <div className="wizard-key-value"><strong>🏢 Cliente:</strong> {cliente_nombre || `ID #${cliente_id}`}</div>
        <div className="wizard-key-value"><strong>🏗️ Obra:</strong> {obra_nombre || `ID #${obra_id}`}</div>
        <div className="wizard-key-value"><strong>🏭 Filial:</strong> {filial_nombre || `ID #${filial_id}`}</div>
      </div>

      <div className="wizard-section">
        <h4>⚙️ Cotización</h4>
        <div className="wizard-key-value"><strong>⚙️ Uso:</strong> {uso_nombre || `ID #${uso_id}`}</div>
        <div className="wizard-key-value"><strong>📦 Tipo de cotización:</strong> {tipo_cotizacion}</div>
        {descuento !== 0 && (
          <div className="wizard-key-value"><strong>Descuento:</strong> {descuento}%</div>
        )}
        {requiereAprobacion && (
          <div className="wizard-key-value" style={{ color: "#e74c3c" }}>
            ⚠️ Esta cotización requiere aprobación de Gerencia por el descuento aplicado.
          </div>
        )}
      </div>

      {/* SERVICIOS ADICIONALES */}
      {(tiene_pernos_disponibles || tiene_transporte || tipo_instalacion !== "NINGUNA") && (
        <div className="wizard-section">
          <h4>➕ Servicios adicionales</h4>

          {tiene_pernos_disponibles && (
            <div className="wizard-key-value">
              <strong>🔩 Pernos de expansión:</strong> {tiene_pernos ? "Sí, se incluirán" : "No se incluirán"}
            </div>
          )}

          {tiene_transporte && (
            <div className="wizard-key-value">
            <strong>🚛 Costo Transporte:</strong> S/ {precio_final_transporte}          
            </div>
          )}

          {tipo_instalacion === "COMPLETA" && (
            <div className="wizard-key-value">
              <strong>🛠️ Instalación completa:</strong> S/ {precio_instalacion_completa?.toFixed(2) || "0.00"}
            </div>
          )}

          {tipo_instalacion === "PARCIAL" && (
            <>
              <div className="wizard-key-value">
                <strong>🛠️ Instalación completa (referencia):</strong> S/ {precio_instalacion_completa?.toFixed(2) || "0.00"}
              </div>
              <div className="wizard-key-value">
                <strong>🧰 Instalación parcial:</strong> S/ {precio_instalacion_parcial?.toFixed(2) || "0.00"}
              </div>
              <div className="wizard-key-value" style={{ flexDirection: "column", alignItems: "flex-start" }}>
                <strong>📝 Nota sobre instalación parcial:</strong>
                <p style={{ marginTop: "0.3rem", color: "#555", fontSize: "14px" }}>
                  {nota_instalacion || "No especificada."}
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Total principal */}
      <div className="wizard-total">
        <strong>💰 Total final:</strong> <span> S/ {totalConDescuento}</span>
      </div>

      {/* Total referencial incluyendo servicios */}
      {console.log("Form Data:", formData)}
      {(tiene_instalacion !== false || tiene_transporte != false) && (
        <div className="wizard-total" style={{ marginTop: "1rem", color: "#666", fontSize: "15px" }}>
          <strong>🧾 Total referencial con servicios:</strong>{" "}
          <span style={{ color: "#009688" }}>
            S/ {totalReferencial}
          </span>

          <p style={{ fontSize: "13px", marginTop: "0.4rem", color: "#666" }}>
            <em>
              Este monto incluye el total con transporte e instalación completa como referencia. 
              El precio real a pagar se encuentra en el total final.
            </em>
          </p>
        </div>
      )}

      <div className="mensaje-revision-final">
        Revisa bien todos los datos antes de guardar. Esta será la información registrada en su cotización.
      </div>
    </div>
  );
}