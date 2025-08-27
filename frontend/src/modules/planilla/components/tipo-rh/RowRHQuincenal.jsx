import { TableCell, TableRow } from "@/components/ui/table";
import { Eye, FileDown } from "lucide-react";
import { formatearFecha } from "../../utils/formatearFecha";
const RowPlanillaQuincenal = ({ key, e, index }) => {
  return (
    <TableRow key={key} className={"text-xs"}>
     <TableCell className="text-right">{e.tipo_documento}</TableCell>
      <TableCell className="text-right">{e.numero_documento}</TableCell>
      <TableCell className="text-right">{e.nombres} {e.apellidos}</TableCell>
      <TableCell className="text-right">{e.dias_laborados}</TableCell>
      <TableCell className="text-right">{e.sueldo_base}</TableCell>
      <TableCell className="text-right">{e.sueldo_quincenal}</TableCell>
      <TableCell className="text-right">{e.banco}</TableCell>
    </TableRow>
  );
};

export default RowPlanillaQuincenal;
