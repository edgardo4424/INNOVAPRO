// INNOVA PRO+ v1.2.0 — Quinta: Card compacta + un solo botón “Soportes”
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { currency } from "../utils/ui";

export default function IngresosPreviosCard({
  preview, fuentePrevios, filiales = [], onClickAuto, onOpenSoportes, dense, className
}) {
  if (!preview) return null;

  const inPrev = preview?.ingresos_previos || {};
  const total = Number(inPrev?.total_ingresos || 0);
  const meta = preview?.retencion_meta || {};
  const warnings = preview?.warnings || [];

  const rsById = useMemo(() => {
    const dict = {};
    (filiales || []).forEach(f => {
      dict[String(f.filial_id)] = f.filial_razon_social || f.razon_social || `Filial #${f.filial_id}`;
    });
    return dict;
  }, [filiales]);

  const Row = ({ llave, valor }) => (
    <div className="flex items-center justify-between">
      <span className="text-slate-600">{llave}</span>
      <span className="font-medium">{valor}</span>
    </div>
  );

  const C = (valor) => currency.format(Number(valor || 0));
  const labelFilial = (id) => rsById[String(id)] || `Filial #${id}`;

  // Indicadores de soportes detectados (de cualquier fuente disponible en el preview/meta)
  const soportes = {
    multiempleo: !!(meta?.soportes_json?.multiempleo || preview?.soportes?.multiempleo),
    certificado: !!(meta?.soportes_json?.certificado || preview?.soportes?.certificado),
    sinprevios:  !!(meta?.soportes_json?.sin_previos || preview?.soportes?.sinPrevios),
  };

  const fuenteLabel = (() => {
    if (fuentePrevios === "CERTIFICADO") return "Certificado de 5ta";
    if (fuentePrevios === "SIN_PREVIOS") return "DJ: Sin ingresos previos";
    if (fuentePrevios === "AUTO")        return "Proyección automática";
    return fuentePrevios || "Automática";
  })();

  return (
    <div className={["p-3 border rounded bg-white w-full", dense ? "text-[11.5px]" : "text-sm", className].join(" ")}>

      {/* Contexto de varias filiales */}
      {meta?.origen_retencion !== "NINGUNO" && (
        <div className="mt-2 p-2 border rounded bg-slate-50">
          <div className="text-[11px] text-slate-700 font-semibold mb-1">Contexto de retención (varias filiales)</div>
          <div className="grid gap-1">
            <Row llave="Origen" valor={meta?.origen_retencion || "—"} />
            <Row llave="Rol" valor={meta?.es_secundaria ? "Secundaria (no retiene)" : "Principal (retiene)"} />
            <Row
              llave="Filial que retiene"
              valor={
                meta?.filial_retiene_id != null
                  ? `${labelFilial(meta.filial_retiene_id)}`
                  : (meta?.filial_retiene_id ?? "—")
              }
            />
            {meta?.ingresos_previos_internos > 0 && (
              <Row llave="Previos internos" valor={C(meta?.ingresos_previos_internos)} />
            )}
            {meta?.ingresos_previos_externos > 0 && (
              <Row llave="Previos externos" valor={C(meta?.ingresos_previos_externos)} />
            )}
            {meta?.retenciones_previas_internas > 0 && (
              <Row llave="Retenciones internas" valor={C(meta?.retenciones_previas_internas)} />
            )}
            {meta?.retenciones_previas_externas > 0 && (
              <Row llave="Retenciones externas" valor={C(meta?.retenciones_previas_externas)} />
            )}
          </div>
        </div>
      )}

      {/* Acumulados de la filial actual */}
      <div className="mt-2 p-2 border rounded bg-slate-50">
        <div className="text-[11px] text-slate-700 font-semibold mb-1">Acumulados de esta filial</div>
        <div className="grid gap-1">
          {total > 0 && fuentePrevios !== "SIN_PREVIOS" ? (
            <>
              <Row llave="Remuneraciones" valor={C(inPrev.remuneraciones)} />
              <Row llave="Gratificaciones" valor={C(inPrev.gratificaciones)} />
              <Row llave="Bonos" valor={C(inPrev.bonos)} />
              <Row llave="Asignación familiar" valor={C(inPrev.asignacion_familiar)} />
              <Row llave="TOTAL" valor={C(total)} />
              {preview?.retencion_meta?.meta?.ingresos_previos_externos > 0 && (
                <div className="mt-1 text-[11px] text-slate-600">
                  Externos ({preview?.retencion_meta?.meta?.fuente_externos === 'CERTIFICADO' ? 'Certificado' : 'DJ'}{preview?.retencion_meta?.meta?.certificado_aplica_desde ? ` desde ${['','Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'][preview.retencion_meta.meta.certificado_aplica_desde]}` : ''}):{" "}
                  <span className="font-semibold">S/ {Number(preview.retencion_meta.meta.ingresos_previos_externos || 0).toFixed(2)}</span>
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-500 italic">No existen ingresos previos registrados.</p>
          )}
        </div>
      </div>

      {/* NUEVA sección “Fuente + Soportes” */}
      <div className="mt-2 p-2 border rounded bg-amber-50 text-gray-700">
        <div className="flex items-center justify-between mb-2">
          <p className="font-semibold">Fuente actual: <span className="font-medium">{fuenteLabel}</span></p>

          {/* Acción secundaria para mantener tu flujo actual */}
          <Button size="sm" variant="outline" className="h-6 px-2 text-[11px] bg-white"
            onClick={onClickAuto}>
            Usar proyección automática
          </Button>
        </div>

        {/* Indicadores de soportes detectados */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          <Badge variant={soportes.multiempleo ? "default" : "secondary"} className="text-[10px]">Multiempleo</Badge>
          <Badge variant={soportes.certificado ? "default" : "secondary"} className="text-[10px]">Certificado 5ta</Badge>
          <Badge variant={soportes.sinprevios ? "default" : "secondary"} className="text-[10px]">Sin ingresos previos</Badge>
        </div>

        {/* ÚNICO BOTÓN */}
        <Button
          onClick={onOpenSoportes}
          className="h-7 px-3 text-[11px] bg-amber-600 text-white hover:opacity-95"
        >
          Ver / editar soportes de ingresos previos
        </Button>
      </div>

      {/* Warnings */}
      {Array.isArray(warnings) && warnings.length > 0 && (
        <div className="mt-2 p-2 border rounded bg-amber-50 text-amber-900">
          <div className="text-[11px] font-semibold">Advertencias</div>
          <ul className="list-disc list-inside">{warnings.map((w, i) => <li key={i}>{w}</li>)}</ul>
        </div>
      )}
    </div>
  );
}