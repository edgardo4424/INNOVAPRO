import { TableCell, TableRow } from "@/components/ui/table";

const RowTotalPlanillaMensual = ({ datosTotalesPlanilla: d }) => {
   return (
      <TableRow className={"bg-blue-300 text-xs"}>
         <TableCell className="text-right" colSpan={8}>
            Total
         </TableCell>
         <TableCell className="text-right bg-orange-300">
            {d?.sumatoria_sueldo_basico?d.sumatoria_sueldo_basico:0}
         </TableCell>
         <TableCell className="text-right bg-orange-300"></TableCell>
         <TableCell className="text-right bg-orange-300"></TableCell>
         <TableCell className="text-right bg-orange-300"></TableCell>
         <TableCell className="text-right"></TableCell>
         <TableCell className="text-right"></TableCell>
         <TableCell className="text-right bg-orange-300"></TableCell>
         <TableCell className="text-right"></TableCell>
         <TableCell className="text-right"></TableCell>
         <TableCell className="text-right"></TableCell>
         <TableCell className="text-right"></TableCell>
         <TableCell className="text-right"></TableCell>
         <TableCell className="text-right"></TableCell>
         <TableCell className="text-right"></TableCell>
         <TableCell className="text-right"></TableCell>
         <TableCell className="text-right"></TableCell>
         <TableCell className="text-right"></TableCell>
         <TableCell className="text-right">45</TableCell>
         <TableCell className="text-right"></TableCell>
         <TableCell className="text-right"></TableCell>
         <TableCell className="text-right"></TableCell>
         <TableCell className="text-right"></TableCell>
         <TableCell className="text-right"></TableCell>
         <TableCell className="text-right"></TableCell>
         <TableCell className="text-right"></TableCell>
         <TableCell className="text-right"></TableCell>
         <TableCell className="text-right"></TableCell>
         <TableCell className="text-right bg-amber-600 text-white">
            {d?.sumatoria_saldo_por_pagar
               ? d.sumatoria_saldo_por_pagar.toFixed(2)
               : 0}
         </TableCell>
         <TableCell className="text-right bg-green-700 text-white">
            {d?.sumatoria_essalud ? d.sumatoria_essalud.toFixed(2) : 0}
         </TableCell>
         <TableCell className="text-right bg-green-700 text-white">
            {d?.sumatoria_vida_ley ? d.sumatoria_vida_ley.toFixed(2) : 0}
         </TableCell>
         <TableCell className="text-right bg-green-700 text-white">
            {d?.sumatoria_sctr_salud ? d.sumatoria_sctr_salud.toFixed(2) : 0}
         </TableCell>
         <TableCell className="text-right bg-green-700 text-white">
            {d?.sumatoria_sctr_pension ? d.sumatoria_sctr_pension.toFixed(2) : 0}
         </TableCell>
      </TableRow>
   );
};

export default RowTotalPlanillaMensual;
