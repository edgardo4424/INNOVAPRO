import { useEffect, useRef } from "react";
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

// Convierte zonas a string para detectar cambios profundos
// Para poder generar nuevos despieces si se cambia cualquier cosa dentro de cada zona
const zonasToString = (zonas) =>
  JSON.stringify(zonas.map(z => ({
    zona: z.zona,
    nota_zona: z.nota_zona,
    atributos_formulario: z.atributos_formulario
  })));

export function useGenerarDespiece(formData, setFormData) {
  const zonasStringRef = useRef("");

  useEffect(() => {
    const { uso_id, zonas, despiece_editado_manualmente, id, duracion_alquiler } = formData;
    const uso_data = formData.uso;
    const cotizacion_data = formData.cotizacion;

    // Generar nuevo despiece desde zonas
    if (!uso_data.id || !uso_data.zonas?.length) return;

    // Si el despiece viene desde OT, no hacer nada
    if (cotizacion_data.id) return; 

    const zonasActual = zonasToString(uso_data.zonas);
    if (zonasStringRef.current === zonasActual && !uso_data.despiece_editado_manualmente) return;

    // Si cambió zonas, actualizamos referencia
    zonasStringRef.current = zonasActual;

    // Si había modificaciones manuales de precios, las descartamos aquí
    if (uso_data.despiece_editado_manualmente) {
      setFormData(prev => ({ 
        ...prev, 
        uso: {
          ...prev.uso,
          despiece_editado_manualmente: false,
        }
      }));
      return; // esperamos al siguiente render para generar
    }

    const cargarDespiece = async () => {
      try {
        const despieceAnterior = formData.uso.despiece;

        const data = await generarDespiece(uso_data.zonas, uso_data.id);

        // Si el uso es colgante, no generar despiece
        if (data.tarifario_alquiler_colgante_soles) {
          setFormData(prev => ({
            ...prev,
            uso: {
              ...prev.uso,
              despiece: [],
              resumenDespiece: {
                total_piezas: 0,
                peso_total_kg: 0,
                peso_total_ton: "0.00",
                precio_subtotal_venta_soles: "0.00",
                precio_subtotal_venta_dolares: "0.00",
                precio_subtotal_alquiler_soles: "0.00",
              },      
              detalles_colgantes: {
                precio_u_alquiler_soles: data.tarifario_alquiler_colgante_soles || 0,
                precio_u_venta_nuevo: data.tarifario_venta_colgante_dolares || 0,
                precio_u_venta_usado: 0,
                longitud_plataformas: 0,
                tipo_soporte: "",
              },      
            },
            cotizacion: {
              ...prev.cotizacion,
              requiereAprobacion: false,
            },
            atributos_opcionales: {
              ...prev.atributos_opcionales,
              pernos: {
                ...prev.pernos,
                tiene_pernos_disponibles: false,
              }
            }
          }));
          return;
        }

        if (!Array.isArray(data?.despiece)) throw new Error ("Respuesta sin despiece válido");

        const despieceOriginal = data.despiece.map(mapearPieza);

        // Replicamos los precios anteriores personalizados si existen
        const despieceFusionado = despieceOriginal.map(p => {
          const previo = despieceAnterior?.find(prev => prev.pieza_id === p.pieza_id);
          if (previo?.precio_diario_manual !== undefined) {
            const diario = parseFloat(previo.precio_diario_manual);
            return {
              ...p,
              precio_diario_manual: diario,
              precio_u_alquiler_soles: parseFloat((diario * duracion_alquiler).toFixed(2)),
              precio_alquiler_soles: parseFloat((diario * duracion_alquiler * p.total).toFixed(2))
            }
          }
          return p;
        })

        const hayPernos = despieceFusionado.some(pieza => pieza.esPerno);

        const resumen = calcularResumen(despieceFusionado)

        const nuevoEstado = {
          ...formData,
          uso: {
            despiece: despieceFusionado,
            resumenDespiece: resumen,
          },
          cotizacion: {
            requiereAprobacion: false,
          },
          atributos_opcionales: {
            pernos: {
              tiene_pernos_disponibles: hayPernos,
            }
          }
        }

        if (uso_data.id === 3 && data.detalles_escaleras) {
          nuevoEstado.uso.detalles_escaleras = {
            precio_tramo: data.detalles_escaleras.precio_por_tramo_alquiler,
            altura_total_general: data.detalles_escaleras.altura_total_general,
            tramos_2m: data.detalles_escaleras.tramos_2m,
            tramos_1m: data.detalles_escaleras.tramos_1m
          }
        }

        if(uso_data.id === 4 && data.detalles_escuadras) { // Si es escuadras con plataforma
          nuevoEstado.uso.detalles_escuadras = data.detalles_escuadras
        }

        setFormData(nuevoEstado);
      } catch (error) {
        console.error("❌ Error generando despiece:", error.message);
      }
    };

    cargarDespiece();

  }, [formData.uso.id, formData.uso.zonas, formData.uso.despiece_editado_manualmente, formData.cotizacion.id, formData.cotizacion.duracion_alquiler]);
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