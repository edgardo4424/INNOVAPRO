import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useFacturaBoleta } from "@/context/Factura/FacturaBoletaContext";
import { AlertCircle, CheckCircle, ClipboardPlus, LoaderCircle, X } from "lucide-react";
import { useEffect, useState } from "react";

/*
 * Componente EnviarFactura
 * 
 * Este componente representa un modal para gestionar el proceso de envío de una factura.
 * 
 * Props:
 * - open: Un booleano que indica si el modal está abierto o cerrado.
 * - setOpen: Una función para actualizar el estado de apertura del modal.
 * - ClosePreviu: Una función para cerrar la previsualización de la factura.
 * 
 * Contexto:
 * Utiliza useFacturaBoleta del contexto FacturaBoletaContext para acceder a las funciones y estados relacionados con la factura.
 * - facturaValidaParaGuardar: Verifica si la factura cumple con los requisitos necesarios para ser guardada.
 * - emitirFactura: Función que maneja la lógica para emitir la factura.
 * - factura: Datos de la factura que se está procesando.
 * 
 * Estados:
 * - isLoading: Indica si el proceso de emisión de la factura está en curso.
 * - isSuccess: Indica si la factura fue emitida exitosamente.
 * - isError: Indica si hubo un error durante la emisión de la factura.
 * - displayMessage: Mensaje que se muestra al usuario, dependiendo del resultado de la emisión.
 * 
 * Funcionalidades:
 * Este componente maneja la interacción del usuario al intentar emitir una factura. Muestra mensajes de éxito o error según sea el caso,
 * y utiliza iconos visuales para mejorar la experiencia del usuario.
 */


const EnviarFactura = ({ open, setOpen, ClosePreviu }) => {
    const { facturaValidaParaGuardar, emitirFactura, factura } = useFacturaBoleta();

    //* Estados para controlar el modal de emisión
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [displayMessage, setDisplayMessage] = useState("");

    //* Resetear estados cuando el modal se abre/cierra
    useEffect(() => {
        if (open) {
            setIsLoading(false); //* No empezar cargando automáticamente
            setIsSuccess(false);
            setIsError(false);
            setDisplayMessage(""); //* Limpiar mensaje al abrir
        }
    }, [open]);

    // ?Esta función se llama al hacer clic en el botón "Emitir Factura"
    const handleEmitirFacturaClick = async () => {
        setIsLoading(true); //* Inicia el loading en el modal
        setIsError(false);
        setIsSuccess(false);
        setDisplayMessage("Emitiendo documento...");

        try {
            const result = await emitirFactura();

            if (result.success) {
                setIsSuccess(true);
                setDisplayMessage(result.message || "Factura emitida con éxito.");
            } else {
                setIsError(true);
                setDisplayMessage(result.message || "Error al emitir la factura.");
            }
        } catch (err) {
            console.error("Error inesperado en handleEmitirFacturaClick del componente:", err);
            setIsError(true);
            setDisplayMessage("Ocurrió un error inesperado.");
        } finally {
            setIsLoading(false); // ? Detener el loading 
        }
    };

    const closeModal = () => {
        setOpen(false);
        // todo: Reiniciar estados para la próxima vez que se abra el modal
        setIsLoading(false);
        setIsSuccess(false);
        setIsError(false);
        setDisplayMessage("");
        ClosePreviu();
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    className={` ${facturaValidaParaGuardar ? 'cursor-pointer bg-green-600' : 'cursor-not-allowed bg-red-600/80'} text-white py-2 px-4 rounded-md flex gap-x-2`}
                    disabled={!facturaValidaParaGuardar}
                >
                    <ClipboardPlus />
                    <span className="hidden md:block">
                        Emitir Factura
                    </span>
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="flex flex-col gap-4">
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-600 cursor-pointer"
                    onClick={closeModal}
                >
                    <X />
                </button>

                {/* Contenido dinámico del modal */}
                <div className="w-full flex flex-col items-center p-10 bg-gray-100 rounded-md shadow-md">
                    {!isLoading && !isSuccess && !isError && (
                        <>
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">
                                ¿Estás seguro de emitir esta factura?
                            </h2>
                            <Button
                                onClick={handleEmitirFacturaClick}
                                className="bg-blue-500 hover:bg-blue-600 text-white"
                            >
                                Sí, emitir
                            </Button>
                        </>
                    )}

                    {/* Estado de Carga */}
                    {isLoading && (
                        <>
                            <LoaderCircle className="animate-spin text-blue-500 mb-4" size={120} />
                            <h2 className="text-lg font-semibold text-gray-700">{displayMessage}</h2>
                        </>
                    )}

                    {/* Estado de Éxito */}
                    {isSuccess && (
                        <>
                            <CheckCircle className="text-green-500 mb-4" size={120} />
                            <h2 className="text-lg font-semibold text-green-700 text-center">{displayMessage}</h2>
                            <Button onClick={closeModal} className="mt-4 bg-green-500 hover:bg-green-600">Cerrar</Button>
                        </>
                    )}

                    {/* Estado de Error */}
                    {isError && (
                        <>
                            <AlertCircle className="text-red-500 mb-4" size={120} />
                            <h2 className="text-lg font-semibold text-red-700 text-center">{displayMessage}</h2>
                            <Button onClick={closeModal} className="mt-4 bg-red-500 hover:bg-red-600">Cerrar</Button>
                        </>
                    )}
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default EnviarFactura;