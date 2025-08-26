import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useFacturaBoleta } from "@/modules/facturacion/context/FacturaBoletaContext";
import { AlertCircle, CheckCircle, ClipboardPlus, LoaderCircle, TriangleAlert, X } from "lucide-react";
import { useEffect, useState } from "react";

const EnviarFactura = ({ open, setOpen, ClosePreviu }) => {
    const { emitirFactura, validarFactura } = useFacturaBoleta();

    // * Estados unificados para el modal
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState("idle"); // 'idle' | 'loading' | 'success' | 'error' | 'details'
    const [displayMessage, setDisplayMessage] = useState("");
    const [detailedMessage, setDetailedMessage] = useState("");
    const [validado, setValidado] = useState(false);

    // * Resetear estados cuando el modal se abre/cierra
    useEffect(() => {
        if (open) {
            setStatus("idle");
            setDisplayMessage("");
            setDetailedMessage("");
            setIsLoading(false);
        }
    }, [open]);

    const handleEmitirFacturaClick = async () => {
        setIsLoading(true);
        setStatus("loading");
        setDisplayMessage("Emitiendo documento...");

        try {
            const result = await emitirFactura();
            console.log("el resultado de la emision es: ", result);

            // Lógica unificada para manejar la respuesta
            if (result.success && (result.status === 200 || result.status === 201)) {
                // Caso de éxito
                setStatus("success");
                setDisplayMessage(result.message || "Factura emitida con éxito.");
            } else if (result.data?.error) {
                // Caso de error "detallado" (por ejemplo, desde la API)
                setStatus("details");
                setDisplayMessage(result.message);
                setDetailedMessage(result.data.details || "");
            } else {
                // Cualquier otro caso que no sea un éxito directo
                setStatus("error");
                setDisplayMessage(result.message || "Error al emitir la factura.");
                setDetailedMessage(result.detailedMessage || "");
            }
        } catch (err) {
            // Manejo de errores de red o del sistema
            setStatus("error");
            setDisplayMessage(err.message || "Error inesperado al emitir la factura.");
            setDetailedMessage("Por favor, inténtelo de nuevo más tarde.");
        } finally {
            setIsLoading(false); // Detener el loading siempre
        }
    };

    const closeModal = () => {
        setOpen(false);
        // Resetea todos los estados
        setStatus("idle");
        setDisplayMessage("");
        setDetailedMessage("");
        setIsLoading(false);
        ClosePreviu();
    };

    // Helper para determinar el contenido a mostrar
    const renderContent = () => {
        switch (status) {
            case "loading":
                return (
                    <>
                        <LoaderCircle className="animate-spin text-blue-500 mb-4" size={120} />
                        <h2 className="text-lg font-semibold text-gray-700">{displayMessage}</h2>
                    </>
                );
            case "success":
                return (
                    <>
                        <CheckCircle className="text-green-500 mb-4" size={120} />
                        <h2 className="text-lg font-semibold text-green-700 text-center">{displayMessage}</h2>
                        <Button onClick={closeModal} className="mt-4 bg-green-500 hover:bg-green-600">Cerrar</Button>
                    </>
                );
            case "error":
                return (
                    <>
                        <AlertCircle className="text-red-500 mb-4" size={120} />
                        <h2 className="text-lg font-semibold text-red-700 text-center">{displayMessage}</h2>
                        {detailedMessage && <p className="text-sm text-red-600">{detailedMessage}</p>}
                        <Button onClick={closeModal} className="mt-4 bg-red-500 hover:bg-red-600">Cerrar</Button>
                    </>
                );
            case "details":
                return (
                    <>
                        <TriangleAlert className="text-orange-500 mb-4" size={120} />
                        <h2 className="text-lg font-semibold text-orange-700 text-center">{displayMessage}</h2>
                        {detailedMessage && <p className="text-sm text-orange-600">{detailedMessage}</p>}
                        <Button onClick={closeModal} className="mt-4 bg-orange-500 hover:bg-orange-600">Cerrar</Button>
                    </>
                );
            case "idle":
            default:
                return (
                    <>
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">
                            ¿Estás seguro de emitir esta factura?
                        </h2>
                        <Button
                            onClick={handleEmitirFacturaClick}
                            className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                        >
                            Sí, emitir
                        </Button>
                    </>
                );
        }
    };

    useEffect(() => {
        setValidado(false);
        const validar = async () => {
            let result = await validarFactura();
            if (!result) {
                closeModal();
                setValidado(false);
            } else {
                setValidado(true);
            }
        }
        if (open) {
            validar();
        }
    }, [open]);

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button>
                    <ClipboardPlus />
                    <span className="hidden md:block">
                        Emitir Factura
                    </span>
                </Button>
            </AlertDialogTrigger>
            {
                validado &&
                <AlertDialogContent className="flex flex-col gap-4">
                    <button
                        className="absolute top-4 right-4 text-gray-500 hover:text-red-600 cursor-pointer"
                        onClick={closeModal}
                    >
                        <X />
                    </button>
                    <div className="w-full flex flex-col items-center p-10 bg-gray-100 rounded-md shadow-md">
                        {renderContent()}
                    </div>
                </AlertDialogContent>
            }
        </AlertDialog>
    );
};

export default EnviarFactura;