import { TableCell, TableRow } from "@/components/ui/table";

const RowTotalPlanillaMensual = ({ datosTotalesPlanilla: d }) => {
   return (
      <tfoot className="sticky bottom-0 bg-innova-blue  text-white font-semibold z-20 "> 
          <TableRow className={"text-xs"}>
         <TableCell className="text-right pb-4 " colSpan={8}>
            Total
         </TableCell>
         <TableCell className="text-right pb-4 bg-green-600 ">
            {d?.sumatoria_sueldo_basico?d.sumatoria_sueldo_basico:0}
         </TableCell>
         <TableCell className="text-right pb-4 bg-green-600 ">{d.sumatoria_sueldo_mensual?d.sumatoria_sueldo_mensual.toFixed(2):0}</TableCell>
         <TableCell className="text-right pb-4" colSpan={17}></TableCell>
         <TableCell className="text-right pb-4 bg-green-600 ">{d.sumatoria_sueldo_bruto?d.sumatoria_sueldo_bruto.toFixed(2):0}</TableCell>
         <TableCell className="text-right pb-4" colSpan={9}></TableCell>
         <TableCell className="text-right pb-4 bg-orange-400 ">
            {d?.sumatoria_sub_total
               ? d.sumatoria_sub_total.toFixed(2)
               : 0}
         </TableCell>
          <TableCell className="text-right pb-4 bg-green-700">
            {d?.sumatoria_saldo_por_pagar
               ? d.sumatoria_saldo_por_pagar.toFixed(2)
               : 0}
         </TableCell>
         <TableCell className="text-right pb-4  ">
            {d?.sumatoria_essalud ? d.sumatoria_essalud.toFixed(2) : 0}
         </TableCell>
         <TableCell className="text-right pb-4  ">
            {d?.sumatoria_vida_ley ? d.sumatoria_vida_ley.toFixed(2) : 0}
         </TableCell>
         <TableCell className="text-right pb-4  ">
            {d?.sumatoria_sctr_salud ? d.sumatoria_sctr_salud.toFixed(2) : 0}
         </TableCell>
         <TableCell className="text-right pb-4  ">
            {d?.sumatoria_sctr_pension ? d.sumatoria_sctr_pension.toFixed(2) : 0}
         </TableCell>
      </TableRow>
      </tfoot>
     
   );
};

export default RowTotalPlanillaMensual;
