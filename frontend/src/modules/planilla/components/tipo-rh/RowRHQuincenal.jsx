import { TableCell, TableRow } from "@/components/ui/table";

const RowRHQuincenal = ({ key, e, index }) => {
  return (
    <TableRow key={key} className={"text-xs"}>
     <TableCell className="text-right">{e.tipo_documento}</TableCell>
      <TableCell className="text-right">{e.numero_documento}</TableCell>
      <TableCell className="text-right">{e.nombres} {e.apellidos}</TableCell>
      <TableCell className="text-right">{e.dias_laborados}</TableCell>
      <TableCell className="text-right">{e.sueldo_base}</TableCell>
      <TableCell className="text-right">{e.total_a_pagar}</TableCell>
        <TableCell className="text-right">{e.banco}</TableCell>
      <TableCell className="text-right">{e.numero_cuenta}</TableCell>
    </TableRow>
  );
};

export default RowRHQuincenal;
