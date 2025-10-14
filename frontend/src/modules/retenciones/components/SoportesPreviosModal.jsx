import { useEffect, useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { currency } from "../utils/ui";
import { resolveFileUrl } from "@/utils/files";
import {
  quintaObtenerMulti,
  quintaObtenerCertificado,
  quintaObtenerSinPrevios,
} from "../service/quintaService";

import MultiempleoModal from "./MultiempleoModal";
import CertificadoQuintaModal from "./CertificadoQuintaModal";
import SinPreviosModal from "./SinPreviosModal";

// ---- Normalizador robusto de respuestas: soporta axios {data:{...}}, {ok,data:{...}}, o payload directo
function pickPayload(res) {
  if (!res) return null;
  const a = res?.data?.data;           // axios { data: { data: {...} } }
  const b = res?.data;                 // axios { data: {...} }
  const c = res;                       // payload directo
  return a ?? b ?? c ?? null;
}

// Determina "found" de forma tolerante a distintos esquemas
function markFound(payload) {
  if (!payload) return { found: false };
  const p = { ...payload };

  // Casos comunes
  const f =
    p.found ??
    p.exists ??
    p.activo ??
    (typeof p.estado === "string" ? p.estado.toLowerCase() === "vigente" : undefined) ??
    (!!p.id) ??
    (!!p._id);

  return { ...p, found: Boolean(f) };
}

export default function SoportesPreviosModal({
  open, onClose, dni, anio, filiales = [], currentFilialId, onSaved,
}) {
  const [loading, setLoading] = useState(false);

  const [multi, setMulti] = useState(null);
  const [cert, setCert] = useState(null);
  const [sinPrev, setSinPrev] = useState(null);

  const [openMulti, setOpenMulti] = useState(false);
  const [openCert, setOpenCert] = useState(false);
  const [openSin, setOpenSin] = useState(false);

  const hayTrabajador = !!dni && !!anio;

  const reload = async () => {
    if (!hayTrabajador) return;
    setLoading(true);
    try {
      const year = Number(anio) || anio; // acepta string o number
      const [m, c, s] = await Promise.all([
        quintaObtenerMulti(dni, year).catch(() => null),
        quintaObtenerCertificado(dni, year).catch(() => null),
        quintaObtenerSinPrevios(dni, year).catch(() => null),
      ]);
      setMulti(markFound(pickPayload(m)));
      setCert(markFound(pickPayload(c)));
      setSinPrev(markFound(pickPayload(s)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (open) reload(); }, [open, dni, anio]);

  const titleByState = useMemo(() => (
    hayTrabajador ? "Soportes de ingresos previos" : "Selecciona un trabajador para gestionar soportes"
  ), [hayTrabajador]);

  const Sub = ({ label, children }) => (
    <div className="text-[11px] text-slate-600 mt-1">
      {label}: <span className="text-slate-900 font-medium">{children ?? "—"}</span>
    </div>
  );

  const Card = ({ title, activo, children, onRegistrar, onEditar, chip }) => (
    <div className="rounded-xl border p-4 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold">{title}</h3>
          {chip}
        </div>
        <div className="flex gap-2">
          {!activo && <Button size="sm" className="h-7" onClick={onRegistrar}>Registrar</Button>}
          {activo && <Button size="sm" variant="outline" className="h-7" onClick={onEditar}>Editar</Button>}
        </div>
      </div>
      {children}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose?.()}>
      <DialogContent className="sm:max-w-[980px] max-h-[88vh] overflow-hidden p-0 rounded-2xl shadow-2xl">
        {/* HEADER */}
        <div className="sticky top-0 z-10 px-6 pt-5 pb-3 border-b bg-white">
          <DialogHeader className="p-0 space-y-1.5">
            <DialogTitle className="text-[18px] font-semibold">{titleByState}</DialogTitle>
            <DialogDescription className="text-[12px]">
              Este hub muestra <b>todos</b> los soportes existentes del trabajador (sin filtrar por <i>aplica_desde</i>). 
              Usa <b>Registrar</b> o <b>Editar</b> para abrir el formulario completo correspondiente.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* BODY */}
        <div className="px-6 py-4 space-y-4 overflow-auto" style={{ maxHeight: "calc(88vh - 120px)" }}>
          {!hayTrabajador ? (
            <div className="rounded-lg border p-4 bg-amber-50 text-amber-900">
              Debes seleccionar <b>año</b>, <b>mes</b> y <b>trabajador</b> antes de gestionar soportes.
            </div>
          ) : (
            <>
              {/* MULTIEMPLEO */}
              <Card
                title="Multiempleo (SUNAT)"
                activo={!!multi?.found}
                onRegistrar={() => setOpenMulti(true)}
                onEditar={() => setOpenMulti(true)}
                chip={multi?.found ? <Badge className="text-[10px]">Registrado</Badge> : <Badge variant="secondary" className="text-[10px]">No registrado</Badge>}
              >
                {multi?.found ? (
                  <div className="grid md:grid-cols-2 gap-x-6 gap-y-1 mt-2">
                    <Sub label="Renta bruta anual otros">{currency.format(multi.renta_bruta_otros_anual || 0)}</Sub>
                    <Sub label="Retenciones previas otros">{currency.format(multi.retenciones_previas_otros || 0)}</Sub>
                    <Sub label="Somos principal">{multi?.detalle_json?.somos_principal ? "Sí" : "No"}</Sub>
                    <Sub label="Somos secundarios (no retener)">{multi?.detalle_json?.somos_secundario_no_retiene ? "Sí" : "No"}</Sub>
                    {!!multi?.filial_principal_id && <Sub label="Filial principal interna">{multi.filial_principal_id}</Sub>}
                    {!!multi?.principal_ruc && <Sub label="RUC empleador principal (externo)">{multi.principal_ruc}</Sub>}
                    {!!multi?.principal_razon_social && <Sub label="Razón social principal (externo)">{multi.principal_razon_social}</Sub>}
                    {!!multi?.aplica_desde_mes && <Sub label="Aplica desde">{String(multi.aplica_desde_mes).padStart(2,"0")}</Sub>}
                    {!!multi?.archivo_url && (
                      <div className="col-span-2 text-[11px]">
                        Archivo:{" "}
                        <a className="text-blue-600 underline" href={resolveFileUrl(multi.archivo_url)} target="_blank" rel="noreferrer">
                          Ver documento
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-[12px] text-slate-600 mt-2">No existe DJ de multiempleo registrada.</p>
                )}
              </Card>

              {/* CERTIFICADO */}
              <Card
                title="Certificado de 5ta (empleador anterior)"
                activo={!!cert?.found}
                onRegistrar={() => setOpenCert(true)}
                onEditar={() => setOpenCert(true)}
                chip={cert?.found ? <Badge className="text-[10px]">Registrado</Badge> : <Badge variant="secondary" className="text-[10px]">No registrado</Badge>}
              >
                {cert?.found ? (
                  <div className="grid md:grid-cols-2 gap-x-6 gap-y-1 mt-2">
                    <Sub label="Renta bruta total">{currency.format(cert.renta_bruta_total || 0)}</Sub>
                    <Sub label="Retenciones previas">{currency.format(cert.retenciones_previas || 0)}</Sub>
                    {!!cert?.remuneraciones && <Sub label="Remuneraciones">{currency.format(cert.remuneraciones)}</Sub>}
                    {!!cert?.gratificaciones && <Sub label="Gratificaciones">{currency.format(cert.gratificaciones)}</Sub>}
                    {!!cert?.asignacion_familiar && <Sub label="Asignación familiar">{currency.format(cert.asignacion_familiar)}</Sub>}
                    {!!cert?.otros && <Sub label="Otros (vac/bonos/etc.)">{currency.format(cert.otros)}</Sub>}
                    {!!cert?.empresa_ruc && <Sub label="RUC empresa">{cert.empresa_ruc}</Sub>}
                    {!!cert?.empresa_razon_social && <Sub label="Razón social">{cert.empresa_razon_social}</Sub>}
                    {!!cert?.fecha_emision && <Sub label="Fecha de emisión">{cert.fecha_emision}</Sub>}
                    {!!cert?.aplica_desde && <Sub label="Aplica desde">{String(cert.aplica_desde).padStart(2,"0")}</Sub>}
                    {!!cert?.archivo_url && (
                      <div className="col-span-2 text-[11px]">
                        Certificado:{" "}
                        <a className="text-blue-600 underline" href={resolveFileUrl(cert.archivo_url)} target="_blank" rel="noreferrer">
                          Ver documento
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-[12px] text-slate-600 mt-2">No existe certificado de 5ta registrado.</p>
                )}
              </Card>

              {/* SIN PREVIOS */}
              <Card
                title='Declaración jurada "sin ingresos previos"'
                activo={!!sinPrev?.found}
                onRegistrar={() => setOpenSin(true)}
                onEditar={() => setOpenSin(true)}
                chip={sinPrev?.found ? <Badge className="text-[10px]">Registrado</Badge> : <Badge variant="secondary" className="text-[10px]">No registrado</Badge>}
              >
                {sinPrev?.found ? (
                  <div className="grid md:grid-cols-2 gap-x-6 gap-y-1 mt-2">
                    <Sub label="Activo">Sí</Sub>
                    {!!sinPrev?.aplica_desde_mes && <Sub label="Aplica desde">{String(sinPrev.aplica_desde_mes).padStart(2,"0")}</Sub>}
                    {!!sinPrev?.observaciones && <Sub label="Observaciones">{sinPrev.observaciones}</Sub>}
                    {!!sinPrev?.archivo_url && (
                      <div className="col-span-2 text-[11px]">
                        Declaración:{" "}
                        <a className="text-blue-600 underline" href={resolveFileUrl(sinPrev.archivo_url)} target="_blank" rel="noreferrer">
                          Ver documento
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-[12px] text-slate-600 mt-2">No existe DJ "sin ingresos previos" registrada.</p>
                )}
              </Card>
            </>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-6 pb-5 pt-3 border-t bg-white">
          <DialogFooter>
            <Button variant="ghost" onClick={onClose} disabled={loading}>Cerrar</Button>
            <Button onClick={reload} variant="outline" disabled={loading}>Refrescar</Button>
          </DialogFooter>
        </div>
      </DialogContent>

      {/* SUB-MODALES */}
      <MultiempleoModal
        open={openMulti}
        onClose={() => setOpenMulti(false)}
        dni={dni}
        anio={anio}
        filiales={filiales}
        currentFilialId={currentFilialId}
        onSaved={async () => { await reload(); onSaved?.(); }}
      />
      <CertificadoQuintaModal
        open={openCert}
        onClose={() => setOpenCert(false)}
        dni={dni}
        anio={anio}
        onSaved={async () => { await reload(); onSaved?.(); }}
      />
      <SinPreviosModal
        open={openSin}
        onClose={() => setOpenSin(false)}
        dni={dni}
        anio={anio}
        prefill={sinPrev || undefined}
        onSaved={async () => { await reload(); onSaved?.(); }}
      />
    </Dialog>
  );
}