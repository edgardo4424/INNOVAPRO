import { useCallback, useEffect, useMemo, useState } from "react";
import api from "@/shared/services/api";
import { ejecutarQuintaMasivo } from "../service/quintaMasivoService";
import { toast } from "react-toastify";

/** Carga de filiales desde GET /filiales */
export function useFiliales({ auto = true } = {}) {
  const [loadingFiliales, setLoadingFiliales] = useState(!!auto);
  const [errorFiliales, setErrorFiliales] = useState(null);
  const [filiales, setFiliales] = useState([]);

  const reload = useCallback(async () => {
    setErrorFiliales(null);
    setLoadingFiliales(true);
    try {
      const { data } = await api.get("/filiales");
      const arr = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
      setFiliales(arr);
    } catch (e) {
      setErrorFiliales(e?.response?.data?.message || e?.message || "Error al cargar filiales");
    } finally {
      setLoadingFiliales(false);
    }
  }, []);

  useEffect(() => { if (auto) reload(); }, [auto, reload]);
  return { loadingFiliales, errorFiliales, filiales, reload };
}

/** Ejecución del cálculo MASIVO */
export function useQuintaMasivo() {
  const [loading, setLoading] = useState(false);
  const [last, setLast] = useState(null); // { ok, meta, results }
  const [error, setError] = useState(null);

  const ejecutar = useCallback(async ({ anio, mes, filialId }) => {
    setError(null);
    setLoading(true);
    try {
      const out = await ejecutarQuintaMasivo({ anio, mes, filialId });
      setLast(out);
      return out;
    } catch (err) {
        //console.error("[QuintaCategoria][Masivo] Error:", err);
        throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const resumen = useMemo(() => {
    if (!last?.meta || !Array.isArray(last?.results)) return null;
    const { meta, results } = last;
    const exitosos = results.filter(r => r.ok).length;
    const fallidos  = results.length - exitosos;
    const skipped   = results.filter(r => r.skipped).length;
    const updated   = results.filter(r => r.updated).length;
    const totalBase = results.reduce((acc, r) => acc + Number(r?.retencion_base_mes || 0), 0);
    return { ...meta, exitosos, fallidos, skipped, updated, totalBase, total: results.length };
  }, [last]);

  /* ===== CSV PRO: cabeceras amigables, nombre de archivo sin IDs, soporte nombres y filial ===== */
  function sanitizeFilename(name) {
    return String(name || "").replace(/[\/\\?%*:|"<>\u0000-\u001F]/g, "").trim();
  }

  /**
   * Exporta CSV.
   * @param {string|object} opts
   *   - Si string: nombre del archivo.
   *   - Si object: { nombre, mesNombre, filialNombre, nombresByDni, delimiter }
   */
  const exportarCSV = useCallback((opts = {}) => {
    if (!last) return;

    const {
      nombre,
      mesNombre: mesNom,
      filialNombre: filialNom,
      nombresByDni = {},
      delimiter = ",",
    } = typeof opts === "string" ? { nombre: opts } : opts;

    const header = [
      "Año","Mes","Filial",
      "Trabajador","DNI","OK","Actualizado","Saltado","Base Mes (S/)","Mensaje"
    ].join(delimiter);

    const esc = (v) => {
      if (v == null) return "";
      const s = String(v);
      return /[",\n]/.test(s) || delimiter === ";" ? `"${s.replace(/"/g, '""')}"` : s;
    };

    const rows = (last.results || []).map(r => {
      const ok = r.ok ? "Sí" : "No";
      const upd = r.updated ? "Sí" : "No";
      const ski = r.skipped ? String(r.skipped) : "";
      const base = (Number(r.retencion_base_mes || 0)).toFixed(2);
      const trabajador = nombresByDni[r.dni] || "";
      return [
        last.meta?.anio ?? "",
        mesNom || (last.meta?.mes ? String(last.meta.mes) : ""),
        filialNom || (last.meta?.filialNombre || ""),
        trabajador,
        r.dni ?? "",
        ok,
        upd,
        ski,
        base,
        r.message ?? ""
     ].map(esc).join(delimiter);
    });

    const csv = [header, ...rows].join("\n");

    const meta = last.meta || {};
    const fname = sanitizeFilename(
      nombre ||
      `Quinta_Masivo_${mesNom || meta.mes}_${meta.anio} - ${filialNom || `Filial ${meta.filialId}`}.csv`
    );

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fname;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [last]);

  return { loading, last, error, resumen, ejecutar, exportarCSV };
}