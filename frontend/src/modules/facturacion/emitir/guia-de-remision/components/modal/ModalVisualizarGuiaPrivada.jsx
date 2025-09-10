import { useGuiaTransporte } from "@/modules/facturacion/context/GuiaTransporteContext"; // Importamos el contexto correcto
import { Eye, X } from "lucide-react"; // Solo necesitamos Eye y X para previsualizar
import { useEffect, useState } from "react";
import ModalEnviarGuia from "./ModalEnviarGuia";

export default function ModalVisualizarGuiaPrivada() {
    // ?? Obtenemos el objeto 'guiaTransporte' de nuestro contexto
    const { guiaTransporte, guiaDatosPrivado, guiaDatosPublico, guiaDatosInternos, tipoGuia } = useGuiaTransporte();

    // ?? Estado para controlar la visibilidad del modal
    const [open, setOpen] = useState(false);

    const [isOpen, setIsOpen] = useState(false);

    // ?? Funciones para abrir y cerrar el modal
    const closeModal = () => {
        setIsOpen(false);
    };

    const openModal = () => {
        setIsOpen(true);
    };

    // ?? --- Funciones de ayuda para obtener descripciones y formatos ---

    // ?? Helper para obtener la descripción del tipo de documento de la guía
    const getTipoDocGuiaDescription = (typeCode) => {
        switch (typeCode) {
            case "09": return "GUÍA DE REMISIÓN ELECTRÓNICA";
            // ?? Puedes añadir más tipos de documentos de guía si los manejas
            default: return "DOCUMENTO DE GUÍA NO ESPECIFICADO";
        }
    };

    // ?? Helper para obtener la descripción del tipo de documento del cliente/destinatario
    const getClientDocTypeDescription = (typeCode) => {
        switch (typeCode) {
            case "6": return "RUC";
            case "1": return "DNI";
            case "4": return "CARNET DE EXTRANJERÍA";
            default: return "OTRO";
        }
    };

    // ?? Helper para obtener la descripción de la modalidad de traslado
    const getModalidadTrasladoDescription = (code) => {
        switch (code) {
            case "01": return "TRANSPORTE PÚBLICO";
            case "02": return "TRANSPORTE PRIVADO";
            default: return "NO ESPECIFICADO";
        }
    };

    // ?? Helper para obtener la descripción del motivo de traslado
    const getMotivoTrasladoDescription = (code) => {
        switch (code) {
            case "01": return "VENTA";
            case "02": return "COMPRA";
            case "04": return "TRASLADO ENTRE ESTABLECIMIENTOS DE LA MISMA EMPRESA";
            case "08": return "IMPORTACIÓN";
            case "09": return "EXPORTACIÓN";
            case "18": return "TRASLADO EMISOR ITINERANTE DE COMPROBANTES DE PAGO";
            case "19": return "TRASLADO A ZONA PRIMARIA";
            case "13": return "OTROS";
            default: return "NO ESPECIFICADO";
        }
    };

    // ?? Helper para formatear fechas (asumiendo formato ISO 8601 como "YYYY-MM-DDTHH:mm:ss-ZZ:ZZ")
    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
        } catch (e) {
            console.error("Error formatting date:", e);
            return dateString.split('T')[0]; // ?? Fallback a YYYY-MM-DD si hay error
        }
    };

    return (
        <>
            {/* Botón para abrir el modal de previsualización */}
            <button
                type="button"
                onClick={openModal}
                className="py-3 px-6 rounded-lg bg-green-600 text-white font-semibold text-lg hover:bg-green-700 transition duration-300 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 flex gap-x-2 items-center justify-center"
            >
                <Eye size={24} />
                <span className="hidden md:block">Previsualizar </span>
            </button>

            {/* Overlay y Contenido del Modal */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50  flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fade-in"
                >
                    <div
                        className="relative p-1 w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-[95vh] overflow-y-auto animate-scale-in"
                    >
                        {/* Botón para cerrar el modal */}
                        <button
                            className="absolute cursor-pointer top-2 right-2 p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 focus:outline-none"
                            onClick={closeModal}
                            aria-label="Cerrar"
                        >
                            <X size={24} />
                        </button>

                        <div className="px-4 md:px-8 md:pt-8">

                            {/* --- Detalle de la Guía --- */}
                            <div className="space-y-6">
                                {/* Encabezado de la Empresa y Documento */}
                                <div className="rounded-xl border border-gray-200 bg-white">
                                    <div className="px-6 py-6  grid grid-cols-1 md:grid-cols-4 gap-6 items-start ">
                                        <div className="col-span-2">
                                            <h1 className="text-2xl md:text-3xl font-bold text-blue-700">
                                                TU EMPRESA S.A.C.
                                            </h1>
                                            <p className="text-sm">RUC: {guiaTransporte.empresa_Ruc || 'N/A'}</p>
                                            <p className="text-sm">DIRECCIÓN: [Tu dirección de empresa aquí]</p> {/* Placeholder */}
                                        </div>
                                        <div className="md:text-center flex justify-end col-span-2 ">
                                            <div >
                                                <p className="text-lg font-bold ">{getTipoDocGuiaDescription(guiaTransporte.tipo_Doc)}</p>
                                                <p className="text-2xl  font-extrabold text-gray-700 tracking-wide">
                                                    {guiaTransporte.serie}-{guiaTransporte.correlativo}
                                                </p>
                                                <p>Fecha de Emisión: {formatDate(guiaTransporte.fecha_Emision)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Información del Cliente/Destinatario */}
                                <div className="rounded-xl border border-gray-200 bg-white">
                                    <div className="grid grid-cols-1  gap-6 p-6">
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-600 mb-3">
                                                DATOS DEL DESTINATARIO:
                                            </h3>
                                            <div className="text-sm text-gray-800 space-y-1 grid grid-cols-2">
                                                <div className="grid grid-cols-[140px_1fr] gap-x-2">
                                                    <span className="text-gray-700 font-semibold">Tipo Doc.:</span>
                                                    <span className="font-medium">{getClientDocTypeDescription(guiaTransporte.cliente_Tipo_Doc)}</span>

                                                    <span className="text-gray-700 font-semibold">Nro. Doc.:</span>
                                                    <span className="font-medium">{guiaTransporte.cliente_Num_Doc || 'N/A'}</span>

                                                    <span className="text-gray-700 font-semibold">Razón Social/Nombre:</span>
                                                    <span className="font-medium">{guiaTransporte.cliente_Razon_Social || 'N/A'}</span>
                                                </div>
                                                <div className="grid grid-cols-[140px_1fr] gap-x-2">
                                                    <span className="text-gray-700 font-semibold">Dirección:</span>
                                                    <span className="font-medium">{guiaTransporte.cliente_Direccion || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Datos del Traslado */}

                                <div className="rounded-xl border border-gray-200 bg-white">
                                    <div className="grid grid-cols-1  gap-6 p-6">
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-600 mb-3">
                                                DATOS DEL TRASLADO:
                                            </h3>
                                            <div className="text-sm text-gray-800 space-y-1 grid grid-cols-2">
                                                <div className="grid grid-cols-1 md:grid-cols-[170px_1fr] gap-2 text-sm">

                                                    {/* //?privado */}
                                                    {
                                                        tipoGuia === "transporte-privado" &&
                                                        <>
                                                            <span className="text-gray-700 font-semibold">Mod. de Traslado:</span>
                                                            <span className="font-medium"> {guiaDatosPrivado.guia_Envio_Mod_Traslado}</span>

                                                            <span className="text-gray-700 font-semibold">Placa del Vehiculo:</span>
                                                            <span className="font-medium">{guiaDatosPrivado.guia_Envio_Vehiculo_Placa || 'N/A'}</span>


                                                            <span className="text-gray-700 font-semibold">Motivo de Traslado:</span>
                                                            <span className="font-medium">{getMotivoTrasladoDescription(guiaDatosPrivado.guia_Envio_Cod_Traslado)}</span>
                                                        </>
                                                    }
                                                    {
                                                        tipoGuia === "transporte-publico" &&
                                                        <>
                                                            <span className="text-gray-700 font-semibold">Descripción de Traslado:</span>
                                                            <span className="font-medium"> {guiaDatosPublico.guia_Envio_Des_Traslado}</span>

                                                            <span className="text-gray-700 font-semibold">Modalidad de Traslado:</span>
                                                            <span className="font-medium">{guiaDatosPublico.guia_Envio_Mod_Traslado || 'N/A'}</span>

                                                            <span className="text-gray-700 font-semibold">Motivo de Traslado:</span>
                                                            <span className="font-medium">{getMotivoTrasladoDescription(guiaDatosPublico.guia_Envio_Cod_Traslado)}</span>
                                                        </>
                                                    }
                                                    {
                                                        tipoGuia === "traslado-misma-empresa" &&
                                                        <>
                                                            <span className="text-gray-700 font-semibold">Destino de Traslado:</span>
                                                            <span className="font-medium"> {getModalidadTrasladoDescription(guiaDatosInternos.guia_Envio_Des_Traslado)}</span>

                                                            <span className="text-gray-700 font-semibold">Modalidad de Traslado:</span>
                                                            <span className="font-medium">{guiaDatosInternos.guia_Envio_Mod_Traslado || 'N/A'}</span>

                                                            <span className="text-gray-700 font-semibold">Motivo de Traslado:</span>
                                                            <span className="font-medium">{getMotivoTrasladoDescription(guiaDatosInternos.guia_Envio_Cod_Traslado)}</span>
                                                        </>
                                                    }


                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2 text-sm">
                                                    <span className="text-gray-700 font-semibold">Feca de Traslado:</span>
                                                    <span className="font-medium">{formatDate(guiaTransporte.guia_Envio_Fec_Traslado)}</span>
                                                    <span className="text-gray-700 font-semibold">Peso Total Bruto:</span>
                                                    <span className="font-medium">{guiaTransporte.guia_Envio_Peso_Total || '0'} {guiaTransporte.guia_Envio_Und_Peso_Total || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-gray-200 bg-white">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                                        {/* Punto de Partida */}
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-600 mb-3">
                                                PUNTO DE PARTIDA:
                                            </h3>
                                            <div className="text-sm text-gray-800 space-y-1">
                                                <div className="grid grid-cols-1 md:grid-cols-[110px_1fr] gap-2 text-sm">
                                                    <span className="text-gray-700 font-semibold">Ubigeo:</span>
                                                    <span className="font-medium">{guiaTransporte.guia_Envio_Partida_Ubigeo || "—"}</span>
                                                    <span className="text-gray-700 font-semibold">Dirección:</span>
                                                    <span className="font-medium">{guiaTransporte.guia_Envio_Partida_Direccion || "—"}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Punto de Llegada */}
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-600 mb-3">
                                                PUNTO DE LLEGADA:
                                            </h3>
                                            <div className="text-sm text-gray-800 space-y-1">
                                                <div className="grid grid-cols-1 md:grid-cols-[110px_1fr] gap-2 text-sm">
                                                    <span className="text-gray-700 font-semibold">Ubigeo:</span>
                                                    <span className="font-medium">{guiaTransporte.guia_Envio_Llegada_Ubigeo || "—"}</span>
                                                    <span className="text-gray-700 font-semibold">Dirección:</span>
                                                    <span className="font-medium">{guiaTransporte.guia_Envio_Llegada_Direccion || "—"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Datos del Conductor (Chofer) */}


                                {
                                    tipoGuia == "transporte-publico" &&
                                    <div className="rounded-xl border border-gray-200 bg-white">
                                        <div className="p-6">
                                            <h3 className="text-sm font-bold text-gray-600 mb-3">
                                                DATOS DEL CONDUCTOR:
                                            </h3>
                                            {guiaDatosPublico.transportista && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-[110px_1fr] gap-2 text-sm">
                                                        <span className="text-gray-700 font-semibold">Tipo Doc.:</span>
                                                        <span className="font-medium">{getClientDocTypeDescription(guiaDatosPublico.transportista.tipo_doc)}</span>
                                                        <span className="text-gray-700 font-semibold">Nro. Doc.:</span>
                                                        <span className="font-medium">{guiaDatosPublico.transportista.nro_doc || 'N/A'}</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-2 text-sm">
                                                        <span className="text-gray-700 font-semibold">Razón Social:</span>
                                                        <span className="font-medium">{guiaDatosPublico.transportista.razon_Social || 'N/A'}</span>
                                                        <span className="text-gray-700 font-semibold">Nro. MTC:</span>
                                                        <span className="font-medium">{guiaDatosPublico.transportista.nro_mtc || 'N/A'}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                }

                                {/* Tabla de Detalle de Productos */}
                                <div className="mb-6">
                                    <div className="overflow-x-auto rounded-md border border-gray-200">
                                        <table className="min-w-full bg-white">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="py-2 px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cód. Producto</th>
                                                    <th className="py-2 px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Descripción</th>
                                                    <th className="py-2 px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Unidad</th>
                                                    <th className="py-2 px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cant.</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {guiaTransporte.detalle && guiaTransporte.detalle.length > 0 ? (
                                                    guiaTransporte.detalle.map((item, index) => (
                                                        <tr key={index} className="hover:bg-gray-50 border-b last:border-b-0">
                                                            <td className="py-2 px-4 text-sm">{item.cod_Producto || 'N/A'}</td>
                                                            <td className="py-2 px-4 text-sm">{item.descripcion || 'N/A'}</td>
                                                            <td className="py-2 px-4 text-sm">{item.unidad || 'N/A'}</td>
                                                            <td className="py-2 px-4 text-sm">{item.cantidad || '0'}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="4" className="py-4 text-center text-gray-500">No hay productos en el detalle.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Sección de Observacion */}
                                <div className="">
                                    <h3 className="font-bold text-md mb-2 text-gray-600 border-b pb-1">OBSERVACION:</h3>
                                    <div className="p-4 border border-gray-200 rounded-md bg-white text-sm text-gray-800">
                                        {guiaTransporte.observacion || 'No hay observacion registradas.'}
                                    </div>
                                </div>

                            </div>

                            {/* --- Fin Detalle de la Guía --- */}
                            <div className="w-full flex justify-end py-5">
                                <ModalEnviarGuia open={open} setOpen={setOpen} ClosePreviu={closeModal} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
