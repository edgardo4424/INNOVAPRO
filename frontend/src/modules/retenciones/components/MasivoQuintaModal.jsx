import { useEffect, useMemo, useState } from "react";
import { useQuintaMasivo, useFiliales } from "../hooks/useQuintaMasivo";
import { toast } from "react-toastify";

import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Calendar as CalendarIcon,
  Building2, Loader2, RotateCcw, Download, Play, Filter,
  CheckCircle2, Wallet, Search, XCircle, Check, X
} from "lucide-react";

/* -------------------- datos base -------------------- */
const MONTHS = [
  { v: "1", n: "Enero" }, { v: "2", n: "Febrero" }, { v: "3", n: "Marzo" },
  { v: "4", n: "Abril" }, { v: "5", n: "Mayo" }, { v: "6", n: "Junio" },
  { v: "7", n: "Julio" }, { v: "8", n: "Agosto" }, { v: "9", n: "Septiembre" },
  { v: "10", n: "Octubre" }, { v: "11", n: "Noviembre" }, { v: "12", n: "Diciembre" },
];
const FILTERS = [
  { key: "all",  label: "Todos" },
  { key: "ok",   label: "Solo OK" },
  { key: "fail", label: "Solo Fallidos" },
  { key: "skip", label: "Solo Saltados" },
  { key: "upd",  label: "Solo Actualizados" },
];

const mesNombre = (m) => MONTHS.find(x => x.v === String(m))?.n || String(m);
const filialIdOf    = (row) => String(row?.filial_id ?? row?.id ?? row?.codigo ?? "");
const filialLabelOf = (row) => row?.filial_razon_social ?? row?.razon_social ?? row?.nombre ?? `Filial ${filialIdOf(row)}`;

const nombreDesdeTrabajador = (w) =>
  (w?.nombre_completo ||
   [w?.nombres, w?.apellido_paterno, w?.apellido_materno].filter(Boolean).join(" ") ||
   w?.razon_social || w?.nombre || "").trim();

const indexNombresByDni = (trabajadores = []) => {
  const idx = {};
  for (const w of trabajadores) {
    const dni = String(w?.numero_documento ?? w?.dni ?? w?.documento ?? "");
    if (dni) idx[dni] = nombreDesdeTrabajador(w);
  }
  return idx;
};

/* -------------------- UI helpers -------------------- */
function Field({ label, icon, children, className = "" }) {
  return (
    <div className={`grid gap-1 ${className}`}>
      <Label className="text-[11px] flex items-center gap-1">{icon}{label}</Label>
      {children}
    </div>
  );
}
function Chip({ label, value, icon }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 bg-white text-[11px]">
      {icon}{label}: <b className="font-medium">{value}</b>
    </div>
  );
}
const Th = ({ children, align = "left" }) => (
  <th className={`p-2.5 text-${align} font-medium text-slate-700 whitespace-nowrap`}>{children}</th>
);
const Td = ({ children, align = "left", className = "" }) => (
  <td className={`p-2.5 text-${align} ${className}`}>{children}</td>
);

/* -------------------- componente -------------------- */
export default function MasivoQuintaModal({
  open,
  onClose,
  trabajadores = [],
  filiales: filialesProp = null,
  defaultAnio,
  defaultMes,
  onDone,
}) {
  const YEARS = useMemo(() => {
    const y0 = Number(defaultAnio || new Date().getFullYear());
    return Array.from({ length: 6 }, (_, i) => String(y0 + i));
  }, [defaultAnio]);

  const [form, setForm] = useState({
    anio: String(defaultAnio || new Date().getFullYear()),
    mes:  String(defaultMes || (new Date().getMonth() + 1)),
    filialId: ""
  });
  useEffect(() => {
    if (open) setForm(f => ({ ...f, anio: String(defaultAnio || f.anio), mes: String(defaultMes || f.mes) }));
  }, [open, defaultAnio, defaultMes]);

  // Filiales
  const debeAutocargar = !Array.isArray(filialesProp) || filialesProp.length === 0;
  const { loadingFiliales, errorFiliales, filiales, reload } = useFiliales({ auto: debeAutocargar });
  const filialesData = !debeAutocargar ? filialesProp : filiales;

  // Índices
  const nombresByDni = useMemo(() => indexNombresByDni(trabajadores), [trabajadores]);
  const nombreFilialSel = useMemo(() => {
    const f = (filialesData || []).find(x => filialIdOf(x) === String(form.filialId));
    return f ? filialLabelOf(f) : "";
  }, [filialesData, form.filialId]);

  // Caso de uso
  const { loading, last, resumen, ejecutar, exportarCSV } = useQuintaMasivo();

  // Filtros
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");

  const rows = useMemo(() => (last?.results ?? []), [last]);
  const filtered = useMemo(() => {
    let data = rows;
    if (filter === "ok")   data = data.filter(r => r.ok);
    if (filter === "fail") data = data.filter(r => !r.ok);
    if (filter === "skip") data = data.filter(r => !!r.skipped);
    if (filter === "upd")  data = data.filter(r => !!r.updated);
    if (q) {
      const t = q.toLowerCase();
      data = data.filter(r =>
        String(r.dni || "").toLowerCase().includes(t) ||
        String(nombresByDni[r.dni] || "").toLowerCase().includes(t) ||
        String(r.message || "").toLowerCase().includes(t)
      );
    }
    return data;
  }, [rows, filter, q, nombresByDni]);

  const canRun = form.anio && form.mes && form.filialId && !loading;
  const handleRun = async () => {
    if (!canRun) return;
    try {
        const out = await ejecutar({ anio: form.anio, mes: form.mes, filialId: form.filialId });
        onDone?.(out);
    } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Ocurrió un error al procesar el cálculo masivo.";
        toast.error(msg);
    }
  };
  const handleClose = () => { if (!loading) onClose?.(); };

  /* -------------------- UI -------------------- */
  return (
    <Dialog open={open} onOpenChange={(v) => !loading && (v ? null : handleClose())}>
      {/* Ancho grande tipo Multiempleo + alto controlado, y scroller interno */}
      <DialogContent size="xl" className="h-[90vh] p-0 overflow-hidden rounded-2xl shadow-2xl">        
        {/* HEADER */}
        <div className="px-6 pt-5 pb-2 border-b bg-white">
          <DialogHeader className="p-0 space-y-1.5">
            <DialogTitle className="text-[18px] font-semibold">Cálculo masivo — Quinta Categoría</DialogTitle>
            <DialogDescription className="text-[12px]">
              Ejecuta la <b>retención base del mes</b> por filial, revisa resultados y exporta CSV.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* TOOLBAR */}
        <div className="px-6 py-3 border-b bg-white">
          <div className="grid gap-3 md:grid-cols-12">
            <Field className="md:col-span-3" label="Año" icon={<CalendarIcon size={14}/>}>
              <Select value={String(form.anio)} onValueChange={(v)=>setForm(s=>({...s, anio: v}))}>
                <SelectTrigger className="h-9 text-[12px]"><SelectValue placeholder="Año" /></SelectTrigger>
                <SelectContent>{YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
              </Select>
            </Field>

            <Field className="md:col-span-3" label="Mes" icon={<CalendarIcon size={14}/>}>
              <Select value={String(form.mes)} onValueChange={(v)=>setForm(s=>({...s, mes: v}))}>
                <SelectTrigger className="h-9 text-[12px]"><SelectValue placeholder="Mes" /></SelectTrigger>
                <SelectContent>{MONTHS.map(m => <SelectItem key={m.v} value={m.v}>{m.n}</SelectItem>)}</SelectContent>
              </Select>
            </Field>

            <Field className="md:col-span-6" label="Filial" icon={<Building2 size={14}/>}>
              {loadingFiliales && !filialesData?.length ? (
                <div className="h-9 px-3 flex items-center text-[12px] border rounded-md text-slate-500">
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" /> Cargando filiales…
                </div>
              ) : (errorFiliales && !filialesData?.length) ? (
                <div className="flex gap-2 items-center">
                  <div className="h-9 px-3 flex items-center text-[12px] border rounded-md text-red-600">
                    <XCircle className="mr-2 h-3 w-3" /> {errorFiliales}
                  </div>
                  <Button variant="outline" className="h-9 text-[12px]" onClick={reload}>
                    <RotateCcw className="mr-2 h-4 w-4" /> Reintentar
                  </Button>
                </div>
              ) : (
                <Select
                  value={String(form.filialId || "")}
                  onValueChange={(v)=>setForm(s=>({...s, filialId: v}))}
                  disabled={loading || loadingFiliales || !filialesData?.length}
                >
                  <SelectTrigger className="h-9 text-[12px]">
                    <SelectValue placeholder={filialesData?.length ? "Selecciona filial" : "Sin filiales"} />
                  </SelectTrigger>
                  <SelectContent>
                    {(filialesData || []).map(f => {
                      const id = filialIdOf(f);
                      return <SelectItem key={id} value={id}>{filialLabelOf(f)}</SelectItem>;
                    })}
                  </SelectContent>
                </Select>
              )}
            </Field>

            {/* Acciones + filtros */}
            <div className="md:col-span-12 flex flex-wrap items-center gap-2 mt-1">
              <Button onClick={handleRun} disabled={!canRun} className="h-9 text-[12px]">
                {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando…</>) : (<><Play className="mr-2 h-4 w-4" /> Ejecutar</>)}
              </Button>
              <Button
                variant="secondary"
                disabled={!rows.length || loading}
                className="h-9 text-[12px]"
                onClick={() => exportarCSV({ mesNom: mesNombre(form.mes), filialNom: nombreFilialSel, nombresByDni })}
              >
                <Download className="mr-2 h-4 w-4" /> Exportar CSV
              </Button>

              <div className="ml-auto flex items-center gap-2">
                <Filter size={16} className="text-slate-500" />
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="h-9 text-[12px] w-[150px]"><SelectValue /></SelectTrigger>
                  <SelectContent>{FILTERS.map(f => <SelectItem key={f.key} value={f.key}>{f.label}</SelectItem>)}</SelectContent>
                </Select>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    className="h-9 text-[12px] pl-8 w-[260px]"
                    placeholder="Buscar por nombre / DNI / mensaje"
                    value={q}
                    onChange={e => setQ(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KPIs compactos (no desbordan) */}
        <div className="px-6 py-2 bg-slate-50 border-b">
          <div className="flex flex-wrap gap-2">
            <Chip label="Año" value={resumen?.anio ?? form.anio} />
            <Chip label="Mes" value={mesNombre(resumen?.mes ?? form.mes)} />
            <Chip label="Filial" value={nombreFilialSel || "—"} />
            <Chip icon={<CheckCircle2 size={12} className="text-emerald-700" />} label="Éxitos" value={resumen ? `${resumen.exitosos}/${resumen.total}` : "—"} />
            <Chip icon={<Wallet size={12} className="text-blue-700" />} label="Base total (S/)" value={resumen ? Number(resumen.totalBase || 0).toFixed(2) : "—"} />
            <Chip label="Registros" value={rows.length} />
          </div>
        </div>

        {/* CONTENIDO: un único scroller interno — aquí vive la tabla */}
        <div className="flex-1 min-h-0 px-6 pt-3 pb-6 overflow-hidden flex flex-col">
          <Card className="h-full rounded-xl shadow-sm">
            {/* ESTE es el scroller. Clave: h-full + overflow-auto y que su padre tenga min-h-0 */}
            <CardContent className="p-0 h-full overflow-auto">
              <table className="w-full table-fixed text-[12px]">
                {/* IMPORTANT: colgroup sin nodos de texto para evitar hydration errors */}
                <colgroup>{[
                  <col key="c1" style={{ width: 320 }}/>,
                  <col key="c2" style={{ width: 140 }}/>,
                  <col key="c3" style={{ width: 80 }}/>,
                  <col key="c4" style={{ width: 120 }}/>,
                  <col key="c5" style={{ width: 110 }}/>,
                  <col key="c6" style={{ width: 140 }}/>,
                  <col key="c7" /> // Mensaje ocupa el resto
                ]}</colgroup>

                <thead className="bg-slate-50 border-b">
                <tr>
                    <th className="p-2.5 text-left font-medium text-slate-700 whitespace-nowrap">Trabajador</th>
                    <th className="p-2.5 text-left font-medium text-slate-700 whitespace-nowrap">DNI</th>
                    <th className="p-2.5 text-center font-medium text-slate-700 whitespace-nowrap">OK</th>
                    <th className="p-2.5 text-center font-medium text-slate-700 whitespace-nowrap">Actualizado</th>
                    <th className="p-2.5 text-center font-medium text-slate-700 whitespace-nowrap">Saltado</th>
                    <th className="p-2.5 text-right font-medium text-slate-700 whitespace-nowrap">Base Mes (S/)</th>
                    <th className="p-2.5 text-left font-medium text-slate-700 whitespace-nowrap">Mensaje</th>
                </tr>
                </thead>

                <tbody>
                  {(filtered.length ? filtered : []).map((r, idx) => (
                    <tr key={idx} className={(idx % 2 ? "bg-white" : "bg-slate-50/50") + " hover:bg-slate-100/60 transition-colors"}>
                      <Td className="bg-inherit">                        
                        <span className="block truncate" title={nombresByDni[r.dni] || "No disponible"}>
                          {nombresByDni[r.dni] || <span className="text-slate-400">No disponible</span>}
                        </span>
                      </Td>

                      <Td className="bg-inherit">                        
                        <span className="block truncate" title={r.dni}>{r.dni}</span>
                      </Td>

                      <Td align="center">
                        {r.ok
                          ? <span className="inline-flex items-center gap-1 text-emerald-700"><Check size={14}/>Sí</span>
                          : <span className="inline-flex items-center gap-1 text-slate-600"><X size={14}/>No</span>}
                      </Td>

                      <Td align="center">
                        {r.updated
                          ? <Badge className="bg-blue-600 hover:bg-blue-600">Sí</Badge>
                          : <span className="text-slate-400">—</span>}
                      </Td>

                      <Td align="center">
                        {r.skipped ? <span className="text-amber-700">Sí</span> : <span className="text-slate-400">—</span>}
                      </Td>
                      <Td align="right">{Number(r.retencion_base_mes || 0).toFixed(2)}</Td>
                      <Td><span className="block truncate" title={r.message || ""}>{r.message || "—"}</span></Td>
                    </tr>
                  ))}

                  {!rows.length && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">
                        Ejecuta el cálculo para ver resultados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}