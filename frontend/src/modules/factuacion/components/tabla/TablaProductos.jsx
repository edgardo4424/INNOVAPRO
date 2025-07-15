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

const TablaProductos = ({ setOpen }) => {
    const { factura, TotalProducto, editarProducto } = useFacturacion();
    const { detalle: listaProductos } = factura;

    const seleccionarProducto = async (producto, index) => {
        console.log("index", index);
        console.log("producto seleccionado", producto);
        await editarProducto(index);
        setOpen(true);
    };

    return (
        <div className="w-full overflow-x-auto mt-6">
            <Table className={"border-2 border-gray-200"}>
                <TableCaption className="text-gray-600 italic mt-2">
                    Lista de productos agregados
                </TableCaption>

                <TableHeader className="bg-gray-100 border-b-2 border-gray-400">
                    <TableRow>
                        <TableHead className="w-[120px]">Código</TableHead>
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

                        <TableHead>Factor ICBPER</TableHead>
                    </TableRow>
                </TableHeader>

                {listaProductos.length === 0 ? (
                    <tbody>
                        <tr>
                            <td colSpan={13} className="text-center py-6 text-gray-500 italic">
                                ⚠️ No hay productos agregados aún. Agrega uno para comenzar.
                            </td>
                        </tr>
                    </tbody>
                ) : (
                    <TableBody className={"bg-gray-200 "}>
                        {listaProductos.map((producto, index) => (
                            <TableRow key={index}
                                className={"cursor-pointer hover:bg-gray-100"}
                                onClick={() => seleccionarProducto(producto, index)}
                            >
                                <TableCell>{producto.cod_Producto || ""}</TableCell>
                                <TableCell>{producto.descripcion || ""}</TableCell>
                                <TableCell>{producto.unidad || ""}</TableCell>
                                <TableCell>{producto.cantidad ?? ""}</TableCell>

                                <TableCell>
                                    S/. {(producto.monto_Valor_Unitario ?? 0)}
                                </TableCell>
                                <TableCell>
                                    S/. {(producto.monto_Precio_Unitario ?? 0)}
                                </TableCell>
                                <TableCell>
                                    S/. {(producto.monto_Valor_Venta ?? 0)}
                                </TableCell>

                                <TableCell>{producto.porcentaje_Igv ?? ""}%</TableCell>
                                <TableCell>
                                    S/. {(producto.igv ?? 0)}
                                </TableCell>
                                <TableCell>
                                    S/. {(producto.monto_Base_Igv ?? 0)}
                                </TableCell>
                                <TableCell>{producto.tip_Afe_Igv || ""}</TableCell>
                                <TableCell>
                                    S/. {(producto.total_Impuestos ?? 0)}
                                </TableCell>

                                <TableCell>{producto.factor_Icbper ?? ""}</TableCell>
                            </TableRow>
                        ))}
                        {
                            listaProductos.length > 0 && TotalProducto > 0 && (
                                <>
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-right font-bold">
                                            TOTAL
                                        </TableCell>
                                        <TableCell>
                                            S/.{" "}
                                            {TotalProducto}
                                        </TableCell>
                                        <TableCell colSpan={7} className="text-right font-bold">
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-right font-bold">
                                            IGV
                                        </TableCell>
                                        <TableCell>
                                            S/.{" "}
                                            {factura.monto_Igv}
                                        </TableCell>
                                        <TableCell colSpan={7} className="text-right font-bold">
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-right font-bold">
                                            Sub Total + IGV
                                        </TableCell>
                                        <TableCell>
                                            S/.{" "}
                                            {factura.sub_Total}
                                        </TableCell>
                                        <TableCell colSpan={7} className="text-right font-bold">
                                        </TableCell>
                                    </TableRow>
                                </>
                            )
                        }

                    </TableBody>
                )}
            </Table>
        </div>
    );
};

export default TablaProductos;
