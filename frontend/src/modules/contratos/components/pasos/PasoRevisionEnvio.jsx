// INNOVA PRO+ v1.2.0 — Contratos: Paso 5 (Revisión y Envío con preview del payload)
import { useWizardContratoContext } from "../../context/WizardContratoContext";
import { useRegistrarContrato } from "../../hooks/useRegistrarContrato";
import { useMemo, useState } from "react";

export default function PasoRevisionEnvio() {
  const { formData, setFormData } = useWizardContratoContext();
  const { payloadContrato } = useRegistrarContrato(5); // obtenemos el payload armado
  const envio = formData.envio || {};

  const [mostrarJSON, setMostrarJSON] = useState(false);

  const onToggle = (path, checked) => {
    setFormData((prev) => {
      const next = structuredClone(prev);
      const seg = path.split(".");
      let ref = next;
      for (let i = 0; i < seg.length - 1; i++) ref = ref[seg[i]];
      ref[seg.at(-1)] = checked;
      return next;
    });
  };

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

  // Serialización legible del payload (formateado)
  const jsonPretty = useMemo(() => {
    try {
      return JSON.stringify(payloadContrato, null, 2);
    } catch {
      return "// Error generando vista previa del payload";
    }
  }, [payloadContrato]);

  return (
    <div className="space-y-6">
      {/* ==================== RESUMEN ==================== */}
      <section className="rounded-xl border p-4">
        <h3 className="font-semibold">Resumen</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mt-3">
          <div>
            <p className="text-muted-foreground">Cotización</p>
            <p className="font-semibold">
              #{formData?.cotizacion?.codigo_documento || formData?.cotizacion?.id || "—"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Cliente</p>
            <p className="font-semibold">
              {formData?.cotizacion?.entidad?.cliente?.razon_social || "—"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Obra</p>
            <p className="font-semibold">
              {formData?.cotizacion?.entidad?.obra?.nombre || "—"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mt-3">
          <div>
            <p className="text-muted-foreground">Vigencia</p>
            <p>
              {formData?.legales?.vigencia?.inicio || "—"} —{" "}
              {formData?.legales?.vigencia?.fin || "—"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Subtotal / IGV / Total</p>
            <p>
              S/ {formData?.cotizacion?.totales?.subtotal ?? 0} · S/{" "}
              {formData?.cotizacion?.totales?.igv ?? 0} ·{" "}
              <span className="font-semibold">
                S/ {formData?.cotizacion?.totales?.total ?? 0}
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* ==================== ENVÍO ==================== */}
      <section className="rounded-xl border p-4">
        <h3 className="font-semibold">Envío (opcional)</h3>
        <div className="mt-3 space-y-3">
          <div className="flex items-center gap-2">
            <input
              id="enviar_correo"
              type="checkbox"
              className="rounded"
              checked={!!envio.enviar_correo}
              onChange={(e) =>
                onToggle("envio.enviar_correo", e.target.checked)
              }
            />
            <label htmlFor="enviar_correo" className="text-sm">
              Enviar correo automáticamente
            </label>
          </div>

          {envio.enviar_correo && (
            <>
              <div>
                <label className="text-sm">Destinatarios (coma “,” para separar)</label>
                <input
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                  placeholder="cliente@dominio.com, admin@innova.com"
                  value={envio.destinatarios?.join(", ") || ""}
                  onChange={(e) =>
                    onChange(
                      "envio.destinatarios",
                      e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                    )
                  }
                />
              </div>

              <div>
                <label className="text-sm">Asunto</label>
                <input
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                  value={envio.asunto || ""}
                  onChange={(e) => onChange("envio.asunto", e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm">Cuerpo</label>
                <textarea
                  className="mt-1 w-full rounded-lg border px-3 py-2 min-h-[120px]"
                  value={envio.cuerpo || ""}
                  onChange={(e) => onChange("envio.cuerpo", e.target.value)}
                />
              </div>
            </>
          )}
        </div>
      </section>

      {/* ==================== PREVIEW DEL PAYLOAD ==================== */}
      <section className="rounded-xl border p-4 bg-muted/40">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Vista previa del payload</h3>
          <button
            type="button"
            onClick={() => setMostrarJSON((p) => !p)}
            className="rounded-lg border px-3 py-2 text-sm hover:bg-muted"
          >
            {mostrarJSON ? "Ocultar" : "Mostrar JSON"}
          </button>
        </div>

        {mostrarJSON && (
          <pre className="text-xs bg-background border rounded-lg p-3 overflow-x-auto max-h-[400px]">
            {jsonPretty}
          </pre>
        )}
      </section>
    </div>
  );
}