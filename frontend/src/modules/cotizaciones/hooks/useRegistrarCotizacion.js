import { useState, useEffect } from "react";
import { useWizardContext } from "../context/WizardCotizacionContext";
import { extraerDistrito } from "../utils/cotizacionUtils";
import { crearCotizacion, obtenerCotizacionPorId, crearCotizacionDesdeOT } from "../services/cotizacionesService";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { esPernoExpansion, mapearPieza } from "./paso-confirmacion/useGenerarDespiece"
import { validarAtributosPorUso } from "../validaciones/validarAtributosPorUso";
import { Direction } from "react-data-table-component";

// Este hook maneja la lógica del wizard para registrar una cotización.
// Permite avanzar y retroceder entre pasos, validar datos y guardar la cotización final.

export function useRegistrarCotizacion(pasosLength) {
  // Estado para manejar el paso actual del wizard, comenzando en 0 (primer paso).
  // También se maneja el estado de guardado y los errores de validación.
  const [pasoActual, setPasoActual] = useState(0);
  const [guardando, setGuardando] = useState(false);
  const [exito, setExito] = useState(false);
  const { id } = useParams();

  const { 
    formData,
    setFormData, 
    validarPaso, 
    setErrores, 
  } = useWizardContext();

  function obtenerParametrosExtraCotizacion(formData) {
    const extras = {};

    if (formData.uso.id === 5) {
      // Puntales
      const transporte_puntales = formData.uso.zonas
        ?.flatMap(zona => zona.atributos_formulario || [])
        .map(attr => attr?.tipoPuntal)
        .filter(Boolean)
        .map(tipo => ({ 
          tipo_puntal: String(tipo).replace(" m", "").trim()
        }));

      if (transporte_puntales?.length) {
        extras.transporte_puntales = transporte_puntales;
      }
    }

    if (formData.uso.id === 3 && formData.uso.detalles_escaleras) {
      // Escalera de Acceso
      extras.detalles_escaleras = {
        precio_por_tramo_alquiler: Number(formData.uso.detalles_escaleras.precio_tramo || 0),
        altura_total_general: Number(formData.uso.detalles_escaleras.altura_total_general || 0),
        tramos_2m: Number(formData.uso.detalles_escaleras.tramos_2m || 0),
        tramos_1m: Number(formData.uso.detalles_escaleras.tramos_1m || 0)
      }
    }

    if (formData.uso.id === 7 && formData.uso.cantidad_plataformas) {
      extras.cantidad_plataformas = formData.uso.cantidad_plataformas;
    }

    if (formData.uso.id === 4 && formData.uso.detalles_escuadras) {
      // Escuadras con plataforma
      extras.detalles_escuadras = formData.uso.detalles_escuadras;
    }
    
    return extras;
  }


  // Cargar la cotización "En progreso" al entrar al Wizard
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const data = await obtenerCotizacionPorId(id);
           
        const despieceFormateado = data.despiece?.map(mapearPieza)

        const hayPernos = despieceFormateado.some(p => p.esPerno); 

        setFormData({
          ...data,
          entidad: {
            contacto: {
              id: data.cotizacion.contacto_id,
              nombre: data.cotizacion.contacto_nombre,
            },
            cliente: {
              id: data.cotizacion.cliente_id,
              razon_social: data.cotizacion.cliente_razon_social,
            },
            obra: {
              id: data.cotizacion.obra_id,
              nombre: data.cotizacion.obra_nombre,
              Direction: data.cotizacion.obra_direccion,
            },
            filial: {
              id: data.cotizacion.filial_id,
              razon_social: data.cotizacion.razon_social,
            }
          },
          uso: {
            id: data.uso_id,
            nombre: data.uso_nombre,
            zonas: data.zonas,
            despiece: despieceFormateado,
            resumenDespiece: calcularResumenDespiece(data.despiece)
          },
          cotizacion: {
            tipo: data.cotizacion.tipo_cotizacion,
            duracion_alquiler: data.cotizacion.tiempo_alquiler_dias,
          },
          atributos_opcionales: {
            pernos: {
              tiene_pernos_disponibles: hayPernos,
            }
          },
        })
        
        setPasoActual(3); // Acá definimos desde qué paso vamos a comenzar: El tercero es el paso confirmación
      } catch (error) {
        console.error("Error al cargar la cotización: ", error);
      }
    })();
  }, [id]);
  

  // Funciones para avanzar y retroceder entre los pasos del wizard.
  // Al avanzar, se valida el paso actual y, si no hay errores, se incrementa el pasoActual.
  // Al retroceder, simplemente se decrementa el pasoActual y se limpian los errores.
  const avanzarPaso = () => {
    const erroresPaso = validarPaso(pasoActual);
    if (Object.keys(erroresPaso).length > 0) {
      setErrores(erroresPaso);
      return;
    }
    setErrores({});
    setPasoActual((prev) => prev + 1);
  };

  const retrocederPaso = () => {
    setErrores({});
    setPasoActual((prev) => prev - 1);
  };

  const guardarCotizacion = async () => {
    const formDataAjustado = ajustarResumenParaEscalera(formData);
    const resultado = validarAtributosPorUso(formDataAjustado);
    if (!resultado.valido) {
      toast.error(`⚠️ Faltan datos mínimos para generar la cotización:\n${resultado.errores.join("\n")}`);
      setGuardando(false);
      return;
    }

    setGuardando(true);
    try {
      let cotizacionExtras = obtenerParametrosExtraCotizacion(formDataAjustado);
      if (formDataAjustado.uso.id === 3) {
        const totales = calcularTotalesParaEscalera(formDataAjustado);
        cotizacionExtras = {
          ...cotizacionExtras,
          ...totales,
        }
      }

      if (formDataAjustado.uso.id === 8 && formDataAjustado.uso.detalles_colgantes) {
        cotizacionExtras.detalles_colgantes = {
          cantidad_colgantes: formDataAjustado.uso.detalles_colgantes.cantidad_colgantes,
          precio_u_alquiler_soles: formDataAjustado.uso.detalles_colgantes.precio_u_alquiler_soles || 0, 
          precio_u_venta_nuevo: formDataAjustado.uso.detalles_colgantes.precio_u_venta_nuevo || 0,
          precui_u_venta_usado: formDataAjustado.uso.detalles_colgantes.precio_u_venta_usado || 0,
          longitud_plataformas: formDataAjustado.uso.detalles_colgantes.longitud_plataformas,
          tipo_soporte: formDataAjustado.uso.detalles_colgantes.tipo_soporte,
        };
      }

      const payload = {
        uso_id: formDataAjustado.uso.id,
        zonas: Array.isArray(formDataAjustado.uso.zonas) ? formDataAjustado.uso.zonas : [],
        cotizacion: {
          cliente_id: formDataAjustado.entidad.cliente.id,
          obra_id: formDataAjustado.entidad.obra.id,
          contacto_id: formDataAjustado.entidad.contacto.id,
          filial_id: formDataAjustado.entidad.filial.id,
          tipo_cotizacion: formDataAjustado.cotizacion.tipo,
          tiene_transporte: formDataAjustado.atributos_opcionales.transporte.tiene_transporte || false,
          tipo_transporte: formDataAjustado.atributos_opcionales.transporte.tipo_transporte,
          costo_tarifas_transporte: formDataAjustado.atributos_opcionales.transporte.costo_tarifas_transporte || 0,
          costo_distrito_transporte: formDataAjustado.atributos_opcionales.transporte.costo_distrito_transporte || 0,
          costo_pernocte_transporte: formDataAjustado.atributos_opcionales.transporte.costo_pernocte_transporte || 0,
          tiene_pernos: formDataAjustado.atributos_opcionales.pernos.tiene_pernos,
          tiene_instalacion: formDataAjustado.atributos_opcionales.instalacion.tiene_instalacion,
          tipo_instalacion: formDataAjustado.atributos_opcionales.instalacion.tipo_instalacion || null,
          precio_instalacion_completa: formDataAjustado.atributos_opcionales.instalacion.precio_instalacion_completa || 0,
          precio_instalacion_parcial: formDataAjustado.atributos_opcionales.instalacion.precio_instalacion_parcial || 0,
          nota_instalacion: formDataAjustado.atributos_opcionales.instalacion.nota_instalacion || "",
          porcentaje_descuento: formDataAjustado.cotizacion.descuento || 0,
          igv_porcentaje: 18,
          tiempo_alquiler_dias: formDataAjustado.cotizacion.duracion_alquiler,
          distrito_transporte: extraerDistrito(formDataAjustado.entidad.obra.direccion),
          ...cotizacionExtras
        },
        despiece: formDataAjustado.uso.despiece,
      };
      await crearCotizacion(payload);
      setPasoActual(pasosLength);
    } catch (error) {
      console.error("Error al guardar cotización", error.response?.data?.message || error.message);
      toast.error("Error al guardar cotización ", error.respones?.data?.message || error.message);
    } finally {
      setGuardando(false);
    }
  };

  // Funciones para guardar las cotizaciones que vienen con despiece de OT

  const guardarCotizacionDesdeOT = async () => {
    const formDataAjustado = ajustarResumenParaEscalera(formData)
    const resultado = validarAtributosPorUso(formDataAjustado);
    if (!resultado.valido) {
      toast.error(`⚠️ Atributos incompletos:\n${resultado.errores.join("\n")}`);
      setGuardando(false);
      return;
    }

    setGuardando(true);

    try {
      const payload = construirPayloadOT(formDataAjustado);
      await crearCotizacionDesdeOT(payload);
      setExito(true);
      setPasoActual(pasosLength);
    } catch (error) {
      toast.error("Error al guardar la cotización");
    } finally {
      setGuardando(false);
    }
  }

  function construirPayloadOT(formData) { 
    let cotizacionExtras = obtenerParametrosExtraCotizacion(formData);
      if (formData.uso.id === 3) {
        const totales = calcularTotalesParaEscalera(formData);
        cotizacionExtras = {
          ...cotizacionExtras,
          ...totales,
        }
      }
  return {
    uso_id: formData.uso.id,
    zonas: Array.isArray(formData.uso.zonas) ? formData.uso.zonas : [],
    cotizacion: {
      id: formData.cotizacion.id, // En caso estés editando, opcional
      porcentaje_descuento: formData.cotizacion.descuento || 0,
      igv_porcentaje: 18,

      tiene_transporte: formData.atributos_opcionales.transporte.tiene_transporte,
      distrito_transporte: formData.atributos_opcionales.transporte.distrito_transporte || "",

      costo_tarifas_transporte: formData.atributos_opcionales.transporte.costo_tarifas_transporte || 0,
      costo_distrito_transporte: formData.atributos_opcionales.transporte.costo_distrito_transporte || 0,
      costo_pernocte_transporte: formData.atributos_opcionales.transporte.costo_pernocte_transporte || 0,

      tiene_pernos: formData.atributos_opcionales.pernos.tiene_pernos,

      tiene_instalacion: formData.atributos_opcionales.instalacion.tiene_instalacion,
      tipo_instalacion: formData.atributos_opcionales.instalacion.tipo_instalacion || "NINGUNA",
      precio_instalacion_completa: formData.atributos_opcionales.instalacion.precio_instalacion_completa || 0,
      precio_instalacion_parcial: formData.atributos_opcionales.instalacion.precio_instalacion_parcial || 0,
      nota_instalacion: formData.atributos_opcionales.instalacion.nota_instalacion || "",

      tipo_transporte: formData.atributos_opcionales.transporte.tipo_transporte || "",
      ...cotizacionExtras
    },
    despiece: (formData.uso.despiece || [])
      .filter((pieza) => pieza.incluido !== false)
      .map((pieza) => ({
      pieza_id: pieza.pieza_id,
      item: pieza.item,
      descripcion: pieza.descripcion,
      total: pieza.total,
      esAdicional: pieza.esAdicional || false,
      esPerno: pieza.esPerno || false,
      peso_u_kg: parseFloat(pieza.peso_u_kg),
      peso_kg: parseFloat(pieza.peso_kg),
      precio_u_venta_dolares: parseFloat(pieza.precio_u_venta_dolares),
      precio_venta_dolares: parseFloat(pieza.precio_venta_dolares),
      precio_u_venta_soles: parseFloat(pieza.precio_u_venta_soles),
      precio_venta_soles: parseFloat(pieza.precio_venta_soles),
      precio_u_alquiler_soles: parseFloat(pieza.precio_u_alquiler_soles),
      precio_alquiler_soles: parseFloat(pieza.precio_alquiler_soles),
      stock_actual: pieza.stock_actual,
    })),
  };
}

// Ajustamos el resumen del despiece para enviar al backend si es escalera de acceso
// con su lógica por tramos y no por despiece

function ajustarResumenParaEscalera(formData) {
  if (formData.uso.id !== 3 || !formData.uso.detalles_escaleras) return formData;

  const { precio_tramo, tramos_2m, tramos_1m } = formData.uso.detalles_escaleras;
  const tramosTotales = Number(tramos_2m || 0) + Number(tramos_1m || 0);
  const subtotal = parseFloat((Number(precio_tramo || 0) * tramosTotales).toFixed(2));

  if (isNaN(subtotal)) return formData;

  const subtotal_venta = formData.uso.resumenDespiece?.precio_subtotal_venta_soles || 0;
  const peso_total_kg = formData.uso.resumenDespiece?.peso_total_kg || 0;

  return {
    ...formData,
    uso: {
      ...formData.uso,
       resumenDespiece: {
        ...formData.uso.resumenDespiece,
        precio_subtotal_alquiler_soles: subtotal.toFixed(2),
        precio_subtotal_venta_soles: subtotal_venta,
        peso_total_kg,
        peso_total_ton: (peso_total_kg / 1000).toFixed(2),
    }
    }
  };
}


// Para enviar al backend cuando es escalera de acceso:

function calcularTotalesParaEscalera(formData) {
  const precio_tramo = Number(formData.uso.detalles_escaleras.precio_tramo || 0);
  const tramos = Number(formData.uso.detalles_escaleras.tramos_2m || 0) + Number(formData.uso.detalles_escaleras.tramos_1m || 0);
  const subtotal = parseFloat((precio_tramo * tramos).toFixed(2));
  const descuento = Number(formData.cotizacion.descuento || 0);
  const subtotal_con_descuento = parseFloat((subtotal * (1 - descuento / 100)).toFixed(2));
  const igv_porcentaje = 18;
  const igv_monto = parseFloat((subtotal_con_descuento * igv_porcentaje / 100).toFixed(2));
  const total_final = parseFloat((subtotal_con_descuento + igv_monto).toFixed(2));

  return {
    subtotal,
    subtotal_con_descuento,
    igv_porcentaje,
    igv_monto,
    total_final
  };
}

  return {
    pasoActual,
    setPasoActual,
    avanzarPaso,
    retrocederPaso,
    guardarCotizacion,
    guardarCotizacionDesdeOT,
    guardando,
    exito: pasoActual === pasosLength,
  };
}

// Utilidad para calcular resumen del despiece desde piezas
function calcularResumenDespiece(despiece) {
  let peso_total_kg = 0;
  let precio_subtotal_alquiler_soles = 0;
  let precio_subtotal_venta_soles = 0;

  for (const pieza of despiece || []) {
    peso_total_kg += parseFloat(pieza.peso_kg || 0);
    precio_subtotal_alquiler_soles += parseFloat(pieza.precio_alquiler_soles || 0);
    precio_subtotal_venta_soles += parseFloat(pieza.precio_venta_soles || 0);
  }

  return {
    peso_total_kg,
    peso_total_ton: (peso_total_kg / 1000).toFixed(2),
    precio_subtotal_alquiler_soles: precio_subtotal_alquiler_soles.toFixed(2),
    precio_subtotal_venta_soles: precio_subtotal_venta_soles.toFixed(2),
  };
}