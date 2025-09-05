import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { useNota } from "@/modules/facturacion/context/NotaContext";
import { useMemo } from "react";
import MontosDetallado from "../MontosDetallado";

const campos_01_02 = [
    "item",
    "unidad",
    "cantidad",
    "codigo",
    "descripcion",
    "valor_unitario",
    "precio_unitario",
    "monto_precio_unitario",
    "igv",
];

const campos_03 = [
    "item",
    "unidad",
    "descripcion",
    "valor_unitario",
];

const campos_04 = [
    "cantidad",
    "descripcion",
    "valor_unitario",
];

const TablaProductos = ({ setOpen }) => {
    const { notaCreditoDebito, setItemActual, documentoAAfectar } = useNota();

    // Calcula una vez qué campos se muestran según el motivo
    const visiblesSet = useMemo(() => {
        if (notaCreditoDebito?.motivo_Cod === "03" && notaCreditoDebito?.tipo_Doc === "07") return new Set(campos_03);
        if (notaCreditoDebito?.motivo_Cod === "04" && notaCreditoDebito?.tipo_Doc === "07") return new Set(campos_04);
        if ( notaCreditoDebito?.tipo_Doc === "08") return new Set(campos_04);
        return new Set(campos_01_02); // default para "01" y "02"
    }, [notaCreditoDebito?.motivo_Cod]);

    const valoresVisibles = (campo) => visiblesSet.has(campo);

    const selectItem = (item) => {
        if (String(notaCreditoDebito?.motivo_Cod) === "03") {
            const itemDetalle = documentoAAfectar?.detalle?.find(
                (detalleItem) => detalleItem.id === item.id
            );
            setItemActual(itemDetalle);
        } else {
            setItemActual(item);
        }
        setOpen(true);
    };

    return (
        <div className="w-full overflow-x-auto mt-6">
            <Table className="border-2 border-gray-200">
                <TableHeader className="bg-gray-100 border-b-2 border-gray-400">
                    <TableRow>
                        <TableHead className={valoresVisibles("item") ? "" : "hidden"}>Item</TableHead>
                        <TableHead className={valoresVisibles("codigo") ? "" : "hidden"}>Código</TableHead>
                        <TableHead className={valoresVisibles("cantidad") ? "" : "hidden"}>Cantidad</TableHead>
                        <TableHead className={valoresVisibles("descripcion") ? "" : "hidden"}>Descripción</TableHead>
                        <TableHead className={valoresVisibles("unidad") ? "" : "hidden"}>Unidad</TableHead>
                        <TableHead className={valoresVisibles("valor_unitario") ? "" : "hidden"}>Valor Unitario</TableHead>
                        <TableHead className={valoresVisibles("precio_unitario") ? "" : "hidden"}>Precio Unitario</TableHead>
                        <TableHead className={valoresVisibles("igv") ? "" : "hidden"}>IGV</TableHead>
                        <TableHead className={valoresVisibles("monto_precio_unitario") ? "" : "hidden"}>Monto</TableHead>
                    </TableRow>
                </TableHeader>

                {notaCreditoDebito?.detalle?.length === 0 ? (
                    <tbody>
                        <tr>
                            <td colSpan={13} className="text-center py-6 text-gray-500 italic">
                                ⚠️ No hay items agregados aún. Agrega uno para comenzar.
                            </td>
                        </tr>
                    </tbody>
                ) : (
                    <TableBody className="bg-gray-200">
                        {notaCreditoDebito.detalle.map((producto, index) => (
                            <TableRow
                                key={producto?.id ?? index}
                                className="cursor-pointer hover:bg-gray-100"
                                onClick={() => selectItem(producto)}
                            >
                                <TableCell className={valoresVisibles("item") ? "" : "hidden"}>
                                    {index + 1}
                                </TableCell>
                                <TableCell className={valoresVisibles("codigo") ? "" : "hidden"}>
                                    {producto?.cod_Producto || ""}
                                </TableCell>
                                <TableCell className={valoresVisibles("cantidad") ? "" : "hidden"}>
                                    {producto?.cantidad ?? ""}
                                </TableCell>
                                <TableCell className={valoresVisibles("descripcion") ? "min-w-[400px]" : "hidden"}>
                                    {producto?.descripcion || ""}
                                </TableCell>
                                <TableCell className={valoresVisibles("unidad") ? "" : "hidden"}>
                                    {producto?.unidad || ""}
                                </TableCell>
                                <TableCell className={valoresVisibles("valor_unitario") ? "" : "hidden"}>
                                    S/. {producto?.monto_Valor_Unitario ?? 0}
                                </TableCell>
                                <TableCell className={valoresVisibles("precio_unitario") ? "" : "hidden"}>
                                    S/. {producto?.monto_Precio_Unitario ?? 0}
                                </TableCell>
                                <TableCell className={valoresVisibles("igv") ? "" : "hidden"}>
                                    S/. {producto?.igv ?? 0}
                                </TableCell>
                                <TableCell className={valoresVisibles("monto_precio_unitario") ? "" : "hidden"}>
                                    S/. {producto?.monto_Precio_Unitario ?? 0}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                )}
            </Table>

            {/* Montos Detallados */}
            <MontosDetallado />
        </div>
    );
};

export default TablaProductos;
