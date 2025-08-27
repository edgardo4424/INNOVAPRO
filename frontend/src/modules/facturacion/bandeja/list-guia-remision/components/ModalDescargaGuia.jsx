import { FileCode, FileText, Folders, X } from 'lucide-react';
import { useState } from 'react';

const ModalDescargaGuia = ({ id_documento, setIdDocumento, setModalOpen, guiaADescargar, setGuiaADescargar }) => {
    const [isOpen, setIsOpen] = useState(true);

    const closeModal = () => {
        setIsOpen(false);
        setIdDocumento("");
        setModalOpen(false);
        setGuiaADescargar({});
    };

    const handleDownload = (format) => {
        // Lógica de descarga según el formato seleccionado
        console.log(`Descargando documento ${id_documento} en formato: ${format}`);
        // Aquí podrías llamar a tu API para iniciar la descarga.
        // Ejemplo: window.open(`/api/download/${id_documento}?format=${format}`, '_blank');
        closeModal();
    };

    return (
        <div>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
                    <div className="bg-white p-8 rounded-xl shadow-2xl relative w-full max-w-sm">

                        {/* Botón para cerrar el modal */}
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="text-center mb-6">
                            {
                                guiaADescargar.serie && guiaADescargar.correlativo ?
                                    <h2 className="text-xl font-bold text-gray-800">
                                        Guia de Remision {guiaADescargar.serie}-{guiaADescargar.correlativo}
                                    </h2>
                                    :
                                    <h2 className="text-xl font-bold text-gray-800">
                                        Guia de Remision
                                    </h2>
                            }
                            <h2 className="text-xl font-bold text-gray-800">
                                ¿Qué deseas descargar?
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Selecciona el formato de descarga para el documento.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {/* Opción de XML */}
                            <button
                                onClick={() => handleDownload("xml")}
                                className="cursor-pointer flex items-center justify-center gap-2 p-4 bg-gray-100 rounded-lg text-gray-700 font-semibold hover:bg-gray-300/90 transition-colors"
                            >
                                <FileCode size={20} />
                                Descargar XML
                            </button>

                            {/* Opción de PDF */}
                            <button
                                onClick={() => handleDownload("pdf")}
                                className="cursor-pointer flex items-center justify-center gap-2 p-4 bg-gray-100 rounded-lg text-gray-700 font-semibold hover:bg-gray-300/90 transition-colors"
                            >
                                <FileText size={20} />
                                Descargar PDF
                            </button>

                            {/* Opción para descargar ambos */}
                            <button
                                onClick={() => handleDownload("all")}
                                className="cursor-pointer flex items-center justify-center gap-2 p-4 bg-innova-blue text-white rounded-lg font-semibold hover:bg-innova-blue-hover transition-colors"
                            >
                                <Folders size={20} />
                                Descargar Ambos
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModalDescargaGuia;