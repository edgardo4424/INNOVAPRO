import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { 
  quintaPreview, quintaCrear, quintaList, quintaRecalc, 
  quintaObtenerMulti, quintaObtenerCertificado, quintaObtenerSinPrevios
} from "../service/quintaService";
import trabajadoresService from "@/modules/trabajadores/services/trabajadoresService"; // Para traernos todos los trabajadores

import { FUENTE_PREVIOS, DEBOUNCE_MS } from "../utils/quinta.constants";
import {
  normalizarFuentePrevios,
  normalizarCalculo,
  mostrarUltimoRegistroPorMes,
  extraerFilas
} from "../utils/quinta.mappers";
import { validarFormularioQuinta } from "../utils/quinta.validators";

// Aquí va toda la lógica del frontend de retención de quinta categoría
// El usuario elige año, mes y trabajador. En ese instante, el hook prepara el formulario fuente: el número de documento y la remuneración vigente desde el trabajador elegido; 
// luego, con un debounce quirúrgico, solicita una previsualización al backend. “Muéstrame qué tocaría retener este mes si oficializo”.
// Cuando la UI quiere guardar como oficial, el hook valida el formulario (año, mes, trabajador, remuneración; 
// y si se marcó CERTIFICADO, que los números existan) y dispara quintaCrear. 
// Si existe un registro vigente y el usuario elige recalcular, el hook usa quintaRecalc para crear un nuevo asiento con es_recalculo = true, compara deltas y notifica el ajuste.
 
// El hook toma la fuente de ingresos previos (AUTO, CERTIFICADO, SIN_PREVIOS) y 
// normaliza: si es CERTIFICADO, convierte cada campo a Number para que el backend reciba enteros/decimales, nunca cadenas. 
// Además, cuando trae el historial, colapsa por mes para mostrarnos el último cálculo vigente por cada mes (sea original o recálculo), que es lo que la gerencia espera ver.
// Al final, este hook entrega al componente todo en bandeja: datos listos para pintar y acciones listas para ejecutar.


/**
 * @typedef {Object} CertificadoQuinta
 * @property {string|number} renta_bruta_total
 * @property {string|number} retenciones_previas
 * @property {string|number} [remuneraciones]
 * @property {string|number} [asignacion_familiar]
 * @property {string|number} [vacaciones]
 * @property {string|number} [gratificaciones]
 * @property {string|number} [otros]
 */

export function useQuintaCategoria() {
  const [form, setForm] = useState({
    anio: "",
    mes: "",
    trabajadorId: null,
    filial_id: "",
    contrato_id: "",
    dni: "",
    remuneracionMensualActual: "",
    fuentePrevios: FUENTE_PREVIOS.AUTO, // AUTO | CERTIFICADO | SIN PREVIOS
    /** @type {CertificadoQuinta} */
    certificadoQuinta: {
      renta_bruta_total: "",
      retenciones_previas: "",
      remuneraciones: "",
      asignacion_familiar: "",
      vacaciones: "",
      gratificaciones: "",
      otros: ""
    }
  });

  const [preview, setPreview] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [historialVigente, setHistorialVigente] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);
  const [filiales, setFiliales] = useState([]);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [soportesOpen, setSoportesOpen] = useState(false);
  const [soportesMode, setSoportesMode] = useState("AUTO");

  const debounceRef = useRef(null);
  const reqSeqRef = useRef(0); // Para ignorar respuestas atrasadas

  // Selectores y banderas
  // Habilitador de la acción de calcular para evitar llamadas innecesarias
  const canCalcular = useMemo(
    () => !!form.anio && !!form.mes && !!form.trabajadorId && !!form.filial_id, 
    [form.anio, form.mes, form.trabajadorId, form.filial_id]
  );

  const vigenteDelMes = useMemo(
    () => historialVigente.find(r => r.mes === Number(form.mes)),
    [historialVigente, form.mes]
  );

  const yaExisteOficialEnMes = Boolean(vigenteDelMes);

  // Validaciones antes de calcular o guardar
  const validar = useCallback(() => {
    const { ok, errors } = validarFormularioQuinta(form);
    setErrors(errors);
    return ok;
  }, [form]);

  // Limpiar la previsualización 
  const resetPreview = useCallback(() => setPreview(null), []);

  // Manejadores 
  const handleChange = useCallback((llave, valor) => {
    setForm(prev => ({ ...prev, [llave]: valor }))
  }, []);

  const handleFilialSelect = useCallback((value, filialObj) => {
    const seleccionado = filialObj || filiales.find(f => String(f.filial_id) === String(value));
    if (!seleccionado) return;
    setForm(prev => ({
      ...prev,
      filial_id: String(seleccionado.filial_id),
      contrato_id: String(seleccionado.contrato_id || ""),
      // si quieres mostrar el sueldo de ese contrato en el input de solo lectura:
      remuneracionMensualActual: seleccionado.sueldo ?? prev.remuneracionMensualActual,
    }));
  }, [filiales]);

  const openSoportes = useCallback((mode = "AUTO") => {
    setSoportesMode(mode);
    if (mode === "AUTO") handleChange("fuentePrevios", "AUTO");
    if (mode === "CERTIFICADO") handleChange("fuentePrevios", "CERTIFICADO");
    if (mode === "SIN_PREVIOS") handleChange("fuentePrevios", "SIN_PREVIOS");
    setSoportesOpen(true);
  }, [handleChange]);

  const closeSoportes = useCallback(() => setSoportesOpen(false), []);

  // Construímos el payload para el backend
  const crearPayload = useCallback((base = form) => {
    // Tomamos el formulario actual y desestructuramos
    const { fuentePrevios, certificadoQuinta, filial_id, contrato_id, ...rest } = base;
    // Pasamos al payload las fuentes previas normalizadas como se espera en el backend | AUTO | CERTIFICADO | SIN_PREVIOS |
    const payload = { 
      ...rest, 
      fuentePrevios: normalizarFuentePrevios(fuentePrevios),
      filialId: filial_id ? Number(filial_id) : undefined,
      contratoId: contrato_id ? Number(contrato_id) : undefined,
    };
    // Si la fuente previa es CERTIFICADO convertimos todo a number para los cálculos del backend
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

  // función para traernos la previsualización
  const previsualizacionSegura = useCallback(async (payload) => {
    const reqId = ++reqSeqRef.current;
    try {
      setLoadingPreview(true);
      const { data } = await quintaPreview(payload);
      // Ignora respuestas viejas si llegó otra más reciente
      if (reqId !== reqSeqRef.current) return;
      setPreview(data.data);
      
      setForm(prev => {
        if (prev.remuneracionMensualActual === data.data.entradas.remuneracion_mensual) {
          return prev; // no hay cambio → no renderiza
        }
        return {
          ...prev,
          remuneracionMensualActual: data.data.entradas.remuneracion_mensual || "",
        };
      });
    } catch (err) {
      if (reqId !== reqSeqRef.current) return;
      console.error(err);
      const msg = err?.response?.data?.message || "Error al calcular proyección.";
      toast.error(msg);
    } finally {
      if (reqId === reqSeqRef.current) setLoadingPreview(false);
    }
  }, []);

  const handleTrabajadorSelect = useCallback((id) => {
    const intId = Number(id);
    const trabajador = trabajadores.find(trab => Number(trab.id) === intId);
    if (!trabajador) return;
    
    const sueldo = trabajador?.contrato_mas_antiguo?.sueldo ?? 0;
    setForm(prev => ({
      ...prev,
      trabajadorId: intId,
      dni: trabajador.numero_documento || trabajador.dni || "",
    }));
  }, [trabajadores]);

  const handlePreview = useCallback(async () => {
    if (!validar()) return;
    await previsualizacionSegura(crearPayload());
  }, [validar, previsualizacionSegura, crearPayload]);

  // Función para guardar registro en base de datos para alimentar la planilla y reportes
  const handleGuardar = useCallback(async () => {
    if (!validar()) return;
    try {
      setSaving(true);
      await quintaCrear(crearPayload());
      toast.success("Cálculo guardado correctamente");
      setPreview(null);
      await cargarHistorial();
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || "Error al guardar cálculo oficial.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }, [validar, crearPayload]);

  // Función para recalcular si hay cambios en contratos o reglas del negocio 
  // mantenemos trazabilidad con es_recalculo 
  const handleRecalcular = useCallback(async (row) => {
    if (!row?.id) return;

    const ok = window.confirm(
      "Esto volverá a liquidar ese mes con las reglas y contrato vigentes y creará un nuevo registro marcado como recálculo. ¿Continuar?"
    );
    if(!ok) return;

    try {
      const baseTotal = Number(row.retencion_base_mes) + Number(row.retencion_adicional_mes);

      // Respetamos la fuente seleccionada por el usuario
      const payload = {
        fuentePrevios: form.fuentePrevios,
        certificadoQuinta:
          form.fuentePrevios === FUENTE_PREVIOS.CERTIFICADO ? form.certificadoQuinta ?? null : null,
        // para forzar el sueldo en el recálculo descomentamos abajo
        // remuneracionMensualActual: Number(form.remuneracionMensualActual) || undefined,
      };

      /* setLoadingPreview(true); */
      const { data } = await quintaRecalc(row.id, payload);
      const nuevo = normalizarCalculo(data.data); // registro recién creado (es_recalculo=true en backend)

      const nuevoTotal = Number(nuevo.retencion_base_mes) + Number(nuevo.retencion_adicional_mes);
      const delta = Number((nuevoTotal - baseTotal).toFixed(2));

      // Insertamos el nuevo arriba y evitamos duplicar si el backend devuelve el mismo id
      setHistorial((prev) => {
        const rows = [nuevo, ...prev];
        setHistorialVigente(mostrarUltimoRegistroPorMes(rows));
        return rows;
      });

      if (delta === 0) {
        toast.info("Recalculado sin variación en la retención.");
      } else {
        const signo = delta > 0 ? "+" : "";
        toast.success(`Recalculado. Ajuste ${signo}S/ ${Math.abs(delta).toFixed(2)} vs. registro original.`);
      }
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || "Error al recalcular.";
      toast.error(msg);
    }
  }, [form.fuentePrevios, form.certificadoQuinta /*, form.remuneracionMensualActual */]);
    
  const cargarHistorial = useCallback(async () => {
    if (!form.dni || !form.anio) return;
    try {
      const { data } = await quintaList({ dni: form.dni, anio: form.anio });
      const rows = extraerFilas(data);
      setHistorial(rows.map(normalizarCalculo));
      setHistorialVigente(mostrarUltimoRegistroPorMes(rows));
    } catch (err) {
      console.error(err);
    }
  }, [form.dni, form.anio]);

  const cargarTrabajadores = useCallback(async () => {
    try {
      const { data } = await trabajadoresService.getTrabajadores();
      setTrabajadores(data || []);
    } catch (err) {
      console.error("Error al cargar trabajadores", err);
    }
  }, []);

  // USE EFFECTS
  // Inicial
  useEffect(() => { cargarTrabajadores(); }, [cargarTrabajadores]);

  // Refrescar historial cuando cambia documento o año 
  useEffect(() => { cargarHistorial(); }, [cargarHistorial]);

  // Cargar filiales cuando haya dni, anio y mes
  useEffect(() => {
    if (!form.dni || !form.anio || !form.mes) return;
    (async () => {
      try {
        const { data } = await trabajadoresService.getFilialesVigentes(form.dni, form.anio, form.mes);
        const lista = data?.data?.filiales || [];
        setFiliales(lista);

        // Si sólo hay una, autoselección
        if (lista.length === 1) {
          const f = lista[0];
          handleFilialSelect(String(f.filial_id), f);
        } else {
          // Si cambió el periodo, limpia selección previa para evitar inconsistencias
          setForm(prev => ({ ...prev, filial_id: "", contrato_id: "" }));
        }
      } catch (e) {
        setFiliales([]);
      }
    })();
  }, [form.dni, form.anio, form.mes]);

  // Recalcular automaticamente cuando cambia la fuente (AUTO/CERTIFICADO/SIN_PREVIOS)
  useEffect(() => {
    if (!form.trabajadorId || !form.anio || !form.mes) return;
    if (!validar()) return;

    // Debounce para evitar spam al alternar
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      previsualizacionSegura(crearPayload());
    }, DEBOUNCE_MS);

    return () => clearTimeout(debounceRef.current);
  }, [
    form.trabajadorId,
    form.anio,
    form.mes,
    form.filial_id,
    form.fuentePrevios,
    form.certificadoQuinta,
    validar,
    previsualizacionSegura,
    crearPayload,
  ]);

  // Al seleccionar trabajador/año, pre-carga soportes (certificado / sin-prev / multi)
  useEffect(() => {
    if (!form.dni || !form.anio) return;
    (async () => {
      try {
        const [certificado, sinPrevios /*, multiRes */] = await Promise.all([
          quintaObtenerCertificado(form.dni, form.anio).catch(() => null),
          quintaObtenerSinPrevios(form.dni, form.anio).catch(() => null),
          // multi se usa informativo; el cálculo ya lo consume en backend si corresponde
          //quintaObtenerMulti(form.dni, form.anio).catch(() => null),
        ]);
        if (certificado?.data?.data?.found) {
          const certificadoData = certificado.data.data;
          setForm(prev => ({ 
            ...prev, 
            certificadoQuinta: {
              renta_bruta_total: certificadoData.renta_bruta_total,
              retenciones_previas: certificadoData.retenciones_previas,
              ...(certificadoData.detalle_json || {})
          }}));
        }
        if (sinPrevios?.data?.data?.found) {
          // si hay Declaracion jurada de “sin previos”, selecciona la fuente automáticamente
          setForm(prev => ({ ...prev, fuentePrevios: FUENTE_PREVIOS.SIN_PREVIOS }));
        }
      } catch (error) { /* silencioso */ }
    })();
  }, [form.dni, form.anio]);

  // callback cuando guardan en modal que refresca certificado y dispara preview
  const onSoportesGuardado = useCallback(async ({ certificado, sinPrevios }) => {
    if (sinPrevios) {
      setForm(prev => ({ ...prev, fuentePrevios: FUENTE_PREVIOS.SIN_PREVIOS }));
    } else if (certificado && (certificado.renta_bruta_total || certificado.retenciones_previas)) {
      setForm(prev => ({
        ...prev,
        fuentePrevios: FUENTE_PREVIOS.CERTIFICADO,
        certificadoQuinta: {
          ...prev.certificadoQuinta,
          renta_bruta_total: certificado.renta_bruta_total,
          retenciones_previas: certificado.retenciones_previas
        }
      }));
    }
    // recalcula preview
    if (form.trabajadorId && form.anio && form.mes) {
      const payload = crearPayload();
      await previsualizacionSegura(payload);
    }
  }, [form.trabajadorId, form.anio, form.mes, crearPayload, previsualizacionSegura]);

  return {
    form,
    handleChange,
    preview,
    resetPreview,
    historial,
    historialVigente,
    vigenteDelMes,
    yaExisteOficialEnMes,
    trabajadores,
    handleTrabajadorSelect,
    filiales,
    handleFilialSelect,
    canCalcular,
    handlePreview,
    handleGuardar,
    handleRecalcular,
    soportesOpen,
    soportesMode,
    openSoportes,
    closeSoportes,
    onSoportesGuardado,
    loadingPreview,
    saving,
    errors,
  };
}