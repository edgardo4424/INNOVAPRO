import React from "react";

/**
 * Muestra el resultado del mes (base, adicional, previas) + tramos usados
 * Props:
 *  - data: respuesta completa del backend
 */
export default function ResultadosResumen({ data }) {
  if (!data) return null;
  const { resultados, calculos } = data;
  const Currency = (v) => `S/ ${Number(v || 0).toLocaleString("es-PE")}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="rounded-2xl border p-4 bg-white">
        <div className="text-sm text-slate-500">Retenciones previas</div>
        <div className="text-2xl font-bold">{Currency(resultados?.retenciones_previas)}</div>
      </div>
      <div className="rounded-2xl border p-4 bg-white">
        <div className="text-sm text-slate-500">Retención base del mes</div>
        <div className="text-2xl font-bold">{Currency(resultados?.retencion_base_mes)}</div>
      </div>
      <div className="rounded-2xl border p-4 bg-white">
        <div className="text-sm text-slate-500">Retención adicional del mes</div>
        <div className="text-2xl font-bold">{Currency(resultados?.retencion_adicional_mes)}</div>
      </div>

      <div className="lg:col-span-3 rounded-2xl border bg-slate-50 p-3">
        <div className="text-[13px] text-slate-700 mb-2 font-semibold">Tramos usados (anual)</div>
        <div className="flex flex-wrap gap-2">
          {(calculos?.tramos_usados || []).map((t, i) => (
            <div key={i} className="px-3 py-2 rounded-xl bg-white border">
              <div className="text-xs text-slate-500">{t.tramo} — tasa {(t.tasa * 100).toFixed(0)}%</div>
              <div className="text-sm text-slate-800">
                Base: S/ {Number(t.monto_soles || 0).toLocaleString("es-PE")} · Impuesto: S/ {Number(t.impuesto || 0).toLocaleString("es-PE")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}