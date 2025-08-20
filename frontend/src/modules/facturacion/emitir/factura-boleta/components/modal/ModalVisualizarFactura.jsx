import { useState } from "react";
import { useFacturaBoleta } from "@/context/Factura/FacturaBoletaContext"; // Import your context
import { ClipboardPlus, Eye, X } from "lucide-react"; // Still using Lucide icons
import EnviarFactura from "./EnviarFactura";

export default function ModalVisualizarFactura() {

    const { facturaValidaParaGuardar, emitirFactura } = useFacturaBoleta();
    //? Modal Emmitir
    const [open, setOpen] = useState(false);

    const [isOpen, setIsOpen] = useState(false); // Changed state name for clarity

    const closeModal = () => {
        setIsOpen(false);
    };

    const openModal = () => {
        setIsOpen(true);
    };

    // Get the factura object from your context
    const { factura } = useFacturaBoleta();

    // Helper to get document type description
    const getTipoDocDescription = (typeCode) => {
        switch (typeCode) {
            case "01": return "FACTURA ELECTRÓNICA";
            case "03": return "BOLETA DE VENTA ELECTRÓNICA";
            case "07": return "NOTA DE CRÉDITO ELECTRÓNICA";
            case "08": return "NOTA DE DÉBITO ELECTRÓNICA";
            default: return "DOCUMENTO NO ESPECIFICADO";
        }
    };

    // Helper to format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            // "2025-07-14T05:00:00-05:00" -> "14/07/2025"
            const date = new Date(dateString);
            return date.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
        } catch (e) {
            console.error("Error formatting date:", e);
            return dateString.split('T')[0]; // Fallback to YYYY-MM-DD
        }
    };

    // Helper to get client document type description
    const getClientDocTypeDescription = (typeCode) => {
        switch (typeCode) {
            case "6": return "RUC";
            case "1": return "DNI";
            case "4": return "CARNET DE EXTRANJERÍA";
            default: return "OTRO";
        }
    };

    return (
        <>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={openModal} // Open modal on click
                className="py-3 px-6 rounded-lg bg-green-600 text-white font-semibold text-lg hover:bg-green-700 transition duration-300 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 flex gap-x-2 items-center justify-center"
            >
                <Eye size={24} />
                <span className="hidden md:block">Pre visualizar</span>
            </button>

            {/* Modal Overlay and Content */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 bg-opacity-10 animate-fade-in">
                    <div className="relative w-full max-w-4xl p-6 bg-white shadow-2xl rounded-xl animate-scale-in overflow-y-auto max-h-[95vh]">
                        {/* Close Button */}
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition-colors duration-200"
                            onClick={closeModal}
                            aria-label="Cerrar"
                        >
                            <X size={24} />
                        </button>

                        {/* Modal Header */}
                        <div className="mb-6 text-center border-b pb-4">
                            <h2 className="text-3xl font-bold text-blue-800 mb-2">
                                Previsualización de Documento
                            </h2>
                            <p className="text-lg text-gray-700">
                                Revisa los detalles de tu documento antes de emitirlo.
                            </p>
                        </div>

                        {/* --- Invoice Detail --- */}
                        <div className="border border-gray-300 p-6 rounded-lg bg-gray-50 text-gray-800">

                            {/* Company and Document Header */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 pb-4 border-b border-gray-200">
                                <div>
                                    <p className="text-xl font-bold text-blue-700">TU EMPRESA S.A.C.</p>
                                    <p className="text-sm">RUC: {factura.empresa_Ruc}</p>
                                    <p className="text-sm">DIRECCIÓN: [Tu dirección de empresa aquí]</p>
                                </div>
                                <div className="text-right border border-blue-400 p-4 rounded-md bg-blue-50">
                                    <p className="text-lg font-bold">{getTipoDocDescription(factura.tipo_Doc)}</p>
                                    <p className="text-2xl font-extrabold text-blue-900">
                                        {factura.serie}-{factura.correlativo}
                                    </p>
                                </div>
                            </div>

                            {/* Client Information */}
                            <div className="mb-6 p-4 border border-gray-200 rounded-md bg-white">
                                <h3 className="font-bold text-md mb-2 text-gray-600 border-b pb-1">DATOS DEL CLIENTE:</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                    <p><strong>Tipo Doc.:</strong> {getClientDocTypeDescription(factura.cliente_Tipo_Doc)}</p>
                                    <p><strong>Nro. Doc.:</strong> {factura.cliente_Num_Doc}</p>
                                    <p className="col-span-full"><strong>Razón Social/Nombre:</strong> {factura.cliente_Razon_Social}</p>
                                    <p className="col-span-full"><strong>Dirección:</strong> {factura.cliente_Direccion || 'N/A'}</p>
                                    <p className="col-span-full"><strong>Fecha de Emisión:</strong> {formatDate(factura.fecha_Emision)}</p>
                                </div>
                            </div>

                            {/* Product Details Table */}
                            <div className="mb-6">
                                <h3 className="font-bold text-md mb-2 text-gray-600 border-b pb-1">DETALLE DE PRODUCTOS/SERVICIOS:</h3>
                                <div className="overflow-x-auto rounded-md border border-gray-200">
                                    <table className="min-w-full bg-white">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="py-2 px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cant.</th>
                                                <th className="py-2 px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Unidad</th>
                                                <th className="py-2 px-4 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Descripción</th>
                                                <th className="py-2 px-4 border-b text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">V. Unit.</th>
                                                <th className="py-2 px-4 border-b text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">P. Unit.</th>
                                                <th className="py-2 px-4 border-b text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {factura.detalle && factura.detalle.length > 0 ? (
                                                factura.detalle.map((item, index) => (
                                                    <tr key={index} className="hover:bg-gray-50 border-b last:border-b-0">
                                                        <td className="py-2 px-4 text-sm">{item.cantidad}</td>
                                                        <td className="py-2 px-4 text-sm">{item.unidad}</td>
                                                        <td className="py-2 px-4 text-sm">{item.descripcion}</td>
                                                        <td className="py-2 px-4 text-right text-sm">{item.monto_Valor_Unitario || '0.00'}</td>
                                                        <td className="py-2 px-4 text-right text-sm">{item.monto_Precio_Unitario || '0.00'}</td>
                                                        <td className="py-2 px-4 text-right text-sm">{(item.monto_Valor_Venta + (item.igv || 0)) || '0.00'}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" className="py-4 text-center text-gray-500">No hay productos en el detalle.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* // Observations Section */}
                            <div className="mb-6">
                                <h3 className="font-bold text-md mb-2 text-gray-600 border-b pb-1">OBSERVACIONES:</h3>
                                <div className="p-4 border border-gray-200 rounded-md bg-white text-sm text-gray-800">
                                    {factura.observaciones || 'No hay observaciones registradas.'}
                                </div>
                            </div>


                            {/* Totals & Payment */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-bold text-md mb-2 text-gray-600 border-b pb-1">FORMA DE PAGO:</h3>
                                    {factura.forma_pago && factura.forma_pago.length > 0 ? (
                                        <ul className="list-disc list-inside text-sm text-gray-700">
                                            {factura.forma_pago.map((pago, index) => (
                                                <li key={index} className="mb-1">
                                                    {pago.tipo} - {pago.monto} {factura.tipo_Moneda} ({formatDate(pago.fecha_Pago)})
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-gray-500">No se han registrado formas de pago.</p>
                                    )}
                                    {factura.legend && factura.legend.length > 0 && (
                                        <div className="mt-4 pt-2 border-t border-gray-200">
                                            <p className="font-semibold text-blue-700 text-sm">
                                                {factura.legend[0].legend_Value}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="text-right p-4 border border-gray-200 rounded-md bg-white">
                                    <p className="flex justify-between text-sm mb-1">
                                        <span className="font-semibold text-gray-700">Op. Gravadas:</span>
                                        <span className="text-gray-900">{factura.tipo_Moneda} {factura.monto_Oper_Gravadas || '0.00'}</span>
                                    </p>
                                    <p className="flex justify-between text-sm mb-1">
                                        <span className="font-semibold text-gray-700">Op. Exoneradas:</span>
                                        <span className="text-gray-900">{factura.tipo_Moneda} {factura.monto_Oper_Exoneradas || '0.00'}</span>
                                    </p>
                                    {/* Assuming IGV percentage is dynamic or a fixed 18% based on your context state */}
                                    <p className="flex justify-between text-sm mb-1">
                                        <span className="font-semibold text-gray-700">IGV (18%):</span>
                                        <span className="text-gray-900">{factura.tipo_Moneda} {factura.total_Impuestos || '0.00'}</span>
                                    </p>
                                    <p className="flex justify-between text-lg font-bold mt-4 pt-4 border-t-2 border-gray-300 text-blue-800">
                                        <span>TOTAL:</span>
                                        <span>{factura.tipo_Moneda} {factura.monto_Imp_Venta || '0.00'}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Footer / Additional Info */}
                            <div className="text-center text-xs text-gray-500 mt-6 pt-4 border-t border-gray-200">
                                <p>Documento Generado por tu Sistema de Facturación.</p>
                                <p>Para consultas, contáctanos al [Tu Teléfono] o [Tu Email]</p>
                            </div>

                        </div>
                        {/* --- End Invoice Detail --- */}
                        <div className="w-full flex justify-end pt-5">
                            <EnviarFactura open={open} setOpen={setOpen} ClosePreviu={closeModal}/>

                        </div>
                    </div>
                </div>
            )}

        </>
    );
}