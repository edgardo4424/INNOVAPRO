import { Download, EllipsisVertical, EyeIcon } from 'lucide-react';
import React from 'react'

const TablaDocumentos = ({ documentos, setIdDocumento, setModalOpen, setModalDescargar, setDocumentoADescargar, setDocumentoAVisualizar, setDocumentoOpciones }) => {
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
                        {/* <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider">Valor Venta</th> */}
                        {/* <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider">Sub Total</th> */}
                        <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider">Monto Imp. Venta</th>
                        <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider">Estado</th>
                        <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {documentos.map((factura, index) => (
                        <tr key={factura.id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} border-b border-gray-200`}>
                            <td className="py-3 px-6 text-xs text-gray-700">{factura.tipo_doc == "01" ? "Factura" : "Boleta"}</td>
                            <td className="py-3 px-6 text-xs text-gray-700">{`${factura.serie}-${factura.correlativo}`}</td>
                            <td className="py-3 px-6 text-xs text-gray-700">
                                {new Date(factura.fecha_emision).toLocaleDateString("es-PE", { year: "numeric", month: "2-digit", day: "2-digit" })}
                            </td>
                            <td className="py-3 px-6 text-xs text-gray-700">{factura.empresa_ruc}</td>
                            <td className="py-3 px-6 text-xs text-gray-700">
                                {factura.cliente_num_doc
                                    ? `${factura.cliente_num_doc} - ${factura.cliente_razon_social}`
                                    : factura.cliente_razon_social}
                            </td>
                            {/* <td className="py-3 px-6 text-xs text-gray-700 font-medium">{`${factura.tipo_moneda} ${factura.valor_venta}`}</td> */}
                            {/* <td className="py-3 px-6 text-xs text-gray-700 font-medium">{`${factura.tipo_moneda} ${factura.sub_total}`}</td> */}
                            <td className="py-3 px-6 text-xs text-gray-700 font-medium">{`${factura.tipo_moneda} ${factura.monto_imp_venta}`}</td>
                            <td className={`py-3 px-6 text-sm font-semibold ${factura.estado === "RECHAZADA" ? "text-red-500" : "text-green-500"} `}>
                                {factura.estado}
                            </td>
                            <td className="py-3 px-6">
                                <div className="flex justify-start gap-x-2">
                                    <button onClick={() => { setIdDocumento(factura.id); setModalOpen(true); setDocumentoAVisualizar({ correlativo: String(factura.correlativo), serie: factura.serie, empresa_ruc: factura.empresa_ruc, tipo_doc: factura.tipo_doc }) }}>
                                        <EyeIcon className="h-5 w-5 cursor-pointer hover:text-blue-500" />
                                    </button>
                                    <button onClick={() => { setIdDocumento(factura.id); setModalDescargar(true); setDocumentoADescargar({ serie: factura.serie, correlativo: factura.correlativo, numRuc: factura.empresa_ruc, tipoDoc: factura.tipo_doc, numDocumentoComprobante: factura.cliente_num_doc }); }}>
                                        <Download className="h-5 w-5 cursor-pointer hover:text-green-500" />
                                    </button>
                                    <button onClick={()=>{setIdDocumento(factura.id); setDocumentoOpciones(true) }}>
                                        <EllipsisVertical className="h-5 w-5 cursor-pointer hover:text-yellow-500" />
                                    </button>
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
