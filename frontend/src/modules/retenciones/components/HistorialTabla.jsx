// Tabla de historial vigente por mes
import { Button } from "@/components/ui/button";
import { currency, formatFechaCorta, nombreMes } from "../utils/ui";
import { memo } from "react";

function HistorialTabla({ rows = [], onRecalc, dense }) {
  if (!rows?.length) {
    return (
      <div className="py-6 text-center opacity-60 text-sm">Sin registros guardados</div>
    );
  }

  return (
    <table className={["w-full", dense ? "text-[11px] leading-tight" : "text-sm"].join(" ")}>
      <thead>
        <tr className="text-left border-b">
          <th>Fecha del cálculo</th>
          <th>Mes</th>
          <th>Base</th>
          <th>Adic.</th>
          <th>Total</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {rows.map((h) => {
          const base = Number(h.retencion_base_mes ?? 0);
          const adic = Number(h.retencion_adicional_mes ?? 0);
          const total = base + adic;
          return (
            <tr key={`${h.id}-${h.createdAt}`} className="border-t hover:bg-gray-50">
              <td className="whitespace-nowrap py-1.5 pr-3">
                {formatFechaCorta(h.createdAt)}
                {h.es_recalculo && (
                  <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                    recálculo
                  </span>
                )}
              </td>
              <td className="py-1.5 pr-3">{nombreMes(h.mes)}</td>
              <td className="py-1.5 pr-3">{currency.format(base)}</td>
              <td className="py-1.5 pr-3">{currency.format(adic)}</td>
              <td className="py-1.5 pr-3 font-semibold">{currency.format(total)}</td>
              <td className="py-1.5">
                <Button size="sm" className={dense ? "h-6 px-2 text-[11px]" : ""} variant="outline" onClick={() => onRecalc?.(h)}>
                  Recalcular
                </Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default memo(HistorialTabla);