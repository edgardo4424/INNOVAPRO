import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useWizardContratoContext } from "../../context/WizardContratoContext";
import { obtenerTodos, obtenerCotizacionPorId } from "@/modules/cotizaciones/services/cotizacionesService";

const mapearSnapshotDesdeCotizacion = (data, cotizacionId) => {
  
  // Intento de totales: si no hay info, dejamos 0.
  const subtotal = 0;
  const igv = 0;
  const total = Number(data?.total_soles ?? 0);

  return {
    id: Number(cotizacionId ?? data?.id),
    codigo_documento: data?.codigo_documento || "",
    tipo: data?.tipo_cotizacion || "",

    cliente: {
      id: data?.cliente?.id ?? null,
      razon_social: data?.cliente?.razon_social ?? "",
      ruc: data?.cliente?.ruc ?? "",
      direccion: data?.cliente?.direccion ?? "",
    },

    obra: {
      id: data?.obra?.id ?? null,
      nombre: data?.obra?.nombre ?? "",
      direccion: data?.obra?.direccion ?? "",
      distrito: data?.obra?.distrito ?? "",
    },

    filial: {
      id: data?.filial?.id ?? null,
      razon_social: data?.filial?.razon_social ?? "",
      ruc: data?.filial?.ruc ?? "",
    },

    uso: {
      id: data?.uso?.id ?? null,
      nombre: data?.uso?.descripcion ?? data?.uso?.nombre ?? "",
    },

    totales: {
      subtotal,
      igv,
      total,
    },
  };
};

export function usePasoOrigenCotizacion() {
  const { formData, setFormData } = useWizardContratoContext();
  const [searchParams, setSearchParams] = useSearchParams();

  const [cotizaciones, setCotizaciones] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const cotizacionIdParam = useMemo(() => searchParams.get("cotizacionId"), [searchParams]);

  // 1) Cargar TODAS las cotizaciones y filtrar en memoria por “Condiciones Cumplidas”
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await obtenerTodos(); // ← sin parámetros, como definiste
        // Soporta ambos shapes (plano o “antiguo”)
        const filtradas = (res || []).filter((c) => {
          const estado =
            c?.estados_cotizacion?.nombre ||
            c?.estado ||
            c?.estado_nombre ||
            "";
          return estado === "Condiciones Cumplidas";
        });
        setCotizaciones(filtradas);
      } catch (error) {
        console.error("❌ Error al obtener cotizaciones:", error);
        toast.error("Error al cargar cotizaciones");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 2) Si entramos con ?cotizacionId=… → precarga snapshot
  useEffect(() => {
    if (!cotizacionIdParam) return;
    let cancelado = false;
    (async () => {
      try {
        setLoading(true);
        const data = await obtenerCotizacionPorId(cotizacionIdParam);
        console.log("DATA DE LA COTI: ", data);
        const snapshot = mapearSnapshotDesdeCotizacion(data, cotizacionIdParam);
        if (cancelado) return;
        setFormData((prev) => ({ ...prev, cotizacion: snapshot }));
        toast.success("Cotización base precargada.");
      } catch (error) {
        if (!cancelado) {
          console.error(error);
          toast.error("No se pudo cargar la cotización base.");
        }
      } finally {
        if (!cancelado) setLoading(false);
      }
    })();
    return () => {
      cancelado = true;
    };
  }, [cotizacionIdParam, setFormData]);

  // 3) Seleccionar una cotización manualmente (desde la lista)
  const seleccionarCotizacion = async (id) => {
    try {
      setLoading(true);
      const data = await obtenerCotizacionPorId(id);
      console.log("DATA DE LA COTI: ", data);
      const snapshot = mapearSnapshotDesdeCotizacion(data, id);
      setFormData((prev) => ({ ...prev, cotizacion: snapshot }));
      setSearchParams({ cotizacionId: id });
      toast.success("Cotización seleccionada como base.");
    } catch (error) {
      console.error(error);
      toast.error("Error al seleccionar la cotización.");
    } finally {
      setLoading(false);
    }
  };

  const limpiarSeleccion = () => {
    setFormData((prev) => ({
      ...prev,
      cotizacion: { ...prev.cotizacion, id: null },
    }));
    setSearchParams({});
  };

  // 4) Filtro local por texto (razón social, obra, código)
  const resultados = useMemo(() => {
    const texto = (query || "").toLowerCase();
    if (!texto) return cotizaciones;
    return (cotizaciones || []).filter((c) => {
      const razon =
        c?.cliente?.razon_social ||
        c?.cliente_razon_social ||
        "";
      const obraNombre =
        c?.obra?.nombre ||
        c?.obra_nombre ||
        "";
      const codigo =
        c?.codigo_documento ||
        c?.codigo ||
        "";

      return (
        razon.toLowerCase().includes(texto) ||
        obraNombre.toLowerCase().includes(texto) ||
        codigo.toLowerCase().includes(texto)
      );
    });
  }, [cotizaciones, query]);

  return {
    formData,
    query,
    setQuery,
    resultados,
    loading,
    seleccionarCotizacion,
    limpiarSeleccion,
  };
}