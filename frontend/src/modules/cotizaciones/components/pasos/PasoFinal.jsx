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
      
      <div className="wizard-total">
        <strong>💰 Total final:</strong> <span> S/ {totalConDescuento}</span>
      </div>

      <div className="mensaje-revision-final">
        Revisa bien todos los datos antes de guardar. Esta será la información registrada en su cotización.
      </div>
    </div>
  );
}