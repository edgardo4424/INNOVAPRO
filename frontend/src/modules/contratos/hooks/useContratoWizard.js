// INNOVA PRO+ v1.2.0 - Contratos - Hook avanzado (plantillas/preview)
// Responsabilidades:
// - Carga snapshot de cotización y plantillas
// - Edición de variables con helpers
// - Preview y creación desde plantilla

import { useCallback, useEffect, useMemo, useState } from "react";
import contratosService from "../services/contratosService";

export default function useContratoWizard({ cotizacionId, filtroPlantilla = {} }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [snapshot, setSnapshot] = useState(null);
  const [plantillas, setPlantillas] = useState([]);
  const [plantillaId, setPlantillaId] = useState(null);

  const [variables, setVariables] = useState({});
  const [preview, setPreview] = useState({ motor: "HTML", html: "" });

  // Helpers para editar variables por path (ej. "cliente.razon_social")
  const setVar = useCallback((path, value) => {
    setVariables((prev) => {
      const clone = structuredClone(prev || {});
      const keys = path.split(".");
      let cur = clone;
      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        cur[k] = cur[k] ?? {};
        cur = cur[k];
      }
      cur[keys.at(-1)] = value;
      return clone;
    });
  }, []);

  const bulkSetVars = useCallback((obj) => {
    setVariables((prev) => ({ ...(prev || {}), ...(obj || {}) }));
  }, []);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const [snapRes, plRes] = await Promise.all([
          contratosService.getCotizacionSnapshot(cotizacionId),
          contratosService.getPlantillas(filtroPlantilla),
        ]);

        if (cancel) return;
        const s = snapRes?.data || null;
        const pls = plRes?.data?.data || [];

        setSnapshot(s);
        setPlantillas(pls);
        setPlantillaId(pls?.[0]?.id ?? null);

        // Auto semilla de variables
        const auto = {
          resumen: {
            ref_contrato: (s?.cotizacion?.codigo_documento || "").replace("-COT-", "-CC-"),
            fecha_emision: new Date().toISOString().slice(0, 10),
            moneda: s?.cotizacion?.moneda || "PEN",
            total_contrato: s?.cotizacion?.total || 0,
          },
          cliente: {
            razon_social: s?.cliente?.razon_social || "",
            ruc: s?.cliente?.ruc || "",
            domicilio_fiscal: s?.cliente?.domicilio_fiscal || "",
            contacto_nombre: s?.contacto?.nombre || "",
            contacto_email: s?.contacto?.email || "",
            contacto_cargo: s?.contacto?.cargo || "",
          },
          obra: {
            nombre: s?.obra?.nombre || "",
            direccion: s?.obra?.direccion || "",
            fecha_inicio: s?.cotizacion?.fecha_inicio || "",
            fecha_fin: s?.cotizacion?.fecha_fin || "",
          },
          operacion: {
            vigencia_dias: s?.cotizacion?.vigencia_dias ?? "",
            penalidad: "0.5% por día",
          },
          firmantes: {
            cliente: { nombre: s?.contacto?.nombre || "", dni: "", cargo: s?.contacto?.cargo || "" },
            interno: { nombre: "", dni: "", cargo: "Representante" },
          },
        };
        setVariables(auto);
      } catch (e) {
        if (!cancel) setError(e?.response?.data?.message || e?.message || "No se pudo cargar el wizard.");
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [cotizacionId, JSON.stringify(filtroPlantilla)]);

  const generarPreview = useCallback(async () => {
    try {
      setError(null);
      const { data } = await contratosService.preview({ plantillaId, variables });
      setPreview({ motor: data?.motor, html: data?.html || "" });
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Error generando preview.");
    }
  }, [plantillaId, variables]);

  const faltantes = useMemo(() => {
    const html = preview?.html || "";
    const regex = /<mark data-missing="([^"]+)">/g;
    const miss = new Set();
    let m;
    while ((m = regex.exec(html)) !== null) miss.add(m[1]);
    return Array.from(miss);
  }, [preview?.html]);

  const crearContrato = useCallback(async () => {
    try {
      setError(null);
      const payload = {
        plantillaId,
        cotizacionId,
        filialId: snapshot?.filial?.id,
        clienteId: snapshot?.cliente?.id,
        variablesOverride: variables,
      };
      const { data } = await contratosService.crearDesdeCotizacion(payload);
      return data; // { ok, contrato, version }
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Error creando contrato.");
      return { ok: false };
    }
  }, [plantillaId, cotizacionId, snapshot, variables]);

  return {
    // estado
    loading,
    error,

    // snapshot y plantillas
    snapshot,
    plantillas,
    plantillaId,
    setPlantillaId,

    // variables
    variables,
    setVariables,
    setVar,
    bulkSetVars,

    // preview
    preview,
    generarPreview,
    faltantes,

    // persistencia
    crearContrato,
  };
}