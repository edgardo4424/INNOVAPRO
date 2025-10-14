import { useCallback, useEffect, useRef, useState } from "react";
import {
  quintaObtenerSinPrevios,
  quintaGuardarSinPrevios
} from "../service/quintaService";
import { uploadQuintaArchivo } from "../service/archivosService";
import { FaSmileBeam } from "react-icons/fa";

export function useSinPrevios({ open, dni, anio, prefill }) {
  const [loading, setLoading] = useState(false);
  const [sinPrevios, setSinPrevios] = useState(false);
  const [aplicaDesdeMes, setAplicaDesdeMes] = useState("");
  const [observ, setObserv] = useState("");

  const [archivo, setArchivo] = useState(null);
  const [archivoUrl, setArchivoUrl] = useState("");
  const reqRef = useRef(0);

  const onArchivoChange = useCallback((file) => setArchivo(file || null), []);

  const reset = useCallback(() => { 
    setSinPrevios(false); 
    setAplicaDesdeMes("");
    setObserv(""); 
    setArchivo(null); 
    setArchivoUrl(""); 
  }, []);

  const applyPrefill = useCallback((dj) => {
    if(!dj?.found) return false;
    setSinPrevios(true);
    setAplicaDesdeMes(String(dj.aplica_desde_mes ?? "") || "");
    setObserv(String(dj.observaciones ?? ""));
    setArchivoUrl(dj.archivo_url || "");
    return true;
  }, []);

  // Cargar desde el backend y pre-rellenar el formulario del modal
  const reload = useCallback(async () => {
    if (!dni || !anio) return;
    const id = ++reqRef.current;
    setLoading(true);
    try {
      const respuesta = await quintaObtenerSinPrevios(dni, anio).catch(() => null);
      if (!respuesta || (respuesta.status && respuesta.status === 304)) {
        return;
      }
      if (id !== reqRef.current) return;
      const declaracionJurada = respuesta?.data?.data;
      if (!applyPrefill(declaracionJurada) && !prefill?.found) reset();
    } finally {
      if (id === reqRef.current) setLoading(false);
    }
  }, [dni, anio, reset, applyPrefill, prefill?.found]);

  useEffect(() => {
    if (!dni || !anio) return;
    if (open) { 
      if (!(prefill && applyPrefill(prefill))) {}
      reload(); 
    } else { 
      reset(); 
    }    
  }, [open, dni, anio, prefill, applyPrefill, reload, reset]);

  const save = useCallback(async () => {
    if (sinPrevios && (!aplicaDesdeMes || Number(aplicaDesdeMes) < 1 || Number(aplicaDesdeMes) > 12 )) {
      throw new Error ("Debes indicar el mes desde el cual aplica (1...12).");
    }
    let url = archivoUrl;
    if (sinPrevios && archivo) {
        url = await uploadQuintaArchivo('sinprevios', dni, anio, archivo);
        setArchivoUrl(url || "");
    }
    if (sinPrevios) {
      await quintaGuardarSinPrevios({ 
        dni, 
        anio: Number(anio), 
        aplica_desde_mes: Number(aplicaDesdeMes),
        observaciones: observ || null, 
        archivo_url: url || null 
      });
    }
    return { sinPrevios, aplica_desde_mes: Number(aplicaDesdeMes)||null, observaciones: observ || null, archivo_url: url || null };
  }, [dni, anio, sinPrevios, aplicaDesdeMes, observ, archivo, archivoUrl]);

  return {
    loading,
    sinPrevios, setSinPrevios,
    aplicaDesdeMes, setAplicaDesdeMes,
    observ, setObserv,
    archivoUrl, onArchivoChange,
    save, reset,
    reload
  };
}