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
        nombre: fil?.representante || "",
        cargo: fil?.cargo_representante || "Representante Legal",
        documento: fil?.doc_representante || "",
      },
      receptor: {
        nombre: cli?.representante || cli?.contacto?.nombre || "",
        cargo: cli?.contacto?.cargo || "Representante",
        documento: cli?.representante_doc || "",
      },
      asuntoBase: formData?.cotizacion?.codigo_documento
        ? `Contrato de ${formData?.cotizacion?.tipo || "servicios"} - ${formData.cotizacion.codigo_documento}`
        : "Contrato para revisión y firma",
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