import { BookX, Download, EyeIcon } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const TablaDocumentos = ({ documentos, setIdDocumento, setModalOpen, setModalDescargar, setDocumentoADescargar, setDocumentoAVisualizar, setDocumentoAAnular, setModalAnular }) => {

    // Función para obtener el color del estado
    const getEstadoColor = (estado) => {
        switch (estado) {
            case "EMITIDA":
                return "text-green-600 bg-green-100 border border-green-200";
            case "RECHAZADA":
                return "text-red-600 bg-red-100 border border-red-200";
            case "ANULADA-NOTA":
                return "text-red-600 bg-red-100 border border-red-200";
            case "ANULADA":
                return "text-red-600 bg-red-100 border border-red-200";
            case "MODIFICADA-NOTA":
                return "text-blue-600 bg-blue-100 border border-blue-200";
            case "OBSERVADA":
                return "text-yellow-600 bg-yellow-100 border border-yellow-200";
            case "PENDIENTE":
                return "text-orange-600 bg-orange-100 border border-orange-200";
            default:
                return "text-gray-600 bg-gray-100 border border-gray-200";
        }
    };

    // Función para obtener el texto a mostrar del estado
    const getEstadoTexto = (estado) => {
        switch (estado) {
            case "ANULADA-NOTA":
                return "ANULADA POR NOTA";
            case "MODIFICADA-NOTA":
                return "MODIFICADA POR NOTA";
            default:
                return estado;
        }
    };

    return (
        <div className='w-full border-1 border-gray-200 rounded-xl'>
            <table className="min-w-full bg-white rounded-xl shadow-md overflow-hidden ">
                <thead className="bg-innova-blue text-white">
                    <tr>
                        <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider">Tipo Doc</th>
                        <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider">Serie-Correlativo</th>
                        <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider">Fecha Emision</th>
                        {/* <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider">Empresa RUC</th> */}
                        <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider">Filial</th>
                        <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider">Nro. Doc - Cliente</th>
                        <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider">Monto Imp. Venta</th>
                        <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider">Estado</th>
                        <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {documentos.map((factura, index) => (
                        <tr key={factura.id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} border-b border-gray-200 hover:bg-gray-100 transition-colors`}>
                            <td className="py-3 px-2 text-xs text-gray-700">
                                {factura.tipo_doc == "01" ? "Factura" : "Boleta"}
                            </td>
                            <td className="py-3 px-2 text-xs text-gray-700 font-medium">
                                {`${factura.serie}-${factura.correlativo}`}
                            </td>
                            <td className="py-3 px-6 text-xs text-gray-700">
                                {new Date(factura.fecha_emision).toLocaleDateString("es-PE", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit"
                                })}
                            </td>
                            <td className="py-3 px-2 text-xs text-gray-700">
                                {/* <span>{factura.empresa_ruc || ""} -</span> */}
                                <span>{factura.empresa_nombre || ""}</span>
                            </td>
                            <td className="py-3 px-2 text-xs text-gray-700 flex flex-col">
                                <span>{`${factura.cliente_num_doc || ""} -`}</span>
                                <span>{factura.cliente_razon_social || ""}</span>
                            </td>
                            <td className="py-3 px-2 text-xs text-gray-700 font-medium">
                                {`${factura.tipo_moneda} ${factura.monto_imp_venta}`}
                            </td>
                            <td className="py-3 min-w-[160px]">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getEstadoColor(factura.estado)}`}>
                                    {getEstadoTexto(factura.estado)}
                                </span>
                            </td>
                            <td className="py-3 px-2">
                                <div className="flex justify-start gap-x-2">
                                    <Tooltip side="bottom" align="center" className="mr-2">
                                        <TooltipTrigger asChild>
                                            <button
                                                onClick={() => {
                                                    setIdDocumento(factura.id);
                                                    setModalOpen(true);
                                                    setDocumentoAVisualizar({
                                                        correlativo: String(factura.correlativo),
                                                        serie: factura.serie,
                                                        empresa_ruc: factura.empresa_ruc,
                                                        tipo_doc: factura.tipo_doc
                                                    })
                                                }}
                                                className="hover:bg-blue-100 p-1 rounded transition-colors"
                                            >
                                                <EyeIcon className="h-5 w-5 cursor-pointer text-blue-600 hover:text-blue-800" />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Ver documento</p>
                                        </TooltipContent>
                                    </Tooltip>

                                    <Tooltip side="bottom" align="center" className="mr-2">
                                        <TooltipTrigger asChild>
                                            <button
                                                onClick={() => {
                                                    setIdDocumento(factura.id);
                                                    setModalDescargar(true);
                                                    setDocumentoADescargar({
                                                        serie: factura.serie,
                                                        correlativo: factura.correlativo,
                                                        numRuc: factura.empresa_ruc,
                                                        tipoDoc: factura.tipo_doc,
                                                        numDocumentoComprobante: factura.cliente_num_doc
                                                    });
                                                }}
                                                className="hover:bg-green-100 p-1 rounded transition-colors"
                                            >
                                                <Download className="h-5 w-5 cursor-pointer text-green-600 hover:text-green-800" />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Descargar</p>
                                        </TooltipContent>
                                    </Tooltip>

                                    <Tooltip side="bottom" align="center" className="mr-2">
                                        <TooltipTrigger asChild>
                                            <button
                                                disabled={factura.estado !== "EMITIDA"}
                                                onClick={() => {
                                                    setIdDocumento(factura.id);
                                                    setModalAnular(true);
                                                    setDocumentoAAnular({
                                                        empresa_ruc: factura.empresa_ruc,
                                                        tipo_Doc: factura.tipo_doc,
                                                        serie: factura.serie,
                                                        correlativo: factura.correlativo,
                                                        anulacion_Motivo: "",
                                                        estado_Documento: "0",
                                                    })
                                                }}
                                                className={`${factura.estado !== "EMITIDA" ? "" : "hover:bg-red-100 text-red-500 hover:text-red-700 "}p-1 rounded transition-colors`}
                                            >
                                                <BookX className="h-5 w-5 cursor-pointer" />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            {
                                                factura.estado !== "EMITIDA" ?
                                                    <p>Documento anulado</p>
                                                    :
                                                    <p>Anular</p>
                                            }
                                        </TooltipContent>
                                    </Tooltip>


                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default TablaDocumentos