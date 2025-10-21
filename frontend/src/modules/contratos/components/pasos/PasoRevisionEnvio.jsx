import { useWizardContratoContext } from "../../context/WizardContratoContext";
import { useRegistrarContrato } from "../../hooks/useRegistrarContrato";
import { useMemo, useState } from "react";

function Item({ label, children }) {
  return (
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <div className="text-sm font-medium text-gray-900">{children ?? "—"}</div>
    </div>
  );
}

export default function PasoRevisionEnvio() {
  const { formData } = useWizardContratoContext();
  const { payloadContrato } = useRegistrarContrato(5);
  const [mostrarJSON, setMostrarJSON] = useState(false);

  const jsonPretty = useMemo(() => {
    try { return JSON.stringify(payloadContrato, null, 2); }
    catch { return "// Error generando vista previa del payload"; }
  }, [payloadContrato]);

  const cot = formData?.cotizacion || {};
  const legales = formData?.legales || {};
  const val = formData?.valorizacion || {};
  const firmas = formData?.firmas || {};
  const envio = formData?.envio || {};

  const totalClausulas = (legales?.clausulas || []).filter(c=>c?.activo).length;
  const totalCondiciones = (legales?.condiciones_alquiler || []).length;

  const resumenValo = val?.renovaciones
    ? `${val?.requiere_adelantada ? "Adelantada" : "Regular"} · ${val.renovaciones}`
    : "No definida";

  return (
    <div className="space-y-6">
      {/* ====== RESUMEN GENERAL ====== */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Resumen</h3>

        {/* Cabecera */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Item label="Cotización">
            #{cot?.codigo_documento || cot?.id}
          </Item>
          <Item label="Cliente">
            {cot?.entidad?.cliente?.razon_social}
          </Item>
          <Item label="Obra">
            {cot?.entidad?.obra?.nombre}
          </Item>
        </div>

        {/* Fechas / Totales */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Item label="Totales">
            S/ {cot?.totales?.subtotal ?? 0} · S/ {cot?.totales?.igv ?? 0} ·{" "}
            <span className="font-semibold">S/ {cot?.totales?.total ?? 0}</span>
          </Item>
          <Item label="Valorización">
            {resumenValo}
          </Item>
          <Item label="Filial">
            {cot?.entidad?.filial?.razon_social}
          </Item>
        </div>

        {/* Legales / Firmas */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-gray-200 p-4">
            <p className="mb-3 text-sm font-semibold text-gray-900">Legales</p>
            <ul className="text-sm text-gray-700 space-y-1 list-disc pl-5">
              <li><strong>Cláusulas activas:</strong> {totalClausulas}</li>
              <li><strong>Vigencia:</strong> {(legales?.vigencia?.inicio || "—") + " — " + (legales?.vigencia?.fin || "—")}</li>
            </ul>
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <p className="mb-3 text-sm font-semibold text-gray-900">Firmas a imprimir en PDF</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 text-xs uppercase">Emisor (Filial)</p>
                <div className="font-medium">{firmas?.firmante_emisor?.nombre || "—"}</div>
                <div className="text-gray-600">{firmas?.firmante_emisor?.cargo}</div>
                <div className="text-gray-600">{firmas?.firmante_emisor?.documento}</div>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase">Receptor (Cliente)</p>
                <div className="font-medium">{firmas?.firmante_receptor?.nombre || "—"}</div>
                <div className="text-gray-600">{firmas?.firmante_receptor?.cargo}</div>
                <div className="text-gray-600">{firmas?.firmante_receptor?.documento}</div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* ====== PREVIEW DEL PAYLOAD ====== */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Vista previa del payload</h3>
          <button
            type="button"
            onClick={() => setMostrarJSON(p => !p)}
            className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
          >
            {mostrarJSON ? "Ocultar JSON" : "Mostrar JSON"}
          </button>
        </div>
        {mostrarJSON && (
          <pre className="text-xs bg-gray-50 border rounded-lg p-3 overflow-x-auto max-h-[420px]">
            {jsonPretty}
          </pre>
        )}
      </section>
    </div>
  );
}