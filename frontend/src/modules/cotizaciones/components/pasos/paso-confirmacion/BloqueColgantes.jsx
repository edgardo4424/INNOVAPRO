import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Este es el componente dedicado a los andamios colgantes.
// Primero, presenta una ficha informativa con los datos técnicos: tipo de servicio, altura del edificio, sistema de soporte y cantidad.
// Luego, guía al usuario para que defina: Cuánto cuesta cada colgante. Cuántos metros de plataformas se instalarán. Y qué tipo de soporte se empleará en obra.
// A medida que se escriben estos valores, el sistema calcula el subtotal parcial (precio × cantidad) y lo actualiza en pantalla, para dar feedback en tiempo real.

export default function BloqueColgantes({ formData, setFormData }) {
  
  // Como solo vamos a definir una zona con unos solos atributos, los almacenamos:
  const zonas = formData.uso.zonas || [];
  const atributos = zonas?.[0]?.atributos_formulario?.[0] || {};
  
  // Almacenamos los detalles que defina el comercial
  const detalles = formData.uso.detalles_colgantes || {};

  // Guardamos la cantidad de colgantes
  const cantidad = parseInt(atributos.cantidad || detalles.cantidad_colgantes || 1);
  
  const [precioUnitario, setPrecioUnitario] = useState("");
  const [longitud, setLongitud] = useState("");
  const sistemaSoporte = atributos.sistemaSoporte || ""


  // Cargamos valores iniciales que vienen del backend, cuando estén disponibles (y solo una vez)
  useEffect(() => {
    if (detalles && detalles.precio_u_alquiler_soles && precioUnitario === "") {
      setPrecioUnitario(detalles.precio_u_alquiler_soles);
    }
    if (detalles && detalles.longitud_plataformas && longitud === "") {
      setLongitud(detalles.longitud_plataformas);
    }
  }, [detalles]);

  // Calcular cuanto costarían los colgantes con el precio ingresado
  const totalParcial = (parseFloat(precioUnitario || 0) * cantidad).toFixed(2);

  // Cada vez que el comercial cambia algo, actualizamos el formData
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      uso: {
        ...prev.uso,
        detalles_colgantes: {
        ...prev.uso.detalles_colgantes,
        cantidad_colgantes: cantidad,
        precio_u_alquiler_soles: parseFloat(precioUnitario || 0),
        longitud_plataformas: parseFloat(longitud || 0),
        tipo_soporte: sistemaSoporte,
        tarifa_colgante: parseFloat(precioUnitario || 0),
      },
      }
    }));
  }, [precioUnitario, longitud, cantidad]);

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
      </div>
    </div>
  );
}