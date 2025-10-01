import { TableCell, TableRow } from "@/components/ui/table";

const RowRHMensual = ({  e }) => {
  return (
    <TableRow  className={"text-xs"}>
      <TableCell className="text-right">{e.tipo_documento}</TableCell>
      <TableCell className="text-right">{e.numero_documento}</TableCell>
      <TableCell className="text-right">{e.nombres_apellidos}</TableCell>
      <TableCell className="text-right">{e.area}</TableCell>
      <TableCell className="text-right">{e.fecha_ingreso}</TableCell>
      <TableCell className="text-right">{e.dias_labor}</TableCell>
      <TableCell className="text-right">{e.sueldo_basico}</TableCell>
      <TableCell className="text-right">{Number(e.sueldo_del_mes).toFixed(2)}</TableCell>
      <TableCell className="text-right">{e.vacaciones}</TableCell>
      <TableCell className="text-right">{e.vacaciones_vendidas}</TableCell>
      <TableCell className="text-right"></TableCell>
        <TableCell className="text-right"></TableCell>
      <TableCell className="text-right">{e.faltas_primera_quincena.toFixed(2)}</TableCell>
      <TableCell className="text-right">{e.faltas_segunda_quincena.toFixed(2)}</TableCell>
      <TableCell className="text-right">{e.sueldo_neto.toFixed(2)}</TableCell>
      <TableCell className="text-right">{e.sueldo_quincenal}</TableCell>
            <TableCell className="text-right">{e.adelanto_prestamo}</TableCell>

      <TableCell className="text-right">{e.saldo_por_pagar.toFixed(2)}</TableCell>
      <TableCell className="text-right">{e.banco}</TableCell>
    </TableRow>
  );
};

export default RowRHMensual;
