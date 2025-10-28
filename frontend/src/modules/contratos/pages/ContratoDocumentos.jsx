import { useParams } from "react-router-dom";
import { useContratoDocumentos } from "../hooks/useContratoDocumentos";

export default function ContratoDocumentos() {
  const { contratoId } = useParams();
  const { ui, state, actions, derived } = useContratoDocumentos({ contratoId });

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      {/* HEADER */}
      <header className="rounded-xl border bg-white shadow-sm px-5 py-4 flex items-start md:items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-s font-semibold">
            Documentos del Contrato #{state.codigoContrato}
          </h1>
          <p className="text-xs text-gray-500">
            Gestión de documentos: generación, revisión, carga final y oficialización.
          </p>
        </div>

        <span
          className={[
            "px-3 py-1 text-[11px] font-semibold rounded-full border",
            derived.oficializado
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-innova-orange/10 text-innova-orange border-innova-orange/30",
          ].join(" ")}
        >
          {derived.oficializado ? "OFICIALIZADO" : "NO OFICIAL"}
        </span>
      </header>

      {/* LAYOUT PRINCIPAL: Historial + Acciones*/}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* HISTORIAL */}
        <section className="lg:col-span-2 rounded-xl border bg-white shadow-sm">
          <div className="px-5 py-4 border-b">
            <h2 className="text-base font-semibold">Historial de versiones</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Registra cada generación, carga final y estado de oficialización.
            </p>
          </div>

          {state.historial.length === 0 ? (
            <div className="text-center text-gray-500 text-sm py-10">
              Aún no hay documentos generados para este contrato.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 border-y">
                  <tr className="text-left text-gray-600">
                    <th className="py-2.5 px-4">Versión</th>
                    <th className="py-2.5 px-4">Estado</th>
                    <th className="py-2.5 px-4">DOCX</th>
                    <th className="py-2.5 px-4">PDF</th>
                    <th className="py-2.5 px-4">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {state.historial.map((h) => (
                    <tr key={h.id} className="border-b hover:bg-gray-50">
                      <td className="py-2.5 px-4">v{h.version}</td>
                      <td className="py-2.5 px-4">{h.estado}</td>
                      <td className="py-2.5 px-4">
                        {h.docx_url ? (
                          <a
                            href={h.docx_url}
                            className="text-innova-blue underline"
                            target="_blank"
                            rel="noreferrer"
                          >
                            Ver DOCX
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="py-2.5 px-4">
                        {h.pdf_url ? (
                          <a
                            href={h.pdf_url}
                            className="text-innova-blue underline"
                            target="_blank"
                            rel="noreferrer"
                          >
                            Ver PDF
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="py-2.5 px-4">
                        {new Date(h.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ACCIONES */}
        <aside className="space-y-4">
          {/* GENERAR DOCUMENTO */}
          <section className="rounded-xl border bg-white shadow-sm">
            <div className="px-5 py-3 border-b">
              <h3 className="text-sm font-semibold">Generar documento</h3>
              <p className="text-[11px] text-gray-500">
                Generación automática del Word usando la data del contrato.
              </p>
            </div>
            <div className="px-5 py-4 space-y-2">
              <button
                onClick={actions.renderDocumento}
                disabled={state.loading}
                className="w-full rounded-lg bg-innova-blue text-white text-sm py-2.5 hover:brightness-110 disabled:opacity-50"
              >
                {state.loading ? "Generando..." : "Generar Documento Word"}
              </button>

              {state.docxGenerado && (
                <a
                  href={state.docxGenerado}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-xs text-innova-blue underline text-center"
                >
                  Descargar documento generado
                </a>
              )}
            </div>
          </section>

          {/* SUBIR FINAL / OFICIALIZAR */}
          <section className="rounded-xl border bg-white shadow-sm">
            <div className="px-5 py-3 border-b">
              <h3 className="text-sm font-semibold">Subir final / Oficializar</h3>
              <p className="text-[11px] text-gray-500">
                Carga los archivos finales y procede a oficializar.
              </p>
            </div>

            <div className="px-5 py-4 space-y-3">
              <div>
                <label className="text-[12px] font-medium">Final (.docx)</label>
                <input
                  ref={ui.refDocx}
                  type="file"
                  accept=".docx"
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="text-[12px] font-medium">Final (.pdf)</label>
                <input
                  ref={ui.refPdf}
                  type="file"
                  accept="application/pdf"
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-xs"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={actions.subirFinal}
                  disabled={state.loading}
                  className="flex-1 rounded-lg bg-innova-blue text-white text-sm py-2 hover:brightness-110 disabled:opacity-50"
                >
                  {ui.buttonSubir}
                </button>
                <button
                  type="button"
                  onClick={actions.oficializar}
                  disabled={state.loading || derived.oficializado}
                  className="flex-1 rounded-lg bg-innova-orange text-white text-sm py-2 hover:brightness-110 disabled:opacity-50"
                >
                  {ui.buttonOficializar}
                </button>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}