// INNOVA PRO+ v1.1.0 - Contratos
import { CheckCircle2, FileDown, List, Eye } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { generarPDFContrato } from "../services/contratosService";

// Uso:
// <ExitoContrato contratoId={idCreado} />

export default function ExitoContrato({ contratoId }) {
  const navigate = useNavigate();
  const { id: idFromRoute } = useParams();
  const id = contratoId || idFromRoute;

  const onDescargarPDF = async () => {
    try {
      if (!id) {
        toast.info("Aún no hay ID de contrato para descargar.");
        return;
      }
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

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <CheckCircle2 className="w-14 h-14 text-emerald-500" />
      <h2 className="mt-3 text-2xl font-bold">¡Contrato creado correctamente!</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        ID de contrato {id ? `#${id}` : "(pendiente de backend)"} listo.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={() => navigate("/contratos")}
          className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-muted"
        >
          <List className="w-4 h-4" /> Ver contratos
        </button>

        <button
          onClick={() => navigate(`/contratos/${id}`)}
          disabled={!id}
          className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-muted disabled:opacity-50"
        >
          <Eye className="w-4 h-4" /> Ir al detalle
        </button>

        <button
          onClick={onDescargarPDF}
          disabled={!id}
          className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-muted disabled:opacity-50"
        >
          <FileDown className="w-4 h-4" /> Descargar PDF
        </button>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Si aún no está integrado el backend, puedes quedarte en esta pantalla y continuar con otros registros.
      </p>
    </div>
  );
}