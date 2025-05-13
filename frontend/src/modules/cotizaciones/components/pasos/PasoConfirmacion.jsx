// INNOVA PRO+ v1.3.1
import { useEffect } from "react";
import { useWizardContext } from "../../hooks/useWizardCotizacion";
import { generarDespiece } from "../../services/cotizacionesService";
import Loader from "../../../../shared/components/Loader";

export default function PasoConfirmacion() {
  const { formData, setFormData } = useWizardContext();

  useEffect(() => {
    const cargarDespiece = async () => {
      try {
        const data = await generarDespiece(formData.atributos);
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

      <h4 style={{ color: "#e67e22", marginBottom: "1rem" }}>Resumen del Despiece:</h4>
      <ul style={{ color: "#e67e22", fontSize: "0.95rem", lineHeight: "1.4" }}>
        {formData.despiece.map((pieza) => (
          <li key={pieza.pieza_id}>
            <strong>{pieza.descripcion}</strong> - {pieza.total} unidades - S/{" "}
            {tipo === "Alquiler" ? pieza.precio_alquiler_soles : pieza.precio_venta_soles}
          </li>
        ))}
      </ul>

      <hr />

      <div style={{ marginTop: "1rem" }}>
        <p><strong>🧱 Total de piezas:</strong> {resumen.total_piezas}</p>
        <p><strong>⚖️ Peso total (kg):</strong> {resumen.peso_total_kg}</p>
        <p><strong>🚚 Peso total (ton):</strong> {resumen.peso_total_ton}</p>
        <p><strong>💵 Subtotal venta (USD):</strong> ${resumen.precio_subtotal_venta_dolares}</p>
        <p><strong>💰 Subtotal venta (S/):</strong> S/ {resumen.precio_subtotal_venta_soles}</p>
        <p><strong>🛠️ Subtotal alquiler (S/):</strong> S/ {resumen.precio_subtotal_alquiler_soles}</p>
      </div>

      <div style={{ marginTop: "1.5rem" }}>
        <label><strong>🎯 Descuento (%):</strong></label>
        <input
          type="number"
          value={formData.descuento || ""}
          onChange={(e) => handleDescuento(e.target.value)}
          placeholder="Ej: 5"
          min="0"
          max="100"
        />
        {formData.requiereAprobacion && (
          <p className="warning-text" style={{ color: "#e74c3c", marginTop: "0.5rem" }}>
            ⚠️ Este descuento requiere aprobación de Gerencia.
          </p>
        )}

        <p style={{ marginTop: "1rem" }}>
          <strong>Total final:</strong> S/{" "}
          <span style={{ fontSize: "1.2rem" }}>{totalConDescuento}</span>
        </p>
      </div>
    </div>
  );
}