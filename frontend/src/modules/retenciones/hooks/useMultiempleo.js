import { useCallback, useEffect, useRef, useState } from "react";
import { quintaObtenerMulti, quintaGuardarMulti } from "../service/quintaService";
import { uploadQuintaArchivo } from "../service/archivosService";
import { toast } from "react-toastify";

export default function useMultiempleo({ open, dni, anio, filiales = [], currentFilialId }) {
  const [loading, setLoading] = useState(false);

  // Campos del esquema
  const [aplica_desde_mes, setAplicaDesdeMes] = useState(""); // "" = todo el año
  const [es_secundaria, setEsSecundaria] = useState(false);

  const [renta_bruta_otros_anual, setRentaOtros] = useState("");
  const [retenciones_previas_otros, setRetOtros] = useState("");

  const [principal_ruc, setPrincipalRuc] = useState("");
  const [principal_razon_social, setPrincipalRazon] = useState("");

  const [filial_principal_id, setFilialPrincipalId] = useState("");

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

        setRentaOtros(String(d.renta_bruta_otros_anual ?? ""));
        setRetOtros(String(d.retenciones_previas_otros ?? ""));

        setPrincipalRuc(d.principal_ruc || "");
        setPrincipalRazon(d.principal_razon_social || "");

        setFilialPrincipalId(d.filial_principal_id ? String(d.filial_principal_id) : "");

        setObservaciones(d.observaciones || "");
        setArchivoUrl(d.archivo_url || "");
      } else {
        if (currentFilialId) setFilialPrincipalId(String(currentFilialId));
      }
    } finally {
      setLoading(false);
    }
  }, [dni, anio, currentFilialId]);

  useEffect(() => { if (!open) return; loadedRef.current = false; }, [open, dni, anio]);

  useEffect(() => {
    if (!open || loadedRef.current) return;
    loadedRef.current = true;
    fetchExistente();
  }, [open, fetchExistente]);

  const onArchivoChange = (file) => setArchivoFile(file || null);

  const save = useCallback(async () => {
    if (!dni || !anio) {
      toast.error("Faltan datos del trabajador (DNI/Año).");
      return { ok: false };
    }

    setLoading(true);
    try {
      let finalUrl = archivoUrl || null;

      // 1) Subir archivo si existe
      if (archivoFile) {
        try {
          const url = await uploadQuintaArchivo("multiempleo", dni, anio, archivoFile);
          if (url) finalUrl = url;
        } catch (err) {
          toast.error(err.message || "No pudimos subir el archivo. Revisa el tamaño y el formato.", {
            autoClose: 6000,
          });
          return { ok: false };
        }
      }

      // 2) Guardar DJ
      const payload = {
        dni,
        anio,
        aplica_desde_mes: (aplica_desde_mes === "" ? null : Number(aplica_desde_mes)),
        es_secundaria: !!es_secundaria,

        renta_bruta_otros_anual: Number(renta_bruta_otros_anual || 0),
        retenciones_previas_otros: Number(retenciones_previas_otros || 0),

        principal_ruc: principal_ruc || null,
        principal_razon_social: principal_razon_social || null,

        filial_principal_id: filial_principal_id ? Number(filial_principal_id) : null,

        observaciones: observaciones || null,
        archivo_url: finalUrl,
      };

      try {
        await quintaGuardarMulti(payload);
        toast.success("Declaración de multiempleo guardada. Se aplicará desde el mes configurado.", {
          autoClose: 4000,
        });
        return { ok: true, archivo_url: finalUrl };
      } catch (err) {
        const msg = err?.response?.data?.message || err?.message || "No se pudo guardar la declaración.";
        toast.error(msg, { autoClose: 6000 });
        return { ok: false };
      }
    } finally {
      setLoading(false);
    }
  }, [
    dni, anio,
    aplica_desde_mes, es_secundaria,
    renta_bruta_otros_anual, retenciones_previas_otros,
    principal_ruc, principal_razon_social,
    filial_principal_id,
    observaciones, archivoUrl, archivoFile
  ]);

  return {
    loading,
    aplica_desde_mes, setAplicaDesdeMes,
    es_secundaria, setEsSecundaria,

    renta_bruta_otros_anual, setRentaOtros,
    retenciones_previas_otros, setRetOtros,

    principal_ruc, setPrincipalRuc,
    principal_razon_social, setPrincipalRazon,

    filial_principal_id, setFilialPrincipalId,

    observaciones, setObservaciones,

    archivoUrl, onArchivoChange,
    save,
  };
}