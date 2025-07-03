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
        .map(tipo => ({ tipo_puntal: tipo }));

      if (transporte_puntales?.length) {
        extras.transporte_puntales = transporte_puntales;
      }
    }

    if (formData.uso_id === 3) {
      // Escalera de Acceso
      extras.precio_tramo = formData.precio_tramo || 0;
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
    const resultado = validarAtributosPorUso(formData);
    if (!resultado.valido) {
      toast.error(`⚠️ Faltan datos mínimos para generar la cotización:\n${resultado.errores.join("\n")}`);
      setGuardando(false);
      return;
    }

    setGuardando(true);
    try {
      const payload = {
        uso_id: formData.uso_id,
        zonas: Array.isArray(formData.zonas) ? formData.zonas : [],
        cotizacion: {
          cliente_id: formData.cliente_id,
          obra_id: formData.obra_id,
          contacto_id: formData.contacto_id,
          filial_id: formData.filial_id,
          tipo_cotizacion: formData.tipo_cotizacion,
          tiene_transporte: formData.tiene_transporte,
          tipo_transporte: formData.tipo_transporte,
          costo_tarifas_transporte: formData.costo_tarifas_transporte || 0,
          costo_distrito_transporte: formData.costo_distrito_transporte || 0,
          costo_pernocte_transporte: formData.costo_pernocte_transporte || 0,
          tiene_pernos: formData.tiene_pernos,
          tiene_instalacion: formData.tiene_instalacion,
          tipo_instalacion: formData.tipo_instalacion || null,
          precio_instalacion_completa: formData.precio_instalacion_completa || 0,
          precio_instalacion_parcial: formData.precio_instalacion_parcial || 0,
          nota_instalacion: formData.nota_instalacion || "",
          porcentaje_descuento: formData.descuento || 0,
          igv_porcentaje: 18,
          tiempo_alquiler_dias: formData.duracion_alquiler,
          distrito_transporte: extraerDistrito(formData.obra_direccion),
          ...obtenerParametrosExtraCotizacion(formData)
        },
        despiece: formData.despiece,
      };

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
    const resultado = validarAtributosPorUso(formData);
    if (!resultado.valido) {
      toast.error(`⚠️ Atributos incompletos:\n${resultado.errores.join("\n")}`);
      setGuardando(false);
      return;
    }

    setGuardando(true);

    try {
      const payload = construirPayloadOT(formData);
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
      ...obtenerParametrosExtraCotizacion(formData)
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