import { useCallback, useEffect, useMemo, useState } from "react";
import { quintaObtenerMulti, quintaGuardarMulti } from "../service/quintaService";
import { uploadQuintaArchivo } from "../service/archivosService";

const toNumber = (v) => {
  const n = Number(String(v ?? "").toString().replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
};

export function useMultiempleo({ open, dni, anio, currentFilialId }) {
  const [loading, setLoading] = useState(false);

  // Cabecera
  const [filialPrincipalId, setFilialPrincipalId] = useState("");
  const [somosPrincipal, setSomosPrincipal] = useState(false);
  const [somosSecundario, setSomosSecundario] = useState(false);

  // Archivo
  const [archivo, setArchivo] = useState(null);
  const [archivoUrl, setArchivoUrl] = useState("");

  // Detalles (internos + externos)
  const [detalles, setDetalles] = useState([]);

  const onArchivoChange = useCallback((file) => setArchivo(file || null), []);

  const reset = useCallback(() => {
    setFilialPrincipalId("");
    setSomosPrincipal(false);
    setSomosSecundario(false);
    setArchivo(null);
    setArchivoUrl("");
    setDetalles([]);
  }, []);

  useEffect(() => {
    if (!open || !dni || !anio) return;
    (async () => {
      setLoading(true);
      try {
        const resp = await quintaObtenerMulti(dni, anio).catch(() => null);
        if (resp?.data?.data?.found) {
          const multi = resp.data.data;
          setFilialPrincipalId(multi.filial_principal_id ? String(multi.filial_principal_id) : "");
          setSomosPrincipal(Boolean(multi.detalle_json?.somos_principal));
          setSomosSecundario(Boolean(multi.detalle_json?.somos_secundario_no_retiene));
          setArchivoUrl(multi.archivo_url || "");
          setDetalles(
            Array.isArray(multi.detalles)
              ? multi.detalles.map((d) => ({
                  tipo: d.tipo || "EXTERNO",
                  filial_id: d.filial_id ?? "",
                  empleador_ruc: d.empleador_ruc ?? "",
                  empleador_nombre: d.empleador_nombre ?? "",
                  renta_bruta_anual: String(d.renta_bruta_anual ?? "0"),
                  retenciones_previas: String(d.retenciones_previas ?? "0"),
                }))
              : []
          );
        } else {
          reset();
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [open, dni, anio, reset]);

  // Opciones para el select de principal (solo filiales internas)
  const filialesDetectadas = useMemo(
    () =>
      detalles
        .filter((d) => d.tipo === "FILIAL" && d.filial_id)
        .map((d) => ({ value: String(d.filial_id), label: `Filial ${d.filial_id}` })),
    [detalles]
  );

  const addExterno = useCallback(() => {
    setDetalles((prev) => [
      ...prev,
      {
        tipo: "EXTERNO",
        empleador_ruc: "",
        empleador_nombre: "",
        renta_bruta_anual: "0",
        retenciones_previas: "0",
      },
    ]);
  }, []);

  const updateDetalle = useCallback((idx, campo, valor) => {
    setDetalles((prev) => prev.map((d, i) => (i === idx ? { ...d, [campo]: valor } : d)));
  }, []);

  const removeDetalle = useCallback((idx) => {
    setDetalles((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const save = useCallback(async () => {
    setLoading(true);
    try {
      if (somosPrincipal && !filialPrincipalId){
        setLoading(false);
        throw new Error("Debes seleccionar la filial principal cuando 'somos principal' está acivo.");
      }
      
      // Upload archivo — verifica en archivosService que use formData.append('file', file)
      let url = archivoUrl;
      if (archivo) {
        url = await uploadQuintaArchivo("multiempleo", dni, anio, archivo);
        setArchivoUrl(url || "");
      }

      // Normalizar payload
      const payload = {
        dni,
        anio: Number(anio),
        filial_principal_id: filialPrincipalId ? Number(filialPrincipalId) : null,
        archivo_url: url || null,
        detalle_json: {
          somos_principal: Boolean(somosPrincipal),
          somos_secundario_no_retiene: Boolean(somosSecundario),
        },
        detalles: detalles.map((d) => ({
          tipo: d.tipo,
          filial_id: d.tipo === "FILIAL" && d.filial_id ? Number(d.filial_id) : null,
          empleador_ruc: d.tipo === "EXTERNO" ? d.empleador_ruc : null,
          empleador_nombre: d.tipo === "EXTERNO" ? d.empleador_nombre : null,
          renta_bruta_anual: toNumber(d.renta_bruta_anual),
          retenciones_previas: toNumber(d.retenciones_previas),
        })),
      };

      await quintaGuardarMulti(payload);
      return payload;
    } finally {
      setLoading(false);
    }
  }, [archivo, archivoUrl, anio, detalles, dni, filialPrincipalId, somosPrincipal, somosSecundario]);

  return {
    loading,
    // cabecera
    filialPrincipalId,
    setFilialPrincipalId,
    somosPrincipal,
    setSomosPrincipal,
    somosSecundario,
    setSomosSecundario,
    // archivo
    archivoUrl,
    onArchivoChange,
    // detalles
    detalles,
    addExterno,
    updateDetalle,
    removeDetalle,
    filialesDetectadas,
    // acciones
    save,
    reset,
  };
}