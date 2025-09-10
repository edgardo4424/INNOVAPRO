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

const TablaPagos = ({ open, setOpen }) => {
    const { factura, setFactura, setPagoActual } = useFacturaBoleta();
    const { forma_pago: ListaDePago } = factura;

    const seleccionarPago = async (pago, index) => {
        setPagoActual({ ...pago, index: index });
        setOpen(true);
    }

    const formatearFecha = (fecha) => {
        const fechaDate = new Date(fecha);
        const dia = fechaDate.getDate().toString().padStart(2, '0');
        const mes = (fechaDate.getMonth() + 1).toString().padStart(2, '0');
        const anio = fechaDate.getFullYear();
        return `${anio}/${mes}/${dia}`
    }

    return (
        <div className="w-full overflow-x-auto mt-6">
            <Table className={"border-2 border-gray-200"}>

                <TableHeader className="bg-gray-100 border-b-2 border-gray-400">
                    <TableRow>
                        <TableHead>Cuota</TableHead>
                        <TableHead>Metodo</TableHead>
                        <TableHead>Monto a Pagar</TableHead>
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
                            <TableRow key={index}
                            // onClick={() => seleccionarPago(item, index)}
                            >
                                <TableCell>{item.cuota}</TableCell>
                                <TableCell>{item.tipo}</TableCell>
                                <TableCell>{item.monto}</TableCell>
                                <TableCell>{formatearFecha(item.fecha_Pago)}</TableCell>
                            </TableRow>
                        ))}

                    </TableBody>
                )}
            </Table>
        </div>
    );
};

export default TablaPagos;

