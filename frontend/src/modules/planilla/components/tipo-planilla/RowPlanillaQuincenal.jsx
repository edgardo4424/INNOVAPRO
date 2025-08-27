import { TableCell, TableRow } from "@/components/ui/table";
import { Eye, FileDown } from "lucide-react";

const RowPlanillaQuincenal = ({ key, e, index }) => {
  console.log('e', e);
  return (
    <TableRow key={key} className={"text-xs"}>
      <TableCell className="text-right">{e.tipo_documento}</TableCell>
      <TableCell className="text-right">{e.numero_documento}</TableCell>

      <TableCell className="text-right">
        {e.nombres} {e.apellidos}
      </TableCell>
      <TableCell className="text-right">{e.dias_laborados}</TableCell>
      <TableCell className="text-right">{e.sueldo_base}</TableCell>
      <TableCell className="text-right">{e.sueldo_quincenal}</TableCell>
      <TableCell className="text-right">{e.asignacion_familiar}</TableCell>

      <TableCell className="text-right">{e.sueldo_bruto}</TableCell>

      <TableCell className="text-right">{e.onp}</TableCell>
      <TableCell className="text-right">{e.eps}</TableCell>
      <TableCell className="text-right">{e.afp}</TableCell>
      <TableCell className="text-right">{e.seguro}</TableCell>
      <TableCell className="text-right">{e?.quinta_categoria}</TableCell>

      <TableCell className="text-right">{e.total_descuentos}</TableCell>
      <TableCell className="text-right">{e.total_a_pagar}</TableCell>


{/*       <TableCell className={"flex gap-x-4 items-center"}>
        <button className="border border-gray-400 rounded-md p-1">
          <Eye className="size-5" />
        </button>

        <button className="border border-gray-400 rounded-md p-1">
          <FileDown className="size-5" />
        </button>

        <button className="border text-white border-red-500 bg-red-500 rounded-md p-1">
          <span>Emitir planilla quincenal</span>
        </button>
      </TableCell> */}
    </TableRow>
  );
};

export default RowPlanillaQuincenal;
