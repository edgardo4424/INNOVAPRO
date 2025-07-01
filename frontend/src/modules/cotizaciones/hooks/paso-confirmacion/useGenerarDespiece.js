import { useEffect } from "react";
import { generarDespiece } from "../../services/cotizacionesService";

// Este hook es la función para generar despiece a partir de las "zonas" generadas en el PasoAtributos del Wizard
// Llama la API pasando el 'uso_id' y 'zonas' para recibir una lista de piezas con sus cantidades y detalles (despiece)
// Si hay Pernos (consumibles) los filtra para dar la opción al comercial de incluirlos o excluirlos de la cotización.


// Detecta si una pieza es un perno según su descripción
export const esPernoExpansion = (descripcion = "") => {
  const desc = descripcion.toUpperCase();
  return (
    desc.includes("PERNO DE EXPANSIÓN") ||
    desc.includes("PERNOS DE EXPANSION") ||
    desc.includes("M12 X 80") ||
    desc.includes("M16 X 145")
  );
};

// Formatea una pieza según si es perno o no
export const mapearPieza = (pieza) => {
  const descripcion = pieza.descripcion?.toUpperCase() || "";
  const esPerno = esPernoExpansion(descripcion);

  return {
    ...pieza,
    esPerno,
    precio_u_venta_soles: esPerno ? 15 : pieza.precio_u_venta_soles,
    precio_venta_soles: esPerno ? (pieza.total * 15) : pieza.precio_venta_soles,
  };
};

export function useGenerarDespiece(formData, setFormData) {
  useEffect(() => {
    const cargarDespiece = async () => {
      const {uso_id, zonas, despiece, resumenDespiece } = formData;

      // Si ya hay un despiece registrado (DESPIECE DE OFICINA TÉCNICA), que no haga nada
      // Si hay despiece pero no un resumen, solo calcula el resumen
      if (Array.isArray(despiece) && despiece.length > 0) {
        const resumenCalculado = calcularResumen(despiece);

        // Si el resumen está incompleto, puede que falte el total de piezas lo forzamos
        if (
          !resumenDespiece ||
          !resumenDespiece.total_piezas ||
          !resumenDespiece.peso_total_kg
        ) {
          setFormData((prev) => ({
            ...prev,
            resumenDespiece: resumenCalculado,
          }))
        }
        return;
      } 

      // Si ya tenemos despiece y resumen, no hacemos nada más
      if (Array.isArray(despiece) && despiece.length > 0 && resumenDespiece) return;

      // Generar nuevo despiece desde zonas
      if (!uso_id || !zonas?.length) return;

      try {
        const data = await generarDespiece(zonas, uso_id);
        if (!Array.isArray(data?.despiece)) throw new Error ("Respuesta sin despiece válido");

        const despieceFormateado = data.despiece.map(mapearPieza);
        const hayPernos = despieceFormateado.some(p => p.esPerno);

        setFormData((prev) => ({
          ...prev,
          despiece: despieceFormateado,
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

    if (formData && (formData.despiece || formData.zonas)){
      cargarDespiece();

    }
  }, [formData.despiece, formData.uso_id, formData.zonas]);
}

function calcularResumen(despiece) {
  let peso_total_kg = 0;
  let total_piezas = 0;
  let precio_subtotal_venta_soles = 0;
  let precio_subtotal_venta_dolares = 0;
  let precio_subtotal_alquiler_soles = 0;

  for (const pieza of despiece) {
    total_piezas += parseFloat(pieza.total || pieza.cantidad || 0);
    peso_total_kg += parseFloat(pieza.peso_kg || 0);
    precio_subtotal_venta_soles += parseFloat(pieza.precio_venta_soles || 0);
    precio_subtotal_venta_dolares += parseFloat(pieza.precio_venta_dolares || 0);
    precio_subtotal_alquiler_soles += parseFloat(pieza.precio_alquiler_soles || 0);
  }

  return {
    total_piezas,
    peso_total_kg,
    peso_total_ton: (peso_total_kg / 1000).toFixed(2),
    precio_subtotal_venta_soles: precio_subtotal_venta_soles.toFixed(2),
    precio_subtotal_venta_dolares: precio_subtotal_venta_dolares.toFixed(2),
    precio_subtotal_alquiler_soles: precio_subtotal_alquiler_soles.toFixed(2),
  };
}