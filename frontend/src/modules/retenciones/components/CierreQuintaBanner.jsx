import { useState, useCallback, useMemo } from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CierreQuintaBanner({
  cerrado,
  periodo,
  loading,
  onCloseClick,
  filialesGenerales = [],
  filialId,                
  onSelectFilial,           
}) {

  const opciones = useMemo(() => (filialesGenerales || []).map(f => ({
    value: String(f.id),
    label: f.razon_social || `Filial ${f.id}`,
    raw: f
  })), [filialesGenerales]);

  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleAskClose = useCallback(() => setConfirmOpen(true), []);
  const handleCancel = useCallback(() => setConfirmOpen(false), []);

  const handleConfirm = useCallback(async () => {
    const fId = Number(filialId || 0);
    if (!fId) return;
    const ok = await (onCloseClick?.({ periodo, filial_id: fId }) ?? false);
    if (ok) setConfirmOpen(false);
  }, [onCloseClick, filialId, periodo]);

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
            <h3 className="text-base font-semibold mb-3">Confirmar cierre de período</h3>

            <div className="grid gap-2 min-w-0 mb-3">
              <div className="grid gap-0.5">
                <Label className="text-[10px]">Filial</Label>
                <Select
                  value={String(filialId || "")}
                  onValueChange={(v) => {
                    const sel = opciones.find(o => o.value === v)?.raw;
                    onSelectFilial?.(v, sel ? { id: sel.id, razon_social: sel.razon_social } : null);
                  }}
                  disabled={!opciones.length || loading}
                >
                  <SelectTrigger className="h-8 truncate w-full text-[12px]">
                    <SelectValue placeholder={opciones.length ? "Selecciona la filial" : "Sin filiales registradas"} />
                  </SelectTrigger>
                  <SelectContent>
                    {opciones.map(o => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="text-xs text-slate-500">
                Estás a punto de <b>cerrar</b> el período <b>{periodo}</b> para la filial seleccionada.
              </div>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>No podrás crear cálculos individuales ni masivos.</li>
                <li>No podrás recalcular ni eliminar cálculos existentes.</li>
                <li>Solo podrás <b>consultar</b> la información.</li>
              </ul>
            </div>

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
                disabled={loading || !filialId}
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