import { useMemo  } from "react";
import { useWizardContratoContext } from "../../context/WizardContratoContext";

export function usePasoValorizacion() {

  const { formData, setFormData } = useWizardContratoContext();
    const val = formData.valorizacion || {};
  
    const onChange = (path, value) => {
      setFormData((prev) => {
        const next = structuredClone(prev);
        const seg = path.split(".");
        let ref = next;
        for (let i = 0; i < seg.length - 1; i++) ref = ref[seg[i]];
        ref[seg.at(-1)] = value;
        return next;
      });
    };
  
    const handleRenovacion = (value) => {
      setFormData((prev) => {
        const next = structuredClone(prev);
        next.valorizacion = next.valorizacion || {};
        next.valorizacion.renovaciones = value;
  
        // Si dejaste de ser personalizada, limpia la descripción
        if (value !== "__PERSONALIZADA__") {
          delete next.valorizacion.personalizada_descripcion;
        }
        return next;
      });
    };
  
    const opciones = useMemo(
      () => [
        { value: "SEMANAL", label: "Semanal", hint: "Se factura/valoriza cada 7 días." },
        { value: "QUINCENAL", label: "Quincenal", hint: "Dos veces por mes (aprox. cada 15 días)." },
        { value: "MENSUAL", label: "Mensual", hint: "Una vez por mes (fin o fecha pactada)." },
        { value: "CADA 7 DÍAS", label: "Cada 7 días" },
        { value: "CADA 15 DÍAS", label: "Cada 15 días" },
        { value: "CADA 21 DÍAS", label: "Cada 21 días" },
        { value: "CADA 30 DÍAS", label: "Cada 30 días" },
        { value: "FIN DE MES", label: "Fin de mes", hint: "Cierre y valorización el último día de cada mes." },
        { value: "__PERSONALIZADA__", label: "Personalizada", hint: "Define un patrón propio (ej. cada 10 días)." },
      ],
      []
    );
  
    const esPersonalizada = val.renovaciones === "__PERSONALIZADA__";
    const resumen = useMemo(() => {
      if (!val.renovaciones) return "Selecciona una frecuencia de renovación.";
      const base = esPersonalizada
        ? (val.personalizada_descripcion || "Personalizada")
        : val.renovaciones.toLowerCase();
      return `${val.requiere_adelantada ? "Adelantada" : "Regular"} ${esPersonalizada ? base : `${base}`}.`;
    }, [val.renovaciones, val.requiere_adelantada, val.personalizada_descripcion, esPersonalizada]);

  return {
    val,
    onChange,
    handleRenovacion,
    esPersonalizada,
    opciones,
    resumen
  };
}