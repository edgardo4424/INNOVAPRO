import { useEffect, useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { currency } from "../utils/ui";
import {
  quintaObtenerMulti, quintaGuardarMulti,
  quintaObtenerCertificado, quintaGuardarCertificado,
  quintaObtenerSinPrevios, quintaGuardarSinPrevios
} from "../service/quintaService";

export default function SoportesPreviosModal({ open, onClose, dni, anio, onSaved, currentFilialId, mode}) {
  // refs de secciones
  const refMulti = useRef(null);
  const refCertificado = useRef(null);
  const refSinPrevios = useRef(null);

  useEffect(() => {
    if(!open) return;
    const target = mode === "CERTIFICADO" ? refCertificado
                 : mode === "SIN:PREVIOS" ? refSinPrevios
                 : refMulti;
    // scroll suave a la sección solicitada
    setTimeout(() => target?.current?.scrollIntoView({ behavior: "smooth", block: "start"}), 60);
  }, [open, mode]);

  const [loading, setLoading] = useState(false);

  // Multiempleo (externo)
  const [otrosIngresosAnual, setOtrosIngresosAnual] = useState("");
  const [retOtros, setRetOtros] = useState("");
  const [somosPrincipal, setSomosPrincipal] = useState(false);
  const [somosSecundario, setSomosSecundario] = useState(false);

  // Multiempleo (interno - solo display si backend lo manda en el detalle_json)
  const [internoTotal, setInternoTotal] = useState(0);

  // Certificado
  const [rentaCert, setRentaCert] = useState("");
  const [retCert, setRetCert] = useState("");

  // Sin previos
  const [sinPrevios, setSinPrevios] = useState(false);
  const [observ, setObserv] = useState("");

  useEffect(() => {
    if (!open || !dni || !anio) return;
    (async () => {
      setLoading(true);
      try {
        const [multiEmpleo, certificado, sinPrevios] = await Promise.all([
          quintaObtenerMulti(dni, anio).catch(() => null),
          quintaObtenerCertificado(dni, anio).catch(() => null),
          quintaObtenerSinPrevios(dni, anio).catch(() => null),
        ]);
        // Multi
        if (multiEmpleo?.data?.data?.found) {
          const multiEmpleoData = multiEmpleo.data.data;
          setOtrosIngresosAnual(String(multiEmpleoData.renta_bruta_otros_anual || 0));
          setRetOtros(String(multiEmpleoData.retenciones_previas_otros || 0));
          const declaracionJurada = multiEmpleoData.detalle_json || {};
          setSomosPrincipal(Boolean(declaracionJurada.somos_principal));
          setSomosSecundario(Boolean(declaracionJurada.somos_secundario_no_retiene));
          setInternoTotal(Number(declaracionJurada.interno_total || 0));
        } else {
          setOtrosIngresosAnual(""); setRetOtros(""); setSomosPrincipal(false); setSomosSecundario(false), setInternoTotal(0);
        }
        // Cert
        if (certificado?.data?.data?.found) {
            const certificadoData = certificado.data.data;
          setRentaCert(String(certificadoData.renta_bruta_total || 0));
          setRetCert(String(certificadoData.retenciones_previas || 0));
        } else {
          setRentaCert(""); setRetCert("");
        }
        // Sin previos
        setSinPrevios(Boolean(sinPrevios?.data?.data?.found));
      } finally {
        setLoading(false);
      }
    })();
  }, [open, dni, anio]);

  const handleGuardar = async () => {
    setLoading(true);
    try {
      // Guardar certificado si tiene valores
      if (rentaCert !== "" || retCert !== "") {
        await quintaGuardarCertificado({
          dni, anio: Number(anio),
          renta_bruta_total: Number(rentaCert || 0),
          retenciones_previas: Number(retCert || 0),
        });
      }
      // Guardar multiempleo si tiene valores
      if (otrosIngresosAnual !== "" || retOtros !== "" || somosPrincipal || somosSecundario) {
        await quintaGuardarMulti({
          dni, anio: Number(anio),
          // Si lo obtenemos del front, lo enviamos, sino lo sacamos del contrato por backend
          filial_principal_id: somosPrincipal ? Number(currentFilialId || 0) || null : null,
          renta_bruta_otros_anual: Number(otrosIngresosAnual || 0),
          retenciones_previas_otros: Number(retOtros || 0),
          detalle_json: {
            somos_principal: Boolean(somosPrincipal),
            somos_secundario_no_retiene: Boolean(somosSecundario),
          }
        });
      }
      // Guardar/limpiar sin previos
      if (sinPrevios) {
        await quintaGuardarSinPrevios({ dni, anio: Number(anio), observaciones: observ || null });
      } else {
        // Si quisieras anular cuando lo apagan, se podría agregar endpoint de anulación.
      }

      onSaved?.({
        certificado: { renta_bruta_total: Number(rentaCert || 0), retenciones_previas: Number(retCert || 0) },
        multi: { 
            renta_bruta_otros_anual: Number(otrosIngresosAnual || 0), 
            retenciones_previas_otros: Number(retOtros || 0),
            somos_principal: somosPrincipal,
            somos_secundario_no_retiene: somosSecundario
        },
        sinPrevios
      });
      onClose?.();
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Error al guardar soportes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose?.()}>
      <DialogContent className="sm:max-w-[720px] max-h-[80vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Soportes de ingresos previos</DialogTitle></DialogHeader>

        <div className="space-y-4">
          {/* INTERNO (solo lectura si backend lo provee) */}
          {Number(internoTotal) > 0 && (
            <section className="rounded border p-2 bg-slate-50">
              <p className="text-xs text-muted-foreground">
                Ingresos internos detectados (otras filiales del grupo, anual): <b>{currency.format(internoTotal)}</b>
              </p>
            </section>
          )}

          {/* MULTIEMPLEO EXTERNO */}
          <section ref={refMulti}>
            <p className="text-xs text-muted-foreground mb-2">
              Multiempleo (SUNAT): registra el total anual y las retenciones de otros empleadores. Define además si <b>somos la principal</b> o <b>secundarios</b>.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Ingresos de otros empleadores (anual)</Label>
                <Input inputMode="decimal" value={otrosIngresosAnual} onChange={(e) => setOtrosIngresosAnual(e.target.value)} placeholder="0.00" />
              </div>
              <div>
                <Label>Retenciones previas (otros empleadores)</Label>
                <Input inputMode="decimal" value={retOtros} onChange={(e) => setRetOtros(e.target.value)} placeholder="0.00" />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Switch checked={somosPrincipal} onCheckedChange={(v) => { setSomosPrincipal(v); if (v) setSomosSecundario(false); }} />
                  <span className="text-xs">Somos empleador principal</span>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={somosSecundario} onCheckedChange={(v) => { setSomosSecundario(v); if (v) setSomosPrincipal(false); }} />
                  <span className="text-xs">Somos secundarios (no retener)</span>
                </div>
              </div>
            </div>
          </section>

          <Separator />

          {/* CERTIFICADO */}
          <section ref={refCertificado}>
            <p className="text-xs text-muted-foreground mb-2">Certificado de 5ta del empleador anterior (relación anterior finiquitada).</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Renta bruta total (certificado)</Label>
                <Input inputMode="decimal" value={rentaCert} onChange={(e) => setRentaCert(e.target.value)} placeholder="0.00" />
              </div>
              <div>
                <Label>Retenciones previas (certificado)</Label>
                <Input inputMode="decimal" value={retCert} onChange={(e) => setRetCert(e.target.value)} placeholder="0.00" />
              </div>
            </div>
          </section>

          <Separator />

          {/* SIN PREVIOS */}
          <section ref={refSinPrevios} className="flex items-center justify-between">
            <div>
              <Label className="block">Declaración jurada “sin ingresos previos”</Label>
              <p className="text-xs text-muted-foreground">Si está activo, el cálculo considerará ingresos previos = 0.</p>
            </div>
            <Switch checked={sinPrevios} onCheckedChange={setSinPrevios} />
          </section>
          {sinPrevios && (
            <div>
              <Label>Observaciones (opcional)</Label>
              <Input value={observ} onChange={(e) => setObserv(e.target.value)} placeholder="Ej. DJ firmada y archivada" />
            </div>
          )}
        </div>

        <DialogFooter className="mt-2">
          <Button variant="ghost" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button onClick={handleGuardar} disabled={loading}>{loading ? "Guardando..." : "Guardar soportes"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}