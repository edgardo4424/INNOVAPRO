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
import { formatearFecha } from "@/modules/facturacion/utils/formatearFecha";

const TablaPagos = ({ open, setOpen }) => {
  const { factura, retencionActivado, retencion, setPagoActual } =
    useFacturaBoleta();
  const { forma_pago: ListaDePago, cuotas_Real } = factura;

  const seleccionarPago = async () => {
    setPagoActual(factura.forma_pago);
    setOpen(true);
  };

  return (
    <div className="mt-6 w-full overflow-x-auto">
      <Table className={"border-2 border-gray-200"}>
        <TableHeader className="border-b-2 border-gray-400 bg-gray-100">
          <TableRow>
            <TableHead>Cuota</TableHead>
            <TableHead>Metodo</TableHead>
            <TableHead>Monto a Pagar</TableHead>
            {factura.tipo_Operacion === "1001" && !retencionActivado && (
              <TableHead>Monto Neto a Pagar</TableHead>
            )}
            {retencionActivado && factura.tipo_Operacion !== "1001" && (
              <TableHead>Monto Neto a Pagar</TableHead>
            )}
            <TableHead>Fecha de Pago</TableHead>
          </TableRow>
        </TableHeader>

        {ListaDePago.length === 0 ? (
          <tbody>
            <tr>
              <td
                colSpan={13}
                className="py-6 text-center text-gray-500 italic"
              >
                ⚠️ No hay Pagos agregados aún. Agrega uno para comenzar.
              </td>
            </tr>
          </tbody>
        ) : (
          <TableBody className={"bg-gray-200"}>
            {ListaDePago.map((item, index) => (
              <TableRow key={index} onClick={() => seleccionarPago()}>
                <TableCell>{item.cuota}</TableCell>
                <TableCell>{item.tipo}</TableCell>
                <TableCell>{item.monto}</TableCell>
                {factura.tipo_Operacion === "1001" && !retencionActivado && (
                  <TableCell>{cuotas_Real[index]?.monto}</TableCell>
                )}
                {retencionActivado && factura.tipo_Operacion !== "1001" && (
                  <TableCell>{cuotas_Real[index]?.monto}</TableCell>
                )}
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
