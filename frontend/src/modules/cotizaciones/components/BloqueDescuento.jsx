export default function BloqueDescuento({ formData, setFormData, errores }) {
  const subtotal = parseFloat(
    formData.tipo_cotizacion === "Alquiler"
      ? formData.resumenDespiece?.precio_subtotal_alquiler_soles
      : formData.resumenDespiece?.precio_subtotal_venta_soles
  ) || 0;

  const totalConDescuento = (subtotal * (1 - (formData.descuento || 0) / 100)).toFixed(2);

  const handleDescuento = (valor) => {
    const num = parseFloat(valor) || 0;
    const requiereAprobacion = num > 10;
    setFormData((prev) => ({
      ...prev,
      descuento: num,
      requiereAprobacion,
    }));
  };

  return (
    <div className="bloque-descuento">
      <label>🎯 ¿Desea aplicar un descuento?</label>
      <input
        type="number"
        min="0"
        max="100"
        value={formData.descuento || ""}
        onChange={(e) => handleDescuento(e.target.value)}
        placeholder="Ej: 5"
      />
    
      <div style={{ fontSize: "13px", marginTop: "1rem", color: "#666" }}>
          {errores?.descuento && <p className="error-text">{errores.descuento}</p>}    
      </div>

      {formData.requiereAprobacion && (
        <p className="warning-text">
          ⚠️ Recuerde informar a Gerencia sobre este descuento.
        </p>
      )}

      <p className="total-final">
        💰 Total final: <span>S/ {totalConDescuento}</span>
      </p>
    </div>
  );
}