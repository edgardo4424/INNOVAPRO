import { useState } from "react";
import { renderPlantillaContrato } from "../services/documentosService";
import { toast } from "react-toastify";

export default function DemoDocxTemplate() {
  const [file, setFile] = useState(null);
  const [jsonData, setJsonData] = useState(JSON.stringify({
    contrato: {
      codigo: "CT-2025-001",
      fecha_emision: "2025-10-21",
      moneda: "PEN",
      subtotal: 10000,
      igv: 1800,
      total: 11800,
      vigencia: { inicio: "2025-11-01", fin: "2026-01-30" },
    },
    cliente: {
      razon_social: "FC BARCELONA SAC",
      ruc: "20134565456",
      domicilio_fiscal: "MIAMI CITY",
      representante: { nombre: "JOAN LAPORTA", documento: "DNI 12345678" }
    },
    obra: {
      nombre: "CAMP NOU",
      direccion: "Puente Estadio Nacional, La Victoria, Perú"
    },
    filial: {
      razon_social: "ENCOFRADOS INNOVA S.A.C.",
      ruc: "20562974998",
      direccion: "AV. ALFREDO BENAVIDES 1579 INT. 602"
    },
    clausulas: [
      { titulo: "Objeto", texto: "El presente contrato tiene por objeto el alquiler de encofrados..." },
      { titulo: "Plazo", texto: "El plazo de alquiler es de 90 días contados desde la fecha de inicio..." },
      { titulo: "Pago", texto: "El pago se realizará mensualmente contra factura a 15 días..." },
    ],
    // Ejemplo de items (si tu plantilla los lista en tabla)
    items: [
      { descripcion: "Encofrado tipo A", unidad: "m2", cantidad: 100, precio_unit: 100, importe: 10000 },
      { descripcion: "Servicio de transporte", unidad: "UND", cantidad: 1, precio_unit: 800, importe: 800 },
    ],
    usuario_actual: "ANDRÉS MARTÍNEZ",
    fecha_actual: "2025-10-21"
  }, null, 2));

  const [generarPdf, setGenerarPdf] = useState(false);
  const [out, setOut] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Selecciona una plantilla .docx");
    let parsed;
    try { parsed = JSON.parse(jsonData); }
    catch { return toast.error("JSON inválido"); }

    setLoading(true);
    try {
      const resp = await renderPlantillaContrato({
        file,
        data: parsed,
        nombreBase: "contrato-demo",
        generarPdf,
      });
      setOut(resp);
      toast.success("Documento generado");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Error generando documento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 rounded-xl border p-4">
      <h2 className="text-xl font-semibold">Demo — docxtemplater para Contratos</h2>

      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="text-sm font-medium">Plantilla (.docx)</label>
          <input
            type="file"
            accept=".docx"
            className="mt-1 block w-full rounded-lg border px-3 py-2"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <p className="text-xs text-gray-500 mt-1">
            La plantilla debe usar tags docxtemplater (ejemplos abajo).
          </p>
        </div>

        <div>
          <label className="text-sm font-medium">Datos JSON para merge</label>
          <textarea
            className="mt-1 h-56 w-full rounded-lg border px-3 py-2 font-mono text-sm"
            value={jsonData}
            onChange={(e) => setJsonData(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={generarPdf}
              onChange={(e) => setGenerarPdf(e.target.checked)}
            />
            <span className="text-sm">Intentar generar PDF en el servidor</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="ml-auto rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Generando..." : "Generar documento"}
          </button>
        </div>
      </form>

      {out && (
        <div className="rounded-lg border p-3">
          <h3 className="font-semibold">Resultado</h3>
          <ul className="list-disc pl-6 text-sm mt-2 space-y-1">
            {out?.docx?.url && (
              <li>
                DOCX: <a className="text-blue-600 underline" href={out.docx.url} target="_blank" rel="noreferrer">{out.docx.filename}</a>
              </li>
            )}
            {out?.pdf?.url && (
              <li>
                PDF: <a className="text-blue-600 underline" href={out.pdf.url} target="_blank" rel="noreferrer">{out.pdf.filename}</a>
              </li>
            )}
            {out?.pdf?.error && (
              <li className="text-red-600">PDF error: {out.pdf.error}</li>
            )}
          </ul>
        </div>
      )}

      <div className="rounded-lg bg-gray-50 p-3">
        <h4 className="font-semibold">Guía rápida de tags (docxtemplater)</h4>
        <pre className="mt-2 whitespace-pre-wrap text-xs">
{`Texto plano: {cliente.razon_social}
Fechas/Numeros: formatea en app antes de enviar (o usa filtros con extensión).
Listas (tabla o párrafos):
{#items}
- {descripcion} | {unidad} | {cantidad} | {precio_unit} | {importe}
{/items}

Cláusulas (cada una con título y texto):
{#clausulas}
TÍTULO: {titulo}
{texto}

{/clausulas}
`}
        </pre>
      </div>
    </div>
  );
}