// INNOVA PRO+ v1.2.1 — Tramos compactos, totales claros
import { currency } from "../utils/ui";

export default function TramosDetalle({ preview, dense }) {
  if (!preview) return null;

  const tramos = preview.calculos?.tramos_usados || [];
  const bruto = Number(preview?.calculos?.bruto_anual_proyectado || 0);
  const renta = Number(preview?.calculos?.renta_neta_anual || 0);

  return (
    <div className={["p-3 border rounded-md bg-white", dense ? "text-[11.5px] mb-3" : "text-sm"].join(" ")}>

      <div className="mt-3 space-y-3 mb-3">
        <div>
          <div className="flex justify-between text-sm font-medium"><span>Bruto anual</span><span>{currency.format(bruto)}</span></div>
          <div className="w-full bg-gray-200 rounded-full h-3 mt-1"><div className="bg-innova-blue h-3 rounded-full" style={{ width: "100%" }} /></div>
        </div>
        <div>
          <div className="flex justify-between text-sm font-medium">
            <span>Renta neta</span>
            <span>{currency.format(renta)}{preview?.parametros?.uit_valor ? <> (≈ {(renta / preview.parametros.uit_valor).toFixed(2)} UIT)</> : null}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mt-1">
            <div className="bg-innova-orange h-3 rounded-full" style={{ width: `${bruto > 0 ? (renta / bruto) * 100 : 0}%` }} />
          </div>
        </div>
      </div>

      {tramos.length > 0 ? (
        <table className="w-full border">
          <thead className="bg-gray-100 text-[11px]">
            <tr>
              <th className="p-2 text-left">Tramo</th>
              <th className="p-2 text-right">Base (S/.)</th>
              <th className="p-2 text-right">Tasa %</th>
              <th className="p-2 text-right">Impuesto (S/.)</th>
            </tr>
          </thead>
          <tbody>
            {tramos.map((t, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-2">{t.tramo}</td>
                <td className="p-2 text-right">{currency.format(t.monto_soles)}</td>
                <td className="p-2 text-right">{(t.tasa * 100).toFixed(2)}%</td>
                <td className="p-2 text-right font-medium text-blue-600">{currency.format(t.impuesto)}</td>
              </tr>
            ))}
            <tr className="border-t bg-gray-100">
              <td className="p-2 font-semibold">Total</td>
              <td className="p-2 text-right font-semibold">
                {currency.format(tramos.reduce((acc, t) => acc + Number(t.monto_soles || 0), 0))}
              </td>
              <td className="p-2 text-right">—</td>
              <td className="p-2 text-right font-bold text-blue-700">
                {currency.format(tramos.reduce((acc, t) => acc + Number(t.impuesto || 0), 0))}
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500 italic">No se registraron tramos en el cálculo.</p>
      )}

    </div>
  );
}