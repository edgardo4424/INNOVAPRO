import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function BloqueColgantes({ formData, setFormData }) {
  const zonas = formData.zonas || [];
  const atributos = zonas?.[0]?.atributos_formulario?.[0] || {};
  const detalles = formData.detalles_colgantes || {};
  const cantidad = parseInt(atributos.cantidad || detalles.cantidad_colgantes || 1);
  
  const [precioUnitario, setPrecioUnitario] = useState("");
  const [longitud, setLongitud] = useState("");
  const [sistemaSoporte, setSistemaSoporte] = useState(
    detalles.tipo_soporte || atributos.sistemaSoporte || ""
  );


  // Cargar valores iniciales cuando estén disponibles (y solo una vez)
  useEffect(() => {
    if (detalles && detalles.precio_u_alquiler_soles && precioUnitario === "") {
      setPrecioUnitario(detalles.precio_u_alquiler_soles);
    }
    if (detalles && detalles.longitud_plataformas && longitud === "") {
      setLongitud(detalles.longitud_plataformas);
    }
    if (detalles && detalles.tipo_soporte && sistemaSoporte === "") {
      setSistemaSoporte(atributos.sistemaSoporte);
    }
  }, [detalles]);

  // Calcular total parcial
  const totalParcial = (parseFloat(precioUnitario || 0) * cantidad).toFixed(2);

  // Actualizar formData en el padre
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      detalles_colgantes: {
        ...prev.detalles_colgantes,
        cantidad_colgantes: cantidad,
        precio_u_alquiler_soles: parseFloat(precioUnitario || 0),
        longitud_plataformas: parseFloat(longitud || 0),
        tipo_soporte: sistemaSoporte,
        tarifa_colgante: parseFloat(precioUnitario || 0),
      }
    }));
  }, [precioUnitario, longitud, sistemaSoporte, cantidad]);

  return (
    <div className="wizard-section">
      <h3 className="font-semibold text-lg mb-4">🛠️ Detalle de Colgantes</h3>

      <div className="mb-6 border border-gray-200 p-4 rounded-md bg-gray-50">
        <ul className="text-sm space-y-1 text-gray-700 pl-4 list-disc">
          <li><strong>Tipo de Servicio:</strong> {atributos.tipoServicio || "—"}</li>
          <li><strong>Altura del Edificio:</strong> {atributos.alturaEdificio || "—"} m</li>
          <li><strong>Sistema de Soporte:</strong> {atributos.sistemaSoporte || sistemaSoporte || "—"}</li>
          <li><strong>Cantidad de colgantes:</strong> {cantidad}</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="precio_unitario">💰 Precio Unitario CPO</Label>
          <Input
            id="precio_unitario"
            type="number"
            step="0.01"
            value={precioUnitario}
            onChange={(e) => setPrecioUnitario(e.target.value)}
            placeholder="Ej: 2500"
            onWheel={(e) => e.target.blur()}
          />
          <p className="text-sm text-muted-foreground mt-1">
            Este precio será confirmado con visita técnica.
          </p>
          <p className="text-sm font-semibold text-green-700 mt-2">
            Total parcial: S/ {totalParcial}
          </p>
        </div>

        <div>
          <Label htmlFor="longitud">📏 Longitud Total Plataformas</Label>
          <Input
            id="longitud"
            type="number"
            step="0.1"
            value={longitud}
            onChange={(e) => setLongitud(e.target.value)}
            placeholder="Ej: 7.5"
            onWheel={(e) => e.target.blur()}
          />
          <p className="text-sm text-muted-foreground mt-1">
            Este valor será considerado para el cálculo técnico.
          </p>
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="tipo_soporte">🧱 Tipo de Soporte</Label>
          <Input
            id="tipo_soporte"
            type="text"
            value={sistemaSoporte}
            onChange={(e) => setSistemaSoporte(e.target.value)}
            placeholder="Ej: Convencional, Especial"
          />
        </div>
      </div>
    </div>
  );
}