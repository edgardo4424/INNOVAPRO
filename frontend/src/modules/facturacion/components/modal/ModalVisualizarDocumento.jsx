import { useEffect, useState } from "react";
import { EyeIcon, X } from "lucide-react";
import facturaService from "../../service/FacturaService";
import { toast } from "react-toastify";

export default function ModalVisualizarDocumento({ id_documento, setIdDocumento, setModalOpen }) {
    const [factura, setFactura] = useState(null);
    const [isOpen, setIsOpen] = useState(true);

    const closeModal = () => {
        setIsOpen(false);
        setIdDocumento("");
        setModalOpen(false);
    };

    const getTipoDocDescription = (typeCode) => {
        switch (typeCode) {
            case "01": return "FACTURA ELECTRÓNICA";
            case "03": return "BOLETA DE VENTA ELECTRÓNICA";
            case "07": return "NOTA DE CRÉDITO ELECTRÓNICA";
            case "08": return "NOTA DE DÉBITO ELECTRÓNICA";
            default: return "DOCUMENTO NO ESPECIFICADO";
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" });
        } catch {
            return (dateString.split?.("T")?.[0]) || dateString;
        }
    };

    const getClientDocTypeDescription = (typeCode) => {
        switch (typeCode) {
            case "6": return "RUC";
            case "1": return "DNI";
            case "4": return "CARNET DE EXTRANJERÍA";
            default: return "OTRO";
        }
    };

    useEffect(() => {
        if (!isOpen || !id_documento) return;

        const BuscarDocumento = async () => {
            try {
                const { mensaje, estado, factura: rawFactura } = await facturaService.obtenerDocumentoConId(id_documento);

                if (!estado) {
                    toast.error(mensaje || "No se pudo obtener el documento");
                    return;
                }

                console.log("este es la factura seleccionada: ", rawFactura);
                const factura = {
                    id: rawFactura.id,
                    tipo_operacion: rawFactura.tipo_Operacion,
                    tipo_doc: rawFactura.tipo_Doc,
                    serie: rawFactura.serie,
                    correlativo: rawFactura.correlativo,
                    tipo_moneda: rawFactura.tipo_Moneda,
                    fecha_emision: rawFactura.fecha_Emision,
                    empresa_ruc: rawFactura.empresa_Ruc,

                    cliente_tipo_doc: rawFactura.cliente_Tipo_Doc,
                    cliente_num_doc: rawFactura.cliente_Num_Doc,
                    cliente_razon_social: rawFactura.cliente_Razon_Social,
                    cliente_direccion: rawFactura.cliente_Direccion,

                    monto_oper_gravadas: rawFactura.monto_Oper_Gravadas,
                    monto_oper_exoneradas: rawFactura.monto_Oper_Exoneradas,
                    monto_igv: rawFactura.monto_Igv,
                    total_impuestos: rawFactura.total_Impuestos,
                    valor_venta: rawFactura.valor_Venta,
                    sub_total: rawFactura.sub_Total,
                    monto_imp_venta: rawFactura.monto_Imp_Venta,

                    estado_documento: rawFactura.estado_Documento,
                    estado: rawFactura.estado,
                    observaciones: rawFactura.observaciones,
                    manual: rawFactura.manual,
                    id_base_dato: rawFactura.id_Base_Dato,
                    usuario_id: rawFactura.usuario_id,

                    detraccion_cod_bien_detraccion: rawFactura.detraccion_cod_bien_detraccion,
                    detraccion_cod_medio_pago: rawFactura.detraccion_cod_medio_pago,
                    detraccion_cta_banco: rawFactura.detraccion_cta_banco,
                    detraccion_percent: rawFactura.detraccion_percent,
                    detraccion_mount: rawFactura.detraccion_mount,

                    descuento_cod_tipo: rawFactura.descuento_cod_tipo,
                    descuento_monto_base: rawFactura.descuento_monto_base,
                    descuento_factor: rawFactura.descuento_factor,
                    descuento_monto: rawFactura.descuento_monto,

                    detalle: rawFactura.detalle_facturas ?? [],
                    forma_pago: rawFactura.forma_pago_facturas ?? [],
                    legend: rawFactura.legend_facturas ?? [],
                };
        console.log(factura);
                setFactura(factura);
            } catch (e) {
                console.error(e);
                toast.error("Error al obtener el documento");
            }
        };

        BuscarDocumento();
    }, [isOpen, id_documento]);

    return (
        <>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 bg-opacity-10 animate-fade-in">
                    <div className="relative w-full max-w-4xl p-6 bg-white shadow-2xl rounded-xl animate-scale-in overflow-y-auto max-h-[95vh]">
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition-colors duration-200"
                            onClick={closeModal}
                            aria-label="Cerrar"
                        >
                            <X size={24} />
                        </button>

                        <div className="mb-6 text-center border-b pb-4">
                            <h2 className="text-3xl font-bold text-blue-800 mb-2">
                                Detalle del documento
                            </h2>
                            <p className="text-lg text-gray-700">
                                Revisa los detalles de tu documento antes de emitirlo.
                            </p>
                        </div>

                        {!factura ? (
                            <p className="text-center text-gray-500">Cargando...</p>
                        ) : (
                            <div className="border border-gray-300 p-6 rounded-lg bg-gray-50 text-gray-800">
                                {/* Cabecera */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 pb-4 border-b border-gray-200">
                                    <div>
                                        <p className="text-xl font-bold text-blue-700">TU EMPRESA S.A.C.</p>
                                        <p className="text-sm">RUC: {factura.empresa_ruc}</p>
                                        <p className="text-sm">DIRECCIÓN: [Tu dirección de empresa aquí]</p>
                                    </div>
                                    <div className="text-right border border-blue-400 p-4 rounded-md bg-blue-50">
                                        <p className="text-lg font-bold">{getTipoDocDescription(factura.tipo_doc)}</p>
                                        <p className="text-2xl font-extrabold text-blue-900">
                                            {factura.serie}-{factura.correlativo}
                                        </p>
                                    </div>
                                </div>

                                {/* Cliente */}
                                <div className="mb-6 p-4 border border-gray-200 rounded-md bg-white">
                                    <h3 className="font-bold text-md mb-2 text-gray-600 border-b pb-1">DATOS DEL CLIENTE:</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                        <p><strong>Tipo Doc.:</strong> {getClientDocTypeDescription(factura.cliente_tipo_doc)}</p>
                                        <p><strong>Nro. Doc.:</strong> {factura.cliente_num_doc}</p>
                                        <p className="col-span-full"><strong>Razón Social/Nombre:</strong> {factura.cliente_razon_social}</p>
                                        <p className="col-span-full"><strong>Dirección:</strong> {factura.cliente_direccion || "N/A"}</p>
                                        <p className="col-span-full"><strong>Fecha de Emisión:</strong> {formatDate(factura.fecha_emision)}</p>
                                    </div>
                                </div>

                                {/* Detalle */}
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
                                                {factura.detalle?.length ? (
                                                    factura.detalle.map((item, index) => (
                                                        <tr key={index} className="hover:bg-gray-50 border-b last:border-b-0">
                                                            {console.log(item)}
                                                            <td className="py-2 px-4 text-sm">{item.cantidad}</td>
                                                            <td className="py-2 px-4 text-sm">{item.unidad}</td>
                                                            <td className="py-2 px-4 text-sm">{item.descripcion}</td>
                                                            <td className="py-2 px-4 text-right text-sm">{item.monto_Valor_Unitario ?? "0.00"}</td>
                                                            <td className="py-2 px-4 text-right text-sm">{item.monto_Precio_Unitario ?? "0.00"}</td>
                                                            <td className="py-2 px-4 text-right text-sm">
                                                                {(item.monto_Precio_Unitario ?? 0) }
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="6" className="py-4 text-center text-gray-500">
                                                            No hay productos en el detalle.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Observaciones */}
                                <div className="mb-6">
                                    <h3 className="font-bold text-md mb-2 text-gray-600 border-b pb-1">OBSERVACIONES:</h3>
                                    <div className="p-4 border border-gray-200 rounded-md bg-white text-sm text-gray-800">
                                        {factura.observaciones || "No hay observaciones registradas."}
                                    </div>
                                </div>

                                {/* Totales */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="font-bold text-md mb-2 text-gray-600 border-b pb-1">FORMA DE PAGO:</h3>
                                        {factura.forma_pago?.length ? (
                                            <ul className="list-disc list-inside text-sm text-gray-700">
                                                {factura.forma_pago.map((pago, index) => (
                                                    <li key={index} className="mb-1">
                                                        {pago.tipo} - {pago.monto} {factura.tipo_moneda}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-gray-500">No se han registrado formas de pago.</p>
                                        )}

                                        {factura.legend?.length > 0 && (
                                            <div className="mt-4 pt-2 border-t border-gray-200">
                                                <p className="font-semibold text-blue-700 text-sm">
                                                    {factura.legend[0].legend_value}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-right p-4 border border-gray-200 rounded-md bg-white">
                                        <p className="flex justify-between text-sm mb-1">
                                            <span className="font-semibold text-gray-700">Op. Gravadas:</span>
                                            <span className="text-gray-900">
                                                {factura.tipo_moneda} {factura.monto_oper_gravadas ?? "0.00"}
                                            </span>
                                        </p>
                                        <p className="flex justify-between text-sm mb-1">
                                            <span className="font-semibold text-gray-700">Op. Exoneradas:</span>
                                            <span className="text-gray-900">
                                                {factura.tipo_moneda} {factura.monto_oper_exoneradas ?? "0.00"}
                                            </span>
                                        </p>
                                        <p className="flex justify-between text-sm mb-1">
                                            <span className="font-semibold text-gray-700">IGV (18%):</span>
                                            <span className="text-gray-900">
                                                {factura.tipo_moneda} {factura.total_impuestos ?? "0.00"}
                                            </span>
                                        </p>
                                        <p className="flex justify-between text-lg font-bold mt-4 pt-4 border-t-2 border-gray-300 text-blue-800">
                                            <span>TOTAL:</span>
                                            <span>
                                                {factura.tipo_moneda} {factura.sub_total}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <div className="text-center text-xs text-gray-500 mt-6 pt-4 border-t border-gray-200">
                                    <p>Documento Generado por tu Sistema de Facturación.</p>
                                    <p>Para consultas, contáctanos al [Tu Teléfono] o [Tu Email]</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
