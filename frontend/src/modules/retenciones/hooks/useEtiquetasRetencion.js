import { useMemo } from "react";

/**
 * Deriva etiquetas y descripciones amigables desde retencion_meta.
 */
export function useEtiquetasRetencion(retencionMeta) {
  return useMemo(() => {
    if (!retencionMeta) {
      return { rol: "—", origen: "—", explicacion: "Sin metadatos de retención." };
    }
    const rol = retencionMeta.es_secundaria ? "Secundaria" : "Principal";
    const origen = (retencionMeta.origen_retencion || "Indefinido")
      .replace("_", " ")
      .toUpperCase();

    let explicacion = "";
    if (retencionMeta.origen_retencion === "INFERIDO") {
      explicacion =
        "Se determinó automáticamente considerando ingresos/retenciones previas y soportes cargados.";
    } else {
      explicacion = "Definido por el soporte/documento registrado.";
    }
    return { rol, origen, explicacion };
  }, [retencionMeta]);
}