import { Download, EyeIcon } from 'lucide-react';
import React from 'react'

const TablaGuias = ({ documentos, setIdDocumento, setModalOpen, setDocumentoAVisualizar, setModalDescargar, setGuiaADescargar }) => {

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
        <table className="min-w-full bg-white rounded-xl shadow-md overflow-hidden">
            <thead className="bg-innova-blue text-white">
                <tr>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider">ID</th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider">Tipo Doc</th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider">Serie-Correlativo</th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider">Fecha Emision</th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider">Empresa RUC</th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider">Nro. Doc - Cliente</th>
                    {/* <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider">Usuario</th> */}
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider">Estado</th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {documentos.map((guia, index) => (
                    <tr key={guia.id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} border-b border-gray-200`}>
                        <td className="py-3 px-6 text-xs text-gray-700">{guia.id}</td>
                        <td className="py-3 px-6 text-xs text-gray-700">{guia.tipo_doc}</td>
                        <td className="py-3 px-6 text-xs text-gray-700">{`${guia.serie}-${guia.correlativo}`}</td>
                        <td className="py-3 px-6 text-xs text-gray-700">
                            {new Date(guia.fecha_emision).toLocaleDateString("es-PE", { year: "numeric", month: "2-digit", day: "2-digit" })}
                        </td>
                        <td className="py-3 px-6 text-xs text-gray-700">{guia.empresa_ruc}</td>
                        <td className="py-3 px-6 text-xs text-gray-700">
                            {guia.cliente_num_doc
                                ? `${guia.cliente_num_doc} - ${guia.cliente_razon_social}`
                                : guia.cliente_razon_social}
                        </td>
                        {/* <td className="py-3 px-6 text-xs text-gray-700">{factura.usuario_id}</td> */}
                        <td className="py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getEstadoColor(guia.estado)}`}>
                                {getEstadoTexto(guia.estado)}
                            </span>
                        </td>
                        <td className="py-3 px-6">
                            <div className="flex justify-start gap-x-2">
                                <button onClick={() => { setIdDocumento(guia.id); setModalOpen(true); setDocumentoAVisualizar({ correlativo: String(guia.correlativo), serie: guia.serie, empresa_ruc: guia.empresa_ruc, tipo_doc: guia.tipo_doc }) }}>
                                    <EyeIcon className="h-5 w-5 cursor-pointer text-blue-600 hover:text-blue-800" />
                                </button>
                                <button
                                    onClick={() => {
                                        setIdDocumento(guia.id);
                                        setModalDescargar(true);
                                        setGuiaADescargar({
                                            serie: guia.serie,
                                            correlativo: guia.correlativo,
                                            numRuc: guia.empresa_ruc,
                                            tipoDoc: guia.tipo_doc,
                                            numDocumentoComprobante: guia.cliente_num_doc
                                        });
                                    }}>
                                    <Download className="h-5 w-5 cursor-pointer text-green-600 hover:text-green-800" />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default TablaGuias

