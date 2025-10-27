import { useWizardContext } from "../../context/WizardCotizacionContext";

// Este componente representa el último paso del Wizard
// Su función es mostrar un resumen organizado y limpio de todo los datos relevantes seleccionados durante 
// el proceso de cotización. Todo ésto para confirmar antes de guardar la cotización.

export default function PasoFinal() {
  const { formData } = useWizardContext();

  const {
    entidad,
    uso,
    cotizacion,
    atributos_opcionales
  } = formData;

  // Cálculo del total base
  const calcularTotalBase = () => {
    if (cotizacion.tipo === "Alquiler") {
      if (uso.id === 3 && uso.detalles_escaleras) {
        const { precio_tramo, tramos_2m, tramos_1m } = uso.detalles_escaleras;
        const tramos = (tramos_2m || 0) + (tramos_1m || 0);
        return parseFloat((precio_tramo * tramos).toFixed(2));
      }
      return parseFloat(uso.resumenDespiece?.precio_subtotal_alquiler_soles || 0);
    } else {
      return parseFloat(uso.resumenDespiece?.precio_subtotal_venta_soles || 0);
    }
  };

  const total = calcularTotalBase();


  // Aplicación de descuento en caso tenga
  const totalConDescuento = (total * (1 - (cotizacion.descuento || 0) / 100)).toFixed(2);

  // Precio final de transporte
  const precio_final_transporte = 
    Number(atributos_opcionales.transporte.costo_tarifas_transporte || 0) + 
    Number(atributos_opcionales.transporte.costo_distrito_transporte || 0)+ 
    Number(atributos_opcionales.transporte.costo_pernocte_transporte || 0);

  // Cálculo del total con servicios incluidos
  const totalReferencial = (
    parseFloat(totalConDescuento) +
    (atributos_opcionales.transporte.tiene_transporte ? precio_final_transporte : 0) +
    (atributos_opcionales.instalacion?.tipo_instalacion === "COMPLETA" || atributos_opcionales.instalacion?.tipo_instalacion === "PARCIAL"
      ? (atributos_opcionales.instalacion.precio_instalacion_completa || 0)
      : 0)
  ).toFixed(2);
             

  return (
    <div className="paso-formulario">
      <h3>Paso 6: Revisión y Confirmación</h3>

      <div className="wizard-section">
        <h4>🧑 Información General</h4>
        <div className="wizard-key-value"><strong>👤 Contacto:</strong> {entidad.contacto.nombre || `ID #${entidad.contacto.id}`}</div>
        <div className="wizard-key-value"><strong>🏢 Cliente:</strong> {entidad.cliente.razon_social || `ID #${entidad.cliente.id}`}</div>
        <div className="wizard-key-value"><strong>🏗️ Obra:</strong> {entidad.obra.nombre || `ID #${entidad.obra.id}`}</div>
        <div className="wizard-key-value"><strong>🏭 Filial:</strong> {entidad.filial.razon_social || `ID #${entidad.filial.id}`}</div>
      </div>

      <div className="wizard-section">
        <h4>⚙️ Cotización</h4>
        <div className="wizard-key-value"><strong>⚙️ Uso:</strong> {uso.nombre || `ID #${uso.id}`}</div>
        <div className="wizard-key-value"><strong>📦 Tipo de cotización:</strong> {cotizacion.tipo}</div>
        {!cotizacion.descuento || cotizacion.descuento !== 0 && (
          <div className="wizard-key-value"><strong>Descuento:</strong> {formData.cotizacion.descuento}%</div>
        )}
        {cotizacion.requiereAprobacion && (
          <div className="wizard-key-value" style={{ color: "#e74c3c" }}>
            ⚠️ Esta cotización requiere aprobación de Gerencia por el descuento aplicado.
          </div>
        )}
      </div>

      {/* SERVICIOS ADICIONALES */}
      {(
        atributos_opcionales.pernos.tiene_pernos_disponibles !== false || 
        atributos_opcionales.transporte?.tiene_transporte !== false || 
        atributos_opcionales.instalacion?.tipo_instalacion !== "NINGUNA" && 
        atributos_opcionales.instalacion?.tipo_instalacion !== "") && 
        uso.id !== 8 && (
          <div className="wizard-section">
            <h4>➕ Servicios adicionales</h4>

            {atributos_opcionales.pernos.tiene_pernos_disponibles && (
              <div className="wizard-key-value">
                <strong>🔩 Pernos de expansión:</strong> {atributos_opcionales.pernos.tiene_pernos ? "Sí, se incluirán" : "No se incluirán"}
              </div>
            )}

            {atributos_opcionales.transporte.tiene_transporte && (
              <div className="wizard-key-value">
              <strong>🚛 Costo Transporte:</strong> S/ {precio_final_transporte}          
              </div>
            )}

            {atributos_opcionales.instalacion?.tipo_instalacion === "COMPLETA" && (
              <div className="wizard-key-value">
                <strong>🛠️ Instalación completa:</strong> S/ {atributos_opcionales.instalacion.precio_instalacion_completa?.toFixed(2) || "0.00"}
              </div>
            )}

            {atributos_opcionales.instalacion?.tipo_instalacion === "PARCIAL" && (
              <>
                <div className="wizard-key-value">
                  <strong>🛠️ Instalación completa (referencia):</strong> S/ {atributos_opcionales.instalacion.precio_instalacion_completa?.toFixed(2) || "0.00"}
                </div>
                <div className="wizard-key-value">
                  <strong>🧰 Instalación parcial:</strong> S/ {atributos_opcionales.instalacion.precio_instalacion_parcial?.toFixed(2) || "0.00"}
                </div>
                <div className="wizard-key-value" style={{ flexDirection: "column", alignItems: "flex-start" }}>
                  <strong>📝 Nota sobre instalación parcial:</strong>
                  <p style={{ marginTop: "0.3rem", color: "#555", fontSize: "14px" }}>
                    {atributos_opcionales.instalacion.nota_instalacion || "No especificada."}
                  </p>
                </div>
              </>
            )}
          </div>
      )}

      {/* Total principal */}
      <div className="wizard-total">
        {formData.uso.id === 8 ? (
          <>
            <strong>💰 Total por colgante:</strong> <span> S/ {uso.detalles_colgantes.tarifa_colgante}</span>
          </>
        ) : (
          <>
            <strong>💰 Total final:</strong> <span> S/ {totalConDescuento}</span>
          </>
        )}
      </div>

      {/* Total referencial incluyendo servicios */}
      {(
        atributos_opcionales.instalacion?.tiene_instalacion || 
        atributos_opcionales.transporte.tiene_transporte != false) &&
        uso.id !== 8 && (
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
  )
}