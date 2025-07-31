// Este componente le permite al comercial aplicar un descuento sobre todo el despiece.

export default function BloqueDescuento({ formData, setFormData, errores }) {
  // Calculamos el subtotal dependiendo el tipo de cotización para mostrarle al usuario
  const subtotal = parseFloat(
    formData.cotizacion.tipo === "Alquiler"
      ? formData.uso.resumenDespiece?.precio_subtotal_alquiler_soles
      : formData.uso.resumenDespiece?.precio_subtotal_venta_soles
  ) || 0;

  // Guardamos el total con descuento
  const totalConDescuento = (subtotal * (1 - (formData.cotizacion.descuento || 0) / 100)).toFixed(2);

  // Manejamos el descuento cada vez que cambia el valor
  const handleDescuento = (valor) => {
    let num = parseFloat(valor) || 0;
    if (num < 0 ) num = 0;
    const requiereAprobacion = num > 50;
    setFormData((prev) => ({
      ...prev,
      cotizacion: {
        ...prev.cotizacion,
        descuento: num,
        requiereAprobacion,
      }
    }));
  };

  return (
    <div className="bloque-descuento">
      <label>🎯 Si desea aplicar un descuento, aplique su porcentaje</label>
      <input
        type="number"
        onWheel={(e) => e.target.blur()}
        min="0"
        max="100"
        value={formData.cotizacion.descuento || ""}
        onChange={(e) => handleDescuento(e.target.value)}
        placeholder="Ej: 5%"
      />
    
      <div style={{ fontSize: "13px", marginTop: "1rem", color: "#666" }}>
          {errores?.descuento && <p className="error-text">{errores.descuento}</p>}    
      </div>

      {formData.cotizacion.requiereAprobacion && (
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