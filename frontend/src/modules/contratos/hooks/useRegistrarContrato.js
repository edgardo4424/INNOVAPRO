import { useCallback, useEffect, useMemo, useState, useRef } from "react"; 
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useWizardContratoContext } from "../context/WizardContratoContext";

// Servicios
import { obtenerDatosPDF } from "@/modules/cotizaciones/services/cotizacionesService";
import { crearContrato } from "../services/contratosService";

// Utilidad
import { mapearCotizacionAContrato } from "../utils/mapearCotizacionAContrato";

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

  const [exito, setExito] = useState(false);

  const [buscandoBase, setBuscandoBase] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const location = useLocation();
  // Cuando la cotización viene desde la tabla de cotizaciones el ID viene en el estado
  const idDelEstado = location?.state?.cotizacionId ?? null;
  const cotizacionId = idDelEstado ?? null;

  // Evita precargar más de una vez por montaje
  const cotizacionYaCargadaRef = useRef(false);

  // Precargar cotización si llegamos con ?cotizacionId o :id

  useEffect(() => {
    // Si no hay fuente o ya precargamos una vez, salir.
    if (!cotizacionId || cotizacionYaCargadaRef.current) return;

    // Si ya tengo el mismo id en estado, no recargar.
    const currentId = formData?.cotizacion?.id ? Number(formData.cotizacion.id) : null;
    if (currentId && Number(currentId) === Number(cotizacionId)) {
      cotizacionYaCargadaRef.current = true;
      return;
    }

    let cancelado = false;

    (async () => {
      try {
        setBuscandoBase(true);
        const data = await obtenerDatosPDF(cotizacionId);
        if (cancelado) return;
        const snapshot = mapearCotizacionAContrato(data, cotizacionId);

        setFormData((prev) => ({ ...prev, cotizacion: snapshot }));
        cotizacionYaCargadaRef.current = true;
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

    return () => { cancelado = true; };
  }, [cotizacionId, formData?.cotizacion?.id, setFormData]);

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
    //const envio = formData?.envio || {};

    // Fechas desde vigencia
    const fecha_inicio = legales?.vigencia?.inicio || null;
    const fecha_fin = legales?.vigencia?.fin || null;

    // Clausulado: solo las cláusulas activas
    const clausulas_adicionales = (legales?.clausulas || [])
      .filter(c => c?.activo)
      .map(({ id, titulo, texto, fija }) => ({ id, titulo, texto, fija: !!fija }));

    // Condiciones (para auditoría del contrato)
    /* const condiciones_alquiler = (legales?.condiciones_alquiler || []).map(c => ({
      texto: c?.texto || "",
      cumplida: !!c?.cumplida,
    })); */

    return {
      // claves principales
      cotizacion_id: cot.id,
      ref_contrato: cot.codigo_documento || null,

      // fechas
      fecha_inicio,
      fecha_fin,

      // legales
      clausulas_adicionales,          // JSON (activa/compacta)
      //condiciones_alquiler,           // JSON (nuevo en payload, ver migración)

      // valorización
      requiere_valo_adelantada: !!val.requiere_adelantada, // respeta nombre de DB actual
      renovaciones: val.renovaciones || null,

      // firmas y envío (se guardan como JSON para impresión/flujo)
      firmas: {
        //mostrar_bloque_firmas: firmas?.mostrar_bloque_firmas ?? true,
        firmante_emisor: firmas?.firmante_emisor || {},
        firmante_receptor: firmas?.firmante_receptor || {},
        //opciones: firmas?.opciones || {},            // e.g. { requiere_vobo_legal, incluir_sello_filial }
        //notas_envio: firmas?.notas_envio || {},      // asunto/mensaje/cc sugeridos
      },
      /* envio: {
        enviar_correo: !!envio?.enviar_correo,
        destinatarios: envio?.destinatarios || [],
        asunto: envio?.asunto || "",
        cuerpo: envio?.cuerpo || "",
      }, */

      // estado inicial
      estado: "PROGRAMADO",
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
      setExito(true);
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
    payloadContrato,
    exito
  };
}