// INNOVA PRO+ v1.2.0
import { useCallback, useEffect, useRef, useState } from "react";
import { quintaObtenerCertificado, quintaGuardarCertificado } from "../service/quintaService";
import { uploadQuintaArchivo } from "../service/archivosService";

export default function useCertificadoQuinta({ open, dni, anio }) {
  const [loading, setLoading] = useState(false);

  // Campos editables
  const [remuneraciones, setRemuneraciones] = useState("");
  const [gratificaciones, setGratificaciones] = useState("");
  const [asignacionFamiliar, setAsignacionFamiliar] = useState("");
  const [otros, setOtros] = useState("");

  const [retCert, setRetCert] = useState("");   // retenciones previas
  const [archivoUrl, setArchivoUrl] = useState("");
  const [archivoFile, setArchivoFile] = useState(null);

  const loadedRef = useRef(false);

  const rentaCert = (() => {
    const r = Number(remuneraciones || 0);
    const g = Number(gratificaciones || 0);
    const af = Number(asignacionFamiliar || 0);
    const o = Number(otros || 0);
    const total = r + g + af + o;
    return total > 0 ? String(Number(total.toFixed(2))) : "0";
  })();

  const setIfChanged = (curr, next, setter) => {
    if (curr !== next) setter(next);
  };

  const fetchExistente = useCallback(async () => {
    if (!dni || !anio) return;
    setLoading(true);
    try {
      const { data } = await quintaObtenerCertificado(dni, anio);
      const c = data?.data;
      if (data?.ok && c?.found) {
        setIfChanged(remuneraciones, String(c.remuneraciones ?? ""), setRemuneraciones);
        setIfChanged(gratificaciones, String(c.gratificaciones ?? ""), setGratificaciones);
        setIfChanged(asignacionFamiliar, String(c.asignacion_familiar ?? ""), setAsignacionFamiliar);
        setIfChanged(otros, String(c.otros ?? ""), setOtros);
        setIfChanged(retCert, String(c.retenciones_previas ?? ""), setRetCert);
        setIfChanged(archivoUrl, c.archivo_url || "", setArchivoUrl);
      }
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dni, anio]);

  useEffect(() => {
    if (!open) return;
    // Permite recargar al cambiar dni/anio mientras esté visible
    loadedRef.current = false;
  }, [open, dni, anio]);

  useEffect(() => {
    if (!open || loadedRef.current) return;
    loadedRef.current = true;
    fetchExistente();
  }, [open, fetchExistente]);

  const onArchivoChange = (file) => {
    setArchivoFile(file || null);
  };

  const save = useCallback(async () => {
    if (!dni || !anio) return;
    setLoading(true);
    try {
      let finalUrl = archivoUrl || null;
      if (archivoFile) {
        const url = await uploadQuintaArchivo("certificado", dni, anio, archivoFile);
        if (url) finalUrl = url;
      }
      await quintaGuardarCertificado({
        dni,
        anio,
        renta_bruta_total: Number(rentaCert || 0),
        remuneraciones: Number(remuneraciones || 0),
        gratificaciones: Number(gratificaciones || 0),
        asignacion_familiar: Number(asignacionFamiliar || 0),
        otros: Number(otros || 0),
        retenciones_previas: Number(retCert || 0),
        archivo_url: finalUrl,
      });
      return { ok: true, archivo_url: finalUrl };
    } finally {
      setLoading(false);
    }
  }, [dni, anio, rentaCert, remuneraciones, gratificaciones, asignacionFamiliar, otros, retCert, archivoUrl, archivoFile]);

  return {
    // valores que consume el modal
    rentaCert,
    retCert, setRetCert,
    remuneraciones, setRemuneraciones,
    gratificaciones, setGratificaciones,
    asignacionFamiliar, setAsignacionFamiliar,
    otros, setOtros,
    archivoUrl,
    onArchivoChange,
    save,
    loading,
  };
}