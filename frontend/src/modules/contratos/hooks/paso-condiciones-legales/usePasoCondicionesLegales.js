import { useEffect, useMemo } from "react";
import { useWizardContratoContext } from "../../context/WizardContratoContext";

import { sumarDias, hoyEnFormatoISO } from "../../utils/helpers";


export default function usePasoCondicionesLegales() {
  const { formData, setFormData } = useWizardContratoContext(); 

  // VIGENCIA con política de 15 días
  const vigencia = formData?.legales?.vigencia || { inicio: "", fin: "", politica: "FIJA_15D" };
  const usarFija15 = (vigencia?.politica || "FIJA_15D") === "FIJA_15D";

  // Estado proyectado
  const estadoProyectado = useMemo(() => {
    const hoy = hoyEnFormatoISO();
    if (!vigencia?.inicio || !vigencia?.fin) return "—";
    if (hoy < vigencia.inicio) return "Programado";
    if (hoy > vigencia.fin) return "Vencido";
    const diasRestantes =
      Math.ceil((new Date(vigencia.fin + "T00:00:00") - new Date(hoy + "T00:00:00")) / 86400000);
    if (diasRestantes <= 3) return "Por vencer";
    return "Vigente";
  }, [vigencia?.inicio, vigencia?.fin]);

  const diasRestantes = useMemo(() => {
    if (!vigencia?.fin) return null;
    const hoy = hoyEnFormatoISO();
    return Math.ceil((new Date(vigencia.fin + "T00:00:00") - new Date(hoy + "T00:00:00")) / 86400000);
  }, [vigencia?.fin]);

  // Setter de campos de vigencia
  const setVigencia = (campo, valor) => {
    setFormData((prev) => {
      const next = structuredClone(prev);
      if (!next.legales) next.legales = {};
      if (!next.legales.vigencia) next.legales.vigencia = { inicio: "", fin: "", politica: "FIJA_15D" };
      next.legales.vigencia[campo] = valor;
      // si es fija, autocalcular fin = inicio + 15
      if (campo === "inicio" && next.legales.vigencia.politica === "FIJA_15D") {
        next.legales.vigencia.fin = valor ? sumarDias(valor, 15) : "";
      }
      return next;
    });
  };

  const setPoliticaVigencia = (usarFija) => {
    setFormData((prev) => {
      const next = structuredClone(prev);
      if (!next.legales) next.legales = {};
      if (!next.legales.vigencia) next.legales.vigencia = { inicio: "", fin: "", politica: "FIJA_15D" };
      next.legales.vigencia.politica = usarFija ? "FIJA_15D" : "MANUAL";
      // si activamos fija y hay inicio, recalcular fin
      if (usarFija && next.legales.vigencia.inicio) {
        next.legales.vigencia.fin = sumarDias(next.legales.vigencia.inicio, 15);
      }
      // si activamos fija y no hay inicio, seteamos inicio con fecha de hoy y recalculamos el fin
      if (usarFija && !next.legales.vigencia.inicio) {
        next.legales.vigencia.inicio = hoyEnFormatoISO();
        next.legales.vigencia.fin = sumarDias(next.legales.vigencia.inicio, 15);
      }
      return next;
    });
  };

  // al montar, si no hay inicio, ponemos HOY; si está en FIJA_15D y no hay fin, calcularlo
  useEffect(() => {
    if (!vigencia?.inicio) {
      setVigencia("inicio", hoyEnFormatoISO());
      return;
    }
    if (usarFija15 && !vigencia?.fin) {
      setFormData((prev) => {
        const next = structuredClone(prev);
        next.legales = next.legales || {};
        next.legales.vigencia = next.legales.vigencia || {};
        next.legales.vigencia.fin = sumarDias(vigencia.inicio, 15);
        return next;
      });
    }
  }, []);

  // recalculamos SIEMPRE que cambie inicio o la política (cubre precargas asincrónicas)
  useEffect(() => {
    if (!usarFija15) return;
    if (!vigencia?.inicio) return;
    const finEsperado = sumarDias(vigencia.inicio, 15);
    if (vigencia.fin !== finEsperado) {
      setFormData((prev) => {
        const next = structuredClone(prev);
        if (!next.legales) next.legales = {};
        if (!next.legales.vigencia) next.legales.vigencia = { inicio: "", fin: "", politica: "FIJA_15D" };
        next.legales.vigencia.fin = finEsperado;
        return next;
      });
    }
  }, [vigencia?.inicio, usarFija15, setFormData, vigencia?.fin]);

  // Clausulas del formData
  const clausulas = formData?.legales?.clausulas || [];

  const toggleClausula = (indice) => {
    setFormData((prev) => {
      const next = structuredClone(prev);
      next.legales.clausulas[indice].activo = !next.legales.clausulas[indice].activo;
      return next;
    });
  };

  const agregarClausulaManual = () => {
    setFormData((prev) => ({
      ...prev,
      legales: {
        ...prev.legales,
        clausulas: [
          ...prev.legales.clausulas,
          { id: `manual-${Date.now()}`, titulo: "", texto: "", fija: false, activo: true },
        ],
      },
    }));
  };

  const editarClausula = (indice, key, value) => {
    setFormData((prev) => {
      const next = structuredClone(prev);
      next.legales.clausulas[indice][key] = value;
      return next;
    });
  };

  const eliminarClausula = (indice) => {
    setFormData((prev) => {
      const next = structuredClone(prev);
      next.legales.clausulas.splice(indice, 1);
      return next;
    });
  };

  return {
    // vigencia
    vigencia,
    usarFija15,
    setVigencia,
    setPoliticaVigencia,
    estadoProyectado,
    diasRestantes,

    clausulas,
    toggleClausula,
    agregarClausulaManual,
    editarClausula,
    eliminarClausula,

  };
}