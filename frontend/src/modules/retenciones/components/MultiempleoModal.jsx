// INNOVA PRO+ v1.2.0
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { resolveFileUrl } from "@/utils/files";
import useMultiempleo from "../hooks/useMultiempleo";

export default function MultiempleoModal({ open, onClose, dni, anio, onSaved }) {
  const m = useMultiempleo({ open, dni, anio });

  const handleSave = async () => {
    const saved = await m.save();
    onSaved?.({ multi: saved });
    onClose?.();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose?.()}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Declaración jurada de multiempleo</DialogTitle>
        </DialogHeader>

        {/* Documento */}
        <div className="space-y-2">
          <Label className="text-xs">Documento soporte (PDF/JPG/PNG)</Label>
          <Input type="file" accept=".pdf,image/*" onChange={(e) => m.onArchivoChange(e.target.files?.[0] || null)} />
          {!!m.archivoUrl && (
            <p className="text-[11px]">
              Actual:{" "}
              <a className="text-blue-600 underline" href={resolveFileUrl(m.archivoUrl)} target="_blank" rel="noreferrer">
                Ver documento
              </a>
            </p>
          )}
        </div>

        {/* Detalles mínimos consistentes con backend actual */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <Label className="text-xs">Aplica desde (mes)</Label>
            <select
              className="border rounded p-1 text-xs w-full"
              value={m.aplica_desde_mes}
              onChange={(e) => m.setAplicaDesdeMes(e.target.value)}
            >
              <option value="">-- Seleccionar --</option>
              {Array.from({ length: 12 }).map((_, i) => (
                <option key={i + 1} value={String(i + 1)}>
                  {["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"][i]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <div className="flex items-center gap-2">
              <Switch checked={!!m.es_secundaria} onCheckedChange={(v) => m.setEsSecundaria(v)} />
              <span className="text-xs">Somos secundarios (no retener)</span>
            </div>
          </div>

          <div className="col-span-2 grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">RUC empleador principal (si aplica)</Label>
              <Input
                value={m.principal_ruc}
                onChange={(e) => m.setPrincipalRuc(e.target.value)}
                placeholder="Opcional si somos secundarios"
                disabled={m.es_secundaria}
              />
            </div>
            <div>
              <Label className="text-xs">Razón social empleador principal</Label>
              <Input
                value={m.principal_nombre}
                onChange={(e) => m.setPrincipalNombre(e.target.value)}
                placeholder="Opcional si somos secundarios"
                disabled={m.es_secundaria}
              />
            </div>
          </div>

          <div className="col-span-2">
            <Label className="text-xs">Observaciones</Label>
            <Input value={m.observaciones} onChange={(e) => m.setObservaciones(e.target.value)} />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="ghost" onClick={onClose} disabled={m.loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              m.loading ||
              !m.aplica_desde_mes // pedimos al menos el mes de inicio
            }
          >
            {m.loading ? "Guardando..." : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}