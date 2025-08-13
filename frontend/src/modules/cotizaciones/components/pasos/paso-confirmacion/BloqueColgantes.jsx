import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function BloqueColgantes({ formData, setFormData }) {
  const zonas = formData.zonas || [];
  const detalles = formData.detalles_colgantes || {};
  const cantidad = parseInt(zonas?.[0]?.atributos_formulario?.[0]?.cantidad || "1");
  const [longitudPlataformas, setLongitudPlataformas] = useState();

  const [precioAlquiler, setPrecioAlquiler] = useState(
    detalles.tarifa_soles || detalles.tarifa_dolares || formData.tarifa_colgante || ""
  );

  // Para hacer que el precio inicial del CP0 se muestre en el primer render
  useEffect(() => {
    if (detalles.tarifa_soles) {
      setPrecioAlquiler(detalles.tarifa_soles);
    } else if (detalles.tarifa_dolares) {
      setPrecioAlquiler(detalles.tarifa_dolares);
    }
  }, [detalles]);
  
  // Actualizar formData cada vez que cambia el precio
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      detalles_colgantes: {
        ...prev.detalles_colgantes,
        tarifa_colgante: precioAlquiler,
        longitud_plataformas: longitudPlataformas || 0,
      }
    }));
  }, [precioAlquiler, longitudPlataformas]);

  const totalParcial = (parseFloat(precioAlquiler || 0) * cantidad).toFixed(2);

  return (
    <div className="wizard-section">
      <h3 className="font-semibold text-lg mb-4">🛠️ Detalle de Colgantes</h3>

      {zonas.map((zona, index) => {
        const atributos = zona.atributos_formulario?.[0] || {};
        return (
          <div key={index} className="mb-6 border border-gray-200 p-4 rounded-md bg-gray-50">
            <p className="text-sm mb-2 font-medium text-gray-700">
              <strong>Zona {zona.zona}:</strong> {zona.nota_zona || "—"}
            </p>
            <ul className="text-sm space-y-1 text-gray-700 pl-4 list-disc">
              <li><strong>Tipo de Servicio:</strong> {atributos.tipoServicio || "—"}</li>
              <li><strong>Altura del edificio:</strong> {atributos.alturaEdificio || "—"} m</li>
              <li><strong>Sistema de soporte:</strong> {atributos.sistemaSoporte || "—"}</li>
              <li><strong>Cantidad:</strong> {atributos.cantidad || "—"} unidad(es)</li>
            </ul>
          </div>
        );
      })}

      <div className="mt-4">
        <Label htmlFor="precio_alquiler_cpo" className="block mb-1">
          💰 Precio CPO:
        </Label>
        <Input
          id="precio_alquiler_cpo"
          type="number"
          step="0.01"
          min="0"
          value={precioAlquiler}
          onChange={(e) => setPrecioAlquiler(e.target.value)}
          placeholder="Ingrese precio base de alquiler"
          onWheel={(e) => e.target.blur()}
        />
        <p className="text-sm text-gray-600 mt-2">
          Este precio será confirmado con visita técnica y puede estar sujeto a variación.
        </p>

        <p className="text-sm text-green-700 font-semibold mt-2">
          Total parcial (S/): {totalParcial}
        </p>
      </div>

      <div className="mt-4">
        <Label htmlFor="longitud_plataformas" className="block mb-1">
          📏 Longitud Total Plataformas:
        </Label>
        <Input
          id="longitud_plataformas"
          type="number"
          step="0.01"
          min="0"
          value={longitudPlataformas}
          onChange={(e) => setLongitudPlataformas(e.target.value)}
          placeholder="Ingrese precio base de alquiler"
          onWheel={(e) => e.target.blur()}
        />
        <p className="text-sm text-gray-600 mt-2">
          Esta longitud se utilizará para calcular el total de plataformas necesarias.
        </p>
      </div>
    </div>
  );
}