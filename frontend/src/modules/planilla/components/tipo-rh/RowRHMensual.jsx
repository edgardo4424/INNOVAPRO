import { TableCell, TableRow } from "@/components/ui/table";

const RowRHMensual = ({ key, e, index }) => {
  return (
    <TableRow key={key} className={"text-xs"}>
      <TableCell className="text-right">{e.tipo_documento}</TableCell>
      <TableCell className="text-right">{e.numero_documento}</TableCell>
      <TableCell className="text-right">{e.nombres_apellidos}</TableCell>
      <TableCell className="text-right">{e.area}</TableCell>
      <TableCell className="text-right">{e.fecha_ingreso}</TableCell>
      <TableCell className="text-right">{e.dias_labor}</TableCell>
      <TableCell className="text-right">{e.bruto}</TableCell>
      <TableCell className="text-right">{e.sueldo_del_mes}</TableCell>
      <TableCell className="text-right">{e.vacaciones}</TableCell>
      <TableCell className="text-right"></TableCell>
      <TableCell className="text-right"></TableCell>
      <TableCell className="text-right">{e.falta}</TableCell>
      <TableCell className="text-right"></TableCell>
      <TableCell className="text-right">{e.sueldo_neto}</TableCell>
      <TableCell className="text-right">{e.sueldo_quincen}</TableCell>
      <TableCell className="text-right">{e.sueldo_por_pagar}</TableCell>
      <TableCell className="text-right">{e.banco}</TableCell>
    </TableRow>
  );
};

export default RowRHMensual;
