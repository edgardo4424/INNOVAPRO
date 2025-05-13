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

      <p><strong>👤 Contacto seleccionado:</strong> ID #{contacto_id}</p>
      <p><strong>🏢 Cliente:</strong> ID #{cliente_id}</p>
      <p><strong>🏗️ Obra:</strong> ID #{obra_id}</p>
      <p><strong>🏭 Filial (empresa proveedora):</strong> ID #{filial_id}</p>
      <p><strong>⚙️ Uso seleccionado:</strong> ID #{uso_id}</p>
      <p><strong>📦 Tipo de cotización:</strong> {tipo_cotizacion}</p>

      <hr />

      <p><strong>🎯 Descuento aplicado:</strong> {descuento || 0}%</p>
      {requiereAprobacion && (
        <p style={{ color: "#e74c3c" }}>
          ⚠️ Esta cotización requiere aprobación de Gerencia por el descuento aplicado.
        </p>
      )}

      <p><strong>💰 Total final:</strong> S/ {totalConDescuento}</p>

      <p style={{ fontStyle: "italic", marginTop: "1rem" }}>
        Revisa bien todos los datos antes de guardar. Esta será la información enviada al backend para registrar la cotización.
      </p>
    </div>
  );
}