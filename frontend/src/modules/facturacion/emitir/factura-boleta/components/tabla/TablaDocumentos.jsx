import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useFacturaBoleta } from "@/modules/facturacion/context/FacturaBoletaContext";
import { Trash } from "lucide-react";
const TablaDocumentos = ({ open, setOpen }) => {
    const { factura, setFactura, setPagoActual } = useFacturaBoleta();

    const { relDocs: listaDeDocumentos } = factura;

    const eliminarDocumento = (index) => {
        const nuevosDocumentos = [...factura.relDocs];
        nuevosDocumentos.splice(index, 1);
        setFactura({ ...factura, relDocs: nuevosDocumentos });

    }
    return (
        <div >
            <Table className={"border-2 border-gray-200"}>
                <TableHeader className="bg-gray-100 border-b-2 border-gray-400">
                    <TableRow>
                        <TableHead>Tipo de Documento</TableHead>
                        <TableHead>Nro. Documento</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>

                {listaDeDocumentos.length === 0 ? (
                    <tbody>
                        <tr>
                            <td colSpan={2} className="text-center py-6 text-gray-500 italic">
                                No se encontraron documentos
                            </td>
                        </tr>
                    </tbody>
                    ) : (
                    <TableBody className={"bg-gray-100"}>
                        {listaDeDocumentos.map((item, index) => (
                            <TableRow key={index}
                                onClick={() => seleccionarPago(item)}
                            >
                                <TableCell>{item.tipoDoc == "09" ? "Guia de Remision" : "-"}</TableCell>
                                <TableCell>{item.nroDoc}</TableCell>
                                <TableCell className={"cursor-pointer text-red-500 hover:text-red-600"} onClick={() => eliminarDocumento(index)}><Trash /></TableCell>
                            </TableRow>
                        ))}

                    </TableBody>
                )}
            </Table>
        </div>
    )
}

export default TablaDocumentos
