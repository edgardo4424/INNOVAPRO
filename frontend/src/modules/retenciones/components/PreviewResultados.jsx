// Card de resultados de previsualización
import { currency } from "../utils/ui";

export default function PreviewResultados({ preview, dense, className }) {
  if (!preview) return null;

  const base = Number(preview?.resultados?.retencion_base_mes || 0);
  const adic = Number(preview?.resultados?.retencion_adicional_mes || 0);

  return (
    <div className={["p-4 py-0 border rounded-md bg-gray-50", dense ? "text-[11px]" : "text-sm", className].join(" ")}>
      <h3 className="font-semibold text-gray-700">Resultado de la proyección</h3>

      <div className={dense ? "mt-1 text-[11px]" : "mt-2 text-xs"}>
        <h4 className="font-semibold text-gray-600">Detalle de proyección del resto del año:</h4>
        <ul className="list-disc list-inside space-y-0">
          <li>
            Remuneración mensual ({currency.format(preview.entradas?.remuneracion_mensual)}) ×{" "}
            {12 - preview.trabajador?.mes + 1} meses ={" "}
            <b>{currency.format(preview.entradas?.remuneracion_mensual * (12 - preview.trabajador?.mes + 1))}</b>
          </li>
          <li>Gratificación julio proyectada: <b>{currency.format(preview.entradas?.grati_julio_proj)}</b></li>
          <li>Gratificación diciembre proyectada: <b>{currency.format(preview.entradas?.grati_diciembre_proj)}</b></li>
          <li>Otros ingresos proyectados: <b>{currency.format(preview.entradas?.otros_ingresos_proj)}</b></li>
        </ul>
      </div>

      <div className="py-0.5 pl-4">Bruto anual proyectado: <b>{currency.format(Number(preview?.calculos?.bruto_anual_proyectado || 0))}</b></div>
      <div className="py-0.5 pl-4">Renta neta anual: <b>{currency.format(Number(preview?.calculos?.renta_neta_anual || 0))}</b></div>
      <div className="py-0.5 pl-4">Impuesto anual: <b>{currency.format(Number(preview?.calculos?.impuesto_anual || 0))}</b></div>
      <div className="py-0.5 pl-4">Retenciones previas: <b>{currency.format(Number(preview?.resultados?.retenciones_previas || 0))}</b></div>
      <div className="py-0.5 pl-4">
        Retención base del mes: <b>{currency.format(base)}</b>{" "}
        (divisor {preview?.calculos?.divisor_calculo || "-"})
      </div>

      {adic > 0 && (
        <div>
          Retención adicional del mes (extras): <b>{currency.format(adic)}</b>
        </div>
      )}

      <div className="text-[15px] font-bold text-red-700">
        Total a retener este mes: {currency.format(base + adic)}
      </div>

      <div className="text-xs opacity-70">
        UIT {preview?.trabajador?.anio || "-"}: {currency.format(Number(preview?.parametros?.uit_valor || 0))} • Fuente: {preview?.metadata?.fuente || "-"}
      </div>
    </div>
  );
}