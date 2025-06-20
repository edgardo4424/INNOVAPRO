import { useState } from "react";
import { useWizardContext } from "../context/WizardCotizacionContext";
import { extraerDistrito } from "../utils/cotizacionUtils";
import { crearCotizacion } from "../services/cotizacionesService";

// Este hook maneja la lógica del wizard para registrar una cotización.
// Permite avanzar y retroceder entre pasos, validar datos y guardar la cotización final.

export function useRegistrarCotizacion(pasosLength) {
  // Estado para manejar el paso actual del wizard, comenzando en 0 (primer paso).
  // También se maneja el estado de guardado y los errores de validación.
  const [pasoActual, setPasoActual] = useState(0);
  const { formData, validarPaso, setErrores } = useWizardContext();
  const [guardando, setGuardando] = useState(false);

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

  return {
    pasoActual,
    setPasoActual,
    avanzarPaso,
    retrocederPaso,
    guardarCotizacion,
    guardando,
    exito: pasoActual === pasosLength,
  };
}