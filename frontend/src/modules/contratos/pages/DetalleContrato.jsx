// INNOVA PRO+ v1.1.0 - Contratos
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { obtenerContratoPorId, generarPDFContrato } from "../services/contratosService";
import { toast } from "react-toastify";

export default function DetalleContrato() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setCargando(true);
        const resp = await obtenerContratoPorId(id);
        setData(resp);
      } catch (e) {
        console.error(e);
        toast.error("No se pudo cargar el contrato.");
      } finally {
        setCargando(false);
      }
    })();
  }, [id]);

  const onDescargarPDF = async () => {
    try {
      const blob = await generarPDFContrato(id);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Contrato-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (e) {
      console.error(e);
      toast.error("No se pudo generar el PDF del contrato.");
    }
  };

  if (cargando) return <p className="text-sm">Cargando contrato...</p>;
  if (!data) return <p className="text-sm text-muted-foreground">Sin datos.</p>;

  const { base, contrato, cronograma, garantias, firmas } = data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Contrato #{contrato?.numero || id}</h2>
        <button
          onClick={onDescargarPDF}
          className="rounded-lg border px-3 py-2 hover:bg-muted text-sm"
        >
          Descargar PDF
        </button>
      </div>

      {/* Snapshot */}
      <section className="rounded-xl border p-4">
        <h3 className="text-lg font-semibold mb-2">Resumen comercial (snapshot)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <p className="font-medium">Cliente</p>
            <p>{base?.snapshot?.cliente?.razon_social} · RUC {base?.snapshot?.cliente?.ruc}</p>
            <p className="text-muted-foreground">{base?.snapshot?.cliente?.direccion}</p>
          </div>
          <div>
            <p className="font-medium">Obra</p>
            <p>{base?.snapshot?.obra?.nombre}</p>
            <p className="text-muted-foreground">{base?.snapshot?.obra?.direccion}</p>
          </div>
          <div>
            <p className="font-medium">Filial</p>
            <p>{base?.snapshot?.filial?.razon_social} · RUC {base?.snapshot?.filial?.ruc}</p>
          </div>
          <div>
            <p className="font-medium">Uso</p>
            <p>{base?.snapshot?.uso?.nombre}</p>
          </div>
          <div className="md:col-span-2">
            <p className="font-medium">Totales</p>
            <p>
              Subtotal alquiler: S/ {base?.snapshot?.totales?.precio_subtotal_alquiler_soles} · IGV: S/ {base?.snapshot?.totales?.igv_soles} · Total: S/ {base?.snapshot?.totales?.total_soles}
            </p>
          </div>
        </div>
      </section>

      {/* Contrato */}
      <section className="rounded-xl border p-4">
        <h3 className="text-lg font-semibold mb-2">Condiciones del contrato</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div><span className="font-medium">Número:</span> {contrato?.numero || "—"}</div>
          <div><span className="font-medium">Vigencia:</span> {contrato?.vigencia_dias} días</div>
          <div><span className="font-medium">Inicio:</span> {contrato?.fecha_inicio || "—"}</div>
          <div><span className="font-medium">Fin:</span> {contrato?.fecha_fin || "—"}</div>
          <div className="md:col-span-2">
            <span className="font-medium">Pago:</span>{" "}
            {contrato?.condiciones_pago?.moneda} · {contrato?.condiciones_pago?.forma} · Adelanto {contrato?.condiciones_pago?.adelanto_pct}% · Crédito {contrato?.condiciones_pago?.credito_dias} días
          </div>
        </div>
      </section>

      {/* Cláusulas */}
      <section className="rounded-xl border p-4">
        <h3 className="text-lg font-semibold mb-2">Cláusulas</h3>
        <div className="divide-y">
          {(contrato?.clausulas || []).map((c, i) => (
            <div key={i} className="py-3">
              <p className="font-semibold text-sm">{i + 1}. {c.titulo}</p>
              <p className="text-sm whitespace-pre-wrap">{c.texto}</p>
            </div>
          ))}
          {(!contrato?.clausulas || !contrato?.clausulas.length) && (
            <p className="text-sm text-muted-foreground">Sin cláusulas.</p>
          )}
        </div>
      </section>

      {/* Cronograma/Garantías */}
      <section className="rounded-xl border p-4">
        <h3 className="text-lg font-semibold mb-2">Cronograma y garantías</h3>
        <div className="text-sm space-y-2">
          <div>
            <p className="font-medium">Hitos</p>
            {cronograma?.length ? (
              <ul className="list-disc ml-5">
                {cronograma.map((h, i) => (
                  <li key={i}>{h.titulo} · {h.fecha} · {h.porcentaje ? `${h.porcentaje}%` : (h.monto ? `S/ ${h.monto}` : "—")}</li>
                ))}
              </ul>
            ) : <p className="text-muted-foreground">—</p>}
          </div>
          <div>
            <p className="font-medium">Garantía</p>
            <p>{garantias?.tipo} {garantias?.monto ? `· S/ ${garantias.monto}` : ""} {garantias?.detalle ? `· ${garantias.detalle}` : ""}</p>
          </div>
        </div>
      </section>

      {/* Firmas */}
      <section className="rounded-xl border p-4">
        <h3 className="text-lg font-semibold mb-2">Firmas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <p className="font-medium">INNOVA (Filial)</p>
            <p>{data?.firmas?.innova?.razon_social} · RUC {data?.firmas?.innova?.ruc}</p>
            <p>Rep.: {data?.firmas?.innova?.representante} · DNI {data?.firmas?.innova?.dni}</p>
          </div>
          <div>
            <p className="font-medium">Cliente</p>
            <p>{data?.firmas?.cliente?.razon_social} · RUC {data?.firmas?.cliente?.ruc}</p>
            <p>Rep.: {data?.firmas?.cliente?.representante} · DNI {data?.firmas?.cliente?.dni}</p>
          </div>
          <div className="md:col-span-2">
            <p><span className="font-medium">Lugar/Fecha firma:</span> {data?.firmas?.lugar_firma} · {data?.firmas?.fecha_firma || "—"}</p>
          </div>
        </div>
      </section>
    </div>
  );
}