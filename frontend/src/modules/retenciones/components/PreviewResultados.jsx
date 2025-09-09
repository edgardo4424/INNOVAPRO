import { currency } from "../utils/ui";

export default function PreviewResultados({ preview, dense, className }) {
  if (!preview) return null;

  const base = Number(preview?.resultados?.retencion_base_mes || 0);
  const adic = Number(preview?.resultados?.retencion_adicional_mes || 0);
  const tramos = preview?.calculos?.tramos_usados || [];
  const divisor = preview?.calculos?.divisor_calculo || "-";

  const Row = ({ llave, valor }) => (
    <div className="flex items-center justify-between">
      <span className="text-slate-600">{llave}</span>
      <span className="font-medium">{valor}</span>
    </div>
  );

  const C = (valor) => currency.format(Number(valor || 0));

  const mesActual = Number(preview?.trabajador?.mes || 0); // 1-12
  const mesesRestantes = (mesActual >= 1 && mesActual <= 12) ? (12 - mesActual + 1) : 0;
  const sueldoMensual = Number(preview?.entradas?.remuneracion_mensual || 0);
  const remuneracionMensualProyectada = sueldoMensual * mesesRestantes;

  const mesesAbbr = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  const rangoMeses = (mesActual >= 1 && mesActual <= 12) ? `${mesesAbbr[mesActual - 1]}–Dic` : "—";

  return (
    <div className={["p-3 border rounded-md bg-gray-50", dense ? "text-[11.5px]" : "text-sm", className].join(" ")}>
      <div className="mt-2 p-2 border rounded bg-slate-50">
        <div className="text-[11px] text-slate-700 font-semibold mb-1">Proyección anual</div>
        <div className="grid gap-1">
          <Row llave="Remuneración mensual" valor={C(sueldoMensual)} />
          <Row llave="Remuneración proyectada" valor={`${C(remuneracionMensualProyectada)}`} />
          <Row llave="Meses considerados" valor={rangoMeses} />
          <Row llave="Grati Julio Proyectada" valor={C(preview.entradas?.grati_julio_proj)} />
          <Row llave="Grati Diciembre Proyectada" valor={C(preview.entradas?.grati_diciembre_proj)} />
          <Row llave="Otros ingresos proyectados" valor={C(preview.entradas?.otros_ingresos_proj)} />
        </div>
      </div>

      <div className="mt-2 p-2 border rounded bg-slate-50">
        <div className="text-[11px] text-slate-700 font-semibold mb-1">Resultado de la proyección</div>
        <div className="grid gap-1">
          <Row llave="Bruto anual proyectado" valor={C(preview?.calculos?.bruto_anual_proyectado)} />
          <Row llave="Renta neta anual" valor={C(preview?.calculos?.renta_neta_anual)} />
          <Row llave="Impuesto anual" valor={C(preview?.calculos?.impuesto_anual)} />
          <Row llave="Retenciones previas" valor={C(preview?.resultados?.retenciones_previas)} />
          {adic > 0 && <Row llave="Adicional del mes (extras)" valor={C(adic)} />}
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] font-bold text-red-700 border rounded  bg-slate-50 mt-2 p-2">
        Total a retener este mes: {currency.format(base + adic)}
        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px]">divisor {divisor}</span>

      </div>

      {/* {Array.isArray(tramos) && tramos.length > 0 && (
        <div className="mt-2 p-2 border rounded bg-white">
          <div className="text-[11px] font-semibold text-slate-700 mb-1">Tramos usados (anual)</div>
          <div className="flex flex-wrap gap-1">
            {tramos.map((t, i) => (
              <div key={i} className="px-3 py-2 w-full rounded-lg bg-slate-50 border">
                <div className="text-[10px] text-slate-500">{t.tramo} — {Math.round((t.tasa || 0) * 100)}%</div>
                <div className="text-[11px]">Base: {currency.format(t.monto_soles)} · Impuesto: {currency.format(t.impuesto)}</div>
              </div>
            ))}
          </div>
        </div>
      )} */}

      <div className="text-[11px] opacity-70 pl-4 mt-1">
        UIT {preview?.trabajador?.anio || "-"}: {currency.format(Number(preview?.parametros?.uit_valor || 0))} • Fuente: {preview?.metadata?.fuente || "-"}
      </div>
    </div>
  );
}