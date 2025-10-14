import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNota } from '@/modules/facturacion/context/NotaContext';
import { valorIncialDescuentos } from '../utils/valoresInicialNota';

const ListaDeItem = ({ closeModal }) => {
    const { notaCreditoDebito, setItemActual, documentoAAfectar } = useNota();

    const { detalle } = documentoAAfectar;

    let itemsFiltrados = detalle.filter(item => !notaCreditoDebito.detalle.some(detalleItem => detalleItem.id === item.id));

    const seleccionarItem = (item) => {
        if (((notaCreditoDebito.motivo_Cod === "03" || notaCreditoDebito.motivo_Cod === "07") && notaCreditoDebito.tipo_Doc === "07") || (notaCreditoDebito.motivo_Cod === "02" && notaCreditoDebito.tipo_Doc === "08")) {
            setItemActual(item);
        } else if (notaCreditoDebito.motivo_Cod === "05") {
            setItemActual({
                ...item,
                Descuentos: valorIncialDescuentos
            });
        }
        closeModal();
    }

    return (
        <div>
            {/* Scroll vertical aquí */}
            <div className="w-full overflow-x-auto mt-6">
                <div className="max-h-[300px] overflow-y-auto">
                    <Table className="border-2 border-gray-200">

                        <TableHeader className="bg-gray-100 border-b-2 border-gray-400">
                            <TableRow>
                                <TableHead>Unidad</TableHead>
                                <TableHead>Cantidad</TableHead>
                                <TableHead>Código</TableHead>
                                <TableHead>Descripción</TableHead>
                                <TableHead>Valor Unitario</TableHead>
                                <TableHead>Base IGV</TableHead>
                                <TableHead>Precio Unitario</TableHead>
                                <TableHead>Valor de Venta</TableHead>
                                <TableHead>% IGV</TableHead>
                                <TableHead>IGV</TableHead>
                                <TableHead>Tip. Afección IGV</TableHead>
                                <TableHead>Factor ICBPER</TableHead>
                                <TableHead>Total Impuestos</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody className="bg-gray-200">
                            {itemsFiltrados.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={14} className="text-center py-6 text-gray-500 italic">
                                        ⚠️ No hay productos que coincidan con la búsqueda.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                itemsFiltrados.sort((a, b) => b.id - a.id).map((item, index) => (
                                    <TableRow key={index}
                                        onClick={() => seleccionarItem(item)}
                                        className={"cursor-pointer hover:bg-gray-300"}
                                    >
                                        <TableCell>{item.unidad || ""}</TableCell>
                                        <TableCell>{item.cantidad || 0}</TableCell>
                                        <TableCell>{item.cod_Producto || ""}</TableCell>
                                        <TableCell>{item.descripcion || ""}</TableCell>
                                        <TableCell>{item.monto_Valor_Unitario || 0}</TableCell>
                                        <TableCell>{item.monto_Base_Igv || 0}</TableCell>
                                        <TableCell>{item.monto_Precio_Unitario || 0}</TableCell>
                                        <TableCell>{item.monto_Valor_Venta || 0}</TableCell>
                                        <TableCell>{item.porcentaje_Igv || 0}</TableCell>
                                        <TableCell>{item.igv || 0}</TableCell>
                                        <TableCell>{item.tip_Afe_Igv || ""}</TableCell>
                                        <TableCell>{item.factor_Icbper || 0}</TableCell>
                                        <TableCell>{item.total_Impuestos || 0}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

export default ListaDeItem
