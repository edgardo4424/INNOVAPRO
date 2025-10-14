import { TableCell, TableRow } from "@/components/ui/table";
import { Eye, FileDown } from "lucide-react";
import { formatearFecha } from "../../utils/formatearFecha";
import ModalInfoDetallesQuincenal from "./ModalInfoDetallesQuincenal";

const RowPlanillaQuincenal = ({ key, e, index }) => {

   let registroPlanillaQuincenalDetalle = e?.registro_planilla_quincenal_detalle;

try {
  if (typeof registroPlanillaQuincenalDetalle === "string" && registroPlanillaQuincenalDetalle.trim() !== "") {
    registroPlanillaQuincenalDetalle = JSON.parse(registroPlanillaQuincenalDetalle);
  }
} catch (e) {
  console.error("Error al parsear info_detalle:", e);
  registroPlanillaQuincenalDetalle = [];
}

  return (
    <TableRow key={key} className={"text-xs"}>
      <TableCell className="text-center">
                  {registroPlanillaQuincenalDetalle && registroPlanillaQuincenalDetalle.length > 1 && (
                     <ModalInfoDetallesQuincenal data={registroPlanillaQuincenalDetalle} />
                  )}
               </TableCell>
      <TableCell className="text-right">{e.tipo_documento}</TableCell>
      <TableCell className="text-right">{e.numero_documento}</TableCell>

      <TableCell className="text-right">
        {e.nombres} {e.apellidos}
      </TableCell>
      <TableCell className="text-right">{e.cargo}</TableCell>
      <TableCell className="text-right">{e.tipo_afp}</TableCell>

      <TableCell className="text-right">{formatearFecha(e.fecha_ingreso)}</TableCell>

      <TableCell className="text-right">{e.dias_laborados}</TableCell>
      <TableCell className="text-right">{Number(e.sueldo_base).toFixed(2)}</TableCell>
      <TableCell className="text-right">{Number(e.sueldo_quincenal).toFixed(2)}</TableCell>
      <TableCell className="text-right">{Number(e.asignacion_familiar).toFixed(2)}</TableCell>

      <TableCell className="text-right">{Number(e.sueldo_bruto).toFixed(2)}</TableCell>

      <TableCell className="text-right">{Number(e.onp).toFixed(2)}</TableCell>
   
      <TableCell className="text-right">{Number(e.afp).toFixed(2)}</TableCell>
      <TableCell className="text-right">{Number(e.seguro).toFixed(2)}</TableCell>
      <TableCell className="text-right">{Number(e.comision).toFixed(2)}</TableCell>

      <TableCell className="text-right">{Number(e?.quinta_categoria).toFixed(2)}</TableCell>
      <TableCell className="text-right">{Number(e?.adelanto_sueldo).toFixed(2)}</TableCell>


      <TableCell className="text-right">{Number(e.total_descuentos).toFixed(2)}</TableCell>
      <TableCell className="text-right">{Number(e.total_a_pagar).toFixed(2)}</TableCell>
      <TableCell className="text-right">{e.banco}</TableCell>
      <TableCell className="text-right">{e.numero_cuenta}</TableCell>



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
