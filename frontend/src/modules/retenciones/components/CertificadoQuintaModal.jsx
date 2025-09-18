import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import useCertificadoQuinta from "../hooks/useCertificadoQuinta";
import { resolveFileUrl } from "@/utils/files";

export default function CertificadoQuintaModal({ open, onClose, dni, anio, onSaved }) {
  const certificado = useCertificadoQuinta({ open, dni, anio });

  const handleSave = async () => {
    const saved = await certificado.save();
    onSaved?.({ certificado: saved });
    onClose?.();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose?.()}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Certificado de Quinta (empleador anterior)</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Renta bruta total (anual) — calculada</Label>
            <Input value={certificado.rentaCert} readOnly />
          </div>
          <div>
            <Label>Retenciones previas (certificado)</Label>
            <Input
              inputMode="decimal"
              step="0.01"
              value={certificado.retCert}
              onChange={(e) => certificado.setRetCert(e.target.value)}
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <Label>Remuneraciones</Label>
            <Input
              inputMode="decimal"
              step="0.01"
              value={certificado.remuneraciones}
              onChange={(e) => certificado.setRemuneraciones(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div>
            <Label>Gratificaciones</Label>
            <Input
              inputMode="decimal"
              step="0.01"
              value={certificado.gratificaciones}
              onChange={(e) => certificado.setGratificaciones(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div>
            <Label>Asignación familiar</Label>
            <Input
              inputMode="decimal"
              step="0.01"
              value={certificado.asignacionFamiliar}
              onChange={(e) => certificado.setAsignacionFamiliar(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div>
            <Label>Aplica desde (mes)</Label>
            <select
              value={certificado.aplicaDesde || ""}
              onChange={(e) => certificado.setAplicaDesde(e.target.value)}
              className="border rounded-md h-9 w-full px-3"
            >
              <option value="">Todo el año</option>
              {["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]
                .map((m,i)=>(<option key={i+1} value={i+1}>{m}</option>))}
            </select>
          </div>
          <div>
            <Label>Vacaciones/Bonos/Otros</Label>
            <Input
              inputMode="decimal"
              step="0.01"
              value={certificado.otros}
              onChange={(e) => certificado.setOtros(e.target.value)}
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>RUC de la empresa</Label>
            <Input
              value={certificado.empresaRuc}
              onChange={(e) => certificado.setEmpresaRuc(e.target.value)}
              placeholder="11 dígitos"
              maxLength={11}
              inputMode="numeric"
            />
          </div>
          <div>
            <Label>Razón social</Label>
            <Input
              value={certificado.empresaRazon}
              onChange={(e) => certificado.setEmpresaRazon(e.target.value)}
              placeholder="Razón social del empleador"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Fecha de emisión</Label>
            <Input
              type="date"
              value={certificado.fechaEmision || ""}
              onChange={(e) => certificado.setFechaEmision(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-3">
          <Label>Certificado (PDF/JPG/PNG)</Label>
          <Input type="file" accept=".pdf,image/*" onChange={(e) => certificado.onArchivoChange?.(e.target.files?.[0] || null)} />
          {!!certificado.archivoUrl && (
            <p className="text-[11px] mt-1">
              Actual:{" "}
              <a className="text-blue-600 underline" href={resolveFileUrl(certificado.archivoUrl)} target="_blank" rel="noreferrer">
                Ver documento
              </a>
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={certificado.loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              certificado.loading ||
              (Number(certificado.rentaCert || 0) <= 0 && Number(certificado.retCert || 0) <= 0)
            }
          >
            {certificado.loading ? "Guardando..." : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}