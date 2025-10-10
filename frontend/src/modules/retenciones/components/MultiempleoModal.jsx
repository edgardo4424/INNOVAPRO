// INNOVA PRO+ v1.3.1 — Quinta: Multiempleo con Dialog (fix overlay anidado)
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { resolveFileUrl } from "@/utils/files";
import useMultiempleo from "../hooks/useMultiempleo";

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

export default function MultiempleoModal({ open, onClose, dni, anio, filiales = [], currentFilialId, onSaved }) {
  const m = useMultiempleo({ open, dni, anio, filiales, currentFilialId });

  const isSecundaria = !!m.es_secundaria;
  const faltaFilialSiPrincipal = !isSecundaria && !m.filial_principal_id;
  const filialProhibidaSiSecundaria = isSecundaria && !!m.filial_principal_id;

  const canSave = !m.loading && !faltaFilialSiPrincipal && !filialProhibidaSiSecundaria;

  const handleSave = async () => {
    const saved = await m.save();
    if (saved?.ok) {
      onSaved?.({ multi: saved });
      onClose?.();
    }
  };

  const onToggleSecundaria = (checked) => {
    m.setEsSecundaria(checked);
    if (checked) {
      m.setFilialPrincipalId("");
    } else {
      m.setPrincipalRuc("");
      m.setPrincipalRazon("");
      if (!m.filial_principal_id && currentFilialId) {
        m.setFilialPrincipalId(String(currentFilialId));
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose?.(); }}>
      <DialogContent className="sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle>Declaración jurada de multiempleo</DialogTitle>
        </DialogHeader>

        {/* Archivo soporte */}
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

        {/* Fila 1: mes + secundaria */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <Label className="text-xs">Aplica desde (mes)</Label>
            <select
              className="border rounded p-2 text-xs w-full h-9"
              value={m.aplica_desde_mes}
              onChange={(e) => m.setAplicaDesdeMes(e.target.value)}
            >
              <option value="">Todo el año</option>
              {MESES.map((mes, i) => (
                <option key={i + 1} value={String(i + 1)}>{mes}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <div className="flex items-center gap-2">
              <Switch checked={isSecundaria} onCheckedChange={onToggleSecundaria} />
              <span className="text-xs">
                {isSecundaria ? "Somos secundarios (NO retenemos aquí)" : "Somos principales (retenemos aquí)"}
              </span>
            </div>
          </div>
        </div>

        {/* Fila 2: montos anuales externos */}
        <div className="grid grid-cols-2 gap-3 mt-2">
          <div>
            <Label className="text-xs">Renta bruta anual de otros empleadores</Label>
            <Input inputMode="decimal" step="0.01" value={m.renta_bruta_otros_anual} onChange={(e)=>m.setRentaOtros(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs">Retenciones previas de otros empleadores</Label>
            <Input inputMode="decimal" step="0.01" value={m.retenciones_previas_otros} onChange={(e)=>m.setRetOtros(e.target.value)} />
          </div>
        </div>

        {/* Fila 3: empleador principal (externo) — sólo si somos secundarios */}
        <div className="grid grid-cols-2 gap-3 mt-2 opacity-100">
          <div>
            <Label className="text-xs">RUC del empleador principal (externo)</Label>
            <Input
              value={m.principal_ruc}
              onChange={(e)=>m.setPrincipalRuc(e.target.value)}
              placeholder={isSecundaria ? "Opcional" : "No aplica (somos principal)"}
              disabled={!isSecundaria}
            />
          </div>
          <div>
            <Label className="text-xs">Razón social del empleador principal</Label>
            <Input
              value={m.principal_razon_social}
              onChange={(e)=>m.setPrincipalRazon(e.target.value)}
              placeholder={isSecundaria ? "Opcional" : "No aplica (somos principal)"}
              disabled={!isSecundaria}
            />
          </div>
          {!isSecundaria && (
            <p className="col-span-2 text-[11px] text-slate-500">Como somos <strong>principal</strong>, estos datos no aplican.</p>
          )}
        </div>

        {/* Fila 4: Filial principal interna — obligatoria si somos principales */}
        <div className="grid grid-cols-2 gap-3 mt-2">
          <div>
            <Label className="text-xs">
              Filial principal (interna){!isSecundaria && <span className="text-red-500"> *</span>}
            </Label>
            <select
              className={`border rounded p-2 text-xs w-full h-9 ${faltaFilialSiPrincipal ? "border-red-500" : ""}`}
              value={m.filial_principal_id || ""}
              onChange={(e)=>m.setFilialPrincipalId(e.target.value)}
              disabled={isSecundaria}
            >
              <option value="">{isSecundaria ? "No aplica (somos secundarios)" : "Selecciona una filial"}</option>
              {filiales.map(f => (
                <option key={f.filial_id} value={String(f.filial_id)}>
                  {(f.filial_razon_social || `Filial ${f.filial_id}`)}
                </option>
              ))}
            </select>
            {!isSecundaria && faltaFilialSiPrincipal && (
              <div className="text-[11px] text-red-600 mt-1">Selecciona la filial que actúa como principal.</div>
            )}
            {isSecundaria && (
              <div className="text-[11px] text-slate-500 mt-1">
                Somos <strong>secundarios</strong>, por eso no definimos filial principal interna.
              </div>
            )}
          </div>

          <div>
            <Label className="text-xs">Observaciones</Label>
            <Input value={m.observaciones} onChange={(e)=>m.setObservaciones(e.target.value)} />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="ghost" onClick={onClose} disabled={m.loading}>Cancelar</Button>
          <Button onClick={handleSave} disabled={!canSave}>{m.loading ? "Guardando..." : "Guardar"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}