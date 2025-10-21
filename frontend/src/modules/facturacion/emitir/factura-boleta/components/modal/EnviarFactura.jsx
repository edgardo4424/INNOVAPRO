import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useFacturaBoleta } from "@/modules/facturacion/context/FacturaBoletaContext";
import {
  AlertCircle,
  CheckCircle,
  ClipboardPlus,
  LoaderCircle,
  TriangleAlert,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

const EnviarFactura = ({ open, setOpen, ClosePreviu }) => {
  const { emitirFactura, validarFactura } = useFacturaBoleta();

  // * Estados unificados para el modal
  const [status, setStatus] = useState("idle"); // 'idle' | 'loading' | 'success' | 'error'
  const [displayMessage, setDisplayMessage] = useState("");
  const [detailedMessage, setDetailedMessage] = useState("");
  const [validado, setValidado] = useState(false);

  // * Resetear estados cuando el modal se abre/cierra
  useEffect(() => {
    if (!open) {
      setStatus("idle");
      setDisplayMessage("");
      setDetailedMessage("");
      setValidado(false);
    }
  }, [open]);

  // * Validar al abrir el modal
  useEffect(() => {
    const validateAndOpen = async () => {
      if (open) {
        const isValid = await validarFactura();
        if (isValid) {
          setValidado(true);
        } else {
          setValidado(false);
          // Esto cerrará el modal si la validación falla
          setOpen(false);
        }
      }
    };
    validateAndOpen();
  }, [open, setOpen]);

  const handleEmitirFacturaClick = async () => {
    setStatus("loading");
    setDisplayMessage("Emitiendo documento...");
    setDetailedMessage(""); // Limpiar mensajes de error anteriores

    try {
      const { success, message, status, data } = await emitirFactura();

      if ((success && status === 200) || status === 201) {
        // Caso de éxito
        setStatus("success");
        setDisplayMessage(message || "Factura emitida con éxito.");
      } else if (status === 200 || status === 400) {
        // Caso de error "detallado" (por ejemplo, desde la API)
        setStatus("details");
        setDisplayMessage(message);
        setDetailedMessage(data.details || ""); // Si hay más detalles, los guardamos aquí
      } else {
        // Cualquier otro caso que no sea un éxito directo
        setStatus("error");
        setDisplayMessage(message || "Error al emitir la Factura.");
        setDetailedMessage(detailedMessage || "");
      }
    } catch (err) {
      // Manejo de errores de red o del sistema
      setStatus("error");
      setDisplayMessage(
        err.message || "Error inesperado al emitir la factura.",
      );
      setDetailedMessage(
        "Ocurrió un error al comunicarse con el servidor. Por favor, inténtelo de nuevo.",
      );
    }
  };

  const closeModal = () => {
    setOpen(false);
    setStatus("idle");
    setDisplayMessage("");
    setDetailedMessage("");
    ClosePreviu();
  };

  // Helper para determinar el contenido a mostrar
  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <>
            <LoaderCircle
              className="mb-4 animate-spin text-blue-500"
              size={120}
            />
            <h2 className="text-lg font-semibold text-gray-700">
              {displayMessage}
            </h2>
          </>
        );
      case "success":
        return (
          <>
            <CheckCircle className="mb-4 text-green-500" size={120} />
            <h2 className="text-center text-lg font-semibold text-green-700">
              {displayMessage}
            </h2>
            <Button
              onClick={closeModal}
              className="mt-4 bg-green-500 hover:bg-green-600"
            >
              Cerrar
            </Button>
          </>
        );
      case "error":
        return (
          <>
            <AlertCircle className="mb-4 text-red-500" size={120} />
            <h2 className="text-center text-lg font-semibold text-red-700">
              {displayMessage}
            </h2>
            {detailedMessage && (
              <p className="text-sm text-red-600">{detailedMessage}</p>
            )}
            <Button
              onClick={closeModal}
              className="mt-4 bg-red-500 hover:bg-red-600"
            >
              Cerrar
            </Button>
          </>
        );
      case "details":
        return (
          <>
            <TriangleAlert className="mb-4 text-orange-500" size={120} />
            <h2 className="text-center text-lg font-semibold text-orange-700">
              {displayMessage}
            </h2>
            {detailedMessage && (
              <p className="text-sm text-orange-600">{detailedMessage}</p>
            )}
            <Button
              onClick={closeModal}
              className="mt-4 bg-orange-500 hover:bg-orange-600"
            >
              Cerrar
            </Button>
          </>
        );
      case "idle":
      default:
        return (
          <>
            <h2 className="mb-4 text-center text-lg font-semibold text-gray-700">
              ¿Estás seguro de emitir esta factura?
            </h2>
            <Button
              onClick={handleEmitirFacturaClick}
              className="cursor-pointer bg-blue-500 text-white hover:bg-blue-600"
            >
              Sí, emitir
            </Button>
          </>
        );
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {validado && (
        <AlertDialogContent className="flex flex-col gap-4">
          <button
            className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-red-600"
            onClick={closeModal}
          >
            <X />
          </button>
          <div className="flex w-full flex-col items-center rounded-md bg-gray-100 p-10 shadow-md">
            {renderContent()}
          </div>
        </AlertDialogContent>
      )}
      <AlertDialogTrigger asChild>
        <Button>
          <ClipboardPlus />
          <span className="hidden md:block">Emitir Factura</span>
        </Button>
      </AlertDialogTrigger>
    </AlertDialog>
  );
};

export default EnviarFactura;
