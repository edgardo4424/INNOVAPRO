import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useWizardContratoContext } from "../../context/WizardContratoContext";
import { obtenerCondicionesPorCotizacion } from "@/modules/cotizaciones/services/condicionesService";
import mapearCondicionesAClausulas from "../../utils/mapearCondicionesAClausulas";
import TERMINOS_FIJOS from "../../constants/terminosFijos";

// helpers
const sumarDias = (fecha, numeroDias) => {
  if (!fecha) return "";
  const date = new Date(fecha + "T00:00:00");
  date.setDate(date.getDate() + numeroDias);
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const dia = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${mes}-${dia}`;
};
const hoyEnFormatoISO = () => {
  const date = new Date();
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const dia = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${mes}-${dia}`;
};

function parsearCondicionesBackend(condicionRaw) {
  if (!condicionRaw?.condiciones)
    return { definidas: [], observacion: null, cumplidasIniciales: [] };

  const textoCondiciones = (condicionRaw.condiciones.split("CONDICIONES AUTORIZADAS:")[1] || "");
  const lineas = textoCondiciones.split("•").map((c) => c.trim()).filter(Boolean);

  let definidas = [];
  let observacion = null;

  lineas.forEach((linea) => {
    if (/OBSERVACIÓN:/i.test(linea)) {
      const partes = linea.split(/OBSERVACIÓN:/i);
      if (partes[0].trim()) definidas.push(partes[0].trim());
      observacion = (partes[1] || "").trim();
    } else {
      definidas.push(linea);
    }
  });

  const cumplidasIniciales = condicionRaw.condiciones_cumplidas || [];
  return { definidas, observacion, cumplidasIniciales };
}

export default function usePasoCondicionesLegales() {
  const { formData, setFormData } = useWizardContratoContext();

  const [loading, setLoading] = useState(false);
  const [condicionesDefinidas, setCondicionesDefinidas] = useState([]);
  const [condicionesCumplidas, setCondicionesCumplidas] = useState([]);
  const [observacion, setObservacion] = useState(null);

  const cotizacionId = formData?.cotizacion?.id;

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
      return next;
    });
  };

  // Efecto 1: al montar, si no hay inicio, poner HOY; si está en FIJA_15D y no hay fin, calcularlo
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

  // Efecto 2: recalcular SIEMPRE que cambie inicio o la política (cubre precargas asincrónicas)
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

  // --------- CARGA CONDICIONES -> SUGERENCIAS DE CLÁUSULAS ----------
  useEffect(() => {
    if (!cotizacionId) return;
    let cancelado = false;

    (async () => {
      try {
        setLoading(true);
        const data = await obtenerCondicionesPorCotizacion(cotizacionId);
        const { definidas, observacion, cumplidasIniciales } = parsearCondicionesBackend(data);
        if (cancelado) return;

        setCondicionesDefinidas(definidas);
        setCondicionesCumplidas(cumplidasIniciales || []);
        setObservacion(observacion || null);

        const sugeridas = mapearCondicionesAClausulas(definidas, cumplidasIniciales);

        setFormData((prev) => {
          const prevVig = prev?.legales?.vigencia || { inicio: vigencia.inicio, fin: vigencia.fin, politica: vigencia.politica };
          return {
            ...prev,
            legales: {
              ...prev.legales,
              vigencia: prevVig,
              clausulas: [
                ...TERMINOS_FIJOS.map((t) => ({ ...t, fija: true, activo: true })),
                ...sugeridas.map((c) => ({ ...c, fija: false })),
              ],
              condiciones_alquiler: definidas.map((texto) => ({
                texto,
                cumplida: (cumplidasIniciales || []).includes(texto),
              })),
              observacion_condiciones: observacion || "",
            },
          };
        });
      } catch (e) {
        if (!cancelado) {
          console.error(e);
          toast.error("No se pudieron cargar las condiciones de alquiler.");
        }
      } finally {
        if (!cancelado) setLoading(false);
      }
    })();

    return () => { cancelado = true; };
  }, [cotizacionId]);

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
    loading,
    // vigencia
    vigencia,
    usarFija15,
    setVigencia,
    setPoliticaVigencia,
    estadoProyectado,
    diasRestantes,

    // condiciones & clausulas
    condicionesDefinidas,
    condicionesCumplidas,
    observacion,

    clausulas,
    toggleClausula,
    agregarClausulaManual,
    editarClausula,
    eliminarClausula,

  };
}