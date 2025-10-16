import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useWizardContratoContext } from "../context/WizardContratoContext";

// Servicios
import { obtenerDatosPDF } from "@/modules/cotizaciones/services/cotizacionesService";
import { crearContrato } from "../services/contratosService";


// Hook principal
export function useRegistrarContrato(totalPasos) {
  const {
    formData,
    setFormData,
    errores,
    setErrores,
    pasoActual,
    setPasoActual,
  } = useWizardContratoContext();

  const [buscandoBase, setBuscandoBase] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const [searchParams] = useSearchParams();
  const { id: idParam } = useParams();

  // Precargar cotización si llegamos con ?cotizacionId o :id

  useEffect(() => {
    const cotizacionId = searchParams.get("cotizacionId") || idParam;
    if (!cotizacionId) return;

    let cancelado = false;
    (async () => {
      try {
        setBuscandoBase(true);
        const data = await obtenerDatosPDF(cotizacionId);
        console.log("🟢 Cotización cargada:", data);
        const subtotal = Number(data?.cotizacion.subtotal_con_descuento_sin_igv ?? 0);
        const igv = (subtotal * 18)/100;
        // Mapear respuesta a snapshot del formData
        const snapshot = {
          id: Number(cotizacionId),
          codigo_documento: data?.cotizacion.codigo_documento ?? "",
          tipo: data?.cotizacion.tipo_servicio ?? "",
          entidad: {
            cliente: data?.cliente ?? {},
            obra: data?.obra ?? {},
            filial: data?.filial ?? {},
            contacto: data?.contacto ?? {},
          },
          uso: {
            id: data?.uso?.id ?? null,
            nombre: data?.uso?.nombre ?? "",
          },
          totales: {
            subtotal,
            igv,
            total: (subtotal + igv),
          },
          moneda: data?.cotizacion.moneda ?? "PEN",
          duracion_alquiler: data?.cotizacion.tiempo_alquiler_dias ?? "",
        };

        if (cancelado) return;
        setFormData((prev) => ({ ...prev, cotizacion: snapshot }));
        toast.success("Cotización base precargada.");
      } catch (e) {
        if (!cancelado) {
          console.error("❌ Error al cargar cotización base:", e);
          toast.error("No se pudo cargar la cotización base.");
        }
      } finally {
        if (!cancelado) setBuscandoBase(false);
      }
    })();

    return () => {
      cancelado = true;
    };
  }, [searchParams, idParam, setFormData]);

  // Navegación entre pasos
  const avanzarPaso = useCallback(() => {
    setErrores({});
    setPasoActual((p) => Math.min(p + 1, totalPasos));
  }, [setPasoActual, totalPasos, setErrores]);

  const retrocederPaso = useCallback(() => {
    setErrores({});
    setPasoActual((p) => Math.max(p - 1, 1));
  }, [setPasoActual, setErrores]);

  // Payload final del contrato
  const payloadContrato = useMemo(() => {
    const cot = formData?.cotizacion || {};
    const legales = formData?.legales || {};
    const val = formData?.valorizacion || {};
    const firmas = formData?.firmas || {};
    const envio = formData?.envio || {};

    return {
      cotizacion_id: cot.id,

      ref_contrato: cot.codigo_documento,

      legales: {
        vigencia: legales.vigencia,
        clausulas: legales.clausulas || [],
        condiciones_alquiler: legales.condiciones_alquiler || [],
      },

      valorizacion: {
        requiere_adelantada: !!val.requiere_adelantada,
        renovaciones: val.renovaciones || "",
      },

      firmas: {
        firmante_emisor: firmas.firmante_emisor || {},
        firmante_receptor: firmas.firmante_receptor || {},
      },

      envio: {
        enviar_correo: !!envio.enviar_correo,
        destinatarios: envio.destinatarios || [],
        asunto: envio.asunto || "",
        cuerpo: envio.cuerpo || "",
      },
    };
  }, [formData]);


  // Guardar contrato (enviar al backend)
  const guardarContrato = useCallback(async () => {
    try {
      setGuardando(true);
      if (!payloadContrato.cotizacion_id)
        throw new Error("Falta la cotización base.");
      console.log("📦 Enviando payloadContrato:", payloadContrato);
      const res = await crearContrato(payloadContrato);
      toast.success("Contrato creado correctamente.");
      return res;
    } catch (e) {
      console.error("❌ Error al crear contrato:", e);
      toast.error(
        e?.response?.data?.message || e?.message || "No se pudo crear el contrato."
      );
      throw e;
    } finally {
      setGuardando(false);
    }
  }, [payloadContrato]);

  return {
    pasoActual,
    errores,
    formData,
    buscandoBase,
    guardando,
    avanzarPaso,
    retrocederPaso,
    guardarContrato,
    setFormData,
    setErrores,
    payloadContrato, // Exponemos el payload para vista previa
  };
}