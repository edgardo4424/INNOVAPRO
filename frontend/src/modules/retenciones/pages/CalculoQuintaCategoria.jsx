import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { currency } from "../utils/ui";
import { useQuintaCategoria } from "../hooks/useQuintaCategoria";

import TrabajadorCombobox from "../components/TrabajadorCombobox";
import HistorialTabla from "../components/HistorialTabla";
import IngresosPreviosCard from "../components/IngresosPreviosCard";
import PreviewResultados from "../components/PreviewResultados";
import TramosDetalle from "../components/TramosDetalle";
import RetencionMetaBanner from "../components/RetencionMetaBanner";
import MultiempleoResumen from "../components/MultiempleoResumen";
import MultiempleoModal from "../components/MultiempleoModal";
import CertificadoQuintaModal from "../components/CertificadoQuintaModal";
import SinPreviosModal from "../components/SinPreviosModal";
import MasivoQuintaModal from "../components/MasivoQuintaModal";

export default function CalculoQuintaCategoria() {
  const {
    form, handleChange, resetPreview, preview,
    historialVigente, vigenteDelMes, yaExisteOficialEnMes,
    trabajadores, handleTrabajadorSelect, filiales, handleFilialSelect,
    canCalcular, handlePreview, handleGuardar, handleRecalcular,
    loadingPreview, saving, errors, onSoportesGuardado,
  } = useQuintaCategoria();

  const [openMulti, setOpenMulti] = useState(false);
  const [openCert, setOpenCert] = useState(false);
  const [openSP, setOpenSP] = useState(false);
  const [openMasivo, setOpenMasivo] = useState(false);

  const abrirMulti = () => { setOpenMulti(true); handleChange("fuentePrevios", "AUTO"); };
  const abrirCert  = () => { setOpenCert(true); };
  const abrirSP    = () => { setOpenSP(true); };

  const onAnioChange = (valor) => { handleChange("anio", valor); resetPreview?.(); };
  const onMesChange  = (valor) => { handleChange("mes", valor);  resetPreview?.(); };
  const onTrabSelect = (id)    => { handleTrabajadorSelect(id);  resetPreview?.(); };

  const onClickAuto = async () => {
    handleChange("fuentePrevios", "AUTO");
    if (form.trabajadorId && form.anio && form.mes) await handlePreview();
  };

  const kpis = useMemo(() => {
    if (!preview) return null;
    const base = Number(preview?.resultados?.retencion_base_mes || 0);
    const adic = Number(preview?.resultados?.retencion_adicional_mes || 0);
    return { base, adic, total: base + adic, divisor: preview?.calculos?.divisor_calculo ?? "-" };
  }, [preview]);

  const YEARS = useMemo(() => ["2025","2026","2027","2028","2029","2030"], []);
  const MESES = useMemo(
    () => ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],
    []
  );

  const obtenerSinPreviosDelPreview = (out) =>
    out?.soportes?.sinPrevios || out?.retencion_meta?.soportes_json?.sin_previos || null;

  //const dense = true;

  return (
    <div className="p-2 sm:p-3 xl:p-4 min-h-[calc(100vh-70px)] overflow-auto">
      <div className="flex flex-col xl:flex-row gap-3 h-full">
        {/* Izquierda: fija */}
        <div className="w-full xl:w-[605px] shrink-0 flex flex-col gap-2 min-h-0">
          <Card className="shadow-sm">
            <CardHeader className="py-1">
              <CardTitle className="text-[13px] leading-none">Calculadora de Quinta Categoría</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 py-1">
              {/* Filtros */}
              <section className="grid gap-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="grid gap-0.5">
                    <Label className="text-[10px]">Año</Label>
                    <Select value={String(form.anio || "")} onValueChange={onAnioChange}>
                      <SelectTrigger className="h-6 w-full text-[11px]">
                        <SelectValue placeholder="Selecciona el año" />
                      </SelectTrigger>
                      <SelectContent>
                        {YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    {errors?.anio && <p className="text-[11px] text-red-600">{errors?.anio}</p>}
                  </div>

                  <div className="grid gap-0.5">
                    <Label className="text-[10px]">Mes</Label>
                    <Select value={String(form.mes || "")} onValueChange={onMesChange}>
                      <SelectTrigger className="h-6 w-full text-[11px]">
                        <SelectValue placeholder="Selecciona el mes" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({length:12}).map((_,i)=>(
                          <SelectItem key={i+1} value={String(i+1)}>{MESES[i]}</SelectItem>))}
                      </SelectContent>
                    </Select>
                    {errors?.mes && <p className="text-[11px] text-red-600">{errors?.mes}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="grid gap-0.5 min-w-0">
                    <Label className="text-[10px]">Trabajador</Label>
                    <TrabajadorCombobox 
                      trabajadores={trabajadores} 
                      value={form.trabajadorId || ""} 
                      onSelect={onTrabSelect} dense 
                    />
                    {errors?.trabajadorId && <p className="text-[11px] text-red-600">{errors?.trabajadorId}</p>}
                  </div>

                  <div className="grid gap-0.5 min-w-0">
                    <Label className="text-[10px]">Filial</Label>
                    <Select value={String(form.filial_id || "")} onValueChange={(v)=>handleFilialSelect(v)} disabled={!filiales?.length}>
                      <SelectTrigger className="h-6 truncate w-full text-[11px]">
                        <SelectValue placeholder={filiales?.length ? "Selecciona la filial" : "Sin filiales vigentes"} />
                      </SelectTrigger>
                      <SelectContent>
                        {(filiales || []).map(f => (
                          <SelectItem key={f.filial_id} value={String(f.filial_id)}>
                            {(f.filial_razon_social || `Filial ${f.filial_id}`)} — S/ {Number(f.sueldo || 0).toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors?.filial_id && <p className="text-[11px] text-red-600">{errors?.filial_id}</p>}
                  </div>
                </div>
              </section>

              {/* Acciones */}
              <div className="flex justify-between gap-1 mt-4">
                <Button className="h-7 px-2 text-[11px]" onClick={handlePreview} disabled={!canCalcular || loadingPreview}>
                  {loadingPreview ? "Calculando..." : "Calcular proyección"}
                </Button>

                <Button className="h-7 px-2 text-[11px]" variant="outline" onClick={() => setOpenMasivo(true)}>
                  Cálculo masivo
                </Button>

                {yaExisteOficialEnMes ? (
                  <Button 
                    className="h-7 px-2 text-[11px]" 
                    onClick={() => vigenteDelMes && handleRecalcular(vigenteDelMes)} 
                    variant="secondary"
                  >
                    Recalcular vigente
                  </Button>
                ) : (
                  <Button 
                    className="h-7 px-2 text-[11px]" 
                    onClick={handleGuardar} 
                    variant="secondary" 
                    disabled={!preview || saving}
                  >
                    {saving ? "Guardando..." : "Guardar como oficial"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Paneles inferiores */}
          {preview && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 min-h-0">
              <div className="min-h-0">
                <IngresosPreviosCard
                  dense 
                  preview={preview} 
                  fuentePrevios={form.fuentePrevios} 
                  filiales={filiales}
                  onClickAuto={onClickAuto} 
                  onOpenMulti={abrirMulti} 
                  onOpenCertificado={abrirCert} 
                  onOpenSinPrevios={abrirSP}
                  className="h-full overflow-auto"
                />
              </div>

              <div className="min-h-0 flex flex-col gap-2">
                {kpis && (
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-xl border p-2 bg-white">
                      <div className="text-[10px] text-slate-500">Base del mes</div>
                      <div className="text-base text-[12px] ">{currency.format(kpis.base)}</div>
                    </div>
                    <div className="rounded-xl border p-2 bg-white">
                      <div className="text-[10px] text-slate-500">Adicional</div>
                      <div className="text-base text-[12px] ">{currency.format(kpis.adic)}</div>
                    </div>
                    <div className="rounded-xl border p-2 bg-white">
                      <div className="text-[10px] text-slate-500">Total</div>
                      <div className="text-base text-[12px] font-bold">{currency.format(kpis.total)}</div>
                    </div>
                  </div>
                )}
                <PreviewResultados dense preview={preview} className="h-full overflow-auto" />
              </div>
            </div>
          )}

          {/* Modales */}
          <MultiempleoModal 
            open={openMulti} 
            onClose={()=>setOpenMulti(false)} 
            dni={form.dni} 
            anio={form.anio} 
            filiales={filiales}
            currentFilialId={form.filial_id || undefined} 
            onSaved={onSoportesGuardado}
          />
          <CertificadoQuintaModal 
            open={openCert} 
            onClose={() => {
              setOpenCert(false); 
              handleChange("fuentePrevios", "CERTIFICADO");
            }}
            dni={form.dni} 
            anio={form.anio} 
            onSaved={onSoportesGuardado}
          />
          <SinPreviosModal 
            open={openSP} 
            onClose={()=>setOpenSP(false)} 
            dni={form.dni} 
            anio={form.anio}
            prefill={obtenerSinPreviosDelPreview(preview)}
            onSaved={onSoportesGuardado}
          />

          <MasivoQuintaModal
            open={openMasivo}
            onClose={() => setOpenMasivo(false)}
            defaultAnio={form.anio}
            defaultMes={form.mes}
            trabajadores={trabajadores}  
            /* filiales={filialesGlobales}  // opcional; si no las pasas, el modal hace GET /filiales */
            onDone={() => {/* refrescos si aplica */}}
          />

        </div>

        {/* Derecha: flexible con un único scroll interno */}
        <div className="flex-1 min-w-0 grid gap-3 min-h-0 overflow-auto p-0.5">
          {preview?.retencion_meta && (
            <RetencionMetaBanner retencionMeta={preview.retencion_meta} trabajador={preview.trabajador} />
          )}

          <Card className="shadow-sm h-full">
            <CardHeader>
              <CardTitle className="text-[13px] leading-none">Historial del año</CardTitle>
            </CardHeader>
            <CardContent className="min-h-0 overflow-auto">
              <HistorialTabla dense rows={historialVigente} onRecalc={handleRecalcular}/>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-[13px] leading-none">Detalle por tramos</CardTitle>
            </CardHeader>
            <CardContent className="min-h-0 p-2">
              <TramosDetalle dense preview={preview}/>
              <MultiempleoResumen 
                ingresosPrevios={preview?.ingresos_previos}
                filiales={filiales}
                retencionMeta={preview?.retencion_meta}
                currentFilialId={form.filial_id}
                mesActual={preview?.trabajador?.mes}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}