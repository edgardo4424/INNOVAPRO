import { useParams } from "react-router-dom";
import { useContratoDocumentos } from "../hooks/useContratoDocumentos";

export default function ContratoDocumentos() {
  const { contratoId } = useParams();
  const {
    ui, state, actions, derived,
  } = useContratoDocumentos({ contratoId });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <header className="rounded-2xl border p-5 bg-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold">Documentos del Contrato #{contratoId}</h1>
            <p className="text-sm text-gray-500">
              Genera el DOCX desde plantilla, descarga/edita si es necesario y sube la versión final. Puedes oficializar cuando esté firmado.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${derived.oficializado ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
              {derived.oficializado ? "OFICIALIZADO" : "NO OFICIAL"}
            </span>
          </div>
        </div>
      </header>

      {/* Selección de plantilla + JSON */}
      <section className="rounded-2xl border p-5 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">1) Selección de plantilla</h2>
          <div className="text-xs text-gray-500">
            Filial: <b>{state.filialId ?? "-"}</b>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-4">
          <div className="md:col-span-1 space-y-2">
            {/* USO (carpeta) */}
            <label className="text-sm font-medium">Uso / Carpeta</label>
            <select
            className="w-full rounded-xl border px-3 py-2"
            value={state.uso || ""}
            onChange={(e) => { actions.setUso(e.target.value); actions.reloadPlantillas(); }}
            >
            <option value="">-- Todos los usos de la filial --</option>
            {state.arbol
                .find(f => f.filial_id === Number(state.filialId))?.usos
                .map(u => <option key={u.uso} value={u.uso}>{u.uso} ({u.count})</option>)
            }
            </select>

            {/* Plantilla */}
            <label className="text-sm font-medium mt-2 block">Plantilla</label>
            <select
              className="w-full rounded-xl border px-3 py-2"
              value={state.plantillaId || ""}
              onChange={(e) => actions.setPlantillaId(Number(e.target.value))}
            >
              <option value="">-- Selecciona --</option>
              {state.plantillas.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nombre} · {p.uso} · v{p.version}
                </option>
              ))}
            </select>
            <button
              className="w-full rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
              onClick={actions.reloadPlantillas}
              disabled={state.loading}
            >
              {state.loading ? "Cargando..." : "Refrescar plantillas"}
            </button>
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Data de Merge</label>
              <div className="text-xs text-gray-500">{derived.isDataValid ? "JSON válido" : "JSON inválido"}</div>
            </div>
            <textarea
              className="mt-2 h-56 w-full rounded-xl border px-3 py-2 font-mono text-xs"
              value={state.mergeData}
              onChange={(e) => actions.setMergeData(e.target.value)}
            />
            <div className="mt-3 flex items-center gap-3">
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={state.generarPdf}
                  onChange={(e) => actions.setGenerarPdf(e.target.checked)}
                />
                Intentar generar PDF en el servidor
              </label>
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={actions.renderDocumento}
                  disabled={state.loading || !state.plantillaId || !derived.isDataValid}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {ui.buttonGenerar}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Acciones Finalización */}
      <section className="rounded-2xl border p-5 bg-white shadow-sm">
        <h2 className="text-lg font-semibold">2) Subir “Contrato final” y/oficializar</h2>
        <p className="text-sm text-gray-500">Sube el documento revisado/firmado. Puedes oficializar si el documento físico ya está firmado (cliente).</p>

        <form className="mt-4 grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">Final .docx (opcional)</label>
            <input ref={ui.refDocx} type="file" accept=".docx" className="mt-2 w-full rounded-xl border px-3 py-2" />
          </div>
          <div>
            <label className="text-sm font-medium">Final .pdf (opcional)</label>
            <input ref={ui.refPdf} type="file" accept="application/pdf" className="mt-2 w-full rounded-xl border px-3 py-2" />
          </div>
          <div className="flex items-end gap-2">
            <button
              type="button"
              onClick={actions.subirFinal}
              disabled={state.loading}
              className="w-full rounded-xl bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {ui.buttonSubir}
            </button>
            <button
              type="button"
              onClick={actions.oficializar}
              disabled={state.loading || derived.oficializado}
              className="w-full rounded-xl bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {ui.buttonOficializar}
            </button>
          </div>
        </form>
      </section>

      {/* Historial */}
      <section className="rounded-2xl border p-5 bg-white shadow-sm">
        <h2 className="text-lg font-semibold">Historial de documentos</h2>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="py-2">Versión</th>
                <th className="py-2">Estado</th>
                <th className="py-2">DOCX</th>
                <th className="py-2">PDF</th>
                <th className="py-2">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {state.historial.map(h => (
                <tr key={h.id} className="border-t">
                  <td className="py-2">v{h.version}</td>
                  <td className="py-2">{h.estado}</td>
                  <td className="py-2">
                    {h.docx_url ? (
                      <a className="text-blue-600 underline" href={h.docx_url} target="_blank" rel="noreferrer">Descargar</a>
                    ) : "-"}
                  </td>
                  <td className="py-2">
                    {h.pdf_url ? (
                      <a className="text-blue-600 underline" href={h.pdf_url} target="_blank" rel="noreferrer">Descargar</a>
                    ) : "-"}
                  </td>
                  <td className="py-2">{new Date(h.created_at).toLocaleString()}</td>
                </tr>
              ))}
              {state.historial.length === 0 && (
                <tr><td className="py-8 text-center text-gray-500" colSpan={5}>Aún no hay documentos generados</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}