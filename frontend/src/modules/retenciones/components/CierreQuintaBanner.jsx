import { useState, useCallback } from 'react';

export default function CierreQuintaBanner({ cerrado, periodo, onCloseClick, loading }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleAskClose = useCallback(() => setConfirmOpen(true), []);
  const handleCancel = useCallback(() => setConfirmOpen(false), []);

  const handleConfirm = useCallback(async () => {
    try {
      const ok = await (onCloseClick?.() ?? false);
      if (ok) setConfirmOpen(false); 
    } catch {}
  }, [onCloseClick]);

  if (cerrado) {
    return (
      <div className="mb-3 rounded-xl border border-innova-orange/50 bg-innova-orange text-white p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm">
            Periodo <b>{periodo}</b> está <b>cerrado</b>. Solo consulta.
          </p>
        </div>
      </div>
    );
  }

  // ---- Banner cuando el período está ABIERTO ----
  return (
    <>
      {periodo && periodo !== '0000-00' && (
        <div className="mb-3 rounded-xl border border-innova-blue/40 bg-innova-blue text-white p-3 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm">
              Periodo <b>{periodo}</b> está <b>abierto</b>. Puedes calcular y recalcular.
            </p>
            <button
              type="button"
              onClick={handleAskClose}
              disabled={loading}
              className="px-3 py-1.5 rounded-lg bg-innova-orange hover:opacity-90 text-white text-sm disabled:opacity-50"
            >
              Cerrar período
            </button>
          </div>
        </div>
      )}

      {/* Modal de confirmación */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            aria-hidden="true"
            onClick={loading ? undefined : handleCancel}
          />
          <div className="relative mx-auto mt-24 w-[min(520px,92vw)] rounded-xl bg-white text-slate-800 dark:bg-slate-900 dark:text-slate-100 shadow-xl ring-1 ring-black/10 p-5">
            <h3 className="text-base font-semibold mb-1">Confirmar cierre de período</h3>
            <p className="text-sm mb-3">
              Estás a punto de <b>cerrar</b> el período <b>{periodo}</b> para esta filial.
              Después de cerrar:
            </p>
            <ul className="list-disc pl-5 text-sm space-y-1 mb-4">
              <li>No podrás crear cálculos individuales ni masivos.</li>
              <li>No podrás recalcular ni eliminar cálculos existentes.</li>
              <li>Solo podrás <b>consultar</b> la información.</li>
            </ul>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={loading}
                className="px-3 py-1.5 rounded-lg bg-innova-orange text-white text-sm hover:opacity-90 disabled:opacity-50"
              >
                {loading ? 'Cerrando…' : 'Sí, cerrar período'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
