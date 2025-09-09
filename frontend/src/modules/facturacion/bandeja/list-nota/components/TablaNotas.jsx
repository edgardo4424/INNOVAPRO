import { Download, EyeIcon, FileText } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

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

const TablaNotas = ({ documentos, setIdDocumento, setModalOpen, setModalDescargar, setDocumentoADescargar, setDocumentoAVisualizar, setDocumentoAAnular, setModalAnular, setModalVisualizarAfectado, setDocumentoAfectadoVisualizar }) => {

    const obtenerDescripcionMotivo = (motivo_Cod, tipo_Doc) => {
        if (tipo_Doc === "07") {
            const motivoCredito = codigosMotivoCredito.find((motivoCredito) => motivoCredito.value === motivo_Cod);
            return motivoCredito ? motivoCredito.descripcion : "Desconocido";
        } else {
            const motivoDebito = codigosMotivosDebito.find((motivoDebito) => motivoDebito.value === motivo_Cod);
            return motivoDebito ? motivoDebito.descripcion : "Desconocido";
        }
    }

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
                        <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider">Empresa RUC</th>
                        <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider">Nro. Doc - Cliente</th>
                        <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider">Montivo</th>
                        <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider">Estado</th>
                        <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {documentos.map((nota, index) => (
                        <tr key={nota.id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} border-b border-gray-200`}>
                            <td className="py-3 px-6 text-xs text-gray-700">{nota.tipo_Doc == "07" ? "Credito" : "Debito"}</td>
                            <td className="py-3 px-6 text-xs text-gray-700">{`${nota.serie}-${nota.correlativo}`}</td>
                            <td className="py-3 px-6 text-xs text-gray-700">
                                {new Date(nota.fecha_Emision).toLocaleDateString("es-PE", { year: "numeric", month: "2-digit", day: "2-digit" })}
                            </td>
                            <td className="py-3 px-6 text-xs text-gray-700">{nota.empresa_Ruc}</td>
                            <td className="py-3 px-6 text-xs text-gray-700">
                                {nota.cliente_Num_Doc
                                    ? `${nota.cliente_Num_Doc} - ${nota.cliente_Razon_Social}`
                                    : nota.cliente_Razon_Social}
                            </td>
                            <td className="py-3 px-6 text-xs text-gray-700 font-medium">{obtenerDescripcionMotivo(nota.motivo_Cod, nota.tipo_Doc)}</td>
                            <td className="py-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getEstadoColor(nota.estado)}`}>
                                    {getEstadoTexto(nota.estado)}
                                </span>
                            </td>
                            <td className="py-3 px-6">
                                <div className="flex justify-start gap-x-2">
                                    <Tooltip side="bottom" align="center" className="mr-2">
                                        <TooltipTrigger asChild>
                                            <button
                                                onClick={() => {
                                                    setIdDocumento(nota.id);
                                                    setModalOpen(true);
                                                    setDocumentoAVisualizar({
                                                        correlativo: String(nota.correlativo),
                                                        serie: nota.serie,
                                                        empresa_ruc: nota.empresa_Ruc,
                                                        tipo_doc: nota.tipo_Doc
                                                    });
                                                }}
                                                className="hover:bg-blue-100 p-1 rounded transition-colors"
                                            >
                                                <EyeIcon className="h-5 w-5 cursor-pointer text-blue-600 hover:text-blue-800" />
                                            </button>

                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Ver nota</p>
                                        </TooltipContent>
                                    </Tooltip>

                                    <Tooltip side="bottom" align="center" className="mr-2">
                                        <TooltipTrigger asChild>
                                            <button onClick={() => {
                                                setIdDocumento(nota.id);
                                                setModalDescargar(true);
                                                setDocumentoADescargar({
                                                    serie: nota.serie,
                                                    correlativo: nota.correlativo,
                                                    numRuc: nota.empresa_Ruc,
                                                    tipoDoc: nota.tipo_Doc,
                                                    numDocumentoComprobante: nota.cliente_Num_Doc
                                                });
                                            }}>
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
                                                onClick={() => {
                                                    setIdDocumento(nota.id);
                                                    setModalVisualizarAfectado(true);
                                                    const [serie, correlativo] = nota.afectado_Num_Doc.split("-");
                                                    setDocumentoAfectadoVisualizar({
                                                        serie: serie,
                                                        correlativo: correlativo,
                                                        empresa_ruc: nota.empresa_Ruc,
                                                        tipo_doc: nota.afectado_Tipo_Doc,
                                                    });
                                                }}
                                                className="hover:bg-yellow-100 p-1 rounded transition-colors"
                                            >
                                                <FileText className="h-5 w-5 cursor-pointer text-yellow-600 hover:text-yellow-700" />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Ver documento</p>
                                        </TooltipContent>
                                    </Tooltip>

                                    {/* <Tooltip side="bottom" align="center" className="mr-2">
                                        <TooltipTrigger asChild>
                                            <button
                                                disabled={nota.estado == "ANULADA"}
                                                onClick={() => {
                                                    setIdDocumento(nota.id);
                                                    setModalAnular(true);
                                                    setDocumentoAAnular({
                                                        empresa_ruc: nota.empresa_Ruc,
                                                        tipo_Doc: nota.tipo_Doc,
                                                        serie: nota.serie,
                                                        correlativo: nota.correlativo,
                                                        anulacion_Motivo: "",
                                                        estado_Documento: "0",
                                                    })
                                                }}
                                                className={`${nota.estado == "ANULADA" || nota.estado == "ANULADA-NOTA" ? "" : "hover:bg-red-100 text-red-500 hover:text-red-700 "}p-1 rounded transition-colors`}
                                                title="Más opciones"
                                            >
                                                <BookX className="h-5 w-5 cursor-pointer" />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Ver documento</p>
                                        </TooltipContent>
                                    </Tooltip> */}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default TablaNotas
