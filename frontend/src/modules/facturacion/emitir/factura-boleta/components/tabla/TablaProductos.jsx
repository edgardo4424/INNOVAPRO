import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { useFacturaBoleta } from "@/modules/facturacion/context/FacturaBoletaContext";

const TablaProductos = ({ setOpen }) => {
  const { factura, editarProducto } = useFacturaBoleta();
  const { detalle: listaProductos, tipo_Moneda } = factura;

  const seleccionarProducto = async (producto, index) => {
    await editarProducto(index);
    setOpen(true);
  };

  return (
    <div className="mt-6 w-full overflow-x-auto">
      <Table className={"border-2 border-gray-200"}>
        <TableHeader className="border-b-2 border-gray-400 bg-gray-100">
          <TableRow>
            <TableHead className="w-[120px]">Item</TableHead>
            <TableHead className="">Código</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Unidad</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead>Valor Unitario</TableHead>
            {/* <TableHead>Precio Unitario</TableHead> */}
            <TableHead>Valor de Venta</TableHead>

            {/* <TableHead>% IGV</TableHead> */}
            <TableHead>IGV</TableHead>
            {/* <TableHead>Base IGV</TableHead> */}
            {/* <TableHead>Tip. Afección IGV</TableHead> */}
            {/* <TableHead>Total Impuestos</TableHead> */}

            {/* <TableHead>Factor ICBPER</TableHead> */}
          </TableRow>
        </TableHeader>

        {listaProductos.length === 0 ? (
          <tbody>
            <tr>
              <td
                colSpan={13}
                className="py-6 text-center text-gray-500 italic"
              >
                ⚠️ No hay productos agregados aún. Agrega uno para comenzar.
              </td>
            </tr>
          </tbody>
        ) : (
          <TableBody className={"bg-gray-200"}>
            {listaProductos.map((producto, index) => (
              <TableRow
                key={index}
                className={"cursor-pointer hover:bg-gray-100"}
                onClick={() => seleccionarProducto(producto, index)}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{producto.cod_Producto || ""}</TableCell>
                <TableCell class="min-w-[200px]">
                  {producto.descripcion || ""}
                </TableCell>
                <TableCell>{producto.unidad || ""}</TableCell>
                <TableCell>{producto.cantidad ?? ""}</TableCell>

                <TableCell>
                  {tipo_Moneda == "USD" ? "$ " : "S/. "}{" "}
                  {producto.monto_Valor_Unitario ?? 0}
                </TableCell>
                {/* <TableCell> */}
                  {/* {tipo_Moneda == "USD" ? "$ " : "S/. "}{" "} */}
                  {/* {producto.monto_Precio_Unitario ?? 0} */}
                {/* </TableCell> */}
                <TableCell>
                  {tipo_Moneda == "USD" ? "$ " : "S/. "}{" "}
                  {producto.monto_Valor_Venta ?? 0}
                </TableCell>

                {/* <TableCell>{producto.porcentaje_Igv ?? ""}%</TableCell> */}
                <TableCell>
                  {tipo_Moneda == "USD" ? "$ " : "S/. "} {producto.igv ?? 0}
                </TableCell>
                {/* <TableCell>
                  {tipo_Moneda == "USD" ? "$ " : "S/. "}{" "}
                  {producto.monto_Base_Igv ?? 0}
                </TableCell> */}
                {/* <TableCell>{producto.tip_Afe_Igv || ""}</TableCell> */}
                {/* <TableCell>
                  {tipo_Moneda == "USD" ? "$ " : "S/. "}{" "}
                  {producto.total_Impuestos ?? 0}
                </TableCell> */}

                {/* <TableCell>{producto.factor_Icbper ?? ""}</TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </div>
  );
};

export default TablaProductos;
