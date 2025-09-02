import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useNota } from "@/modules/facturacion/context/NotaContext";
import MontosDetallado from "../MontosDetallado";

const TablaProductos = ({ setOpen }) => {

    const { notaCreditoDebito, setNotaCreditoDebito, filiales } = useNota();


    return (
        <div className="w-full overflow-x-auto mt-6">
            <Table className={"border-2 border-gray-200"}>
                <TableCaption className="text-gray-600 italic mt-2">
                    Lista de productos agregados
                </TableCaption>

                <TableHeader className="bg-gray-100 border-b-2 border-gray-400">
                    <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Código</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead>Unidad</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Valor Unitario</TableHead>
                        <TableHead>Precio Unitario</TableHead>
                        <TableHead>Valor de Venta</TableHead>

                        <TableHead>% IGV</TableHead>
                        <TableHead>IGV</TableHead>
                        <TableHead>Base IGV</TableHead>
                        <TableHead>Tip. Afección IGV</TableHead>
                        <TableHead>Total Impuestos</TableHead>

                        <TableHead className={"w-min-[100px]"}>Factor ICBPER</TableHead>
                    </TableRow>
                </TableHeader>
                {notaCreditoDebito.detalle.length === 0 ? (
                    <tbody>
                        <tr>
                            <td
                                colSpan={13}
                                className="text-center py-6 text-gray-500 italic"
                            >
                                ⚠️ No hay productos agregados aún. Agrega uno para comenzar.
                            </td>
                        </tr>
                    </tbody>
                ) : (
                    <TableBody className={"bg-gray-200 "}>
                        {notaCreditoDebito.detalle.map((producto, index) => (
                            <TableRow
                                key={index}
                                className={"cursor-pointer hover:bg-gray-100"}
                                onClick={() => seleccionarProducto(producto, index)}
                            >
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{producto.cod_Producto || ""}</TableCell>
                                <TableCell class="min-w-[400px]">
                                    {producto.descripcion || ""}
                                </TableCell>
                                <TableCell>{producto.unidad || ""}</TableCell>
                                <TableCell>{producto.cantidad ?? ""}</TableCell>

                                <TableCell>S/. {producto.monto_Valor_Unitario ?? 0}</TableCell>
                                <TableCell>S/. {producto.monto_Precio_Unitario ?? 0}</TableCell>
                                <TableCell>S/. {producto.monto_Valor_Venta ?? 0}</TableCell>

                                <TableCell>{producto.porcentaje_Igv ?? ""}%</TableCell>
                                <TableCell>S/. {producto.igv ?? 0}</TableCell>
                                <TableCell>S/. {producto.monto_Base_Igv ?? 0}</TableCell>
                                <TableCell>{producto.tip_Afe_Igv || ""}</TableCell>
                                <TableCell>S/. {producto.total_Impuestos ?? 0}</TableCell>

                                <TableCell>{producto.factor_Icbper ?? ""}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                )}
            </Table>
            {/* Montos Detallados */}
            <MontosDetallado />
        </div>
    )
}

export default TablaProductos
