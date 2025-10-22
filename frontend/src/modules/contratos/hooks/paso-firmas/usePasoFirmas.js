import { useMemo  } from "react";
import { useWizardContratoContext } from "../../context/WizardContratoContext";

export function usePasoFirmas() {
  const { formData, setFormData } = useWizardContratoContext();

  // Estructura por defecto en formData.firmas
  const firmas = formData.firmas || {};
  const usarDefault = firmas.usar_por_defecto ?? true;
  const emisor = firmas.firmante_emisor || { nombre: "", cargo: "", documento: "" };
  const receptor = firmas.firmante_receptor || { nombre: "", cargo: "", documento: "" };

  // Sugerencias desde la cotización (si existe en formData)
  const sugeridos = useMemo(() => {
    const cli = formData?.cotizacion?.cliente || formData?.cotizacion?.entidad?.cliente || {};
    const fil = formData?.cotizacion?.filial || formData?.cotizacion?.entidad?.filial || {};
    return {
      emisor: {
        nombre: fil?.nombre_representante || "",
        cargo: fil?.cargo_representante || "Representante Legal",
        documento: fil?.documento_representante || "",
      },
      receptor: {
        nombre: cli?.nombre_representante || "",
        cargo: cli?.cargo_representante || "",
        documento: cli?.documento_representante || "",
      }
    };
  }, [formData]);

  const setPath = (path, value) => {
    setFormData((prev) => {
      const next = structuredClone(prev);
      const seg = path.split(".");
      let ref = next;
      for (let i = 0; i < seg.length - 1; i++) ref = ref[seg[i]] ?? (ref[seg[i]] = {});
      ref[seg.at(-1)] = value;
      return next;
    });
  };

  const cargarSugeridos = () => {
    setFormData((prev) => {
      const next = structuredClone(prev);
      next.firmas = next.firmas || {};
      next.firmas.firmante_emisor = { ...sugeridos.emisor };
      next.firmas.firmante_receptor = { ...sugeridos.receptor };
      next.firmas.notas_envio = {
        ...(next.firmas.notas_envio || {}),
        asunto: sugeridos.asuntoBase,
      };
      next.firmas.usar_por_defecto = true;
      return next;
    });
  };

  const toggleUsarDefault = (checked) => {
    if (checked) {
      cargarSugeridos();
    } else {
      // Dejamos lo actual, pero marcamos que es manual
      setPath("firmas.usar_por_defecto", false);
    }
  };
  
  return {
    usarDefault,
    emisor,
    receptor,
    setPath,
    cargarSugeridos,
    toggleUsarDefault
  };
}