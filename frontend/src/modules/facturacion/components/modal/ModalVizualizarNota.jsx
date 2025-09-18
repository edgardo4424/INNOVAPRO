import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import DocumentoSkeleton from "../../bandeja/list-factura-boleta/components/DocumentoSkeleton";
import facturaService from "../../service/FacturaService";

// Códigos y descripciones de motivos de notas de crédito y débito
// Se movió fuera del componente para evitar re-creaciones en cada render
const MOTIVOS_NOTA = {
    CREDITO: [
        { value: "01", label: "01 - Anulación de la operación", descripcion: "ANULACION DE OPERACION" },
        { value: "02", label: "02 - Anulación por error en el RUC", descripcion: "ANULACION POR ERROR EN EL RUC" },
        { value: "03", label: "03 - Corrección por error en la descripción", descripcion: "CORRECCION POR ERROR EN LA DESCRIPCION" },
        { value: "04", label: "04 - Descuento global", descripcion: "DESCUENTO GLOBAL" },
        { value: "05", label: "05 - Descuento por ítem", descripcion: "DESCUENTO POR ITEM" },
        { value: "06", label: "06 - Devolución total", descripcion: "DEVOLUCION TOTAL" },
        { value: "07", label: "07 - Devolución por ítem", descripcion: "DEVOLUCION POR ITEM" },
        { value: "10", label: "10 - Otros Conceptos", descripcion: "OTROS CONCEPTOS" },
    ],
    DEBITO: [
        { value: "01", label: "01 - Intereses por mora", descripcion: "INTERESES POR MORAS" },
        { value: "02", label: "02 - Aumento en el valor", descripcion: "AUMENTO EN EL VALOR" },
        { value: "03", label: "03 - Penalidades/ otros conceptos", descripcion: "PENALIDADES/ OTROS CONCEPTOS" },
    ],
};


const formatDateTime = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return isNaN(d) ? dateStr : d.toLocaleString("es-PE", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
};


const getTipoDocLabel = (code) => {
    switch (code) {
        case "07":
            return "NOTA DE CRÉDITO";
        case "08":
            return "NOTA DE DÉBITO";
        default:
            return "NOTA ELECTRÓNICA";
    }
};


const getTipoDocCliente = (code) => {
    switch (String(code)) {
        case "6":
            return "RUC";
        case "1":
            return "DNI";
        case "4":
            return "CARNET DE EXTRANJERÍA";
        default:
            return "OTRO";
    }
};


const getMotivoLabel = (tipoDoc, motivoCod) => {
    if (!motivoCod) return "—";
    const motivos = tipoDoc === "07" ? MOTIVOS_NOTA.CREDITO : MOTIVOS_NOTA.DEBITO;
    const motivo = motivos.find((m) => m.value === motivoCod);
    return motivo?.descripcion || motivoCod;
};


const parseDescuentos = (descuentos) => {
    try {
        if (typeof descuentos === 'string') {
            const parsed = JSON.parse(descuentos);
            if (Array.isArray(parsed) && parsed.length > 0) {
                const { Monto, codTipo } = parsed[0];
                return `Descuento: ${Monto} (cod: ${codTipo})`;
            }
        }
    } catch (e) {
        console.error("Error al parsear descuentos:", e);
    }
    return null;
};

export default function ModalVizualizarNota({
    setModalOpen,
    documentoAVisualizar,
    setDocumentoAVisualizar,
}) {
    const [nota, setNota] = useState(null);
    const [isOpen, setIsOpen] = useState(true);

    // Helpers
    const closeModal = () => {
        setIsOpen(false);
        setModalOpen(false);
        setDocumentoAVisualizar({});
    };

    const onBackdropClick = (e) => {
        if (e.target === e.currentTarget) closeModal();
    };

    // Obtener la nota detallada con endpoint
    useEffect(() => {
        if (!isOpen || !documentoAVisualizar || Object.keys(documentoAVisualizar).length === 0) {
            return;
        }

        const fetchNota = async () => {
            try {
                const { succes, status, message, data } = await facturaService.obtenerNotaDetallada(documentoAVisualizar);
                if (succes && status === 200) {
                    setNota(data[0]);
                    return;
                }
                toast.error(message || "Error al obtener el documento");
                closeModal();
            } catch (e) {
                console.error("Error fetching nota:", e);
                toast.error(e.response?.data?.message || "Error al obtener el documento");
                closeModal();
            }
        };

        fetchNota();
    }, [isOpen, documentoAVisualizar]);

    // Se usa un memo para calcular el número de documento solo cuando 'nota' cambia.
    const numeroDoc = useMemo(() => {
        if (!nota) return "";
        const { serie, correlativo } = nota;
        return `${serie ?? ""}-${String(correlativo ?? "").padStart(5, "0")}`;
    }, [nota]);

    if (!isOpen) {
        return null;
    }

    // Si no hay nota, se muestra el esqueleto de carga
    if (!nota) {
        return <DocumentoSkeleton />;
    }

    const {
        empresa_nombre,
        empresa_Ruc,
        empresa_direccion,
        tipo_Doc,
        fecha_Emision,
        cliente_Razon_Social,
        cliente_Direccion,
        cliente_Tipo_Doc,
        cliente_Num_Doc,
        afectado_Num_Doc,
        fecha_Emision_Afectado,
        motivo_Cod,
        motivo_Des,
        detalle_nota_cre_debs,
        tipo_Moneda,
        sub_Total,
        monto_Igv,
        monto_Imp_Venta,
        Observacion,
    } = nota;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-[1px] animate-fade-in"
            onClick={onBackdropClick}
        >
            <div
                role="dialog"
                aria-modal="true"
                className="relative p-1 w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-[95vh] overflow-y-auto animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* X close */}
                <button
                    className="absolute cursor-pointer top-2 right-2 p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label="Cerrar"
                    onClick={closeModal}
                >
                    <X size={20} />
                </button>

                {/* Contenido */}
                <div className="p-6 md:p-8 space-y-6">
                    {/* Header */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6 md:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                            <div className="col-span-2">
                                <h1 className="text-2xl md:text-3xl font-bold text-blue-700">
                                    {empresa_nombre}
                                </h1>
                                <p className="mt-2 text-sm text-gray-700">
                                    {empresa_Ruc}
                                </p>
                                <p className="text-sm text-gray-700">
                                    {empresa_direccion}
                                </p>
                            </div>
                            <div className="md:text-center">
                                <p className="text-lg font-semibold text-gray-700">{getTipoDocLabel(tipo_Doc)}</p>
                                <p className="text-2xl font-extrabold text-gray-700 tracking-wide">{numeroDoc}</p>
                                <p className="mt-4 text-sm text-gray-600">
                                    <span className="font-semibold">Fecha de emisión: </span>
                                    {formatDateTime(fecha_Emision)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Cliente y Documento Afectado */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6">
                        <h3 className="text-sm font-bold text-gray-600 mb-3">
                            DATOS DEL CLIENTE Y DOCUMENTO AFECTADO
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 text-sm text-gray-800">
                            <div className="space-y-1">
                                <div className="grid grid-cols-[140px_1fr] gap-x-2">
                                    <span className="text-gray-700 font-semibold">Razón social:</span>
                                    <span className="font-medium">{cliente_Razon_Social || "—"}</span>
                                </div>
                                <div className="grid grid-cols-[140px_1fr] gap-x-2">
                                    <span className="text-gray-700 font-semibold">Dirección:</span>
                                    <span className="font-medium">{cliente_Direccion || "—"}</span>
                                </div>
                                <div className="grid grid-cols-[140px_1fr] gap-x-2">
                                    <span className="text-gray-700 font-semibold">Tipo doc.:</span>
                                    <span className="font-medium">{getTipoDocCliente(cliente_Tipo_Doc)}</span>
                                </div>
                                <div className="grid grid-cols-[140px_1fr] gap-x-2">
                                    <span className="text-gray-700 font-semibold">Número doc.:</span>
                                    <span className="font-medium">{cliente_Num_Doc || "—"}</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="grid grid-cols-[140px_1fr] gap-x-2">
                                    <span className="text-gray-700 font-semibold">Doc. afectado:</span>
                                    <span className="font-medium">{afectado_Num_Doc || "—"}</span>
                                </div>
                                <div className="grid grid-cols-[140px_1fr] gap-x-2">
                                    <span className="text-gray-700 font-semibold">Fecha emisión:</span>
                                    <span className="font-medium">{formatDateTime(fecha_Emision_Afectado) || "—"}</span>
                                </div>
                                <div className="grid grid-cols-[140px_1fr] gap-x-2">
                                    <span className="text-gray-700 font-semibold">Motivo:</span>
                                    <span className="font-medium">{getMotivoLabel(tipo_Doc, motivo_Cod)}</span>
                                </div>
                                <div className="grid grid-cols-[140px_1fr] gap-x-2">
                                    <span className="text-gray-700 font-semibold">Desc. Motivo:</span>
                                    <span className="font-medium">{motivo_Des || "—"}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabla de items */}
                    <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
                        <div className="bg-gray-100 text-gray-600 text-xs font-semibold uppercase tracking-wide grid grid-cols-12 px-6 py-3">
                            <div className="col-span-2">Código</div>
                            <div className="col-span-3">Descripción</div>
                            <div className="col-span-1 text-right">Cantidad</div>
                            <div className="col-span-1 text-center">Unidad</div>
                            <div className="col-span-2 text-right">Valor Unitario</div>
                            <div className="col-span-1 text-right">IGV</div>
                            <div className="col-span-2 text-right">Monto Precio</div>
                        </div>

                        <div className="divide-y divide-gray-200">
                            {(detalle_nota_cre_debs?.length ? detalle_nota_cre_debs : []).map((it, idx) => (
                                <div key={idx} className="grid grid-cols-12 px-6 py-3 text-sm text-gray-800">
                                    <div className="col-span-2">{it.cod_Producto || "—"}</div>
                                    <div className="col-span-3">{it.descripcion}</div>
                                    <div className="col-span-1 text-right">{Number(it.cantidad ?? 0).toFixed(2)}</div>
                                    <div className="col-span-1 text-center">{it.unidad}</div>
                                    <div className="col-span-2 text-right">{Number(it.monto_Valor_Unitario ?? 0).toFixed(2)}</div>
                                    <div className="col-span-1 text-right">{Number(it.igv ?? 0).toFixed(2)}</div>
                                    <div className="col-span-2 text-right">{Number(it.monto_Precio_Unitario ?? 0).toFixed(2)}</div>
                                </div>
                            ))}
                            {(!detalle_nota_cre_debs || detalle_nota_cre_debs.length === 0) && (
                                <div className="px-6 py-6 text-center text-sm text-gray-500">
                                    No hay productos en el detalle.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Totales */}
                    <div className="flex flex-col items-end">
                        <div className="w-full md:w-1/2 space-y-1 text-sm text-gray-800">
                            <div className="flex justify-between font-semibold">
                                <span>Subtotal:</span>
                                <span>{tipo_Moneda} {Number(sub_Total).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-semibold">
                                <span>IGV (18%):</span>
                                <span>{tipo_Moneda} {Number(monto_Igv).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg text-blue-700 border-t border-gray-300 pt-2">
                                <span>Total:</span>
                                <span>{tipo_Moneda} {Number(monto_Imp_Venta).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Observacion */}
                    {Observacion && (
                        <div className="mt-4 pt-2 border border-gray-200 rounded-md p-4">
                            <h3 className="font-bold text-md mb-2 text-gray-600">Observaciones:</h3>
                            <p className="text-sm text-gray-800">{Observacion}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}