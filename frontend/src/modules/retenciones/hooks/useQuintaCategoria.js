import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  quintaPreview,
  quintaCrear,
  quintaList,
  quintaRecalc,
  quintaObtenerCertificado,
  quintaObtenerSinPrevios,
} from "../service/quintaService";
import trabajadoresService from "@/modules/trabajadores/services/trabajadoresService";
import empresasService from "@/modules/filiales/services/empresasService";
import { FUENTE_PREVIOS, DEBOUNCE_MS } from "../utils/quinta.constants";
import {
  normalizarFuentePrevios,
  normalizarCalculo,
  mostrarUltimoRegistroPorMes,
  extraerFilas,
} from "../utils/quinta.mappers";
import { validarFormularioQuinta } from "../utils/quinta.validators";

/** Limpieza profunda para payloads (evita null/undefined/NaN). */
const limpiarBody = (obj) => {
  if (Array.isArray(obj)) return obj.map(limpiarBody).filter(v => v !== undefined && v !== null);
  if (obj && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([, v]) => v !== undefined && v !== null && !(typeof v === "number" && Number.isNaN(v)))
        .map(([k, v]) => [k, limpiarBody(v)])
    );
  }
  return obj;
};

export function useQuintaCategoria() {
  const [form, setForm] = useState({
    anio: "",
    mes: "",
    trabajadorId: null,
    filial_id: "",
    contrato_id: "",
    dni: "",
    remuneracionMensualActual: "",
    fuentePrevios: FUENTE_PREVIOS.AUTO,
    certificadoQuinta: {
      renta_bruta_total: "",
      retenciones_previas: "",
      remuneraciones: "",
      asignacion_familiar: "",
      vacaciones: "",
      gratificaciones: "",
      otros: "",
    },
  });

  const [preview, setPreview] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [historialVigente, setHistorialVigente] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);
  const [filiales, setFiliales] = useState([]);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const [filialesGenerales, setFilialesGenerales] = useState([]);

  // Control de concurrencia / debounce
  const debounceRef = useRef(null);
  const reqSeqRef = useRef(0);
  const lastOkPreviewRef = useRef(null);

  // Utilidad segura para extraer la DJ desde el preview 
  const obtenerSinPreviosDelPreview = (out) => {
    const a = out?.soportes?.sinPrevios;
    const b = out?.retencion_meta?.soportes_json?.sin_previos;
    return a?.found ? a : (b?.found ? b : null);
  };

  // Sincronizar fuente visual con preview (no toca CERTIFICADO elegido explícitamente)
  const useSincronizarFuenteDesdePreview = ({ form, setFormIfChanged }) => {
    return useCallback((out) => {
      if (String(form?.fuentePrevios).toUpperCase() === FUENTE_PREVIOS.CERTIFICADO) return;
      const declaracionJurada = obtenerSinPreviosDelPreview(out);
      const mes = Number(form?.mes || 0);
      if (!mes) return;

      if (declaracionJurada?.found) {
        const aplica = Number(declaracionJurada.aplica_desde_mes || 0);
        if (mes < aplica) {
          setFormIfChanged(prev =>
            prev.fuentePrevios === FUENTE_PREVIOS.SIN_PREVIOS ? prev
            : ({ ...prev, fuentePrevios: FUENTE_PREVIOS.SIN_PREVIOS })
          );
          return;
        }
      }
      setFormIfChanged(prev =>
        prev.fuentePrevios === FUENTE_PREVIOS.SIN_PREVIOS ? ({ ...prev, fuentePrevios: FUENTE_PREVIOS.AUTO }) : prev
      );
    }, [form?.mes, setFormIfChanged]);
  };

  /* ---------- Flags ---------- */
  const canCalcular = useMemo(
    () => !!form.anio && !!form.mes && !!form.trabajadorId && !!form.filial_id,
    [form.anio, form.mes, form.trabajadorId, form.filial_id]
  );
  const vigenteDelMes = useMemo(
    () => historialVigente.find(r => r.mes === Number(form.mes)),
    [historialVigente, form.mes]
  );
  const yaExisteOficialEnMes = Boolean(vigenteDelMes);

  /* ---------- Validación ---------- */
  const validar = useCallback(() => {
    const { ok, errors } = validarFormularioQuinta(form);
    setErrors(errors);
    return ok;
  }, [form]);

  /* ---------- Setters seguros ---------- */
  const setFormIfChanged = useCallback((updater) => {
    setForm(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      if (
        next.anio === prev.anio &&
        next.mes === prev.mes &&
        next.trabajadorId === prev.trabajadorId &&
        next.filial_id === prev.filial_id &&
        next.contrato_id === prev.contrato_id &&
        next.remuneracionMensualActual === prev.remuneracionMensualActual &&
        next.fuentePrevios === prev.fuentePrevios
      ) return prev;
      return next;
    });
  }, []);

  /* ---------- Handlers ---------- */
  const handleChange = useCallback((k, v) => {
    setFormIfChanged(prev => ({ ...prev, [k]: v }));
  }, [setFormIfChanged]);

  const resetPreview = useCallback(() => {
    lastOkPreviewRef.current = null;
    setPreview(null);
  }, []);

  const handleTrabajadorSelect = useCallback((id) => {
    const trabajador = trabajadores.find(t => Number(t.id) === Number(id));
    if (!trabajador) return;
    setFormIfChanged(prev => ({
      ...prev,
      trabajadorId: Number(id),
      dni: trabajador.numero_documento || trabajador.dni || "",
      filial_id: "",
      contrato_id: "",
      remuneracionMensualActual: "",
    }));
    setFiliales([]); 
    resetPreview(); // SI SE SIGUE SETEANDO NULL MAL BORRA ESTO Y LA FUNCION MISMA
  }, [trabajadores, setFormIfChanged]);

  // Acepta objeto de filiales “vigentes” ({filial_id, contrato_id, sueldo})
  // o de filiales “generales” ({id, razon_social}) y lo normaliza.
  const handleFilialSelect = useCallback((val, filialObj) => {
    // Si viene del <Select> de Cierre: { id, razon_social }
    if (filialObj && filialObj.id && !filialObj.filial_id) {
      const filial_id = Number(filialObj.id);
      setFormIfChanged(prev => ({
        ...prev,
        filial_id: String(filial_id || ""),
        // cierre no requiere contrato/sueldo
        contrato_id: "",
      }));
      return;
    }

    // Flujo normal (filiales vigentes al mes): { filial_id, contrato_id, sueldo }
    const f = filialObj ?? filiales.find(x => String(x.filial_id) === String(val));
    if (!f) return;

    setFormIfChanged(prev => ({
      ...prev,
      filial_id: String(f.filial_id || ""),
      contrato_id: String(f.contrato_id || ""),
      remuneracionMensualActual: typeof f.sueldo === "number" ? f.sueldo : prev.remuneracionMensualActual,
    }));
  }, [filiales, setFormIfChanged]);


  // Clave estable para preview (evita bucles)
  const certificadoKey = useMemo(() => {
    if (form.fuentePrevios !== FUENTE_PREVIOS.CERTIFICADO) return null;
    const c = form.certificadoQuinta || {};
    return {
      renta_bruta_total: c.renta_bruta_total,
      retenciones_previas: c.retenciones_previas,
      remuneraciones: c.remuneraciones,
      asignacion_familiar: c.asignacion_familiar,
      vacaciones: c.vacaciones,
      gratificaciones: c.gratificaciones,
      otros: c.otros,
    };
  }, [
    form.fuentePrevios,
    form.certificadoQuinta.renta_bruta_total,
    form.certificadoQuinta.retenciones_previas,
    form.certificadoQuinta.remuneraciones,
    form.certificadoQuinta.asignacion_familiar,
    form.certificadoQuinta.vacaciones,
    form.certificadoQuinta.gratificaciones,
    form.certificadoQuinta.otros,
  ]);

  // Clave estable para preview sin bucles infinitos
  const previewLlave = useMemo(() => JSON.stringify({
    anio: form.anio,
    mes: form.mes,
    trabajadorId: form.trabajadorId,
    filial_id: form.filial_id,
    fuentePrevios: form.fuentePrevios,
    certificado: certificadoKey
  }), [
    form.anio, form.mes, form.trabajadorId, form.filial_id, form.fuentePrevios, certificadoKey ]);

  /* ---------- Payload ---------- */
  const crearPayload = useCallback(() => {
    const { fuentePrevios, certificadoQuinta, filial_id, contrato_id, trabajadorId, ...rest } = form;
    const payload = {
      ...rest,
      fuentePrevios: normalizarFuentePrevios(fuentePrevios),
      filialId: filial_id ? Number(filial_id) : undefined,
      contratoId: contrato_id ? Number(contrato_id) : undefined,
      trabajadorId: trabajadorId ? Number(trabajadorId) : undefined,
    };

    if (payload.fuentePrevios === FUENTE_PREVIOS.CERTIFICADO) {
      payload.certificadoQuinta = {
        renta_bruta_total: Number(certificadoQuinta.renta_bruta_total || 0),
        retenciones_previas: Number(certificadoQuinta.retenciones_previas || 0),
        remuneraciones: Number(certificadoQuinta.remuneraciones || 0),
        asignacion_familiar: Number(certificadoQuinta.asignacion_familiar || 0),
        vacaciones: Number(certificadoQuinta.vacaciones || 0),
        gratificaciones: Number(certificadoQuinta.gratificaciones || 0),
        otros: Number(certificadoQuinta.otros || 0),
      };
    }
    return payload;
  }, [form]);

  /* ---------- Preview ---------- */
  const previsualizacionSegura = useCallback(async (payload) => {
    const reqId = ++reqSeqRef.current;
    try {
      setLoadingPreview(true);
      const respuesta = await quintaPreview(payload);
      if (reqId !== reqSeqRef.current) return respuesta;

      const out = respuesta?.data?.data || respuesta?.data;
      if (out && out.trabajador) {
        lastOkPreviewRef.current = out; 
        setPreview(out);
        // Sincronizamos sueldo si backend lo devolvió diferente
        setFormIfChanged(prev => {
          const nuevo = out?.entradas?.remuneracion_mensual ?? prev.remuneracionMensualActual;
          if (nuevo === prev.remuneracionMensualActual) return prev;
          return { ...prev, remuneracionMensualActual: nuevo };
        });
      } else if (lastOkPreviewRef.current) {
        setPreview(lastOkPreviewRef.current);
      }
      return respuesta;
    } catch (err) {
      if (reqId !== reqSeqRef.current) return;
      console.error(err);
      toast.error(err?.response?.data?.message || "Error al calcular la proyección.");
      if (lastOkPreviewRef.current) setPreview(lastOkPreviewRef.current);
    } finally {
      if (reqId === reqSeqRef.current) setLoadingPreview(false);
    }
  }, [setFormIfChanged]);

    
  const sincronizarFuenteDesdePreview = useSincronizarFuenteDesdePreview({ form, setFormIfChanged });

  const handlePreview = useCallback(async () => {    
    if (!validar()) return;
    const resultado = await previsualizacionSegura(crearPayload());
    const out = resultado?.data?.data || resultado?.data || resultado;
    if (out) sincronizarFuenteDesdePreview(out);
    return resultado;
  }, [validar, previsualizacionSegura, crearPayload, sincronizarFuenteDesdePreview]);

  const cargarHistorial = useCallback(async () => {
    if (!form.dni || !form.anio) return;
    try {
      const { data } = await quintaList({ dni: form.dni, anio: form.anio });
      const rows = extraerFilas(data);
      const normales = rows.map(normalizarCalculo);
      //setHistorial(rows.map(normalizarCalculo));
      setHistorialVigente(mostrarUltimoRegistroPorMes(rows));
    } catch (err) {
      // Silencioso
    }
  }, [form.dni, form.anio]);

  const handleGuardar = useCallback(async () => {
    if (!validar()) return;
    try {
      setSaving(true);
      await quintaCrear(crearPayload());
      toast.success("Cálculo guardado correctamente");
      resetPreview();
      await cargarHistorial();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Error al guardar cálculo.");
    } finally {
      setSaving(false);
    }
  }, [validar, crearPayload, cargarHistorial, resetPreview]);
  
    const handleRecalcular = useCallback(async (row) => {
    if (!row?.id) return;
    const ok = window.confirm("Recalculará el mes con reglas/contrato vigentes. ¿Continuar?");
    if (!ok) return;

    try {
        const baseTotal = Number(row.retencion_base_mes) + Number(row.retencion_adicional_mes);

        const base = {
          anio: form.anio ? Number(form.anio) : undefined,
          mes:  form.mes  ? Number(form.mes)  : undefined,
          fuentePrevios: normalizarFuentePrevios(form.fuentePrevios),
          __filialId:     form.filial_id     ? Number(form.filial_id)     : undefined,
          __contratoId:   form.contrato_id   ? Number(form.contrato_id)   : undefined,
          __trabajadorId: form.trabajadorId  ? Number(form.trabajadorId)  : undefined,
          filialId:     form.filial_id     ? Number(form.filial_id)     : undefined,
          contratoId:   form.contrato_id   ? Number(form.contrato_id)   : undefined,
          trabajadorId: form.trabajadorId  ? Number(form.trabajadorId)  : undefined,
          remuneracionMensualActual: form.remuneracionMensualActual
              ? Number(form.remuneracionMensualActual)
              : undefined,
        };

        if (form.fuentePrevios === FUENTE_PREVIOS.CERTIFICADO) {
          base.certificadoQuinta = {
              renta_bruta_total:   Number(form.certificadoQuinta?.renta_bruta_total   || 0),
              retenciones_previas: Number(form.certificadoQuinta?.retenciones_previas || 0),
              remuneraciones:      Number(form.certificadoQuinta?.remuneraciones      || 0),
              asignacion_familiar: Number(form.certificadoQuinta?.asignacion_familiar || 0),
              vacaciones:          Number(form.certificadoQuinta?.vacaciones          || 0),
              gratificaciones:     Number(form.certificadoQuinta?.gratificaciones     || 0),
              otros:               Number(form.certificadoQuinta?.otros               || 0),
          };
        }

        const body = limpiarBody(base);
        const { data } = await quintaRecalc(row.id, body);

        const nuevo = normalizarCalculo(data.data);
        const nuevoTotal = Number(nuevo.retencion_base_mes) + Number(nuevo.retencion_adicional_mes);
        const delta = Number((nuevoTotal - baseTotal).toFixed(2));

        toast[delta === 0 ? "info" : "success"](
        delta === 0
            ? "Recalculado sin variación."
            : `Recalculado. Ajuste ${delta > 0 ? "+" : ""}S/ ${Math.abs(delta).toFixed(2)}.`
        );

        if (form.dni && form.anio) {
          const list = await quintaList({ dni: form.dni, anio: form.anio }); // usa objeto (firma segura)
          const rows = extraerFilas(list?.data?.data || list?.data || []);
          setHistorialVigente(mostrarUltimoRegistroPorMes(rows));
        }
    } catch (err) {
        toast.error(err?.response?.data?.message || "Error al recalcular.");
    }
    }, [
        form.anio,
        form.mes,
        form.fuentePrevios,
        form.certificadoQuinta,
        form.filial_id,
        form.contrato_id,
        form.trabajadorId,
        form.remuneracionMensualActual,
        form.dni,
    ]);

  /* ---------- Effects ---------- */
  useEffect(() => { (async () => {
    try { 
      const { data } = await trabajadoresService.getTrabajadores(); 
      setTrabajadores(data || []); 
    } catch (err) { console.error("Error cargando trabajadores", err); }
  })(); }, []);

  useEffect(() => { (async () => {
    try {
      const data = await empresasService.obtenerEmpresas();
      const list = Array.isArray(data) ? data : (data?.filialesGenerales || data?.data || []);
      setFilialesGenerales(list || []);
    } catch (err) {
      console.error("Error cargando filiales", err);
    }
  })(); }, []);


  useEffect(() => { cargarHistorial(); }, [cargarHistorial]);

  useEffect(() => {
    if (!form.dni || !form.anio || !form.mes) return;
    (async () => {
      try {
        const { data } = await trabajadoresService.getFilialesVigentes(form.dni, form.anio, form.mes);
        const lista = data?.data?.filiales || [];
        setFiliales(lista);
        if (lista.length === 1) {
          const f = lista[0];
          setFormIfChanged(prev => ({ 
            ...prev, 
            filial_id: String(f.filial_id), 
            contrato_id: String(f.contrato_id || ""),
            remuneracionMensualActual: typeof f.sueldo === "number" ? f.sueldo : prev.remuneracionMensualActual,
          }));
        } else {
          setFormIfChanged(prev => ({...prev, filial_id: "", contrato_id: "" }));
        }
      } catch { setFiliales([]); }
    })();
  }, [form.dni, form.anio, form.mes, setFormIfChanged]);

  useEffect(() => {
    if (!canCalcular) return;
    if (!validar()) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      handlePreview();
    }, DEBOUNCE_MS);
    return () => clearTimeout(debounceRef.current);
  }, [canCalcular, previewLlave, handlePreview, validar]);

  useEffect(() => {
    if (!form.dni || !form.anio) return;
    (async () => {
      try {
        const [certificado, sinPrevios] = await Promise.all([
          quintaObtenerCertificado(form.dni, form.anio).catch(() => null),
          quintaObtenerSinPrevios(form.dni, form.anio).catch(() => null),
        ]);

        if (certificado?.data?.data?.found) {
          const c = certificado.data.data;
          setFormIfChanged(prev => {
            const next = {
            ...prev,
            certificadoQuinta: {
              ...prev.certificadoQuinta,
              renta_bruta_total: String(c.renta_bruta_total ?? ""),
              retenciones_previas: String(c.retenciones_previas ?? ""),
              remuneraciones: String(c.remuneraciones ?? ""),
              gratificaciones: String(c.gratificaciones ?? ""),
              asignacion_familiar: String(c.asignacion_familiar ?? ""),
              otros: String(c.otros ?? ""), 
            },
          };
          const aplica = Number(sinPrevios?.data?.data?.aplica_desde_mes || 0);
          const mesN = Number(prev.mes || 0);
          const sinPrevAplicaAhora = sinPrevios?.data?.data?.found && mesN && mesN < aplica;

          if (!sinPrevAplicaAhora && prev.fuentePrevios !== FUENTE_PREVIOS.CERTIFICADO) {
            next.fuentePrevios = FUENTE_PREVIOS.CERTIFICADO;
          }
          return next;
        });
        }

        const declaracionJurada = sinPrevios?.data?.data;
        const aplica = Number(declaracionJurada?.aplica_desde_mes || 0 );
        if (declaracionJurada?.found && form.mes && Number(form.mes) < aplica) {
          setFormIfChanged(prev => ({ ...prev, fuentePrevios: FUENTE_PREVIOS.SIN_PREVIOS }));
        }
      } catch {}
    })();
  }, [form.dni, form.anio, form.mes, setFormIfChanged]);

  const onSoportesGuardado = useCallback(async () => {
    try {
      if (form?.dni && form?.anio) {
        const [cert, sp] = await Promise.all([
          quintaObtenerCertificado(form.dni, form.anio).catch(() => null),
          quintaObtenerSinPrevios(form.dni, form.anio).catch(() => null),
        ]);

        if (cert?.data?.data?.found) {
          const c = cert.data.data;
          setFormIfChanged(prev => ({
            ...prev,
            fuentePrevios: FUENTE_PREVIOS.CERTIFICADO,
            certificadoQuinta: {
              ...prev.certificadoQuinta,
              renta_bruta_total:   String(c.renta_bruta_total     ?? ""),
              retenciones_previas: String(c.retenciones_previas   ?? ""),
              remuneraciones:      String(c.remuneraciones        ?? ""),
              gratificaciones:     String(c.gratificaciones       ?? ""),
              asignacion_familiar: String(c.asignacion_familiar   ?? ""),
              otros:               String(c.otros                 ?? ""),
            },
          }));
        }

        const aplica = Number(sp?.data?.data?.aplica_desde_mes || 0);
        if (sp?.data?.data?.found && form?.mes && Number(form.mes) < aplica) {
          setFormIfChanged(prev => ({ ...prev, fuentePrevios: FUENTE_PREVIOS.SIN_PREVIOS }));
        }
      }
    } catch {}
    if (canCalcular) await handlePreview();
  }, [canCalcular, handlePreview, form?.dni, form?.anio, form?.mes, setFormIfChanged]);

  return {
    form, preview, historial, historialVigente, vigenteDelMes, yaExisteOficialEnMes,
    trabajadores, filiales, loadingPreview, saving, errors,
    handleChange, handleTrabajadorSelect, handleFilialSelect,
    canCalcular, handlePreview, handleGuardar, handleRecalcular,
    onSoportesGuardado, filialesGenerales, setFilialesGenerales,
  };
}