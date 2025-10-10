import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  FileWarning,
  X,
  Loader2,
  CheckCircle,
  XCircle,
  RotateCw,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useBandeja } from "../../context/BandejaContext";
import { getTipoResumido } from "../../utils/formateos";
import facturaService from "../../service/FacturaService";

const getEstadoStyles = (estado) => {
  switch (estado?.toUpperCase()) {
    case "EMITIDA":
      return {
        className: "bg-green-100 text-green-700 border-green-300",
        icon: CheckCircle,
      };
    case "RECHAZADA":
    case "RECHAZADO":
      return {
        className: "bg-red-100 text-red-700 border-red-300",
        icon: XCircle,
      };
    case "PENDIENTE":
    default:
      return {
        className: "bg-yellow-100 text-yellow-700 border-yellow-300",
        icon: FileWarning,
      };
  }
};

export default function ModalDocumentosPendientes({ refetchTableData }) {
  const { totalPendientes, documentosPendientes, consultaPendientes } =
    useBandeja();
  const [open, setOpen] = useState(false);
  const [docsLocal, setDocsLocal] = useState([]);
  const [isUpdatingAll, setIsUpdatingAll] = useState(false);
  const [updateSummary, setUpdateSummary] = useState(null);

  useEffect(() => {
    if (documentosPendientes) {
      setDocsLocal([...documentosPendientes]);
    }
  }, [documentosPendientes]);

  const closeModal = () => setOpen(false);

  const handleVerificarSUNAT = async () => {
    setIsUpdatingAll(true);
    setUpdateSummary(null);

    try {
      const response = await facturaService.actulizarEstado(docsLocal);

      if (response?.success && response.documentos) {
        let actualizadosCount = 0;
        let siguenPendientesCount = 0;

        // Mapear y actualizar el estado de los documentos locales
        const updatedDocs = docsLocal.map((doc) => {
          const updatedStatus = response.documentos.find(
            (apiDoc) =>
              doc.empresa_ruc === apiDoc.empresa_ruc &&
              doc.tipo_Doc === apiDoc.tipo_Doc &&
              doc.serie === apiDoc.serie &&
              doc.correlativo === apiDoc.correlativo,
          );

          if (updatedStatus) {
            const estadoAnterior = doc.estado?.toUpperCase();
            const estadoNuevo = updatedStatus.estado?.toUpperCase();

            // Verificar si cambió de estado
            if (estadoAnterior === "PENDIENTE" && estadoNuevo !== "PENDIENTE") {
              actualizadosCount++;
            } else if (estadoNuevo === "PENDIENTE") {
              siguenPendientesCount++;
            }

            return {
              ...doc,
              estado: updatedStatus.estado,
            };
          }
          return doc;
        });

        // Actualizar el estado local del modal
        setDocsLocal(updatedDocs);

        // Determinar el mensaje apropiado
        if (actualizadosCount > 0) {
          setUpdateSummary({
            changed: actualizadosCount,
            pending: siguenPendientesCount,
            total: docsLocal.length,
            type: "success",
          });
        } else if (siguenPendientesCount === docsLocal.length) {
          setUpdateSummary({
            changed: 0,
            pending: siguenPendientesCount,
            total: docsLocal.length,
            type: "no-change",
          });
        } else {
          setUpdateSummary({
            changed: actualizadosCount,
            pending: siguenPendientesCount,
            total: docsLocal.length,
            type: "partial",
          });
        }

        // ✅ ACTUALIZAR CONTEXTO Y TABLA
        await consultaPendientes();

        // ✅ REFRESCAR LA TABLA PRINCIPAL
        if (refetchTableData && typeof refetchTableData === "function") {
          await refetchTableData();
        }
      } else {
        setUpdateSummary({
          error: response?.mensaje || "La API no pudo verificar los estados.",
        });
      }
    } catch (error) {
      console.error("Error al llamar a facturaService.actulizarEstado:", error);
      setUpdateSummary({
        error: "Error de conexión o del servicio de verificación.",
      });
    } finally {
      setIsUpdatingAll(false);
      setTimeout(() => setUpdateSummary(null), 5000);
    }
  };

  const hasPendientes = docsLocal.length > 0;
  const total = totalPendientes ?? 0;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="rounded-full border-yellow-500 bg-yellow-100 text-yellow-800 transition-all hover:border-yellow-600 hover:bg-yellow-200 hover:shadow-lg"
        >
          <FileWarning className="mr-2 h-5 w-5" />
          <span className="font-semibold">
            Pendientes
            {total > 0 && (
              <span className="ml-2 rounded-full bg-yellow-500 px-2 py-0.5 text-xs font-bold text-white">
                {total}
              </span>
            )}
          </span>
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-[90vw] max-w-xl rounded-xl p-0 md:max-w-2xl">
        <button
          className="absolute top-4 right-4 z-10 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"
          onClick={closeModal}
        >
          <X className="h-5 w-5" />
        </button>

        <AlertDialogHeader className="p-6 pb-0 text-center">
          <AlertDialogTitle className="flex items-center justify-center gap-2 text-2xl font-bold text-gray-900">
            <RotateCw className="h-6 w-6 text-indigo-600" />
            Verificación de Documentos
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-500">
            Lista de documentos pendientes. Presiona el botón para verificar su
            estado en SUNAT.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col gap-3 p-6 pt-4">
          {updateSummary && (
            <div
              className={`mx-auto w-full rounded-xl p-4 text-center font-bold shadow-md ${
                updateSummary.error
                  ? "border border-red-300 bg-red-50 text-red-700"
                  : updateSummary.type === "success"
                    ? "border border-green-300 bg-green-50 text-green-700"
                    : updateSummary.type === "no-change"
                      ? "border border-blue-300 bg-blue-50 text-blue-700"
                      : "border border-yellow-300 bg-yellow-50 text-yellow-700"
              }`}
            >
              {updateSummary.error ? (
                <>
                  <XCircle className="mr-2 inline h-5 w-5 align-text-bottom" />
                  <span className="text-sm md:text-base">
                    {updateSummary.error}
                  </span>
                </>
              ) : updateSummary.type === "success" ? (
                <>
                  <CheckCircle className="mr-2 inline h-5 w-5 align-text-bottom" />
                  <span className="text-sm md:text-base">
                    ¡Éxito! {updateSummary.changed} de {updateSummary.total}{" "}
                    documentos se actualizaron.
                    {updateSummary.pending > 0 &&
                      ` (${updateSummary.pending} siguen pendientes)`}
                  </span>
                </>
              ) : updateSummary.type === "no-change" ? (
                <>
                  <FileWarning className="mr-2 inline h-5 w-5 align-text-bottom" />
                  <span className="text-sm md:text-base">
                    Todos los documentos ({updateSummary.total}) siguen en
                    estado PENDIENTE en SUNAT.
                  </span>
                </>
              ) : (
                <>
                  <FileWarning className="mr-2 inline h-5 w-5 align-text-bottom" />
                  <span className="text-sm md:text-base">
                    {updateSummary.changed > 0
                      ? `${updateSummary.changed} documentos actualizados. `
                      : ""}
                    {updateSummary.pending > 0
                      ? `${updateSummary.pending} siguen pendientes.`
                      : ""}
                  </span>
                </>
              )}
            </div>
          )}

          <div className="max-h-[50vh] overflow-y-auto pr-2">
            {hasPendientes ? (
              docsLocal.map((doc, index) => {
                const estadoInfo = getEstadoStyles(doc.estado);
                const EstadoIcon = estadoInfo.icon;
                return (
                  <div
                    key={index}
                    className="mb-2 flex cursor-pointer flex-col gap-2 rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-800 shadow-sm transition-all hover:border-indigo-400 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex flex-1 flex-col md:flex-row md:items-center md:gap-4">
                      <span className="flex-shrink-0 text-[14px] font-bold text-gray-900">
                        {getTipoResumido(doc.tipo_Doc)} • {doc.serie}-
                        {doc.correlativo}
                      </span>
                      <span className="max-w-full flex-1 truncate text-[12px] text-gray-600 md:max-w-xs">
                        ({doc.filial})
                      </span>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-4">
                      <span
                        className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${estadoInfo.className}`}
                      >
                        <EstadoIcon className="h-3 w-3" />
                        {doc.estado || "NO DEFINIDO"}
                      </span>
                      <span className="text-[12px] font-medium text-gray-500">
                        {new Date(doc.fecha_emision).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex h-32 items-center justify-center">
                <p className="text-center text-gray-500">
                  🎉 ¡Todo al día! No tienes documentos pendientes.
                </p>
              </div>
            )}
          </div>
        </div>

        {hasPendientes && (
          <div className="border-t border-gray-100 p-6 pt-4">
            <Button
              onClick={handleVerificarSUNAT}
              disabled={isUpdatingAll}
              className="w-full rounded-lg bg-indigo-600 py-3 text-lg font-bold text-white shadow-xl transition hover:bg-indigo-700 disabled:opacity-50"
            >
              {isUpdatingAll ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Verificando con SUNAT, por favor espere...
                </>
              ) : (
                "Verificar Estado en SUNAT"
              )}
            </Button>
          </div>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}