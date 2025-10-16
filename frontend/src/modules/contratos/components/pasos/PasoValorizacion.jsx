// INNOVA PRO+ v1.2.0 — Contratos: Paso 3 (Valorización)
import { useWizardContratoContext } from "../../context/WizardContratoContext";

export default function PasoValorizacion() {
  const { formData, setFormData } = useWizardContratoContext();
  const val = formData.valorizacion || {};

  const onChange = (path, value) => {
    setFormData((prev) => {
      const next = structuredClone(prev);
      const seg = path.split(".");
      let ref = next;
      for (let i = 0; i < seg.length - 1; i++) ref = ref[seg[i]];
      ref[seg.at(-1)] = value;
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border p-4">
        <h3 className="font-semibold">Tipo de valorización</h3>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <input
              id="requiere_adelantada"
              type="checkbox"
              className="rounded"
              checked={!!val.requiere_adelantada}
              onChange={(e) => onChange("valorizacion.requiere_adelantada", e.target.checked)}
            />
            <label htmlFor="requiere_adelantada" className="text-sm">
              Requiere valorización adelantada
            </label>
          </div>
          <div>
            <label className="text-sm">Renovaciones</label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              placeholder="Ej: mensual, quincenal, personalizado"
              value={val.renovaciones || ""}
              onChange={(e) => onChange("valorizacion.renovaciones", e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border p-4">
        <h3 className="font-semibold">Totales base (heredados de la cotización)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 text-sm">
          <div>
            <p className="text-muted-foreground">Subtotal</p>
            <p className="font-semibold">
              S/ {formData?.cotizacion?.totales?.subtotal ?? 0}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">IGV</p>
            <p className="font-semibold">
              S/ {formData?.cotizacion?.totales?.igv ?? 0}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Total</p>
            <p className="font-semibold">
              S/ {formData?.cotizacion?.totales?.total ?? 0}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}