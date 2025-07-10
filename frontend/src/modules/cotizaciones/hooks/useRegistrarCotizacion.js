import { useState, useEffect } from "react";
import { useWizardContext } from "../context/WizardCotizacionContext";
import { extraerDistrito } from "../utils/cotizacionUtils";
import { crearCotizacion, obtenerCotizacionPorId, crearCotizacionDesdeOT } from "../services/cotizacionesService";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { esPernoExpansion, mapearPieza } from "./paso-confirmacion/useGenerarDespiece"
import { validarAtributosPorUso } from "../validaciones/validarAtributosPorUso";

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

    if (formData.uso_id === 5) {
      // Puntales
      const transporte_puntales = formData.zonas
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

    if (formData.uso_id === 3 && formData.detalles_escaleras) {
      // Escalera de Acceso
      extras.detalles_escaleras = {
        precio_por_tramo_alquiler: Number(formData.detalles_escaleras.precio_tramo || 0),
        altura_total_general: Number(formData.detalles_escaleras.altura_total_general || 0),
        tramos_2m: Number(formData.detalles_escaleras.tramos_2m || 0),
        tramos_1m: Number(formData.detalles_escaleras.tramos_1m || 0)
      }
    }

    if (formData.uso_id === 7 && formData.cantidad_plataformas) {
      extras.cantidad_plataformas = formData.cantidad_plataformas;
    }
    console.log("Parametros extras para el payload :", extras)
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
          id: id,
          contacto_id: data.cotizacion.contacto_id,
          contacto_nombre: data.cotizacion.contacto_nombre,
          cliente_id: data.cotizacion.cliente_id,
          cliente_nombre: data.cotizacion.cliente_razon_social,
          obra_id: data.cotizacion.obra_id,
          obra_nombre: data.cotizacion.obra_nombre,
          obra_direccion: data.cotizacion.obra_direccion,
          filial_id: data.cotizacion.filial_id,
          filial_nombre: data.cotizacion.filial_razon_social,
          uso_id: data.uso_id,
          uso_nombre: data.uso_nombre,
          tipo_cotizacion: data.cotizacion.tipo_cotizacion,
          duracion_alquiler: data.cotizacion.tiempo_alquiler_dias,
          zonas: data.zonas,
          despiece: despieceFormateado,
          tiene_pernos_disponibles: hayPernos,
          resumenDespiece: calcularResumenDespiece(data.despiece),
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
      if (formDataAjustado.uso_id === 3) {
        const totales = calcularTotalesParaEscalera(formDataAjustado);
        cotizacionExtras = {
          ...cotizacionExtras,
          ...totales,
        }
      }
      const payload = {
        uso_id: formDataAjustado.uso_id,
        zonas: Array.isArray(formDataAjustado.zonas) ? formDataAjustado.zonas : [],
        cotizacion: {
          cliente_id: formDataAjustado.cliente_id,
          obra_id: formDataAjustado.obra_id,
          contacto_id: formDataAjustado.contacto_id,
          filial_id: formDataAjustado.filial_id,
          tipo_cotizacion: formDataAjustado.tipo_cotizacion,
          tiene_transporte: formDataAjustado.tiene_transporte,
          tipo_transporte: formDataAjustado.tipo_transporte,
          costo_tarifas_transporte: formDataAjustado.costo_tarifas_transporte || 0,
          costo_distrito_transporte: formDataAjustado.costo_distrito_transporte || 0,
          costo_pernocte_transporte: formDataAjustado.costo_pernocte_transporte || 0,
          tiene_pernos: formDataAjustado.tiene_pernos,
          tiene_instalacion: formDataAjustado.tiene_instalacion,
          tipo_instalacion: formDataAjustado.tipo_instalacion || null,
          precio_instalacion_completa: formDataAjustado.precio_instalacion_completa || 0,
          precio_instalacion_parcial: formDataAjustado.precio_instalacion_parcial || 0,
          nota_instalacion: formDataAjustado.nota_instalacion || "",
          porcentaje_descuento: formDataAjustado.descuento || 0,
          igv_porcentaje: 18,
          tiempo_alquiler_dias: formDataAjustado.duracion_alquiler,
          distrito_transporte: extraerDistrito(formDataAjustado.obra_direccion),
          ...cotizacionExtras
        },
        despiece: formDataAjustado.despiece,
      };
      console.log("Payload enviado por wizard:", payload)
      await crearCotizacion(payload);
      setPasoActual(pasosLength);
    } catch (error) {
      console.error("Error al guardar cotización", error.response?.data?.message || error.message);
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
      if (formData.uso_id === 3) {
        const totales = calcularTotalesParaEscalera(formData);
        cotizacionExtras = {
          ...cotizacionExtras,
          ...totales,
        }
      }
  return {
    uso_id: formData.uso_id,
    zonas: Array.isArray(formData.zonas) ? formData.zonas : [],
    cotizacion: {
      id: formData.id, // En caso estés editando, opcional
      porcentaje_descuento: formData.descuento || 0,
      igv_porcentaje: 18,

      tiene_transporte: formData.tiene_transporte,
      distrito_transporte: formData.distrito_transporte || "",

      costo_tarifas_transporte: formData.costo_tarifas_transporte || 0,
      costo_distrito_transporte: formData.costo_distrito_transporte || 0,
      costo_pernocte_transporte: formData.costo_pernocte_transporte || 0,

      tiene_pernos: formData.tiene_pernos,

      tiene_instalacion: formData.tiene_instalacion,
      tipo_instalacion: formData.tipo_instalacion || "NINGUNA",
      precio_instalacion_completa: formData.precio_instalacion_completa || 0,
      precio_instalacion_parcial: formData.precio_instalacion_parcial || 0,
      nota_instalacion: formData.nota_instalacion || "",

      tipo_transporte: formData.tipo_transporte || "",
      ...cotizacionExtras
    },
    despiece: (formData.despiece || [])
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
  if (formData.uso_id !== 3 || !formData.detalles_escaleras) return formData;

  const { precio_tramo, tramos_2m, tramos_1m } = formData.detalles_escaleras;
  const tramosTotales = Number(tramos_2m || 0) + Number(tramos_1m || 0);
  const subtotal = parseFloat((Number(precio_tramo || 0) * tramosTotales).toFixed(2));

  if (isNaN(subtotal)) return formData;

  const subtotal_venta = formData.resumenDespiece?.precio_subtotal_venta_soles || 0;
  const peso_total_kg = formData.resumenDespiece?.peso_total_kg || 0;

  return {
    ...formData,
    resumenDespiece: {
      ...formData.resumenDespiece,
      precio_subtotal_alquiler_soles: subtotal.toFixed(2),
      precio_subtotal_venta_soles: subtotal_venta,
      peso_total_kg,
      peso_total_ton: (peso_total_kg / 1000).toFixed(2),
    }
  };
}


// Para enviar al backend cuando es escalera de acceso:

function calcularTotalesParaEscalera(formData) {
  const precio_tramo = Number(formData.detalles_escaleras.precio_tramo || 0);
  const tramos = Number(formData.detalles_escaleras.tramos_2m || 0) + Number(formData.detalles_escaleras.tramos_1m || 0);
  const subtotal = parseFloat((precio_tramo * tramos).toFixed(2));
  const descuento = Number(formData.descuento || 0);
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