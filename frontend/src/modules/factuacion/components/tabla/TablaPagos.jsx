import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useFacturacion } from "@/context/FacturacionContext";

const TablaPagos = () => {
    const { factura } = useFacturacion();
    const { forma_pago: ListaDePago } = factura;


    console.log("ListaDePago", ListaDePago)
    return (
        <div className="w-full overflow-x-auto mt-6">
            <Table className={"border-2 border-gray-200"}>
                <TableCaption className="text-gray-600 italic mt-2">
                    Lista de Pagos agregados
                </TableCaption>

                <TableHeader className="bg-gray-100 border-b-2 border-gray-400">
                    <TableRow>
                        <TableHead>Monto</TableHead>
                        <TableHead>Cuota</TableHead>
                        <TableHead>Metodo</TableHead>
                        <TableHead>Fecha de Pago</TableHead>

                    </TableRow>
                </TableHeader>

                {ListaDePago.length === 0 ? (
                    <tbody>
                        <tr>
                            <td colSpan={13} className="text-center py-6 text-gray-500 italic">
                                ⚠️ No hay Pagos agregados aún. Agrega uno para comenzar.
                            </td>
                        </tr>
                    </tbody>
                ) : (
                    <TableBody className={"bg-gray-200"}>
                        {ListaDePago.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item.monto || ""}</TableCell>
                                <TableCell>{item.cuota || ""}</TableCell>
                                <TableCell>{item.tipo || ""}</TableCell>
                                <TableCell>{item.fecha_Pago || ""}</TableCell>

                            </TableRow>
                        ))}
                        <TableRow >
                            <TableCell colSpan={2} className="text-right font-bold">
                                TOTAL
                            </TableCell>
                            <TableCell>
                                S/.{" "}
                                {/* {ListaDePago.reduce(
                                    (total, item) => total + item.monto_Valor_Venta,
                                    0
                                )} */}
                            </TableCell>
                            <TableCell colSpan={7} className="text-right font-bold">

                            </TableCell>
                        </TableRow>
                    </TableBody>
                )}
            </Table>
        </div>
    );
};

export default TablaPagos;
