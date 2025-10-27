import { usePasoValorizacion } from "../../hooks/paso-valorizacion/usePasoValorizacion";
import { Tooltip } from "../../utils/helpers";

export default function PasoValorizacion() {
  const {
    val,
    onChange,
    esPersonalizada,
    handleRenovacion,
    opciones,
    resumen
  } = usePasoValorizacion();

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <header className="mb-4 flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-900">Tipo de valorización</h3>
          <Tooltip
            side="right"
            label={
              <span>
                Define cómo y cuándo se <strong>valorizan</strong> los servicios/activos del contrato para su facturación.
              </span>
            }
          >
            <button
              type="button"
              aria-label="Ayuda"
              className="h-5 w-5 rounded-full border border-gray-300 text-gray-500 flex items-center justify-center text-xs"
            >
              i
            </button>
          </Tooltip>
        </header>

        {/* Adelantada vs Regular */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-start gap-3">
            <input
              id="requiere_adelantada"
              type="checkbox"
              className="mt-1 h-4 w-4 accent-emerald-600"
              checked={!!val.requiere_adelantada}
              onChange={(e) => onChange("valorizacion.requiere_adelantada", e.target.checked)}
            />
            <div className="flex-1">
              <label htmlFor="requiere_adelantada" className="block text-sm font-medium text-gray-800">
                Valorización adelantada
              </label>
              <p className="mt-1 text-xs leading-5 text-gray-600">
                {val.requiere_adelantada ? (
                  <span>
                    Se <strong>cobra antes</strong> de ejecutar el período (ej. antes de iniciar el mes o ciclo).
                  </span>
                ) : (
                  <span>
                    Se <strong>cobra al finalizar</strong> el período (regular). Úsalo si el cliente paga por consumo ya ejecutado.
                  </span>
                )}
              </p>
            </div>
            <Tooltip
              side="left"
              label={
                <div>
                  <div className="font-semibold">¿Qué significa “adelantada”?</div>
                  <ul className="mt-1 list-disc pl-4">
                    <li>Facturación previa al uso del servicio.</li>
                    <li>Mejora flujo de caja y reduce riesgo.</li>
                    <li>Acuerdos típicos en alquiler de equipos.</li>
                  </ul>
                </div>
              }
            >
              <span className="mt-0.5 h-5 w-5 cursor-help select-none rounded-full border border-gray-300 text-gray-500 text-center text-xs leading-5">
                ?
              </span>
            </Tooltip>
          </div>
        </div>

        {/* Frecuencias como “cards” seleccionables */}
        <div className="mt-6">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-sm font-medium text-gray-800">Frecuencia de renovación</span>
            <Tooltip
              side="right"
              label={
                <div>
                  <div className="font-semibold">¿Qué es una renovación?</div>
                  <p className="mt-1">
                    Es cada cuánto se <strong>cierra</strong> y <strong>valoriza</strong> el período del contrato para facturar:
                    semanal, quincenal, mensual o personalizada.
                  </p>
                </div>
              }
            >
              <span className="h-5 w-5 cursor-help select-none rounded-full border border-gray-300 text-gray-500 text-center text-xs leading-5">
                i
              </span>
            </Tooltip>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {opciones.map((opt) => {
              const selected = val.renovaciones === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleRenovacion(opt.value)}
                  className={[
                    "group rounded-xl border px-4 py-3 text-left transition-all",
                    selected
                      ? "border-emerald-500 ring-2 ring-emerald-100 bg-white"
                      : "border-gray-200 hover:border-gray-300 bg-white",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{opt.label}</span>
                    <span
                      className={[
                        "ml-3 inline-flex h-5 w-5 items-center justify-center rounded-full border text-xs",
                        selected
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : "border-gray-300 text-gray-400",
                      ].join(" ")}
                    >
                      {selected ? "✓" : ""}
                    </span>
                  </div>
                  {opt.hint && (
                    <p className="mt-1 text-xs text-gray-600">{opt.hint}</p>
                  )}
                </button>
              );
            })}
          </div>

          {/* Campo extra si es personalizada */}
          {esPersonalizada && (
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="col-span-1 sm:col-span-2">
                <label className="text-xs font-medium text-gray-700">
                  Describe la regla de renovación
                </label>
                <input
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  placeholder="Ej.: cada 10 días / cada 45 días / 1 y 15 de cada mes"
                  value={val.personalizada_descripcion || ""}
                  onChange={(e) =>
                    onChange("valorizacion.personalizada_descripcion", e.target.value)
                  }
                />
                <p className="mt-1 text-[11px] text-gray-500">
                  Este texto aparecerá en el contrato y en la orden de facturación.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Resumen visual */}
        <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          <strong>Configuración seleccionada: </strong>
          {resumen}
        </div>
      </section>
    </div>
  );
}