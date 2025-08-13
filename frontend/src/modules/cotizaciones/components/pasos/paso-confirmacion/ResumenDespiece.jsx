// Éste componente muestra una tabla detallada del despiece generado, incluyendo descripción,
// cantidad y precios según el tipo de cotización (alquiler o venta). Además, presenta un resumen visual claro
// con totales de piezas, peso y subtotales monetarios. El objetivo es que el comercial pueda visualizar
// claramente el despiece de lo que está cotizando.

export default function ResumenDespiece({ formData }) {

  if (!formData) return <p>No se pudo cargar la información del despiece.</p>;

  const { 
    cotizacion,
    uso,
  } = formData;

  const resumen = uso.resumenDespiece;
  const dias = cotizacion.duracion_alquiler || 30;

  if (!Array.isArray(uso.despiece) || uso.despiece.length === 0 || !resumen) {
    return <p>No se pudo generar el despiece correctamente.</p>;
  }

  const formatear = (valor) => {
    const num = parseFloat(valor);
    return isNaN(num) ? "—" : num.toFixed(2);
  };
  

  return (
    <>
    {/* Solo en caso de que sea escalera de acceso en alquiler con CP0 no mostraremos el resumen del despiece */}
    {(uso.id !== 3 || cotizacion.tipo === "Venta" || cotizacion.id) && (
      <>
      <h4 style={{ color: "#004aad", marginBottom: "1rem" }}>Resumen del Despiece:</h4>

            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead>
                <tr style={{ background: "#f3f6f9", color: "#333" }}>
                  <th style={{ padding: "0.5rem", borderBottom: "1px solid #ccc" }}>#</th>
                  <th style={{ padding: "0.5rem", borderBottom: "1px solid #ccc" }}>Descripción</th>
                  <th style={{ padding: "0.5rem", borderBottom: "1px solid #ccc" }}>Cantidad</th>
                  <th style={{ padding: "0.5rem", borderBottom: "1px solid #ccc" }}>Precio Unitario (S/)</th>
                  <th style={{ padding: "0.5rem", borderBottom: "1px solid #ccc" }}>Subtotal (S/)</th>
                </tr>
              </thead>
              <tbody>
                {uso.despiece
                  .filter(pieza => pieza.incluido !== false)
                  .map((pieza, i) => {
                    let precioUnitario = 0;
                    let precioTotal = 0;

                    if (cotizacion.tipo === "Alquiler") {
                      const precioDiario = 
                          pieza.precio_diario_manual !== undefined
                            ? parseFloat(pieza.precio_diario_manual)
                            : parseFloat(pieza.precio_u_alquiler_soles) / 30;

                        precioUnitario = (precioDiario * dias).toFixed(2);
                        precioTotal = (precioDiario * dias * parseFloat(pieza.total)).toFixed(2);
                      } else { // Venta
                        precioUnitario = parseFloat(pieza.precio_u_venta_soles).toFixed(2);
                        precioTotal = parseFloat(pieza.precio_venta_soles).toFixed(2);
                    }

                    return (
                      <tr key={`${pieza.pieza_id || pieza.id}-${i}`}>
                        <td style={{ padding: "0.4rem", borderBottom: "1px solid #eee" }}>{i + 1}</td>
                        <td style={{ padding: "0.4rem", borderBottom: "1px solid #eee" }}>{pieza.descripcion}</td>
                        <td style={{ padding: "0.4rem", textAlign: "center" }}>{pieza.total}</td>
                        <td style={{ padding: "0.4rem", textAlign: "right" }}>{formatear(precioUnitario)}</td>
                        <td style={{ padding: "0.4rem", textAlign: "right" }}>{formatear(precioTotal)}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
      </>
    )}

      <div className="wizard-section" style={{ marginTop: "2rem" }}>
        {/* Solo en caso de que sea escalera de acceso en alquiler con CP0 no mostraremos todos los detalles del despiece */}
        {(uso.id !== 3 || cotizacion.tipo === "Venta" || cotizacion.id) && (
          <>
            <div className="wizard-key-value">
              <strong>🧱 Total de piezas:</strong>{" "}
              {formatear(
                resumen.total_piezas !== undefined
                  ? resumen.total_piezas
                  : despiece.reduce((acc, pieza) => acc + (pieza.incluido === false ? 0 : parseFloat(pieza.total || 0)), 0)
              )}
            </div>
            <div className="wizard-key-value"><strong>⚖️ Peso total (kg):</strong> {formatear(resumen.peso_total_kg)}</div>
            <div className="wizard-key-value"><strong>🚚 Peso total (ton):</strong> {formatear(resumen.peso_total_ton)}</div>
            <div className="wizard-key-value"><strong>💰 Subtotal venta (S/):</strong> S/ {formatear(resumen.precio_subtotal_venta_soles)}</div>
          </>
        )}
        {/* Solo en caso de que sea escalera de acceso el subtotal se calculará en base a los tramos por el precio por tramo */}
        {uso.id === 3 && uso.detalles_escaleras?.precio_tramo ? (
          <div className="wizard-key-value">
            <strong>🛠️ Subtotal alquiler (S/):</strong> S/{" "}
            {formatear((uso.detalles_escaleras.precio_tramo || 0) * ((uso.detalles_escaleras.tramos_1m || 0) + (uso.detalles_escaleras.tramos_2m || 0)))}
          </div>
        ) : (
          <div className="wizard-key-value">
            <strong>🛠️ Subtotal alquiler (S/):</strong> S/ {formatear(resumen.precio_subtotal_alquiler_soles)}
          </div>
        )}
      </div>
    </>
  );
}