import { useEffect, useRef } from "react";
import { generarDespiece } from "../../services/cotizacionesService";

// Este hook es la función para generar despiece a partir de las "zonas" generadas en el PasoAtributos del Wizard
// Llama la API pasando el id del uso y 'zonas' para recibir una lista de piezas con sus cantidades y detalles (despiece)
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

// Formatea una pieza según si es perno o no para poder jugar con ella
export const mapearPieza = (pieza) => {
  const descripcion = pieza.descripcion?.toUpperCase() || "";
  const esPerno = esPernoExpansion(descripcion); // TRUE O FALSE

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


// Función para calcular el resumen pasándole el despiece resultante después de todas las modificaciones
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

// Función principal que genera la lista de piezas con toda la data importante
// recibe el formData y el setter como parámetros
export function useGenerarDespiece(formData, setFormData) {
  const zonasStringRef = useRef(""); // Joyita para almacenar la referencia de la zona transformadas en String

  useEffect(() => {
    const { uso, cotizacion } = formData;

    // Validamos que venga el uso y la zona definida
    // O no generamos ningún despiece
    if (!uso.id || !uso.zonas?.length) return;

    // Si el despiece viene desde OT, no generamos uno nuevo
    if (cotizacion.id) return; 

    // Almacenamos la zona definida por el usuario transformada en STRING
    const zonasActual = zonasToString(uso.zonas);

    // Si la zona no ha cambiado y el despiece no ha sido editado manualmente
    // no generamos uno nuevo
    if (zonasStringRef.current === zonasActual && !uso.despiece_editado_manualmente) return;

    // Si por alguna razón, se cambian las zonas que ya fueron definidas, actualizamos referencia 
    zonasStringRef.current = zonasActual;

    // Si había modificaciones manuales de precios, las descartamos aquí
    if (uso.despiece_editado_manualmente) {
      setFormData(prev => ({ 
        ...prev, 
        uso: {
          ...prev.uso,
          despiece_editado_manualmente: false,
        }
      }));
      return; // esperamos al siguiente render para generar
    }

    // GENERAMOS EL DESPIECE DESDE EL BACKEND
    const cargarDespiece = async () => {
      try {
        
        const despieceAnterior = uso.despiece;

        const data = await generarDespiece(uso.zonas, uso.id);

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

        // Guardamos el despiece original con las piezas formateadas si es perno o no
        const despieceOriginal = data.despiece.map(mapearPieza);

        // Replicamos los precios anteriores personalizados si existen
        const despieceFusionado = despieceOriginal.map(p => {
          // Si hay un despiece guardado previamente comparamos sus piezas iguales
          // Si una de ellas ha sido modificado manualmente, guardamos ese precio en esa pieza
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

        const hayPernos = despieceFusionado.some(pieza => pieza.esPerno); // TRUE en caso haya pernos en el despiece fusionado

        const resumen = calcularResumen(despieceFusionado)

        // Estructuramos el nuevo estado del formData con los valores resultantes
        const nuevoEstado = {
          ...formData,
          uso: {
            ...formData.uso,
            despiece: despieceFusionado,
            resumenDespiece: resumen,
          },
          cotizacion: {
            ...formData.cotizacion,
            requiereAprobacion: false,
          },
          atributos_opcionales: {
            ...formData.atributos_opcionales,
            pernos: {
              ...formData.pernos,
              tiene_pernos_disponibles: hayPernos,
            }
          }
        }

        // Si el uso es escalera de acceso, adicionalmente agregamos detalles de escaleras
        if (uso.id === 3 && data.detalles_escaleras) {
          nuevoEstado.uso.detalles_escaleras = {
            precio_tramo: data.detalles_escaleras.precio_por_tramo_alquiler,
            altura_total_general: data.detalles_escaleras.altura_total_general,
            tramos_2m: data.detalles_escaleras.tramos_2m,
            tramos_1m: data.detalles_escaleras.tramos_1m
          }
        }

        // Si es escuadras con plataforma, adicionalmente agregamos detalles de escuadras
        if(uso.id === 4 && data.detalles_escuadras) { 
          nuevoEstado.uso.detalles_escuadras = data.detalles_escuadras
        }
        
        // Seteamos el FormData con el estado final
        setFormData(nuevoEstado);
      } catch (error) {
        console.error("❌ Error generando despiece:", error.message);
      }
    };

    cargarDespiece(); // Ejecutamos la función al montar el componente

  }, [formData.uso.id, formData.uso.zonas, formData.uso.despiece_editado_manualmente, formData.cotizacion.id, formData.cotizacion.duracion_alquiler]);
}