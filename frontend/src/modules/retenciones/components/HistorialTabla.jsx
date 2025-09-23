import { Button } from "@/components/ui/button";
import { currency, formatFechaCorta, nombreMes } from "../utils/ui";
import { memo } from "react";

function HistorialTabla({ rows = [], onRecalc, dense }) {
  if (!rows?.length) return <div className="py-6 text-center opacity-60 text-sm">Sin registros guardados</div>;

  return (
    <div className="overflow-auto max-h-[420px] rounded border">
      <table className={["w-full", dense ? "text-[11px] leading-tight" : "text-sm"].join(" ")}>
        <thead className="sticky top-0 bg-white z-10 shadow-sm">
          <tr className="text-left border-b">
            <th className="px-2 py-2">Fecha del cálculo</th>
            <th className="px-2 py-2">Mes</th>
            <th className="px-2 py-2">Base</th>
            <th className="px-2 py-2">Adic.</th>
            <th className="px-2 py-2">Total</th>
            <th className="px-2 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((h) => {
            const base = Number(h.retencion_base_mes ?? 0);
            const adic = Number(h.retencion_adicional_mes ?? 0);
            const total = base + adic;
            return (
              <tr key={`${h.id}-${h.createdAt}`} className="border-t hover:bg-gray-50">
                <td className="px-2 py-1.5 whitespace-nowrap">
                  {formatFechaCorta(h.createdAt)}
                  {h.es_recalculo && <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">recálculo</span>}
                </td>
                <td className="px-2 py-1.5">{nombreMes(h.mes)}</td>
                <td className="px-2 py-1.5">{currency.format(base)}</td>
                <td className="px-2 py-1.5">{currency.format(adic)}</td>
                <td className="px-2 py-1.5 font-semibold">{currency.format(total)}</td>
                <td className="px-2 py-1.5">
                  <Button size="sm" variant="outline" className="h-6 px-2 text-[11px]" onClick={() => onRecalc?.(h)}>Recalcular</Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
export default memo(HistorialTabla);