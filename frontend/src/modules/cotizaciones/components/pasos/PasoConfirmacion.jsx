// INNOVA PRO+ v1.2.0
import { useEffect } from "react";
import { useWizardContext } from "../../hooks/useWizardCotizacion";
import despieceMock from "../../data/despieceMock";
import Loader from "../../../../shared/components/Loader"

const PasoConfirmacion = () => {
  const { formData, setFormData } = useWizardContext();

  useEffect(() => {
    // Simulación de respuesta del backend al enviar atributos
    setFormData((prev) => ({
      ...prev,
      despiece: despieceMock.despiece,
      requiereAprobacion: false,
    }));
  }, []);

  const subtotal = parseFloat(despieceMock.precio_subtotal_venta_soles);
  const descuentoAplicado = (formData.descuento || 0) / 100;
  const totalConDescuento = (subtotal * (1 - descuentoAplicado)).toFixed(2);

  const handleDescuento = (valor) => {
    const num = parseFloat(valor);
    const requiereAprobacion = num > 10;
    setFormData((prev) => ({
      ...prev,
      descuento: num,
      requiereAprobacion,
    }));
  };

  if (!formData.despiece.length) return <Loader texto="Generando despiece..." />;

  return (
    <div className="paso-formulario">
      <h3>Paso 3: Confirmación Final</h3>

      <h4>Resumen del Despiece:</h4>
      <ul>
        {formData.despiece.map((pieza) => (
          <li key={pieza.pieza_id}>
            {pieza.descripcion} - {pieza.total} unidades - S/{" "}
            {pieza.precio_venta_soles}
          </li>
        ))}
      </ul>

      <p><strong>Total sin descuento:</strong> S/ {subtotal}</p>

      <label>Descuento (%):</label>
      <input
        type="number"
        value={formData.descuento || ""}
        onChange={(e) => handleDescuento(e.target.value)}
        placeholder="Ej: 5"
        min="0"
        max="100"
      />

      {formData.requiereAprobacion && (
        <p className="warning-text">
          ⚠️ Este descuento requiere aprobación de Gerencia.
        </p>
      )}

      <p><strong>Total final:</strong> S/ {totalConDescuento}</p>
    </div>
  );
};

export default PasoConfirmacion;