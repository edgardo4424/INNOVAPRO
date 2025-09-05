import { useNota } from "@/modules/facturacion/context/NotaContext";
import { Eye, X, FileText, User, Tag, Banknote, Building2, ReceiptText } from "lucide-react";
import { useState } from "react";
import EnviarNota from "../EnviarNota";

const codigosMotivoCredito = [
    { value: "01", label: "01 - Anulación de la operación", descripcion: "ANULACION DE OPERACION" },
    { value: "02", label: "02 - Anulación por error en el RUC", descripcion: "ANULACION POR ERROR EN EL RUC" },
    { value: "03", label: "03 - Corrección por error en la descripción", descripcion: "CORRECCION POR ERROR EN LA DESCRIPCION" },
    { value: "04", label: "04 - Descuento global", descripcion: "DESCUENTO GLOBAL" },
    { value: "05", label: "05 - Descuento por ítem", descripcion: "DESCUENTO POR ITEM" },
    { value: "06", label: "06 - Devolución total", descripcion: "DEVOLUCION TOTAL" },
    { value: "07", label: "07 - Devolución por ítem", descripcion: "DEVOLUCION POR ITEM" },
    // { value: "08", label: "08 - Bonificación" },
    // { value: "09", label: "09 - Disminución en el valor" },
    { value: "10", label: "10 - Otros Conceptos", descripcion: "OTROS CONCEPTOS" },
];

const codigosMotivosDebito = [
    { value: "01", label: "01 - Intereses por mora", descripcion: "INTERESES POR MORAS" },
    { value: "02", label: "02 - Aumento en el valor", descripcion: "AUMENTO EN EL VALOR" },
    { value: "03", label: "03 - Penalidades/ otros conceptos", descripcion: "PENALIDADES/ OTROS CONCEPTOS" },
]


const tipoDocumentoCliente = {
    "1": "DNI",
    "6": "RUC",
    "7": "Pasaporte",
    "A": "Cédula diplomática de identidad"
    // Puedes agregar más códigos si los necesitas
};

const tipoOperacion = {
    "0101": "Venta Interna",
    "1001": "Operaciones Gravadas",
    "0104": "Venta Interna – Anticipos",
    "0105": "Venta Itinerante",
    // Agrega los demás valores del SelectContent aquí si es necesario
};

export default function ModalEmitirNota() {

    const [open, setOpen] = useState(false);

    const [isOpen, setIsOpen] = useState(false);
    const { notaCreditoDebito, filiales } = useNota();

    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const onBackdropClick = (e) => {
        if (e.target === e.currentTarget) closeModal();
    };

    const getMotivoLabel = (motivo_Cod, tipo_Doc) => {
        if (tipo_Doc === "07") {
            const motivoCredito = codigosMotivoCredito.find((motivoCredito) => motivoCredito.value === motivo_Cod);
            return motivoCredito ? motivoCredito.descripcion : "Desconocido";
        } else {
            const motivoDebito = codigosMotivosDebito.find((motivoDebito) => motivoDebito.value === motivo_Cod);
            return motivoDebito ? motivoDebito.descripcion : "Desconocido";
        }
    };

    const getTipoDocClienteLabel = (codigo) => {
        return tipoDocumentoCliente[codigo] || "Desconocido";
    };

    const getTipoOperacionLabel = (codigo) => {
        return tipoOperacion[codigo] || "Desconocido";
    };

    const isNotaDebito = notaCreditoDebito.tipo_Doc === "03";
    const tipoNota = isNotaDebito ? "Débito" : "Crédito";

    const filialActual = filiales.find((filial) => filial.ruc === notaCreditoDebito.empresa_Ruc);
    const nombreEmpresa = filialActual ? filialActual.razon_social : "Empresa Desconocida";

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
            minimumFractionDigits: 2,
        }).format(amount);
    };


    const getTipoDocumentoLabel = (codigo) => {
        switch (codigo) {
            case "01":
                return "Factura";
            case "03":
                return "Boleta";
            case "09":
                return "Guía de Remisión";
            case "07":
                return "Nota de Débito";
            case "03":
                return "Nota de Crédito";
            default:
                return "Desconocido";
        }
    };

    return (
        <div>
            {/* Botón para abrir el modal */}
            <button
                type="button"
                onClick={openModal}
                className="py-3 px-6 rounded-lg bg-green-600 text-white font-semibold text-lg hover:bg-green-700 transition duration-300 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 flex gap-x-2 items-center justify-center"
            >
                <Eye size={24} />
                <span className="hidden md:block">Previsualizar Nota</span>
            </button>

            {/* Modal */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
                    onClick={onBackdropClick}
                >
                    <div
                        className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-gray-100 max-h-[95vh] overflow-y-auto animate-scale-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Botón de cerrar */}
                        <button
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 focus:outline-none"
                            onClick={closeModal}
                            aria-label="Cerrar modal"
                        >
                            <X size={24} />
                        </button>

                        <div className="p-6 md:p-10">
                            {/* Cabecera del Documento */}
                            <div className="flex flex-col md:flex-row md:items-start justify-between pb-6 mb-6 border-b border-gray-200">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <Building2 size={32} className="text-gray-600" />
                                        <h3 className="text-xl font-bold text-gray-800">{nombreEmpresa}</h3>
                                    </div>
                                    <p className="text-gray-500">RUC: {notaCreditoDebito.empresa_Ruc}</p>
                                </div>
                                <div className="mt-4 md:mt-0 text-left md:text-right">
                                    <div className="flex items-center gap-2 mb-2">
                                        <ReceiptText size={28} className="text-indigo-600" />
                                        <span className="text-2xl font-extrabold text-indigo-700">NOTA DE {tipoNota.toUpperCase()}</span>
                                    </div>
                                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${isNotaDebito ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                        {isNotaDebito ? 'Nota de Débito' : 'Nota de Crédito'}
                                    </span>
                                </div>
                            </div>

                            {/* Contenido principal - Grilla */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Sección de Comprobantes Relacionados */}
                                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
                                    <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2"><Tag size={20} className="text-blue-500" />Datos Relacionados</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="font-semibold text-gray-600">Comprobante Afectado:</p>
                                            <p className="text-gray-800">{`${getTipoDocumentoLabel(notaCreditoDebito.afectado_Tipo_Doc)} - ${notaCreditoDebito.afectado_Num_Doc}`}</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-600">Cliente:</p>
                                            <p className="text-gray-800">{`${getTipoDocClienteLabel(notaCreditoDebito.cliente_Tipo_Doc)} - ${notaCreditoDebito.cliente_Num_Doc}`}</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-600">Tipo de Operación:</p>
                                            <p className="text-gray-800">{getTipoOperacionLabel(notaCreditoDebito.tipo_Operacion)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Sección de Detalles de la Nota */}
                                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
                                    <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2"><FileText size={20} className="text-green-500" />Detalles de la Nota</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="font-semibold text-gray-600">Motivo:</p>
                                            <p className="text-gray-800">{getMotivoLabel(notaCreditoDebito.motivo_Cod, notaCreditoDebito.tipo_Doc)}</p>
                                        </div>
                                        {/* <div>
                                            <p className="font-semibold text-gray-600">Descripción Motivo:</p>
                                            <p className="text-gray-800 italic">{notaCreditoDebito.motivo_Des || "Sin observaciones adicionales."}</p>
                                        </div> */}
                                        <div>
                                            <p className="font-semibold text-gray-600">Observación:</p>
                                            <p className="text-gray-800 italic">{notaCreditoDebito.Observacion || "Sin observaciones adicionales."}</p>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                            <p className="font-semibold text-gray-600">Total:</p>
                                            <p className="text-2xl font-extrabold text-indigo-700">{formatCurrency(notaCreditoDebito.monto_Imp_Venta)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* --- End Invoice Detail --- */}
                            <div className="w-full flex justify-end pt-5">
                                <EnviarNota open={open} setOpen={setOpen} ClosePreviu={closeModal} />

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}