import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useGuiaTransporte } from "@/modules/facturacion/context/GuiaTransporteContext";

const TablaDetalles = ({ open, setOpen }) => {

    const { guiaTransporte, setGuiaTransporte, setProductoActual } = useGuiaTransporte();

    const seleccionarProducto = async (pro) => {
        setProductoActual(pro);
        setOpen(true);
    }


    const { detalle } = guiaTransporte;
    return (
        <div className="w-full overflow-x-auto mt-6">
            <Table className={"border-2 border-gray-200"}>

                <TableHeader className="bg-gray-100 border-b-2 border-gray-400">
                    <TableRow>
                        <TableHead className={"max-w-[50px]"}>Cod. de Producto</TableHead>
                        <TableHead>Descipción</TableHead>
                        <TableHead>Unidad</TableHead>
                        <TableHead>Cantidad</TableHead>

                    </TableRow>
                </TableHeader>

                {detalle.length === 0 ? (
                    <tbody>
                        <tr>
                            <td colSpan={4} className="text-center py-6 text-gray-500 italic">
                                ⚠️ No hay Productos agregados aún. Agrega uno para comenzar.
                            </td>
                        </tr>
                    </tbody>
                ) : (
                    <TableBody className={"bg-gray-200"}>
                        {detalle.map((item, index) => (
                            <TableRow key={index}
                                onClick={() => seleccionarProducto({ ...item, index })}
                            >
                                <TableCell className={"pl-3"}>{item.cod_Producto}</TableCell>
                                <TableCell className="pl-3 whitespace-normal overflow-hidden text-ellipsis max-w-[250px] break-words">
                                    {item.descripcion}
                                </TableCell>
                                <TableCell className={"pl-3"}>{item.unidad}</TableCell>
                                <TableCell className={"pl-3"}>{item.cantidad}</TableCell>
                            </TableRow>
                        ))}

                    </TableBody>
                )}
            </Table>
        </div>
    );
};

export default TablaDetalles;

