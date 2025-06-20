import { useEffect } from "react";
import { generarDespiece } from "../services/cotizacionesService";

export function useGenerarDespiece(formData, setFormData) {
  useEffect(() => {
    const cargarDespiece = async () => {
      if (!formData.uso_id || !formData.zonas || formData.zonas.length === 0) return;

      try {
        const data = await generarDespiece(formData.zonas, formData.uso_id);

        if (!data?.despiece || !Array.isArray(data.despiece)) {
          throw new Error("La respuesta del backend no contiene un despiece válido");
        }

        const hayPernos = data.despiece.some(p => {
          const desc = p.descripcion?.toUpperCase() || "";
          return (
            desc.includes("PERNO DE EXPANSIÓN") ||
            desc.includes("PERNOS DE EXPANSION") ||
            desc.includes("M12 X 80") ||
            desc.includes("M16 X 145")
          );
        });

        const despieceFiltrado = data.despiece.map((pieza) => {
          const descripcion = pieza.descripcion?.toUpperCase() || "";
          const esPerno = descripcion.includes("PERNO DE EXPANSIÓN") ||
            descripcion.includes("PERNOS DE EXPANSION") ||
            descripcion.includes("M12 X 80") ||
            descripcion.includes("M16 X 145");

          return {
            ...pieza,
            esPerno,
            precio_u_venta_soles: esPerno ? 15 : pieza.precio_u_venta_soles,
            precio_venta_soles: esPerno ? (pieza.total * 15) : pieza.precio_venta_soles,
          };
        });

        setFormData((prev) => ({
          ...prev,
          despiece: despieceFiltrado,
          resumenDespiece: {
            total_piezas: data.total_piezas,
            peso_total_kg: data.peso_total_kg,
            peso_total_ton: data.peso_total_ton,
            precio_subtotal_venta_dolares: data.precio_subtotal_venta_dolares,
            precio_subtotal_venta_soles: data.precio_subtotal_venta_soles,
            precio_subtotal_alquiler_soles: data.precio_subtotal_alquiler_soles
          },
          requiereAprobacion: false,
          tiene_pernos_disponibles: hayPernos,          
        }));
      } catch (error) {
        console.error("❌ Error generando despiece:", error.message);
      }
    };

    cargarDespiece();
  }, [formData.uso_id, formData.zonas]);
}