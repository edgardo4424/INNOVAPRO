import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import {
   Tooltip,
   TooltipContent,
   TooltipTrigger,
} from "@/components/ui/tooltip";
import { Eye, FileDown } from "lucide-react";
import ModalInfoDetalle from "./ModalInfoDetalles";
import { formatearFecha } from "@/utils/formatearFecha";

const RowPlanillaMensual = ({ key, e, index }) => {
   console.log("e", e);

   return (
      <TableRow key={key} className={"text-xs"}>
         <TableCell className="text-center">
            {e.info_detalle.length > 1 && (
               <ModalInfoDetalle data={e.info_detalle} />
            )}
         </TableCell>

         <TableCell className="text-right">{e.tipo_documento}</TableCell>
         <TableCell className="text-right">{e.numero_documento}</TableCell>
         <TableCell className="text-right">{e.nombres_apellidos}</TableCell>
         <TableCell className="text-right">{e.area}</TableCell>
         <TableCell className="text-right">{e.afp}</TableCell>
         <TableCell className="text-right">{formatearFecha(e.fecha_ingreso)}</TableCell>
         <TableCell className="text-right">{e.dias_labor}</TableCell>

         <TableCell className="text-right">{e.sueldo_basico}</TableCell>
         <TableCell className="text-right">{e.sueldo_del_mes}</TableCell>

         <TableCell className="text-right">{e.asig_fam}</TableCell>
         <TableCell className="text-right">{e.descanso_medico}</TableCell>
         <TableCell className="text-right">
            {e.licencia_con_goce_de_haber}
         </TableCell>
         <TableCell className="text-right">
            {e.licencia_sin_goce_de_haber}
         </TableCell>
         <TableCell className="text-right">{e.vacaciones}</TableCell>
         <TableCell className="text-right">{e.vacaciones_vendidas||0}</TableCell>
         <TableCell className="text-right">{e.gratificacion}</TableCell>
         <TableCell className="text-right">{e.cts}</TableCell>

         <TableCell className="text-right">
            {e.h_extras_primera_quincena}
         </TableCell>
         <TableCell className="text-right">
            {e.h_extras_segunda_quincena}
         </TableCell>

         {/* <TableCell className="text-right">{e.salida_obra_1era_quincena}</TableCell>
       <TableCell className="text-right">{e.salida_obra_2da_quincena}</TableCell> */}

         <TableCell className="text-right">
            {e.faltas_primera_quincena}
         </TableCell>
         <TableCell className="text-right">
            {e.faltas_segunda_quincena}
         </TableCell>

         <TableCell className="text-right">
            {e.tardanza_primera_quincena}
         </TableCell>
         <TableCell className="text-right">
            {e.tardanza_segunda_quincena}
         </TableCell>

         <TableCell className="text-right">{e.bono_primera_quincena}</TableCell>
         <TableCell className="text-right">{e.bono_segunda_quincena}</TableCell>

         <TableCell className="text-right">{e.sueldo_bruto}</TableCell>

         <TableCell className="text-right">{e.onp}</TableCell>
         <TableCell className="text-right">{e.afp_ap_oblig}</TableCell>
         <TableCell className="text-right">{e.seguro}</TableCell>
         <TableCell className="text-right">{e.comision}</TableCell>

         <TableCell className="text-right">{e.quinta_categoria}</TableCell>

         <TableCell className="text-right">{e.total_descuentos}</TableCell>
         <TableCell className="text-right">{e.sueldo_neto}</TableCell>
         <TableCell className="text-right">-{e.sueldo_quincenal}</TableCell>
         <TableCell className="text-right">-{e.adelanto_prestamo}</TableCell>

         <TableCell className="text-right">{e.saldo_por_pagar}</TableCell>
         <TableCell className="text-right">
            {e.essalud ? e.essalud.toFixed(2) : 0}
         </TableCell>
         <TableCell className="text-right">
            {e.seguro_vida_ley ? e.seguro_vida_ley.toFixed(2) : 0}
         </TableCell>
         <TableCell className="text-right">
            {e.sctr_salud ? e.sctr_salud.toFixed(2) : 0}
         </TableCell>
         <TableCell className="text-right">
            {e.sctr_pension ? e.sctr_pension.toFixed(2) : 0}
         </TableCell>

         {/*       <TableCell className={"flex gap-x-4 items-center"}>
        <button className="border border-gray-400 rounded-md p-1">
          <Eye className="size-5" />
        </button>

        <button className="border border-gray-400 rounded-md p-1">
          <FileDown className="size-5" />
        </button>

        <button className="border text-white border-red-500 bg-red-500 rounded-md p-1">
          <span>Emitir planilla Mensual</span>
        </button>
      </TableCell> */}
      </TableRow>
   );
};

export default RowPlanillaMensual;
