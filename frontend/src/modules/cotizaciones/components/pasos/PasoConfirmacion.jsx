// INNOVA PRO+ v1.3.1
import { useEffect } from "react";
import { useWizardContext } from "../../hooks/useWizardCotizacion";
import { generarDespiece } from "../../services/cotizacionesService";
import Loader from "../../../../shared/components/Loader";

export default function PasoConfirmacion() {
  const { formData, setFormData } = useWizardContext();
  console.log("📦 Datos del formulario:", formData);
  useEffect(() => {
    const cargarDespiece = async () => {
      try {
        const data = await generarDespiece(formData.atributos, formData.uso_id);
        console.log("📦 Respuesta despiece:", data);

        if (!data?.despiece || !Array.isArray(data.despiece)) {
          throw new Error("La respuesta del backend no contiene un despiece válido");
        }

        setFormData((prev) => ({
          ...prev,
          despiece: data.despiece,
          resumenDespiece: {
            total_piezas: data.total_piezas,
            peso_total_kg: data.peso_total_kg,
            peso_total_ton: data.peso_total_ton,
            precio_subtotal_venta_dolares: data.precio_subtotal_venta_dolares,
            precio_subtotal_venta_soles: data.precio_subtotal_venta_soles,
            precio_subtotal_alquiler_soles: data.precio_subtotal_alquiler_soles
          },
          requiereAprobacion: false,
        }));
      } catch (error) {
        console.error("Error generando despiece:", error.message);
      }
    };

    cargarDespiece();
  }, []);

  const resumen = formData.resumenDespiece;
  const tipo = formData.tipo_cotizacion;

  if (!formData.despiece.length || !resumen) return <Loader texto="Generando despiece..." />;

  const subtotal = parseFloat(
    tipo === "Alquiler"
      ? resumen.precio_subtotal_alquiler_soles
      : resumen.precio_subtotal_venta_soles
  );

  const descuento = formData.descuento || 0;
  const totalConDescuento = (subtotal * (1 - descuento / 100)).toFixed(2);

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
    <div className="paso-formulario">
      <h3>Paso 5: Confirmación Final</h3>

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
          {formData.despiece.map((pieza, i) => {
            const precioUnitario =
              tipo === "Alquiler" ? pieza.precio_u_alquiler_soles : pieza.precio_u_venta_soles;
            const precioTotal =
              tipo === "Alquiler" ? pieza.precio_alquiler_soles : pieza.precio_venta_soles;
            return (
              <tr key={pieza.pieza_id}>
                <td style={{ padding: "0.4rem", borderBottom: "1px solid #eee" }}>{i + 1}</td>
                <td style={{ padding: "0.4rem", borderBottom: "1px solid #eee" }}>{pieza.descripcion}</td>
                <td style={{ padding: "0.4rem", textAlign: "center" }}>{pieza.total}</td>
                <td style={{ padding: "0.4rem", textAlign: "right" }}>{precioUnitario}</td>
                <td style={{ padding: "0.4rem", textAlign: "right" }}>{precioTotal}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="wizard-section" style={{ marginTop: "2rem" }}>
        <div className="wizard-key-value"><strong>🧱 Total de piezas:</strong> {resumen.total_piezas}</div>
        <div className="wizard-key-value"><strong>⚖️ Peso total (kg):</strong> {resumen.peso_total_kg}</div>
        <div className="wizard-key-value"><strong>🚚 Peso total (ton):</strong> {resumen.peso_total_ton}</div>
        {/* <div className="wizard-key-value"><strong>💵 Subtotal venta (USD):</strong> ${resumen.precio_subtotal_venta_dolares}</div> */}
        <div className="wizard-key-value"><strong>💰 Subtotal venta (S/):</strong> S/ {resumen.precio_subtotal_venta_soles}</div>
        <div className="wizard-key-value"><strong>🛠️ Subtotal alquiler (S/):</strong> S/ {resumen.precio_subtotal_alquiler_soles}</div>
      </div>


      <div className="bloque-descuento">
        <label>🎯 Descuento (%):</label>
        <input
          type="text"
          value={formData.descuento || ""}
          onChange={(e) => handleDescuento(e.target.value)}
          placeholder="Ej: 5"
          min="0"
          max="100"
        />
        {formData.requiereAprobacion && (
          <p className="warning-text">
            ⚠️ Recuerde informar a Gerencia sobre éste descuento.
          </p>
        )}

        <p className="total-final">
          💰 Total final:
          <span>S/ {totalConDescuento}</span>
        </p>
      </div>
    </div>
  );
}