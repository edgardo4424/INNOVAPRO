import React from "react";

export default function RetencionMetaBanner({ retencionMeta, trabajador }) {
  const {
    origen_retencion, es_secundaria
  } = retencionMeta;

  if (origen_retencion === "NINGUNO") return null;

  const chips = [
    { llave: es_secundaria ? "SECUNDARIA" : "PRINCIPAL", cls: es_secundaria ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800" },
    { llave: origen_retencion || "INDEFINIDO", cls: "bg-indigo-100 text-indigo-800" },
  ];

  return (
    <div className="w-full rounded-2xl border border-slate-200 p-4 bg-slate-50">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          {chips.map((c) => (
            <span key={c.llave} className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${c.cls}`}>{c.llave}</span>
          ))}
        </div>
        <div className="text-[11px] text-slate-600">
          DNI <b>{trabajador?.dni}</b> — {trabajador?.anio}/{String(trabajador?.mes).padStart(2, "0")}
          <p className="text-[12px] text-slate-700 leading-5 pl-3.5">
            Esta filial <b>{es_secundaria ? "NO" : "SÍ"}</b> es la que retiene.
          </p>
        </div>
      </div>
    </div>
  );
}