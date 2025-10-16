import usePasoCondicionesLegales from "../../hooks/paso-condiciones-legales/usePasoCondicionesLegales";

export default function PasoCondicionesLegales() {
  const {
    loading,
    vigencia,
    usarFija15,
    setVigencia,
    setPoliticaVigencia,
    estadoProyectado,
    diasRestantes,

    condicionesDefinidas,
    condicionesCumplidas,
    observacion,

    clausulas,
    toggleClausula,
    agregarClausulaManual,
    editarClausula,
    eliminarClausula,

  } = usePasoCondicionesLegales();

  return (
    <div className="space-y-6">
      {/* Vigencia */}
      <section className="rounded-xl border p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold">Vigencia</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Estado proyectado:</span>
            <span
              className={[
                "text-xs font-semibold px-2 py-1 rounded-full border",
                estadoProyectado === "Vigente" && "border-emerald-300 text-emerald-700 bg-emerald-50",
                estadoProyectado === "Por vencer" && "border-amber-300 text-amber-700 bg-amber-50",
                estadoProyectado === "Vencido" && "border-rose-300 text-rose-700 bg-rose-50",
                estadoProyectado === "Programado" && "border-sky-300 text-sky-700 bg-sky-50",
              ].filter(Boolean).join(" ")}
            >
              {estadoProyectado}
              {Number.isFinite(diasRestantes) && estadoProyectado !== "Vencido" && (
                <span className="ml-1 opacity-70">({diasRestantes}d)</span>
              )}
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <input
            id="vig15"
            type="checkbox"
            className="rounded"
            checked={usarFija15}
            onChange={(e) => setPoliticaVigencia(e.target.checked)}
          />
          <label htmlFor="vig15" className="text-sm">
            Usar vigencia fija de <strong>15 días</strong> (recomendado)
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          <div>
            <label className="text-sm">Inicio</label>
            <input
              type="date"
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={vigencia?.inicio || ""}
              onChange={(e) => setVigencia("inicio", e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm">Fin</label>
            <input
              type="date"
              className="mt-1 w-full rounded-lg border px-3 py-2 disabled:bg-muted"
              value={vigencia?.fin || ""}
              onChange={(e) => setVigencia("fin", e.target.value)}
              disabled={usarFija15}
            />
          </div>
        </div>

        <div className="mt-3 px-3 py-2 rounded-lg border bg-muted/40 text-sm">
          <strong>Nota: </strong>Transcurrido ese periodo, deberá generarse un <strong>nuevo contrato</strong>. Los estados
          del contrato se calcularán automáticamente (Vigente / Por vencer / Vencido).
        </div>
      </section>

      {/* Condiciones de Alquiler */}
      <section className="rounded-xl border p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Condiciones de Alquiler (definidas)</h3>
          {loading && <span className="text-xs text-muted-foreground">Cargando…</span>}
        </div>

        {observacion && (
          <div className="mt-2 px-3 py-1 bg-yellow-50 text-yellow-800 rounded-md border text-sm">
            <strong>📝 Observación:</strong> {observacion}
          </div>
        )}

        {condicionesDefinidas.length ? (
          <ul className="mt-3 space-y-1 text-sm">
            {condicionesDefinidas.map((c, i) => {
              const ok = condicionesCumplidas.includes(c);
              return (
                <li key={i} className="flex items-start gap-2">
                  <span className={`mt-1 h-2 w-2 rounded-full ${ok ? "bg-emerald-500" : "bg-gray-300"}`} />
                  <span className={`${ok ? "text-emerald-700" : "text-foreground/80"}`}>{c}</span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground mt-2">No hay condiciones definidas para esta cotización.</p>
        )}

        <p className="text-xs text-muted-foreground mt-3">
          * Las cláusulas sugeridas se activan automáticamente en función de estas condiciones.
        </p>
      </section>

      {/* Términos y Condiciones */}
      <section className="rounded-xl border p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Términos y Condiciones</h3>
          <button
            type="button"
            onClick={agregarClausulaManual}
            className="rounded-lg border px-3 py-2 hover:bg-muted text-sm"
          >
            Agregar cláusula manual
          </button>
        </div>

        <div className="mt-3 space-y-3">
          {clausulas.map((c, idx) => (
            <div key={c.id || idx} className={`rounded-lg border p-3 ${c.fija ? "bg-muted/30" : ""}`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={c.activo !== false}
                    onChange={() => toggleClausula(idx)}
                  />
                  <input
                    className="rounded-lg border px-3 py-2 text-sm w-72"
                    placeholder="Título"
                    value={c.titulo || ""}
                    onChange={(e) => editarClausula(idx, "titulo", e.target.value)}
                    disabled={c.fija === true}
                  />
                </div>

                {!c.fija && (
                  <button
                    type="button"
                    onClick={() => eliminarClausula(idx)}
                    className="rounded-lg border px-3 py-2 hover:bg-muted text-sm"
                  >
                    Quitar
                  </button>
                )}
              </div>

              <textarea
                className="mt-2 w-full rounded-lg border px-3 py-2 text-sm min-h-[80px]"
                placeholder="Texto de la cláusula"
                value={c.texto || ""}
                onChange={(e) => editarClausula(idx, "texto", e.target.value)}
                disabled={c.fija === true}
              />
              {c.fija && <p className="text-[11px] text-muted-foreground mt-1">* Cláusula fija</p>}
            </div>
          ))}

          {!clausulas.length && (
            <p className="text-sm text-muted-foreground">No hay cláusulas configuradas.</p>
          )}
        </div>
      </section>

    </div>
  );
}