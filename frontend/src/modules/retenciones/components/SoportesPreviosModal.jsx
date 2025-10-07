// INNOVA PRO+ v1.2.0 — Quinta: Modal Unificado de Soportes (UI PRO)
import { useEffect, useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { currency } from "../utils/ui";
import {
  quintaObtenerMulti, quintaGuardarMulti,
  quintaObtenerCertificado, quintaGuardarCertificado,
  quintaObtenerSinPrevios, quintaGuardarSinPrevios
} from "../service/quintaService";

export default function SoportesPreviosModal({ open, onClose, dni, anio, onSaved, currentFilialId, mode }) {
  const refTop = useRef(null);
  const refMulti = useRef(null);
  const refCertificado = useRef(null);
  const refSinPrevios = useRef(null);

  // Estado
  const [loading, setLoading] = useState(false);

  // Multiempleo (externo)
  const [otrosIngresosAnual, setOtrosIngresosAnual] = useState("");
  const [retOtros, setRetOtros] = useState("");
  const [somosPrincipal, setSomosPrincipal] = useState(false);
  const [somosSecundario, setSomosSecundario] = useState(false);
  // Interno (solo display si backend lo manda en detalle_json)
  const [internoTotal, setInternoTotal] = useState(0);

  // Certificado
  const [rentaCert, setRentaCert] = useState("");
  const [retCert, setRetCert] = useState("");

  // Sin previos
  const [sinPrevios, setSinPrevios] = useState(false);
  const [observ, setObserv] = useState("");

  // Cargar TODO siempre que se abra (sin filtrar por aplica_desde)
  useEffect(() => {
    if (!open || !dni || !anio) return;
    (async () => {
      setLoading(true);
      try {
        const [multiEmpleo, certificado, sinPreviosResp] = await Promise.all([
          quintaObtenerMulti(dni, anio).catch(() => null),
          quintaObtenerCertificado(dni, anio).catch(() => null),
          quintaObtenerSinPrevios(dni, anio).catch(() => null),
        ]);

        // Multi
        if (multiEmpleo?.data?.data?.found) {
          const m = multiEmpleo.data.data;
          setOtrosIngresosAnual(String(m.renta_bruta_otros_anual || 0));
          setRetOtros(String(m.retenciones_previas_otros || 0));
          const dj = m.detalle_json || {};
          setSomosPrincipal(Boolean(dj.somos_principal));
          setSomosSecundario(Boolean(dj.somos_secundario_no_retiene));
          setInternoTotal(Number(dj.interno_total || 0));
        } else {
          setOtrosIngresosAnual(""); setRetOtros(""); setSomosPrincipal(false); setSomosSecundario(false); setInternoTotal(0);
        }

        // Certificado
        if (certificado?.data?.data?.found) {
          const c = certificado.data.data;
          setRentaCert(String(c.renta_bruta_total || 0));
          setRetCert(String(c.retenciones_previas || 0));
        } else {
          setRentaCert(""); setRetCert("");
        }

        // Sin previos
        setSinPrevios(Boolean(sinPreviosResp?.data?.data?.found));
        setObserv(String(sinPreviosResp?.data?.data?.observaciones || "")); // si existe
      } finally {
        setLoading(false);
        // Scroll a la sección solicitada (opcional)
        const target = mode === "CERTIFICADO" ? refCertificado
                     : mode === "SIN_PREVIOS" ? refSinPrevios
                     : mode === "MULTIEMPLEO" ? refMulti
                     : refTop;
        setTimeout(() => target?.current?.scrollIntoView?.({ behavior: "smooth", block: "start" }), 80);
      }
    })();
  }, [open, dni, anio, mode]);

  const handleGuardar = async () => {
    setLoading(true);
    try {
      // Guardar Certificado si hay valores
      if (rentaCert !== "" || retCert !== "") {
        await quintaGuardarCertificado({
          dni, anio: Number(anio),
          renta_bruta_total: Number(rentaCert || 0),
          retenciones_previas: Number(retCert || 0),
        });
      }

      // Guardar Multiempleo si hay valores (o flags)
      if (otrosIngresosAnual !== "" || retOtros !== "" || somosPrincipal || somosSecundario) {
        await quintaGuardarMulti({
          dni, anio: Number(anio),
          filial_principal_id: somosPrincipal ? Number(currentFilialId || 0) || null : null,
          renta_bruta_otros_anual: Number(otrosIngresosAnual || 0),
          retenciones_previas_otros: Number(retOtros || 0),
          detalle_json: {
            somos_principal: Boolean(somosPrincipal),
            somos_secundario_no_retiene: Boolean(somosSecundario),
          },
        });
      }

      // Guardar/limpiar sin previos (si el switch está activo, lo grabamos)
      if (sinPrevios) {
        await quintaGuardarSinPrevios({ dni, anio: Number(anio), observaciones: (observ || null) });
      }

      onSaved?.({
        certificado: { renta_bruta_total: Number(rentaCert || 0), retenciones_previas: Number(retCert || 0) },
        multi: {
          renta_bruta_otros_anual: Number(otrosIngresosAnual || 0),
          retenciones_previas_otros: Number(retOtros || 0),
          somos_principal: somosPrincipal,
          somos_secundario_no_retiene: somosSecundario,
        },
        sinPrevios,
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
      <DialogContent className="sm:max-w-[900px] max-h-[88vh] overflow-hidden p-0 rounded-2xl shadow-2xl">
        {/* HEADER sticky */}
        <div ref={refTop} className="sticky top-0 z-10 px-6 pt-5 pb-3 border-b bg-white">
          <DialogHeader className="p-0 space-y-1.5">
            <DialogTitle className="text-[18px] font-semibold">Soportes de ingresos previos</DialogTitle>
            <DialogDescription className="text-[12px]">
              Aquí administras <b>Multiempleo</b>, <b>Certificado de 5ta</b> y la DJ de <b>“Sin ingresos previos”</b>. Se muestran siempre que existan, sin filtrar por <i>aplica_desde</i>.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* BODY scrollable */}
        <div className="px-6 py-4 space-y-5 overflow-auto" style={{ maxHeight: "calc(88vh - 120px)" }}>
          {/* Interno (solo lectura si viene) */}
          {Number(internoTotal) > 0 && (
            <section className="rounded-xl border p-3 bg-slate-50">
              <p className="text-xs text-muted-foreground">
                Ingresos internos detectados (otras filiales del grupo, anual): <b>{currency.format(internoTotal)}</b>
              </p>
            </section>
          )}

          {/* MULTIEMPLEO */}
          <section ref={refMulti} className="rounded-xl border p-4 bg-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold">Multiempleo (SUNAT)</h3>
              <div className="flex gap-1">
                {somosPrincipal && <Badge className="text-[10px]">Principal</Badge>}
                {somosSecundario && <Badge variant="secondary" className="text-[10px]">Secundaria</Badge>}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Registra el total anual y las retenciones de otros empleadores. Define además si <b>somos la principal</b> o <b>secundarios</b>.
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

            <div className="mt-3 flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch checked={somosPrincipal} onCheckedChange={(v) => { setSomosPrincipal(v); if (v) setSomosSecundario(false); }} />
                <span className="text-xs">Somos empleador principal</span>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={somosSecundario} onCheckedChange={(v) => { setSomosSecundario(v); if (v) setSomosPrincipal(false); }} />
                <span className="text-xs">Somos secundarios (no retener)</span>
              </div>
            </div>
          </section>

          {/* CERTIFICADO */}
          <section ref={refCertificado} className="rounded-xl border p-4 bg-white">
            <h3 className="text-sm font-semibold mb-2">Certificado de 5ta del empleador anterior</h3>
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

          {/* SIN PREVIOS */}
          <section ref={refSinPrevios} className="rounded-xl border p-4 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">Declaración jurada “sin ingresos previos”</h3>
                <p className="text-xs text-muted-foreground">Si está activo, el cálculo considerará ingresos previos = 0.</p>
              </div>
              <Switch checked={sinPrevios} onCheckedChange={setSinPrevios} />
            </div>
            {sinPrevios && (
              <div className="mt-3">
                <Label>Observaciones (opcional)</Label>
                <Input value={observ} onChange={(e) => setObserv(e.target.value)} placeholder="Ej. DJ firmada y archivada" />
              </div>
            )}
          </section>
        </div>

        {/* FOOTER */}
        <div className="px-6 pb-5 pt-3 border-t bg-white">
          <DialogFooter>
            <Button variant="ghost" onClick={onClose} disabled={loading}>Cancelar</Button>
            <Button onClick={handleGuardar} disabled={loading}>
              {loading ? "Guardando..." : "Guardar soportes"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}