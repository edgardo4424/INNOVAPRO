import { useCallback, useEffect, useState } from "react";
import {
  quintaObtenerCertificado,
  quintaGuardarCertificado
} from "../service/quintaService";
import { uploadQuintaArchivo } from "../service/archivosService";

export function useCertificadoQuinta({ open, dni, anio }) {
  const [loading, setLoading] = useState(false);

  // Totales para cálculo
  const [rentaCert, setRentaCert] = useState("");
  const [retCert, setRetCert] = useState("");

  // Desglose
  const [remuneraciones, setRemuneraciones] = useState("");
  const [gratificaciones, setGratificaciones] = useState("");
  const [asignacionFamiliar, setAsignacionFamiliar] = useState("");
  const [otros, setOtros] = useState("");

  // Documento
  const [archivo, setArchivo] = useState(null);
  const [archivoUrl, setArchivoUrl] = useState("");

  const onArchivoChange = useCallback((file) => setArchivo(file || null), []);

  const reset = useCallback(() => { 
    setRentaCert(""); 
    setRetCert(""); 
    setRemuneraciones("");
    setGratificaciones("");
    setAsignacionFamiliar("");
    setOtros("");
    setArchivo(null);
    setArchivoUrl("");
  }, []);

  useEffect(() => {
    if (!open || !dni || !anio) return;
    (async () => {
      setLoading(true);
      try {
        const respuesta = await quintaObtenerCertificado(dni, anio).catch(() => null);
        if (respuesta?.data?.data?.found) {
          const certificado = respuesta.data.data;
          setRentaCert(String(certificado.renta_bruta_total || 0));
          setRetCert(String(certificado.retenciones_previas || 0));
          const declaracionJurada = certificado.detalle_json || {};
          setRemuneraciones(String(declaracionJurada.remuneraciones ?? ""));
          setGratificaciones(String(declaracionJurada.gratificaciones ?? ""));
          setAsignacionFamiliar(String(declaracionJurada.asignacion_familiar ?? ""));
          setOtros(String(declaracionJurada.otros ?? ""));
          setArchivoUrl(certificado.archivo_url || "");
        } else {
          reset();
        }
      } finally { setLoading(false); }
    })();
  }, [open, dni, anio, reset]);

  useEffect(() => {
    const numero = (v) => Number(v || 0);
    const total = numero(remuneraciones) + numero(gratificaciones) + numero(asignacionFamiliar) + numero(otros);
    setRentaCert(String(total.toFixed(2)));
  }, [remuneraciones, gratificaciones, asignacionFamiliar, otros]);

  const save = useCallback(async () => {
    let url = archivoUrl;
    if (archivo) {
        url = await uploadQuintaArchivo('certificado', dni, anio, archivo);
        setArchivoUrl(url || "");
    }
    await quintaGuardarCertificado({
      dni, anio: Number(anio),
      renta_bruta_total: Number(rentaCert || 0),
      retenciones_previas: Number(retCert || 0),
      archivo_url: url || null,
      detalle_json: {
        remuneraciones: Number(remuneraciones || 0),
        gratificaciones: Number(gratificaciones || 0),
        asignacion_familiar: Number(asignacionFamiliar || 0),
        otros: Number(otros || 0)
      }
    });
    return {
      renta_bruta_total: Number(rentaCert || 0),
      retenciones_previas: Number(retCert || 0),
      archivo_url: url || null
    };
  }, [dni, anio, rentaCert, retCert, remuneraciones, gratificaciones, asignacionFamiliar, otros, archivo, archivoUrl]);

  return {
    loading,
    rentaCert, setRentaCert,
    retCert, setRetCert,
    remuneraciones, setRemuneraciones,
    gratificaciones, setGratificaciones,
    asignacionFamiliar, setAsignacionFamiliar,
    otros, setOtros,
    archivoUrl, onArchivoChange,
    save, reset
  };
}