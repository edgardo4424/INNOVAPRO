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
  const { guiaTransporte, setProductoActual } = useGuiaTransporte();

  const seleccionarProducto = async (pro) => {
    setProductoActual(pro);
    setOpen(true);
  };

  const { detalle } = guiaTransporte;
  return (
    <div className="mt-6 w-full overflow-y-auto">
      <Table className={"border-2 border-gray-200"}>
        <TableHeader className="border-b-2 border-gray-400 bg-gray-100">
          <TableRow>
            <TableHead className={"max-w-[50px]"}>Codigo</TableHead>
            <TableHead>Descipción</TableHead>
            <TableHead>Unidad</TableHead>
            <TableHead>Cantidad</TableHead>
          </TableRow>
        </TableHeader>

        {detalle.length === 0 ? (
          <tbody>
            <tr>
              <td colSpan={4} className="py-6 text-center text-gray-500 italic">
                ⚠️ No hay Productos agregados aún. Agrega uno para comenzar.
              </td>
            </tr>
          </tbody>
        ) : (
          <TableBody className={"bg-gray-200"}>
            {detalle.map((item, index) => (
              <TableRow
                key={index}
                onClick={() => seleccionarProducto({ ...item, index })}
              >
                <TableCell className={"pl-3"}>{item.cod_Producto}</TableCell>
                <TableCell className="max-w-[250px] overflow-hidden pl-3 break-words text-ellipsis whitespace-normal">
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
