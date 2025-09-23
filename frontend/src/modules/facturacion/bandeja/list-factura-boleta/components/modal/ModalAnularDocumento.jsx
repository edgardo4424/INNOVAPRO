import factilizaService from "@/modules/facturacion/service/FactilizaService";
import facturaService from "@/modules/facturacion/service/FacturaService";
import { LoaderCircle, ShieldAlert, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ModalAnularDocumento = ({
  id_documento,
  setModalOpen,
  documentoAAnular,
  setDocumentoAAnular,
  // La prop para recargar la tabla (asume que existe)
  refetchTableData,
}) => {
  const { tipo_Doc, serie, correlativo } = documentoAAnular;
  const [mensajeSeguro, setMensajeSeguro] = useState(false);
  const [confirmarAnulacion, setConfirmarAnulacion] = useState(false);
  const [loading, setLoading] = useState(false);
  const [motivoAnulacion, setMotivoAnulacion] = useState("");

  const closeModal = () => {
    setModalOpen(false);
    setDocumentoAAnular({});
    setMotivoAnulacion(""); // Limpiar el motivo al cerrar
  };

  const handleAnularDocumento = async () => {
    if (!motivoAnulacion.trim()) {
      toast.error("Por favor, ingresa un motivo para la anulación.");
      return;
    }

    setMensajeSeguro(true);
    setConfirmarAnulacion(true);

    if (!confirmarAnulacion) return;
    setLoading(true);
    try {
      let url = "";
      if (documentoAAnular.tipo_Doc == "01") {
        url = "voided";
      } else if (
        documentoAAnular.tipo_Doc == "03" ||
        documentoAAnular.tipo_Doc == "07" ||
        documentoAAnular.tipo_Doc == "08"
      ) {
        url = "summary";
      } else if (documentoAAnular.tipo_Doc == "09") {
        url = "invoice";
      }
      // 1. Primer paso: Anular en Factiliza (SUNAT)
      const factilizaResponse = await factilizaService.anularDocumento(url, {
        ...documentoAAnular,
        anulacion_Motivo: motivoAnulacion,
      });

      console.log("Respuesta de Factiliza:", factilizaResponse);

      // Verificar la respuesta de Factiliza
      if (factilizaResponse.status !== 200 || !factilizaResponse.success) {
        toast.error(factilizaResponse.message || "Error al anular en SUNAT");
        return;
      }

      // 2. Preparar la respuesta de SUNAT para guardar en BD
      const sunat_respuesta = {
        hash: factilizaResponse.data?.hash || null,
        cdr_zip: factilizaResponse.data?.sunatResponse?.cdrZip || null,
        sunat_success: factilizaResponse.data?.sunatResponse?.success || false,
        cdr_response_id:
          factilizaResponse.data?.sunatResponse?.cdrResponse?.id || null,
        cdr_response_code:
          factilizaResponse.data?.sunatResponse?.cdrResponse?.code || null,
        cdr_response_description:
          factilizaResponse.data?.sunatResponse?.cdrResponse?.description ||
          null,
      };

      // 3. Segundo paso: Actualizar estado en nuestra BD
      const dbResponse = await facturaService.anularFactura({
        ...documentoAAnular,
        anulacion_Motivo: motivoAnulacion,
        sunat_respuesta,
      });

      // Verificar la respuesta de la BD
      if (dbResponse.status !== 200 || !dbResponse.success) {
        toast.error(
          dbResponse.message ||
            "Error al actualizar el estado en la base de datos",
        );
        return;
      }

      // 4. Si todo salió bien
      toast.success("Documento anulado correctamente.");

      // Recargar datos de la tabla si es necesario
      if (refetchTableData) {
        await refetchTableData();
      }

      closeModal();
    } catch (error) {
      console.error("Error al anular el documento:", error);

      // Mostrar un mensaje más específico basado en el error
      if (error.response) {
        // Error de respuesta del servidor
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.respuesta?.message ||
          "Error del servidor";
        toast.error(`Error: ${errorMessage}`);
      } else if (error.request) {
        // Error de red
        toast.error("Error de conexión. Verifica tu conexión a internet.");
      } else {
        // Otro tipo de error
        toast.error("Error inesperado al anular el documento.");
      }
    } finally {
      setLoading(false);
    }
  };

  const tipoDocumento = (tipo) => {
    if (tipo == "01") {
      return "Factura";
    } else if (tipo == "03") {
      return "Boleta";
    } else if (tipo == "07") {
      return "Nota de Credito";
    } else if (tipo == "08") {
      return "Nota de Debito";
    } else if (tipo == "09") {
      return "Guia de Remision";
    } else {
      return "Desconocido";
    }
  };

  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md scale-100 transform rounded-2xl bg-white p-6 shadow-2xl transition-all">
        <button
          onClick={closeModal}
          disabled={loading}
          className="absolute top-4 right-4 text-gray-400 transition-colors hover:text-gray-600"
        >
          <X size={24} />
        </button>

        {/* Encabezado del modal */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-red-100 p-3">
            <ShieldAlert className="h-8 w-8 text-red-600" />
          </div>
          {serie && correlativo ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900">
                Revertir {tipoDocumento(tipo_Doc)}
              </h2>
              <h2 className="text-xl font-semibold text-red-600">
                {serie}-{correlativo}
              </h2>
            </>
          ) : (
            <h2 className="text-2xl font-bold text-gray-900">
              Revertir Documento
            </h2>
          )}
          <p className="mt-2 text-gray-600">
            Esta acción no se puede revertir. Por favor, especifica un motivo.
          </p>
        </div>

        {/* Campo para el motivo de anulación */}
        <div className="mb-6">
          <label
            htmlFor="motivo"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Motivo de reversión <span className="text-red-500">*</span>:
          </label>
          <textarea
            id="motivo"
            rows="4"
            name="anulacion_Motivo"
            value={motivoAnulacion}
            onChange={(e) => setMotivoAnulacion(e.target.value.toUpperCase())}
            className="w-full resize-none rounded-lg border border-gray-300 p-3 text-sm focus:border-red-500 focus:ring-red-500"
            placeholder="Ej. 'Error en los datos del cliente' o 'Documento duplicado'."
            disabled={loading}
            maxLength={500}
          />
          <div className="mt-1 text-xs text-gray-500">
            {motivoAnulacion.length}/500 caracteres
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-4">
          <button
            onClick={closeModal}
            disabled={loading}
            className="flex-1 cursor-pointer rounded-lg bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleAnularDocumento}
            disabled={loading || !motivoAnulacion.trim()}
            className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white transition-colors ${
              loading || !motivoAnulacion.trim()
                ? "cursor-not-allowed bg-red-400"
                : "bg-red-600 hover:bg-red-700"
            } `}
          >
            {loading ? (
              <>
                <LoaderCircle className="h-5 w-5 animate-spin" />
                Procesando...
              </>
            ) : mensajeSeguro ? (
              "Seguro de Revertir?"
            ) : (
              "Revertir"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAnularDocumento;
