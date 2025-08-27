// Card de ingresos previos + fuente de esos ingresos previos
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { currency } from "../utils/ui";

export default function IngresosPreviosCard({
  preview,
  fuentePrevios,
  certificadoQuinta,
  errors,
  onFuenteChange,
  onCertificadoChange,
  dense,
  className
}) {
    
  if (!preview) return null;

  return (
    <div className={["p-4 py-5 border rounded bg-white w-80", dense ? "text-[11px]" : "text-xs", className].join(" ")}>
      <h4 className="font-semibold text-gray-700">{dense ? "Ingresos previos" : "Ingresos previos acumulados"}</h4>

      {preview?.ingresos_previos?.total_ingresos > 0 && fuentePrevios !== "SIN_PREVIOS" ? (
        <ul className="mt-1 list-disc list-inside space-y-0">
          <li>Remuneraciones: {currency.format(preview.ingresos_previos.remuneraciones)}</li>
          <li>Gratificaciones: {currency.format(preview.ingresos_previos.gratificaciones)}</li>
          <li>Bonos: {currency.format(preview.ingresos_previos.bonos)}</li>
          <li>Asignación familiar: {currency.format(preview.ingresos_previos.asignacion_familiar)}</li>
          <li className="font-semibold">Total: {currency.format(preview.ingresos_previos.total_ingresos)}</li>
        </ul>
      ) : (
        <p className="text-gray-500 italic">No existen ingresos previos registrados.</p>
      )}

      {/* Fuente de ingresos previos */}
      <div className={["mt-1 p-2 border rounded bg-yellow-50 text-gray-700", dense ? "text-[11px]" : "text-xs"].join(" ")}>
        <p className="font-semibold mb-0">Fuente de ingresos previos</p>
        <div className="flex flex-cols h-17 gap-0">
          <label className="flex items-center gap-0.5">
            <input type="radio" name="fuentePrevios" checked={fuentePrevios === "AUTO"} onChange={() => onFuenteChange("AUTO")} />
            Proyección automática
          </label>
          <label className="flex items-center gap-0.5">
            <input type="radio" name="fuentePrevios" checked={fuentePrevios === "CERTIFICADO"} onChange={() => onFuenteChange("CERTIFICADO")} />
            Certificado de 5ta
          </label>
          <label className="flex items-center gap-0.5">
            <input type="radio" name="fuentePrevios" checked={fuentePrevios === "SIN_PREVIOS"} onChange={() => onFuenteChange("SIN_PREVIOS")} />
            Sin ingresos previos
          </label>
        </div>

        {/* Form mini de certificado */}
        {fuentePrevios === "CERTIFICADO" && (
          <div className="flex flex-cols gap-2 mt-0">
            <div className="w-40">
              <Label className="text-[11px]">Renta bruta total (S/.)</Label>
              <Input
                value={certificadoQuinta.renta_bruta_total}
                onChange={(e) => onCertificadoChange({ ...certificadoQuinta, renta_bruta_total: e.target.value })}
              />
              {errors?.cert_renta && <p className="text-red-600">{errors.cert_renta}</p>}
            </div>
            <div className="w-40">
              <Label className="text-[11px]">Retenciones previas (S/.)</Label>
              <Input
                value={certificadoQuinta.retenciones_previas}
                onChange={(e) => onCertificadoChange({ ...certificadoQuinta, retenciones_previas: e.target.value })}
              />
              {errors?.cert_ret && <p className="text-red-600">{errors.cert_ret}</p>}
            </div>
          </div>
        )}

        {fuentePrevios === "SIN_PREVIOS" && (
          <p className="mt-2 text-yellow-700">⚠️ Requiere Declaración Jurada firmada por el trabajador.</p>
        )}
      </div>
    </div>
  );
}