import { useCallback, useEffect, useRef, useState } from "react";
import { quintaObtenerMulti, quintaGuardarMulti } from "../service/quintaService";
import { uploadQuintaArchivo } from "../service/archivosService";

/**
 * Hook simple y consistente con el backend actual:
 * - aplica_desde_mes (1..12)
 * - es_secundaria (bool) => si true, no retenemos
 * - principal_ruc / principal_nombre (opcional si no es secundaria)
 * - observaciones
 * - archivo_url (soporte)
 */
export default function useMultiempleo({ open, dni, anio }) {
  const [loading, setLoading] = useState(false);

  const [aplica_desde_mes, setAplicaDesdeMes] = useState("");
  const [es_secundaria, setEsSecundaria] = useState(false);
  const [principal_ruc, setPrincipalRuc] = useState("");
  const [principal_nombre, setPrincipalNombre] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const [archivoUrl, setArchivoUrl] = useState("");
  const [archivoFile, setArchivoFile] = useState(null);

  const loadedRef = useRef(false);

  const fetchExistente = useCallback(async () => {
    if (!dni || !anio) return;
    setLoading(true);
    try {
      const { data } = await quintaObtenerMulti(dni, anio);
      const d = data?.data;
      if (data?.ok && d?.found) {
        setAplicaDesdeMes(String(d.aplica_desde_mes ?? ""));
        setEsSecundaria(!!d.es_secundaria);
        setPrincipalRuc(d.principal_ruc || "");
        setPrincipalNombre(d.principal_nombre || "");
        setObservaciones(d.observaciones || "");
        setArchivoUrl(d.archivo_url || "");
      }
    } finally {
      setLoading(false);
    }
  }, [dni, anio]);

  useEffect(() => {
    if (!open) return;
    // Permite recargar al cambiar dni/anio mientras está visible
    loadedRef.current = false;
  }, [open, dni, anio]);

  useEffect(() => {
    if (!open || loadedRef.current) return;
    loadedRef.current = true;
    fetchExistente();
  }, [open, fetchExistente]);

  const onArchivoChange = (file) => setArchivoFile(file || null);

  const save = useCallback(async () => {
    if (!dni || !anio) return;
    setLoading(true);
    try {
      let finalUrl = archivoUrl || null;
      if (archivoFile) {
        const url = await uploadQuintaArchivo("multiempleo", dni, anio, archivoFile);
        if (url) finalUrl = url;
      }
      await quintaGuardarMulti({
        dni,
        anio,
        aplica_desde_mes: Number(aplica_desde_mes || 0),
        es_secundaria: !!es_secundaria,
        principal_ruc: es_secundaria ? null : (principal_ruc || null),
        principal_nombre: es_secundaria ? null : (principal_nombre || null),
        observaciones: observaciones || null,
        archivo_url: finalUrl,
      });
      return { ok: true, archivo_url: finalUrl };
    } finally {
      setLoading(false);
    }
  }, [dni, anio, aplica_desde_mes, es_secundaria, principal_ruc, principal_nombre, observaciones, archivoUrl, archivoFile]);

  return {
    loading,
    aplica_desde_mes, setAplicaDesdeMes,
    es_secundaria, setEsSecundaria,
    principal_ruc, setPrincipalRuc,
    principal_nombre, setPrincipalNombre,
    observaciones, setObservaciones,
    archivoUrl,
    onArchivoChange,
    save,
  };
}