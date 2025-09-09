import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { resolveFileUrl } from "@/utils/files";
import { useMultiempleo } from "../hooks/useMultiempleo";

export default function MultiempleoModal({ open, onClose, dni, anio, currentFilialId, onSaved }) {
  const m = useMultiempleo({ open, dni, anio, currentFilialId });

  const handleSave = async () => {
    const saved = await m.save();
    onSaved?.({ multi: saved });
    onClose?.();
  };

  return (
    <Dialog open={open} onOpenChange={(v)=>!v && onClose?.()}>
      <DialogContent className="sm:max-w-[680px]">
        <DialogHeader>
          <DialogTitle>Multiempleo</DialogTitle>
        </DialogHeader>

        {/* Documento */}
        <div className="space-y-2">
          <Label className="text-xs">Documento soporte (PDF/JPG/PNG)</Label>
          <Input type="file" accept=".pdf,image/*" onChange={(e)=>m.onArchivoChange(e.target.files?.[0] || null)} />
          {!!m.archivoUrl && (
            <p className="text-[11px]">
              Actual:{" "}
              <a className="text-blue-600 underline" href={resolveFileUrl(m.archivoUrl)} target="_blank" rel="noreferrer">
                Ver documento
              </a>
            </p>
          )}
        </div>

        {/* Detalles */}
        <div className="mt-3">
          <h4 className="font-semibold text-sm mb-2">Empleadores declarados</h4>

          <div className="space-y-3 max-h-[42vh] overflow-auto pr-1">
            {m.detalles.map((det, idx) => (
              <div key={idx} className="border rounded-md p-2 text-xs grid grid-cols-2 gap-2">
                {det.tipo === "EXTERNO" ? (
                  <>
                    <div>
                      <Label>RUC</Label>
                      <Input value={det.empleador_ruc ?? ""} onChange={(e)=>m.updateDetalle(idx,"empleador_ruc", e.target.value)} />
                    </div>
                    <div>
                      <Label>Razón social</Label>
                      <Input value={det.empleador_nombre ?? ""} onChange={(e)=>m.updateDetalle(idx,"empleador_nombre", e.target.value)} />
                    </div>
                  </>
                ) : (
                  <div className="col-span-2">
                    <p><b>Filial interna:</b> {det.filial_id ?? "-"}</p>
                  </div>
                )}

                <div>
                  <Label>Renta bruta anual</Label>
                  <Input inputMode="decimal" value={det.renta_bruta_anual ?? "0"}
                    onChange={(e)=>m.updateDetalle(idx,"renta_bruta_anual", e.target.value)} />
                </div>
                <div>
                  <Label>Retenciones previas</Label>
                  <Input inputMode="decimal" value={det.retenciones_previas ?? "0"}
                    onChange={(e)=>m.updateDetalle(idx,"retenciones_previas", e.target.value)} />
                </div>

                <div className="col-span-2 flex justify-end">
                  <Button variant="destructive" size="xs" onClick={()=>m.removeDetalle(idx)}>Eliminar</Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2">
            <Button size="sm" variant="outline" onClick={m.addExterno}>+ Agregar empleador externo</Button>
          </div>
        </div>

        {/* Principal */}
        <div className="mt-4">
          <Label className="text-xs">Seleccionar empleador principal</Label>
          <select
            className="border rounded p-1 text-xs w-full"
            value={m.filialPrincipalId ?? ""}
            onChange={(e)=>m.setFilialPrincipalId(e.target.value)}
          >
            <option value="">-- Seleccionar --</option>
            {m.filialesDetectadas.length === 0 && <option disabled>No hay filiales detectadas</option>}
            {m.filialesDetectadas.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
          <p className="text-[11px] text-muted-foreground mt-1">
            Solo se listan filiales internas del grupo donde el trabajador tiene contrato cargado.
          </p>
        </div>

        {/* Flags */}
        <div className="mt-3 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Switch checked={!!m.somosPrincipal} onCheckedChange={(v)=>{ m.setSomosPrincipal(v); if(v) m.setSomosSecundario(false); }} />
            <span className="text-xs">Somos empleador principal</span>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={!!m.somosSecundario} onCheckedChange={(v)=>{ m.setSomosSecundario(v); if(v) m.setSomosPrincipal(false); }} />
            <span className="text-xs">Somos secundarios (no retener)</span>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="ghost" onClick={onClose} disabled={m.loading}>Cancelar</Button>
          <Button 
            onClick={handleSave} 
            disabled={
              m.loading ||
              (m.somosSecundario && !!m.filialPrincipalId) ||
              (m.detalles.length === 0 && !m.archivoUrl)
              }
            >
              {m.loading ? "Guardando..." : "Guardar"}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}