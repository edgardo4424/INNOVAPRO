import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import useProducto from "../hooks/useProducto";
import { useFacturacion } from "@/context/FacturacionContext";

const ListaDeProductos = ({ closeModal }) => {

    const { ObtenerProductos } = useProducto();
    const { productoActual, setProductoActual } = useFacturacion();

    const [piezasDisponibles, setPiezasDisponibles] = useState([]);
    const [filtro, setFiltro] = useState("");
    useEffect(() => {
        const cargarPiezas = async () => {
            try {
                const data = await ObtenerProductos();
                setPiezasDisponibles(data);
            } catch (error) {
                console.error('Error al cargar piezas', error);
            }
        };
        cargarPiezas();
    }, []);

    // 🔍 Filtrar productos por código o descripción
    const piezasFiltradas = piezasDisponibles.filter(p =>
        `${p.item} ${p.descripcion}`.toLowerCase().includes(filtro.toLowerCase())
    );

    const handleClick = (pieza) => {
        const valorUnitario = parseFloat(pieza.precio_venta_soles) || 0;
        const tipAfeIgv = "10"; // Se asume que es gravado

        // Valores IGV solo si tipo de afectación es "10"
        let monto_Base_Igv = 0;
        let porcentaje_Igv = 0;
        let igv = 0;
        let total_Impuestos = 0;
        let monto_Precio_Unitario = valorUnitario;
        let monto_Valor_Venta = valorUnitario;

        if (tipAfeIgv === "10") {
            monto_Base_Igv = valorUnitario;
            porcentaje_Igv = 18;
            igv = +(monto_Base_Igv * 0.18).toFixed(2);
            total_Impuestos = igv;
            monto_Precio_Unitario = +(valorUnitario + igv).toFixed(2);
            monto_Valor_Venta = valorUnitario;
        }

        setProductoActual({
            ...productoActual,
            cod_Producto: pieza.item,
            descripcion: pieza.descripcion,
            // unidad: pieza.unidad,
            cantidad: 1,
            monto_Valor_Unitario: valorUnitario,
            monto_Base_Igv,
            porcentaje_Igv,
            igv,
            total_Impuestos,
            monto_Precio_Unitario,
            monto_Valor_Venta,
            tip_Afe_Igv: tipAfeIgv,
            factor_Icbper: 0,
        });

        closeModal();
    };


    return (
        <div >
            <div className="flex flex-col gap-1 col-span-1">
                <Label>Buscar por código o descripción</Label>
                <Input
                    type="text"
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    placeholder="Ej: AM.0100 o Husillo"
                    className="border-1 border-gray-400"
                />
            </div>

            {/* Scroll vertical aquí */}
            <div className="w-full overflow-x-auto mt-6">
                <div className="max-h-[300px] overflow-y-auto">
                    <Table className="border-2 border-gray-200">
                        <TableCaption className="text-gray-600 italic mt-2">
                            Lista de productos
                        </TableCaption>

                        <TableHeader className="bg-gray-100 border-b-2 border-gray-400">
                            <TableRow>
                                <TableHead className="w-[120px]">Código</TableHead>
                                <TableHead>Descripción</TableHead>
                                <TableHead>Peso kg</TableHead>
                                <TableHead>Precio USD</TableHead>
                                <TableHead>Precio PEN</TableHead>
                                <TableHead>Precio Alquiler PEN</TableHead>
                                <TableHead>Stock</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody className="bg-gray-200">
                            {piezasFiltradas.length === 0 ? (
                                <TableRow>
                                    <TableCell className="text-center py-6 text-gray-500 italic">
                                        ⚠️ No hay productos que coincidan con la búsqueda.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                piezasFiltradas.map((item, index) => (
                                    <TableRow key={index}
                                        onClick={() => handleClick(item)}
                                        className={"cursor-pointer hover:bg-gray-300"}
                                    >
                                        <TableCell>{item.item || ""}</TableCell>
                                        <TableCell>{item.descripcion || ""}</TableCell>
                                        <TableCell>{item.peso_kg || ""}</TableCell>
                                        <TableCell>{item.precio_venta_dolares || ""}</TableCell>
                                        <TableCell>{item.precio_venta_soles || ""}</TableCell>
                                        <TableCell>{item.precio_alquiler_soles || ""}</TableCell>
                                        <TableCell>{item.stock_actual || ""}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default ListaDeProductos;
