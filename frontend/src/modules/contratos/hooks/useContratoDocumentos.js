import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getResumenYHistorialAPI,
  renderDocumentoAPI,
  subirFinalAPI,
  oficializarAPI,
} from "../services/contratoDocumentosService";

export function useContratoDocumentos({ contratoId }) {
  const location = useLocation();

  const codigo_contrato = location.state.codigo_contrato ?? null;

  // ==== STATE PRINCIPAL ====
  const [codigoContrato, setCodigoContrato] = useState(codigo_contrato ?? "");
  const [filialId, setFilialId] = useState(null);
  const [usoId, setUsoId] = useState(null);
  const [oficializadoFlag, setOficializadoFlag] = useState(false);
  const [docxGenerado, setDocxGenerado] = useState(null); // última URL generada por /render

  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(false);

  // Refs de inputs
  const refDocx = useRef(null);
  const refPdf = useRef(null);

  // ==== CARGA INICIAL: resumen + historial ====
  const fetchResumenYHistorial = useCallback(async () => {
    try {
      const r = await getResumenYHistorialAPI(contratoId);
      const respuesta = r.respuesta;

      setCodigoContrato(respuesta?.resumen?.codigo_contrato || "");
      setFilialId(respuesta?.resumen?.filial_id ?? null);
      setUsoId(respuesta?.resumen?.uso_id ?? null);
      setOficializadoFlag(Boolean(respuesta?.resumen?.oficializado));
      setDocxGenerado(respuesta?.resumen?.docx_ultimo_url || null);
      setHistorial(Array.isArray(respuesta?.historial) ? respuesta.historial : []);
    } catch (e) {
      toast.error(e?.response?.data?.error || "Error cargando documentos del contrato");
    }
  }, [contratoId]);

  useEffect(() => {
    fetchResumenYHistorial();
  }, [fetchResumenYHistorial]);

  // ==== ACCIONES ====
  const renderDocumento = useCallback(async () => {
    setLoading(true);
    try {
      const r = await renderDocumentoAPI(contratoId);
      // r: { documento: {...}, docx_url: "..." }
      if (r?.documento) {
        setHistorial(prev => [r.documento, ...prev]);
      }
      if (r?.docx_url) setDocxGenerado(r.docx_url);
      toast.success("Documento Word generado correctamente.");
    } catch (e) {
      toast.error(e?.response?.data?.error || "Error generando el documento");
    } finally {
      setLoading(false);
    }
  }, [contratoId]);

  const subirFinal = useCallback(async () => {
    const docx = refDocx.current?.files?.[0] || null;
    const pdf = refPdf.current?.files?.[0] || null;
    if (!docx && !pdf) return toast.error("Sube el archivo final (.docx o .pdf)");

    setLoading(true);
    try {
      const r = await subirFinalAPI(contratoId, { docx, pdf });
      // r: { documento: {...} }
      if (r?.documento) setHistorial(prev => [r.documento, ...prev]);
      if (refDocx.current) refDocx.current.value = "";
      if (refPdf.current) refPdf.current.value = "";
      toast.success("Versión final cargada.");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Error subiendo la versión final");
    } finally {
      setLoading(false);
    }
  }, [contratoId]);

  const oficializar = useCallback(async () => {
    if (!window.confirm("¿Confirmas oficializar el contrato? Asegúrate de que ya esté firmado.")) return;
    setLoading(true);
    try {
      const r = await oficializarAPI(contratoId);
      // r: { ok: true, documento: {...}, oficializado: true }
      if (r?.documento) setHistorial(prev => [r.documento, ...prev]);
      if (typeof r?.oficializado === "boolean") setOficializadoFlag(r.oficializado);
      toast.success("Contrato oficializado.");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Error al oficializar el contrato");
    } finally {
      setLoading(false);
    }
  }, [contratoId]);

  // ==== DERIVADOS/UI ====
  const oficializado = useMemo(() => oficializadoFlag, [oficializadoFlag]);

  const ui = {
    refDocx,
    refPdf,
    buttonGenerar: loading ? "Generando..." : "Generar Documento Word",
    buttonSubir: loading ? "Subiendo..." : "Subir versión final",
    buttonOficializar: loading ? "Procesando..." : "Oficializar",
  };

  const state = {
    contratoId,
    codigoContrato,
    filialId,
    usoId,
    docxGenerado,
    historial,
    loading,
  };

  const actions = {
    renderDocumento,
    subirFinal,
    oficializar,
    setFilialId,
    setUsoId,
  };

  const derived = { oficializado };

  return { ui, state, actions, derived };
}