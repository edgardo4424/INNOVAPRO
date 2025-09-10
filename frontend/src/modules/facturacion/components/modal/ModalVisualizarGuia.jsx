import { X } from "lucide-react";
import { Fragment, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import DocumentoSkeleton from "../../bandeja/list-factura-boleta/components/DocumentoSkeleton";
import facturaService from "../../service/FacturaService";

export default function ModalVisualizarGuia({
    setModalOpen,
    documentoAVisualizar,
    setDocumentoAVisualizar,
}) {
    const [guia, setGuia] = useState(null);
    const [isOpen, setIsOpen] = useState(true);

    // Helpers
    const closeModal = () => {
        setIsOpen(false);
        setModalOpen?.(false);
        setDocumentoAVisualizar?.({});
    };

    const onBackdropClick = (e) => {
        if (e.target === e.currentTarget) closeModal();
    };

    const formatDateTime = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        if (isNaN(d)) return dateStr;
        return d.toLocaleString("es-PE", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    const tipoDocLabel = (code) => {
        switch (code) {
            case "09":
                return "GUÍA DE REMISIÓN REMITENTE";
            default:
                return "DOCUMENTO ELECTRÓNICO";
        }
    };

    const tipoDocCliente = (code) => {
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

    const tipoTrasladoLabel = (code) => {
        switch (code) {
            case "01":
                return "VENTA";
            case "02":
                return "VENTA SUJETA A CONFIRMACIÓN DEL COMPRADOR";
            case "03":
                return "COMPRA";
            case "04":
                return "TRASLADO ENTRE ESTABLECIMIENTOS DE LA MISMA EMPRESA";
            case "05":
                return "TRASLADO POR EMISIÓN DE COMPROBANTE DE PAGO";
            case "06":
                return "TRASLADO DE BIENES PARA TRANSFORMACIÓN";
            case "07":
                return "RECOJO DE BIENES";
            case "08":
                return "TRASLADO POR VENTA CON ENTREGA EN VÍA PÚBLICA";
            case "09":
                return "TRASLADO DE BIENES INTERNA";
            case "10":
                return "EXPORTACIÓN";
            default:
                return code;
        }
    };

    const modalidadTrasladoLabel = (code) => {
        switch (code) {
            case "01":
                return "TRANSPORTE PÚBLICO";
            case "02":
                return "TRANSPORTE PRIVADO";
            default:
                return code;
        }
    };

    // ** METODO VISUALIZAR DOCUMENTO CON ENDPOINT DE INNOVA
    useEffect(() => {
        if (!isOpen || !documentoAVisualizar) return;

        (async () => {
            try {
                const { succes, status, message, data } = await facturaService.obtenerGuiaDetallada(documentoAVisualizar);
                console.log(data);
                if (succes && status === 200) {
                    console.log("data", data[0]);
                    setGuia(data[0]);
                    return;
                }
            } catch (e) {
                console.log(e);
                toast.error(e.response.data.message || "Error al obtener el documento");
                closeModal();
            }
        })();
    }, [isOpen, documentoAVisualizar]);

    const numeroDoc = useMemo(() => {
        if (!guia) return "";
        return `${guia.serie ?? ""}-${String(guia.correlativo ?? "").padStart(1, "0")}`;
    }, [guia]);

    if (!isOpen) return null;

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
                <div className="p-6 md:p-8 ">
                    {!guia ? (
                        <DocumentoSkeleton />
                    ) : (
                        <div className="space-y-6">
                            {/* Header */}
                            <div className="rounded-xl border border-gray-200 bg-white">
                                <div className="px-6 py-6 md:py-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                                    <div className="col-span-2">
                                        <h1 className="text-2xl md:text-3xl font-bold text-blue-700">
                                            {guia.empresa_nombre}
                                        </h1>
                                        <p className="mt-2 text-sm text-gray-700">
                                            RUC: {guia.empresa_Ruc}
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            {guia.empresa_direccion}
                                        </p>
                                    </div>
                                    <div className="md:text-center">
                                        <p className="text-lg font-semibold text-gray-700">
                                            {tipoDocLabel(guia.tipo_Doc)}
                                        </p>
                                        <p className="text-2xl font-extrabold text-gray-700 tracking-wide">
                                            {numeroDoc}
                                        </p>
                                        <p className="mt-4 text-sm text-gray-600">
                                            <span className="font-semibold">Fecha de emisión: </span>
                                            {formatDateTime(guia.fecha_Emision)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Cliente */}
                            <div className="rounded-xl border border-gray-200 bg-white p-6">
                                <h3 className="text-sm font-bold text-gray-600 mb-3">
                                    DATOS DEL CLIENTE
                                </h3>
                                <div className="text-sm text-gray-800 space-y-1">
                                    <div className="grid grid-cols-[110px_1fr] gap-x-2">
                                        <span className="text-gray-700 font-semibold">Razón social:</span>
                                        <span className="font-medium">
                                            {guia.cliente_Razon_Social || "—"}
                                        </span>
                                        <span className="text-gray-700 font-semibold">Dirección:</span>
                                        <span className="font-medium">
                                            {guia.cliente_Direccion || "—"}
                                        </span>
                                        <span className="text-gray-700 font-semibold">Tipo doc.:</span>
                                        <span className="font-medium">
                                            {tipoDocCliente(guia.cliente_Tipo_Doc)}
                                        </span>
                                        <span className="text-gray-700 font-semibold">Número doc.:</span>
                                        <span className="font-medium">
                                            {guia.cliente_Num_Doc || "—"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Datos de la Guía de Remisión */}
                            <div className="rounded-xl border border-gray-200 bg-white p-6">
                                <h3 className="text-sm font-bold text-gray-600 mb-3">
                                    DATOS DE ENVÍO
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 text-sm text-gray-800">
                                    <div className="space-y-1">
                                        <div className="grid grid-cols-[140px_1fr] gap-x-2">
                                            <span className="text-gray-700 font-semibold">Fecha de traslado:</span>
                                            <span className="font-medium">{formatDateTime(guia.guia_Envio_Fec_Traslado)}</span>
                                        </div>
                                        <div className="grid grid-cols-[140px_1fr] gap-x-2">
                                            <span className="text-gray-700 font-semibold">Modalidad de traslado:</span>
                                            <span className="font-medium">{modalidadTrasladoLabel(guia.guia_Envio_Mod_Traslado)}</span>
                                        </div>
                                        <div className="grid grid-cols-[140px_1fr] gap-x-2">
                                            <span className="text-gray-700 font-semibold">Motivo de traslado:</span>
                                            <span className="font-medium">{tipoTrasladoLabel(guia.guia_Envio_Cod_Traslado)}</span>
                                        </div>
                                        <div className="grid grid-cols-[140px_1fr] gap-x-2">
                                            <span className="text-gray-700 font-semibold">Peso total:</span>
                                            <span className="font-medium">{guia.guia_Envio_Peso_Total} {guia.guia_Envio_Und_Peso_Total}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="grid grid-cols-[140px_1fr] gap-x-2">
                                            <span className="text-gray-700 font-semibold">Punto de partida:</span>
                                            <span className="font-medium">{guia.guia_Envio_Partida_Direccion}</span>
                                        </div>
                                        <div className="grid grid-cols-[140px_1fr] gap-x-2">
                                            <span className="text-gray-700 font-semibold">Punto de llegada:</span>
                                            <span className="font-medium">{guia.guia_Envio_Llegada_Direccion}</span>
                                        </div>
                                        <div className="grid grid-cols-[140px_1fr] gap-x-2">
                                            <span className="text-gray-700 font-semibold">Placa de vehículo:</span>
                                            <span className="font-medium">{guia.guia_Envio_Vehiculo_Placa || "—"}</span>
                                        </div>
                                        {(guia.guia_choferes && guia.guia_choferes.length > 0) ||
                                            (guia.guia_transportista && Object.keys(guia.guia_transportista).length > 0) ? (
                                            <Fragment>
                                                {guia.guia_choferes && guia.guia_choferes.length > 0 && (
                                                    guia.guia_choferes.map((chofer, index) => (
                                                        <Fragment key={index}>
                                                            <div className="grid grid-cols-[140px_1fr] gap-x-2">
                                                                <span className="text-gray-700 font-semibold">{chofer.nro_mtc ? 'Transportista' : 'Chofer'}:</span>
                                                                <p className="font-medium grid grid-cols-1 ">
                                                                    {chofer.nombres && <span>{chofer.nombres} {chofer.apellidos}</span>}
                                                                    {chofer.razon_Social && <span> {chofer.razon_Social}-{chofer.nro_doc}</span>}
                                                                    {chofer.nro_doc && !chofer.razon_Social && <span> ({chofer.nro_doc})</span>}
                                                                    {chofer.nro_mtc && <span> (MTC {chofer.nro_mtc})</span>}
                                                                </p>
                                                            </div>
                                                        </Fragment>
                                                    ))
                                                )}
                                                {guia.guia_transportista && Object.keys(guia.guia_transportista).length > 0 && (
                                                    <div className="grid grid-cols-[140px_1fr] gap-x-2">
                                                        <span className="text-gray-700 font-semibold">Transportista:</span>
                                                        <span className="font-medium">{guia.guia_transportista.Razon_Social} ({guia.guia_transportista.Num_Doc})</span>
                                                    </div>
                                                )}
                                            </Fragment>
                                        ) : (
                                            <div className="grid grid-cols-[140px_1fr] gap-x-2">
                                                <span className="text-gray-700 font-semibold">Transportista/Chofer:</span>
                                                <span className="font-medium">—</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>


                            {/* Tabla de items */}
                            <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
                                <div className="bg-gray-100 text-gray-600 text-xs font-semibold uppercase tracking-wide grid grid-cols-12 px-6 py-3">
                                    <div className="col-span-2">Código</div>
                                    <div className="col-span-7">Producto</div>
                                    <div className="col-span-1 text-right">Cantidad</div>
                                    <div className="col-span-2 text-right">Unidad</div>
                                </div>

                                <div className="divide-y divide-gray-200">
                                    {(guia.guia_detalles?.length ? guia.guia_detalles : []).map(
                                        (it, idx) => {
                                            const { cod_Producto, descripcion, cantidad, unidad } = it;

                                            return (
                                                <div
                                                    key={idx}
                                                    className="grid grid-cols-12 px-6 py-3 text-sm text-gray-800"
                                                >
                                                    <div className="col-span-2">{cod_Producto || "—"}</div>
                                                    <div className="col-span-7">{descripcion}</div>
                                                    <div className="col-span-1 text-right">
                                                        {Number(cantidad ?? 0).toFixed(2)}
                                                    </div>
                                                    <div className="col-span-2 text-right font-medium">
                                                        {unidad}
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}

                                    {!guia.guia_detalles?.length && (
                                        <div className="px-6 py-6 text-center text-sm text-gray-500">
                                            No hay productos en el detalle.
                                        </div>
                                    )}
                                </div>

                            </div>

                            {/* Observacion */}
                            {
                                guia.observacion && (
                                    <div className="mt-4 pt-2 border border-gray-200 rounded-md p-4">
                                        <h3 className="font-bold text-md mb-2 text-gray-600">Observaciones:</h3>
                                        <p className="text-sm text-gray-800">{guia.observacion}</p>
                                    </div>
                                )
                            }
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}