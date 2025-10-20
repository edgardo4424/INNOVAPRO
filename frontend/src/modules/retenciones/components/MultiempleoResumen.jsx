import React, { useMemo } from "react";

export default function MultiempleoResumen({ 
  ingresosPrevios, 
  filiales = [], 
  retencionMeta, 
  currentFilialId, 
  mesActual 
}) {
  const meta = retencionMeta || {};
  const origen = String(meta?.origen_retencion || "").toUpperCase();
  const aplicaDesde =
    Number(meta?.detalle_json?.aplica_desde_mes ?? meta?.aplica_desde_mes ?? NaN);
  const mes = Number(mesActual || 1);

  if (!origen || origen === "NINGUNO") return null;
  if (!Number.isNaN(aplicaDesde) && mes < aplicaDesde) return null;

  const remu = ingresosPrevios?.remu_multi;
  const grati = ingresosPrevios?.grati_multi;
  const af   = ingresosPrevios?.af_multi;

  const rsById = useMemo(() => {
    const m = {};
    (filiales || []).forEach(f => {
      m[String(f.filial_id)] = f.filial_razon_social || f.razon_social || `Filial #${f.filial_id}`;
    });
    return m;
  }, [filiales]);

  const labelFilial = (id) => rsById[String(id)] || `Filial #${id}`;
  const isRetiene   = (id) => String(id) === String(retencionMeta?.filial_retiene_id);
  const isActual    = (id) => String(id) === String(currentFilialId);

  const RoleChips = ({ filialId }) => {
    const chips = [];
    if (isRetiene(filialId)) chips.push({ txt: "RETIENE", cls: "bg-emerald-100 text-emerald-800" });
    if (isActual(filialId)) chips.push({ txt: "FILIAL ACTUAL", cls: "bg-slate-200 text-slate-800" });
    if (chips.length === 0) chips.push({ txt: "OTRA FILIAL", cls: "bg-slate-100 text-slate-500" });
    return (
      <div className="flex gap-1 flex-wrap">
        {chips.map((c, i) => (
          <span key={i} className={`px-2 py-0.5 rounded-full text-[10px] ${c.cls}`}>{c.txt}</span>
        ))}
      </div>
    );
  };

  const Currency = ({ v }) => <span>S/ {Number(v || 0).toLocaleString("es-PE")}</span>;

  const Box = ({ title, subtitle, right, children }) => (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between p-3 border-b bg-slate-50 rounded-t-2xl">
        <div>
          <div className="text-sm font-semibold text-slate-800">{title}</div>
          {subtitle && <div className="text-xs text-slate-500">{subtitle}</div>}
        </div>
        {right}
      </div>
      <div className="p-3">{children}</div>
    </div>
  );

  const hasAnyMulti =
    !!(remu && ((remu.previos_total_otras ?? 0) > 0 || (remu.proyeccion_total_otras ?? 0) > 0 || (remu.detalle_por_filial?.length > 0))) ||
    !!(grati && (((grati.proyeccion_total_otras?.julio ?? 0) > 0) || ((grati.proyeccion_total_otras?.diciembre ?? 0) > 0) || (grati.detalle_por_filial?.length > 0))) ||
    !!(af && ((af.previos_total_otras ?? 0) > 0 || (af.proyeccion_total_otras ?? 0) > 0 || (af.detalle_por_filial?.length > 0)));

    if (!hasAnyMulti) return null;

    const filas = grati.detalle_por_filial || [];

    const mostrarJulioUsado = mesActual >= 7;      // desde Julio en adelante mostramos USADO
    const mostrarDiciembreUsado   = mesActual >= 12;     // en Diciembre mostramos USADO

    // Totales por tipo
    const totJulioUsado = filas.reduce((a, f) => a + Number(f?.julio?.usado || 0), 0); 
    const totJulioProj  = filas.reduce((a, f) => a + Number(f?.julio?.proj  || 0), 0);
    const totDicUsado   = filas.reduce((a, f) => a + Number(f?.diciembre?.usado || 0), 0);
    const totDicProj    = filas.reduce((a, f) => a + Number(f?.diciembre?.proj  || 0), 0);

    // Chips de encabezado coherentes al mes
    const headerJulio = mostrarJulioUsado
        ? (totJulioUsado || Number(grati?.pagadas_total_otras || 0) || Number(grati?.proyeccion_total_otras?.julio || 0))
        : (Number(grati?.proyeccion_total_otras?.julio || 0) || totJulioProj);

    const headerDic = mostrarDiciembreUsado
        ? (totDicUsado) 
        : (Number(grati?.proyeccion_total_otras?.diciembre || 0) || totDicProj);

  return (
    <div className="grid grid-cols-1 gap-4">
      {/* REMUNERACIONES */}
      {remu && (
        <Box
          title="Remuneraciones (otras filiales)"
          subtitle="Previos y proyección por filial"
          right={
            <div className="flex gap-2 text-xs">
              <span className="px-2 py-0.5 rounded bg-amber-50 border text-amber-800">
                Previos · <Currency v={remu.previos_total_otras} />
              </span>
              <span className="px-2 py-0.5 rounded bg-indigo-50 border text-indigo-800">
                Proyección · <Currency v={remu.proyeccion_total_otras} />
              </span>
            </div>
          }
        >
          <div className="overflow-x-auto rounded border">
            <table className="w-full text-[11px]">
              <thead className="bg-gray-50">
                <tr className="text-left text-slate-600">
                  <th className="p-2">Filial</th>
                  <th className="p-2 text-right">Sueldo</th>
                  <th className="p-2 text-right">Meses prev.</th>
                  <th className="p-2 text-right">Previos (S/)</th>
                  <th className="p-2 text-right">Meses proy.</th>
                  <th className="p-2 text-right">Proyección (S/)</th>
                </tr>
              </thead>
              <tbody>
                {(remu.detalle_por_filial || []).map((f, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2 whitespace-nowrap">
                      {labelFilial(f.filial_id)}
                    </td>
                    <td className="p-2 text-right"><Currency v={f.sueldo} /></td>
                    <td className="p-2 text-right">{f.previos_meses ?? "—"}</td>
                    <td className="p-2 text-right"><Currency v={f.previos_monto} /></td>
                    <td className="p-2 text-right">{f.proj_meses ?? "—"}</td>
                    <td className="p-2 text-right font-medium text-blue-600"><Currency v={f.proj_monto} /></td>
                  </tr>
                ))}
                <tr className="bg-gray-50 border-t">
                  <td className="p-2 font-semibold" colSpan={2}>Total</td>
                  <td className="p-2" colSpan={1}></td>
                  <td className="p-2 text-right font-semibold"><Currency v={remu.previos_total_otras} /></td>
                  <td className="p-2" colSpan={1}></td>
                  <td className="p-2 text-right font-bold text-blue-700"><Currency v={remu.proyeccion_total_otras} /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </Box>
      )}

    {/* GRATIFICACIONES */}
    {grati && (
        <Box
            title="Gratificaciones (otras filiales)"
            right={
                <div className="flex gap-2 text-xs">
                <span className="px-2 py-0.5 rounded bg-indigo-50 border text-indigo-800">
                    Julio · <Currency v={headerJulio} />
                </span>
                <span className="px-2 py-0.5 rounded bg-indigo-50 border text-indigo-800">
                    Diciembre · <Currency v={headerDic} />
                </span>
                </div>
            }
        >
        <div className="overflow-x-auto rounded border">
            <table className="min-w-full text-[11.5px]">
                <thead className="bg-gray-50">
                    <tr className="text-left text-slate-600">
                        <th className="p-2">Filial</th>
                        <th className="p-2 text-right">Julio</th>
                        <th className="p-2 text-right">Diciembre</th>
                    </tr>
                </thead>
                <tbody>
                    {filas.map((f) => {
                        const jR = Number(f?.julio?.real || 0);
                        const jT = Number(f?.julio?.trunca || 0);
                        const jU = Number(f?.julio?.usado || 0);
                        const jP = Number(f?.julio?.proj  || 0);

                        const dR = Number(f?.diciembre?.real || 0);
                        const dT = Number(f?.diciembre?.trunca || 0);
                        const dU = Number(f?.diciembre?.usado || 0);
                        const dP = Number(f?.diciembre?.proj  || 0);

                        return (
                            <tr key={f.filial_id} className="border-t">
                                <td className="p-2 whitespace-nowrap">
                                    {labelFilial(f.filial_id)}
                                </td>
                                <td className="p-2 text-right"><Currency v={mostrarJulioUsado ? jU : jP} /></td>
                                <td className="p-2 text-right"><Currency v={mostrarDiciembreUsado ? dU : dP} /></td>
                            </tr>
                        );
                    })}
                    <tr className="bg-gray-50 border-t">
                        <td className="p-2 font-semibold" colSpan={1}>Totales</td>
                        <td className="p-2 text-right font-semibold">
                            <Currency v={mostrarJulioUsado ? totJulioUsado : totJulioProj} />
                        </td>
                        <td className="p-2 text-right font-bold text-blue-700">
                            <Currency v={mostrarDiciembreUsado ? totDicUsado : totDicProj} />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <p className="mt-2 text-[10.5px] text-slate-600">
            <b>Julio</b> muestra <b>{mostrarJulioUsado ? "Usado" : "Proyección"}</b> según el mes actual; 
            <b className="ml-2">Diciembre</b> muestra <b>{mostrarDiciembreUsado ? "Usado" : "Proyección"}</b>.
        </p>
        </Box>
    )}


      {/* ASIGNACIÓN FAMILIAR */}
      {af && (
        <Box
          title="Asignación Familiar (otras filiales)"
          subtitle="Previos y proyección por filial"
          right={
            <div className="flex gap-2 text-xs">
              <span className="px-2 py-0.5 rounded bg-amber-50 border text-amber-800">
                Previos · <Currency v={af.previos_total_otras} />
              </span>
              <span className="px-2 py-0.5 rounded bg-indigo-50 border text-indigo-800">
                Proyección · <Currency v={af.proyeccion_total_otras} />
              </span>
            </div>
          }
        >
          <div className="overflow-x-auto rounded border">
            <table className="min-w-full text-[11.5px]">
              <thead className="bg-gray-50">
                <tr className="text-left text-slate-600">
                  <th className="p-2">Filial</th>
                  <th className="p-2 text-right">Previos (S/)</th>
                  <th className="p-2 text-right">Proyección (S/)</th>
                </tr>
              </thead>
              <tbody>
                {(af.detalle_por_filial || []).map((f, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2 whitespace-nowrap">
                      {labelFilial(f.filial_id)}
                    </td>
                    <td className="p-2 text-right"><Currency v={f.previos_monto} /></td>
                    <td className="p-2 text-right font-medium text-blue-600"><Currency v={f.proj_monto} /></td>
                  </tr>
                ))}
                <tr className="bg-gray-50 border-t">
                  <td className="p-2 font-semibold" colSpan={1}>Total</td>
                  <td className="p-2 text-right font-semibold"><Currency v={af.previos_total_otras} /></td>
                  <td className="p-2 text-right font-bold text-blue-700"><Currency v={af.proyeccion_total_otras} /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </Box>
      )}

      <p className="text-[10.5px] text-slate-600">
        <b>Previos</b> = ingresos acumulados hasta el mes anterior. <b>Proyección</b> = estimación del resto del año con contratos vigentes.
      </p>
    </div>
  );
}