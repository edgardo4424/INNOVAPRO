import { useCallback, useEffect, useState } from "react";
import { getTrabajadoresByFilial } from "@/shared/services/trabajadoresService";

export function useTrabajadoresByFilial(filialId, { auto = true } = {}) {
  const [loading, setLoading] = useState(!!(auto && filialId));
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);

  const reload = useCallback(async () => {
    if (!filialId) { setItems([]); return; }
    setError(null);
    setLoading(true);
    try {
      const list = await getTrabajadoresByFilial(filialId);
      setItems(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Error al cargar trabajadores");
    } finally {
      setLoading(false);
    }
  }, [filialId]);

  useEffect(() => { if (auto && filialId) reload(); }, [auto, filialId, reload]);

  return { loading, error, items, reload };
}