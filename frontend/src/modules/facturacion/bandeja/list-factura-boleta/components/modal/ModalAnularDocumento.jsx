import factilizaService from '@/modules/facturacion/service/FactilizaService';
import facturaService from '@/modules/facturacion/service/FacturaService';
import { LoaderCircle, ShieldAlert, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const ModalAnularDocumento = ({
    id_documento,
    setModalOpen,
    documentoAAnular,
    setDocumentoAAnular,
    // La prop para recargar la tabla (asume que existe)
    refetchTableData,
}) => {
    const { tipo_Doc, serie, correlativo } = documentoAAnular;
    const [loading, setLoading] = useState(false);
    const [motivoAnulacion, setMotivoAnulacion] = useState('');

    const closeModal = () => {
        setModalOpen(false);
        setDocumentoAAnular({});
        setMotivoAnulacion(''); // Limpiar el motivo al cerrar
    };

    const handleAnularDocumento = async () => {
        if (!motivoAnulacion.trim()) {
            toast.error("Por favor, ingresa un motivo para la anulación.");
            return;
        }

        setLoading(true);
        try {
            let url = "";
            if (documentoAAnular.tipo_Doc == "01") {
                url = "voided";
            } else if (documentoAAnular.tipo_Doc == "03" || documentoAAnular.tipo_Doc == "07" || documentoAAnular.tipo_Doc == "08") {
                url = "summary";
            } else if (documentoAAnular.tipo_Doc == "09") {
                url = "invoice";
            }
            // 1. Primer paso: Anular en Factiliza (SUNAT)
            const factilizaResponse = await factilizaService.anularDocumento(url, {
                ...documentoAAnular,
                anulacion_Motivo: motivoAnulacion
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
                cdr_response_id: factilizaResponse.data?.sunatResponse?.cdrResponse?.id || null,
                cdr_response_code: factilizaResponse.data?.sunatResponse?.cdrResponse?.code || null,
                cdr_response_description: factilizaResponse.data?.sunatResponse?.cdrResponse?.description || null
            };

            // 3. Segundo paso: Actualizar estado en nuestra BD
            const dbResponse = await facturaService.anularFactura({
                ...documentoAAnular,
                anulacion_Motivo: motivoAnulacion,
                sunat_respuesta
            });

            console.log("Respuesta de BD:", dbResponse);

            // Verificar la respuesta de la BD
            if (dbResponse.status !== 200 || !dbResponse.success) {
                toast.error(dbResponse.message || "Error al actualizar el estado en la base de datos");
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
                const errorMessage = error.response.data?.message ||
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
            return "Factura"
        } else if (tipo == "03") {
            return "Boleta"
        } else if (tipo == "07") {
            return "Nota de Credito"
        } else if (tipo == "08") {
            return "Nota de Debito"
        } else if (tipo == "09") {
            return "Guia de Remision"
        } else {
            return "Desconocido"
        }
    }

    useEffect(() => {
        console.log("Documento a anular:", documentoAAnular);
    }, [documentoAAnular]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white p-6 rounded-2xl shadow-2xl relative w-full max-w-md transform transition-all scale-100">
                <button
                    onClick={closeModal}
                    disabled={loading}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={24} />
                </button>

                {/* Encabezado del modal */}
                <div className="flex flex-col items-center text-center mb-6">
                    <div className="bg-red-100 p-3 rounded-full mb-4">
                        <ShieldAlert className="text-red-600 h-8 w-8" />
                    </div>
                    {serie && correlativo ? (
                        <>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Anular {tipoDocumento(tipo_Doc)}
                            </h2>
                            <h2 className="text-xl font-semibold text-red-600">
                                {serie}-{correlativo}
                            </h2>
                        </>
                    ) : (
                        <h2 className="text-2xl font-bold text-gray-900">Anular Documento</h2>
                    )}
                    <p className="text-gray-600 mt-2">
                        Esta acción no se puede revertir. Por favor, especifica un motivo.
                    </p>
                </div>

                {/* Campo para el motivo de anulación */}
                <div className="mb-6">
                    <label htmlFor="motivo" className="block text-sm font-medium text-gray-700 mb-2">
                        Motivo de anulación <span className="text-red-500">*</span>:
                    </label>
                    <textarea
                        id="motivo"
                        rows="4"
                        name='anulacion_Motivo'
                        value={motivoAnulacion}
                        onChange={(e) => setMotivoAnulacion(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-red-500 focus:border-red-500 text-sm"
                        placeholder="Ej. 'Error en los datos del cliente' o 'Documento duplicado'."
                        disabled={loading}
                        maxLength={500}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                        {motivoAnulacion.length}/500 caracteres
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-4">
                    <button
                        onClick={closeModal}
                        disabled={loading}
                        className="flex-1 cursor-pointer px-4 py-3 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleAnularDocumento}
                        disabled={loading || !motivoAnulacion.trim()}
                        className={`flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white rounded-lg transition-colors
                            ${loading || !motivoAnulacion.trim()
                                ? 'bg-red-400 cursor-not-allowed'
                                : 'bg-red-600 hover:bg-red-700'}
                        `}
                    >
                        {loading ? (
                            <>
                                <LoaderCircle className="h-5 w-5 animate-spin" />
                                Procesando...
                            </>
                        ) : (
                            'Anular Documento'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalAnularDocumento;