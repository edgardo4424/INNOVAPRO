import { TableCell, TableRow } from "@/components/ui/table";
import { formatearFecha } from "../../utils/formatearFecha";
import ModalInfoDetallesQuincenal from "../tipo-planilla/ModalInfoDetallesQuincenal";

const RowRHQuincenal = ({ key, e, index }) => {
  return (
    <TableRow key={key} className={"text-xs"}>
         <TableCell className="text-center">
                        {e.registro_planilla_quincenal_detalle && e.registro_planilla_quincenal_detalle.length > 1 && (
                           <ModalInfoDetallesQuincenal data={e.registro_planilla_quincenal_detalle} />
                        )}
                     </TableCell>
     <TableCell className="text-right">{e.tipo_documento}</TableCell>
      <TableCell className="text-right">{e.numero_documento}</TableCell>
      <TableCell className="text-right">{e.nombres} {e.apellidos}</TableCell>
      <TableCell className="text-right">{e.cargo}</TableCell>
      <TableCell className="text-right">{formatearFecha(e.fecha_ingreso)}</TableCell>
      <TableCell className="text-right">{e.dias_laborados}</TableCell>
      <TableCell className="text-right">{e.sueldo_base}</TableCell>
      <TableCell className="text-right">{e.sueldo_quincenal}</TableCell>

      <TableCell className="text-right">{e.adelanto_sueldo}</TableCell>
      <TableCell className="text-right">{e.total_a_pagar}</TableCell>
        <TableCell className="text-right">{e.banco}</TableCell>
      <TableCell className="text-right">{e.numero_cuenta}</TableCell>
    </TableRow>
  );
};

export default RowRHQuincenal;
