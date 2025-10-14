import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useSinPrevios } from "../hooks/useSinPrevios";
import { resolveFileUrl } from "@/utils/files";

// INNOVA PRO+ v1.1.2 — Sin Previos: selector con nombres de meses
const MESES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
];

export default function SinPreviosModal({ open, onClose, dni, anio, onSaved, prefill }) {
  const sinPrevios = useSinPrevios({ open, dni, anio, prefill });

  const handleSave = async () => {
    const saved = await sinPrevios.save();
    onSaved?.({ sinPrevios: saved.sinPrevios });
    onClose?.();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v)=>{
        if (!v) { sinPrevios.reset(); onClose?.(); }
        if (v)   { sinPrevios.reload?.(); }
      }}
    >
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Declaración jurada: sin ingresos previos</DialogTitle>
          <DialogDescription>
            Desde el mes que indiques, <b>no se considerará ningún ingreso previo</b> para Quinta Categoría. Solo proyecciones.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between">
          <div>
            <Label className="block text-xs">Aplicar declaración jurada</Label>
            <p className="text-[11px] text-muted-foreground">Si está activo, el cálculo usará ingresos previos = 0.</p>
          </div>
          <Switch checked={sinPrevios.sinPrevios} onCheckedChange={sinPrevios.setSinPrevios}/>
        </div>

        <div className="grid gird-cols-2 gap-3 mt-3">
          <div>
            <Label className="block">Aplica desde el mes</Label>
            <select
              className="mt-1 w-full h-9 border rounded-md px-2 bg-background"
              value={sinPrevios.aplicaDesdeMes}
              onChange={(e)=>sinPrevios.setAplicaDesdeMes(e.target.value)}
              disabled={!sinPrevios.sinPrevios || sinPrevios.loading}
            >
              <option value="">-- Seleccionar --</option>
              {MESES.map((mes, i) => (
                <option key={i+1} value={String(i+1)}>
                  {mes}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-muted-foreground mt-1">Ej.: Mayo, Junio, Julio…</p>
          </div>
          <div>
            <Label className="block">Observaciones (opcional)</Label>
            <Input
              placeholder="Ej: Declaración firmada en RR.HH."
              value={sinPrevios.observ}
              onChange={(e)=>sinPrevios.setObserv(e.target.value)}
              disabled={!sinPrevios.sinPrevios || sinPrevios.loading}
            />
          </div>
        </div>

        <div className="mt-3">
          <Label>Declaración jurada (PDF/JPG/PNG)</Label>
          <Input type="file" accept=".pdf,image/*" onChange={(e)=>sinPrevios.onArchivoChange?.(e.target.files?.[0] || null)} />
          {!!sinPrevios.archivoUrl && (
            <p className="text-[11px] mt-1">
              Actual: <a className="text-blue-600 underline" href={resolveFileUrl(sinPrevios.archivoUrl)} target="_blank" rel="noreferrer">Ver documento</a>
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={sinPrevios.loading}>Cancelar</Button>
          <Button
            onClick={handleSave}
            disabled={
              sinPrevios.loading ||
              !sinPrevios.sinPrevios ||
              !sinPrevios.aplicaDesdeMes
            }
          >
            {sinPrevios.loading ? "Guardando..." : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}