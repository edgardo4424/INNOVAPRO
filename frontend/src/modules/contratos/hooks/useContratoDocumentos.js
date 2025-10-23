import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getPlantillasArbol, searchPlantillas } from "../services/contratoDocumentosService";
import {
  listarHistorialAPI,
  renderDocumentoAPI,
  subirFinalAPI,
  oficializarAPI,
} from "../services/contratoDocumentosService";
import { mapUsoPlantilla } from "../utils/mapUsoPlantilla";

/**
 * Fuente de verdad:
 * - contratoId: por URL
 * - filialId, uso: se toman del contrato/cotización. TODO: integrarlo con tu contexto.
 * - mergeData: JSON armado automáticamente a partir del contrato (editable según rol).
 */
export function useContratoDocumentos({ contratoId }) {
  const location = useLocation();
  const [search] = useSearchParams();

  // Parámetros entrantes (desde tabla o query)
  const navFilialId = location.state?.filialId ?? (search.get("filialId") ? Number(search.get("filialId")) : null);
  const navUsoId    = location.state?.usoId ?? (search.get("usoId") ? Number(search.get("usoId")) : null);
  const navUsoStr   = location.state?.uso ?? (search.get("uso") || "");

  // TODO: traer desde tu contexto del contrato si no vienen por state/query:
  const [filialId, setFilialId] = useState(navFilialId ?? null);
  const [usoId, setUsoId]       = useState(navUsoId ?? null);
  const [uso, setUso]           = useState(navUsoStr ?? ""); // nombre de carpeta
  // JSON de merge (lo precargo con un ejemplo; reemplaza por tu builder real)
  const [mergeData, setMergeData] = useState("{}");

  // Árbol y plantillas
  const [arbol, setArbol] = useState([]);     // Filial -> Usos -> Plantillas
  const [plantillas, setPlantillas] = useState([]);
  const [plantillaId, setPlantillaId] = useState(null);

  // Historial y UI
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generarPdf, setGenerarPdf] = useState(false);
  const refDocx = useRef(null); const refPdf = useRef(null);

  const isDataValid = useMemo(() => {
    try { JSON.parse(mergeData); return true; } catch { return false; }
  }, [mergeData]);

  // 1) Cargar árbol de plantillas (para combos y auto)
  useEffect(() => {
    (async () => {
      try {
        const r = await getPlantillasArbol();
        setArbol(r?.data || []);
      } catch (e) {
        toast.error(e?.response?.data?.message || "No se pudo cargar el árbol de plantillas");
      }
    })();
  }, []);

  // 2) Precargar JSON demo si viene vacío (reemplaza por tu builder real)
  useEffect(() => {
    if (mergeData === "{}") {
      setMergeData(JSON.stringify({
        contrato: { codigo: `CT-${contratoId}` },
        cliente: { razon_social: "CLIENTE DEMO SAC", ruc: "20123456789" },
        obra: { nombre: "OBRA DEMO", direccion: "Dirección de la obra" },
        mostrarCondiciones: true,
        tienePagoAdelantado: true,
        tieneGarantia: false,
        tieneDepositoEnGarantia: false,
        tieneOrdenDeServicio: false,
        plan: "basico" // <- ayuda a mapear AEI
      }, null, 2));
    }
  }, [contratoId]); // eslint-disable-line

  // 3) Historial
  const fetchHistorial = useCallback(async () => {
    try {
      const r = await listarHistorialAPI(contratoId);
      setHistorial(r?.data || []);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Error listando documentos");
    }
  }, [contratoId]);
  useEffect(() => { fetchHistorial(); }, [fetchHistorial]);

  // 4) Autoselección de USO por reglas (si no vino “uso” explícito)
  useEffect(() => {
    if (!filialId || uso) return; // ya definido por navegación
    try {
      const filialMeta = arbol.find(f => f.filial_id === Number(filialId));
      if (!filialMeta) return;
      const inferred = mapUsoPlantilla({
        filialNombre: filialMeta.filial_nombre,
        mergeData: isDataValid ? JSON.parse(mergeData) : {},
      });
      if (inferred) setUso(inferred);
    } catch (_) { /* no-op */ }
  }, [arbol, filialId, uso, mergeData, isDataValid]);

  // 5) Cargar plantillas segun filial/uso (filesystem)
  const reloadPlantillas = useCallback(async () => {
    if (!filialId) return;
    setLoading(true);
    try {
      const r = await searchPlantillas({ filial_id: filialId, uso }); // si uso es null, traerá todas de la filial
      const list = r?.data || [];
      setPlantillas(list);

      // Autoselección si hay 1 sola
      if (!plantillaId && list.length === 1) setPlantillaId(list[0].id);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Error buscando plantillas");
    } finally {
      setLoading(false);
    }
  }, [filialId, uso, plantillaId]);

  useEffect(() => { reloadPlantillas(); }, [reloadPlantillas]);

  // === Acciones ===
  const renderDocumento = useCallback(async () => {
    if (!plantillaId) return toast.error("Selecciona una plantilla");
    if (!isDataValid) return toast.error("JSON inválido");

    setLoading(true);
    try {
      const payload = {
        plantilla_id: plantillaId,
        data: JSON.parse(mergeData),
        generarPdf,
        nombreBase: `contrato-${contratoId}`,
      };
      const r = await renderDocumentoAPI(contratoId, payload);
      toast.success("Documento generado");
      setHistorial(prev => [r.documento, ...prev]);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Error generando documento");
    } finally {
      setLoading(false);
    }
  }, [plantillaId, isDataValid, mergeData, generarPdf, contratoId]);

  const subirFinal = useCallback(async () => {
    const docx = refDocx.current?.files?.[0] || null;
    const pdf  = refPdf.current?.files?.[0] || null;
    if (!docx && !pdf) return toast.error("Sube DOCX o PDF final");

    setLoading(true);
    try {
      const r = await subirFinalAPI(contratoId, { docx, pdf });
      toast.success("Contrato final agregado");
      setHistorial(prev => [r.documento, ...prev]);
      if (refDocx.current) refDocx.current.value = "";
      if (refPdf.current) refPdf.current.value = "";
    } catch (e) {
      toast.error(e?.response?.data?.message || "Error subiendo contrato final");
    } finally {
      setLoading(false);
    }
  }, [contratoId]);

  const oficializar = useCallback(async () => {
    if (!window.confirm("¿Confirmas oficializar el contrato? Solo si ya está firmado por el cliente.")) return;
    setLoading(true);
    try {
      await oficializarAPI(contratoId); // <- backend por implementar
      toast.success("Contrato oficializado");
      await fetchHistorial();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Error al oficializar");
    } finally {
      setLoading(false);
    }
  }, [contratoId, fetchHistorial]);

  // === Derivados ===
  const oficializado = useMemo(() => {
    // Criterio simple: si la última versión es "final" y hay PDF, lo consideramos oficializado (ajústalo cuando Luis haga el endpoint real).
    const last = historial?.[0];
    return Boolean(last && last.estado === "final");
  }, [historial]);

  const ui = {
    refDocx, refPdf,
    buttonGenerar: loading ? "Generando..." : "Generar DOCX",
    buttonSubir: loading ? "Subiendo..." : "Subir versión final",
    buttonOficializar: loading ? "Procesando..." : "Oficializar",
  };

  const state = {
    contratoId, filialId, usoId, uso,
    setUso, plantillas, plantillaId, setPlantillaId,
    mergeData, setMergeData, generarPdf, setGenerarPdf,
    historial, loading, arbol,
  };

  const actions = {
    reloadPlantillas,
    renderDocumento,
    subirFinal,
    oficializar,
    setUso,
    setFilialId, setUsoId,
  };

  const derived = { isDataValid, oficializado };

  return { ui, state, actions, derived };
}