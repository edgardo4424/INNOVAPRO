import { Download, EllipsisVertical, EyeIcon } from 'lucide-react';

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

const TablaNotas = ({ documentos, setIdDocumento, setModalOpen, setModalDescargar, setDocumentoADescargar, setDocumentoAVisualizar, setDocumentoOpciones }) => {

    const obtenerDescripcionMotivo = (motivo_Cod, tipo_Doc) => {
        if (tipo_Doc === "07") {
            const motivoCredito = codigosMotivoCredito.find((motivoCredito) => motivoCredito.value === motivo_Cod);
            return motivoCredito ? motivoCredito.descripcion : "Desconocido";
        } else {
            const motivoDebito = codigosMotivosDebito.find((motivoDebito) => motivoDebito.value === motivo_Cod);
            return motivoDebito ? motivoDebito.descripcion : "Desconocido";
        }
    }

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
                            <td className="py-3 px-6">
                                <div className="flex justify-start gap-x-2">
                                    <button onClick={() => { setIdDocumento(nota.id); setModalOpen(true); setDocumentoAVisualizar({ correlativo: String(nota.correlativo), serie: nota.serie, empresa_ruc: nota.empresa_Ruc, tipo_doc: nota.tipo_Doc }) }}>
                                        <EyeIcon className="h-5 w-5 cursor-pointer text-blue-600 hover:text-blue-800" />
                                    </button>
                                    <button onClick={() => {
                                        setIdDocumento(nota.id);
                                        setModalDescargar(true);
                                        setDocumentoADescargar({
                                            serie: nota.serie,
                                            correlativo: nota.correlativo,
                                            numRuc: nota.empresa_Ruc,
                                            tipoDoc: nota.tipo_Doc,
                                            numDocumentoComprobante: nota.cliente_num_doc
                                        });
                                    }}>
                                        <Download className="h-5 w-5 cursor-pointer text-green-600 hover:text-green-800" />
                                    </button>
                                    <button onClick={() => { setIdDocumento(nota.id); setDocumentoOpciones(true) }}>
                                        <EllipsisVertical className="h-5 w-5 cursor-pointer text-yellow-600 hover:text-yellow-800" />
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

export default TablaNotas
