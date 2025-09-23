import { useEffect, useMemo, useState, useCallback } from "react";
import { getEstadoCierre, cerrarPeriodoQuinta } from "../service/cierreQuintaService";

const pad2 = (n) => String(n).padStart(2, "0");

export function useCierreQuinta({ filialId, anio, mes }) {
  const [cerrado, setCerrado] = useState(false);
  const [loading, setLoading] = useState(false);

  const periodo = useMemo(() => {
    if (!anio || !mes) return "0000-00";
    return `${anio}-${pad2(mes)}`;
  }, [anio, mes]);

  useEffect(() => {
    let cancel = false;
    async function load() {
      try {
        if (!filialId || periodo === "0000-00") setCerrado(false);
        const isClosed = await getEstadoCierre({ filialId, periodo });
        if (!cancel) setCerrado(Boolean(isClosed));
      } catch {}
    }
    load();
    return () => { cancel = true; };
  }, [filialId, periodo]);

  const cerrar = useCallback(async () => {
    if (!filialId) {
      const e = new Error("Falta la filial para cerrar el período.");
      e.status = 400;
      throw e;
    }

    if (!periodo === "0000-00") {
      const e = new Error("Faltan el año o mes para cerrar el período.");
      e.status = 400;
      throw e;
    }

    setLoading(true);
    try {
      const { status, data } = await cerrarPeriodoQuinta({ filial_id: filialId, periodo });
      const statusOk = status >= 200 && status < 300;
      const confirmado = data?.ok === true || data?.cerrado === true || !!data?.id || !!data?.data?.id;

      if (!(statusOk && confirmado)) {
        const msg = data?.message || data?.mensaje || `Error ${status || ''} al cerrar el período.`;
        const err = new Error(msg);
        err.status = status || 500;
        throw err;
      }

      setCerrado(true);
      return true;
    } finally {
      setLoading(false);
    }
  }, [filialId, periodo]);

  return { cerrado, loading, cerrar, periodo };
}