import { calcularResumen } from "../../hooks/useDespieceManualOT";

export default function ResumenDespieceManual({ despiece = [], resumen = {} }) {
  if (!Array.isArray(despiece) || despiece.length === 0 || !resumen) {
    return <p>No se pudo generar el despiece correctamente.</p>;
  }

  const formatear = (valor) => {
    const num = parseFloat(valor);
    return isNaN(num) ? "—" : num.toFixed(2);
  };

  const resumenCalculado = calcularResumen(despiece || []);

  return (
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
          {despiece.map((pieza, i) => (
            <tr key={`${pieza.pieza_id || pieza.id}-${i}`}>
              <td style={{ padding: "0.4rem", borderBottom: "1px solid #eee" }}>{i + 1}</td>
              <td style={{ padding: "0.4rem", borderBottom: "1px solid #eee" }}>{pieza.descripcion}</td>
              <td style={{ padding: "0.4rem", textAlign: "center" }}>{pieza.cantidad}</td>
              <td style={{ padding: "0.4rem", textAlign: "right" }}>
                {formatear(
                  pieza.precio_unitario ??
                  pieza.precio_venta_soles ??
                  pieza.precio_u_venta_soles ??
                  pieza.precio_alquiler_soles
                )}
              </td>
              <td style={{ padding: "0.4rem", textAlign: "right" }}>
                {formatear(
                  (pieza.precio_unitario ?? pieza.precio_venta_soles ?? pieza.precio_u_venta_soles ?? pieza.precio_alquiler_soles) * pieza.cantidad
                )}              
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="wizard-section" style={{ marginTop: "2rem" }}>
        <div className="wizard-key-value"><strong>🧱 Total de piezas:</strong> {formatear(resumenCalculado.total_piezas)}</div>
        <div className="wizard-key-value"><strong>⚖️ Peso total (kg):</strong> {formatear(resumenCalculado.peso_total_kg)}</div>
        <div className="wizard-key-value"><strong>🚚 Peso total (ton):</strong> {formatear(resumenCalculado.peso_total_ton)}</div>
        <div className="wizard-key-value"><strong>💰 Subtotal total (S/):</strong> S/ {
          formatear(
            resumenCalculado.precio_subtotal_alquiler_soles
          )
        }</div>
      </div>
    </>
  );
}