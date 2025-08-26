import { useState } from "react";
import { useGuiaTransporte } from "@/modules/facturacion/context/GuiaTransporteContext"; // Importamos el contexto correcto
import { Eye, X } from "lucide-react"; // Solo necesitamos Eye y X para previsualizar
import ModalEnviarGuia from "./ModalEnviarGuia";

export default function ModalVisualizarGuiaMismaEmpresa() {
    // ?? Obtenemos el objeto 'guiaTransporte' de nuestro contexto
    const { guiaTransporte } = useGuiaTransporte();

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
        // ?? Se utiliza guia_Envio_Des_Traslado si está disponible, de lo contrario se usa el código
        if (guiaTransporte.guia_Envio_Des_Traslado) {
            return guiaTransporte.guia_Envio_Des_Traslado;
        }
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
                <span className="hidden md:block">Previsualizar</span>
            </button>

            {/* Overlay y Contenido del Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 bg-opacity-10 animate-fade-in">
                    <div className="relative w-full max-w-4xl p-6 bg-white shadow-2xl rounded-xl animate-scale-in overflow-y-auto max-h-[95vh]">
                        {/* Botón para cerrar el modal */}
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition-colors duration-200"
                            onClick={closeModal}
                            aria-label="Cerrar"
                        >
                            <X size={24} />
                        </button>

                        {/* Encabezado del Modal */}
                        <div className="mb-6 text-center border-b pb-4">
                            <h2 className="text-3xl font-bold text-blue-800 mb-2">
                                Previsualización de Guía de Remisión
                            </h2>
                            <p className="text-lg text-gray-700">
                                Revisa los detalles de tu guía antes de emitirla.
                            </p>
                        </div>

                        {/* --- Detalle de la Guía --- */}
                        <div className="border border-gray-300 p-6 rounded-lg bg-gray-50 text-gray-800">

                            {/* Encabezado de la Empresa y Documento */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 pb-4 border-b border-gray-200">
                                <div>
                                    <p className="text-xl font-bold text-blue-700">TU EMPRESA S.A.C.</p>
                                    <p className="text-sm">RUC: {guiaTransporte.empresa_Ruc || 'N/A'}</p>
                                    <p className="text-sm">DIRECCIÓN: [Tu dirección de empresa aquí]</p> {/* Placeholder */}
                                </div>
                                <div className="text-right border border-blue-400 p-4 rounded-md bg-blue-50">
                                    <p className="text-lg font-bold">{getTipoDocGuiaDescription(guiaTransporte.tipo_Doc)}</p>
                                    <p className="text-2xl font-extrabold text-blue-900">
                                        {guiaTransporte.serie}-{guiaTransporte.correlativo}
                                    </p>
                                </div>
                            </div>

                            {/* Información del Cliente/Destinatario */}
                            <div className="mb-6 p-4 border border-gray-200 rounded-md bg-white">
                                <h3 className="font-bold text-md mb-2 text-gray-600 border-b pb-1">DATOS DEL DESTINATARIO:</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                    <p><strong>Tipo Doc.:</strong> {getClientDocTypeDescription(guiaTransporte.cliente_Tipo_Doc)}</p>
                                    <p><strong>Nro. Doc.:</strong> {guiaTransporte.cliente_Num_Doc || 'N/A'}</p>
                                    <p className="col-span-full"><strong>Razón Social/Nombre:</strong> {guiaTransporte.cliente_Razon_Social || 'N/A'}</p>
                                    <p className="col-span-full"><strong>Dirección:</strong> {guiaTransporte.cliente_Direccion || 'N/A'}</p>
                                    <p className="col-span-full"><strong>Fecha de Emisión:</strong> {formatDate(guiaTransporte.fecha_Emision)}</p>
                                </div>
                            </div>

                            {/* Datos del Traslado */}
                            <div className="mb-6 p-4 border border-gray-200 rounded-md bg-white">
                                <h3 className="font-bold text-md mb-2 text-gray-600 border-b pb-1">DATOS DEL TRASLADO:</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                    <p><strong>Modalidad de Traslado:</strong> {getModalidadTrasladoDescription(guiaTransporte.guia_Envio_Mod_Traslado)}</p>
                                    <p><strong>Motivo de Traslado:</strong> {getMotivoTrasladoDescription(guiaTransporte.guia_Envio_Cod_Traslado)}</p>
                                    <p><strong>Fecha de Traslado:</strong> {formatDate(guiaTransporte.guia_Envio_Fec_Traslado)}</p>
                                    <p><strong>Peso Total Bruto:</strong> {guiaTransporte.guia_Envio_Peso_Total || '0'} {guiaTransporte.guia_Envio_Und_Peso_Total || 'N/A'}</p>
                                    <p className="col-span-full"><strong>Placa del Vehículo:</strong> {guiaTransporte.guia_Envio_Vehiculo_Placa || 'N/A'}</p>
                                </div>
                            </div>

                            {/* Punto de Partida */}
                            <div className="mb-6 p-4 border border-gray-200 rounded-md bg-white">
                                <h3 className="font-bold text-md mb-2 text-gray-600 border-b pb-1">PUNTO DE PARTIDA:</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                    <p><strong>Ubigeo:</strong> {guiaTransporte.guia_Envio_Partida_Ubigeo || 'N/A'}</p>
                                    <p className="col-span-full"><strong>Dirección:</strong> {guiaTransporte.guia_Envio_Partida_Direccion || 'N/A'}</p>
                                </div>
                            </div>

                            {/* Punto de Llegada */}
                            <div className="mb-6 p-4 border border-gray-200 rounded-md bg-white">
                                <h3 className="font-bold text-md mb-2 text-gray-600 border-b pb-1">PUNTO DE LLEGADA:</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                    <p><strong>Ubigeo:</strong> {guiaTransporte.guia_Envio_Llegada_Ubigeo || 'N/A'}</p>
                                    <p className="col-span-full"><strong>Dirección:</strong> {guiaTransporte.guia_Envio_Llegada_Direccion || 'N/A'}</p>
                                </div>
                            </div>


                            {/* Tabla de Detalle de Productos */}
                            <div className="mb-6">
                                <h3 className="font-bold text-md mb-2 text-gray-600 border-b pb-1">DETALLE DE PRODUCTOS:</h3>
                                <div className="overflow-x-auto rounded-md border border-gray-200">
                                    <table className="min-w-full bg-white">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="py-2 px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cant.</th>
                                                <th className="py-2 px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Unidad</th>
                                                <th className="py-2 px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cód. Producto</th>
                                                <th className="py-2 px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Descripción</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {guiaTransporte.detalle && guiaTransporte.detalle.length > 0 ? (
                                                guiaTransporte.detalle.map((item, index) => (
                                                    <tr key={index} className="hover:bg-gray-50 border-b last:border-b-0">
                                                        <td className="py-2 px-4 text-sm">{item.cantidad || '0'}</td>
                                                        <td className="py-2 px-4 text-sm">{item.unidad || 'N/A'}</td>
                                                        <td className="py-2 px-4 text-sm">{item.cod_Producto || 'N/A'}</td>
                                                        <td className="py-2 px-4 text-sm">{item.descripcion || 'N/A'}</td>
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

                            {/* Sección de Observaciones */}
                            <div className="mb-6">
                                <h3 className="font-bold text-md mb-2 text-gray-600 border-b pb-1">OBSERVACIONES:</h3>
                                <div className="p-4 border border-gray-200 rounded-md bg-white text-sm text-gray-800">
                                    {guiaTransporte.observacion || 'No hay observaciones registradas.'}
                                </div>
                            </div>

                            {/* Pie de página / Información Adicional */}
                            <div className="text-center text-xs text-gray-500 mt-6 pt-4 border-t border-gray-200">
                                <p>Documento Generado por tu Sistema de Gestión.</p>
                                <p>Para consultas, contáctanos al [Tu Teléfono] o [Tu Email]</p>
                            </div>

                        </div>
                        {/* --- Fin Detalle de la Guía --- */}
                        <div className="w-full flex justify-end pt-5">
                            <ModalEnviarGuia open={open} setOpen={setOpen} ClosePreviu={closeModal} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
