import { AnimatePresence, motion } from "framer-motion";

/**
 * Layout del Wizard de CONTRATOS.
 * - pasoActual es 1-based (1..N)
 * - onPasoClick recibe también 1..N
 */
export default function WizardLayoutContrato({
  titulo,
  subtitulo,
  pasos = [],
  pasoActual = 1,          // 1..N
  children,               // componente de Éxito
  exito = false,
  onPasoClick,
  onAtras,
  onSiguiente,
  onGuardar,
  guardando = false,
}) {
  const idx = Math.max(0, Math.min(pasos.length - 1, (pasoActual || 1) - 1));
  const ComponentePaso = pasos[idx]?.componente;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <header className="mb-6">
        <motion.h2
          className="text-2xl md:text-3xl font-semibold tracking-tight"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {titulo || "Generar Contrato"}
        </motion.h2>
        {subtitulo && (
          <p className="text-sm text-muted-foreground mt-1">{subtitulo}</p>
        )}
      </header>

      {/* Steps */}
      <nav className="mb-6">
        <ol className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-3">
          {pasos.map((p, i) => {
            const stepNumber = i + 1;
            const active = pasoActual === stepNumber;
            const done = pasoActual > stepNumber;

            return (
              <li key={p.id} className="w-full">
                <button
                  type="button"
                  onClick={() => !exito && onPasoClick?.(stepNumber)}
                  className={[
                    "w-full text-left rounded-xl border px-3 py-2 transition",
                    active
                      ? "bg-primary/10 border-primary text-primary"
                      : done
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                      : "bg-card border-border text-foreground/80 hover:bg-muted",
                  ].join(" ")}
                  style={{ cursor: exito ? "default" : "pointer" }}
                  disabled={!!exito}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={[
                        "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                        active
                          ? "bg-primary text-primary-foreground"
                          : done
                          ? "bg-emerald-500 text-white"
                          : "bg-muted text-foreground/70",
                      ].join(" ")}
                    >
                      {stepNumber}
                    </span>
                    <span className="text-sm font-medium truncate">{p.titulo}</span>
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Body */}
      <section className="relative rounded-2xl border border-border bg-card p-4 md:p-6 shadow-sm">
        {guardando ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Guardando contrato…</p>
          </div>
        ) : exito ? (
          children
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.2 }}
              className="min-h-[300px]"
            >
              {ComponentePaso ? <ComponentePaso /> : null}
            </motion.div>
          </AnimatePresence>
        )}
      </section>

      {/* Footer */}
      {!exito && (
        <footer className="mt-6 flex items-center justify-between">
          <div />
          <div className="flex gap-2">
            {pasoActual > 1 && (
              <button
                type="button"
                onClick={onAtras}
                className="px-4 py-2 rounded-lg border bg-background hover:bg-muted transition text-sm"
              >
                Anterior
              </button>
            )}
            {pasoActual < pasos.length ? (
              <button
                type="button"
                onClick={onSiguiente}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition text-sm"
              >
                Siguiente
              </button>
            ) : (
              <button
                type="button"
                onClick={onGuardar}
                disabled={guardando}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:opacity-90 disabled:opacity-60 transition text-sm"
              >
                {guardando ? "Guardando…" : "Guardar Contrato"}
              </button>
            )}
          </div>
        </footer>
      )}
    </div>
  );
}