import {
   AlertDialog,
   AlertDialogTrigger,
   AlertDialogContent,
   AlertDialogHeader,
   AlertDialogFooter,
   AlertDialogTitle,
   AlertDialogDescription,
   AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export default function ModalInfoDetalle({ data }) {
   return (
      <AlertDialog>
         <AlertDialogTrigger asChild className="">
            <Button
               className="size-8 text-orange-500 hover:text-orange-600"
               size={"icon"}
               variant={"outline"}
            >
               <Eye />
            </Button>
         </AlertDialogTrigger>
         <AlertDialogContent className="!max-w-none w-3xl overflow-auto max-h-[90vh]">
            <AlertDialogHeader>
               <AlertDialogTitle>Resumen - {data[0].nombres_apellidos} </AlertDialogTitle>
               <AlertDialogDescription>
                 
               </AlertDialogDescription>
            </AlertDialogHeader>

            {/* Tabla */}
            <div className="overflow-auto">
               <table className="min-w-full border text-sm">
                  <thead className="bg-gray-100 text-xs">
                     <tr>
                        <th className="truncate text-xs border px-2 py-2">Contrato</th>
                        <th className="truncate text-xs border px-2 py-2">Regimen</th>
                        <th className="truncate text-xs border px-2 py-2">Periodo</th>
                        <th className="truncate text-xs border px-2 py-2">AFP</th>
                        <th className="truncate text-xs border px-2 py-2">Días</th>
                        <th className="truncate text-xs border px-2 py-2">Sueldo Básico</th>
                        <th className="truncate text-xs border px-2 py-2">Sueldo Mes</th>
                        <th className="truncate text-xs border px-2 py-2">Descanso Médico</th>
                        <th className="truncate text-xs border px-2 py-2">Lic. Con Goce</th>
                        <th className="truncate text-xs border px-2 py-2">Lic. Sin Goce</th>
                        <th className="truncate text-xs border px-2 py-2">Vacaciones</th>
                        <th className="truncate text-xs border px-2 py-2">Gratificación</th>
                        <th className="truncate text-xs border px-2 py-2">CTS</th>
                        <th className="truncate text-xs border px-2 py-2">H. Extras Q1</th>
                        <th className="truncate text-xs border px-2 py-2">H. Extras Q2</th>
                        <th className="truncate text-xs border px-2 py-2">Faltas Q1</th>
                        <th className="truncate text-xs border px-2 py-2">Faltas Q2</th>
                        <th className="truncate text-xs border px-2 py-2">Tardanza Q1</th>
                        <th className="truncate text-xs border px-2 py-2">Tardanza Q2</th>
                        <th className="truncate text-xs border px-2 py-2">Bono Q1</th>
                        <th className="truncate text-xs border px-2 py-2">Bono Q2</th>
                     </tr>
                  </thead>
                  <tbody className="space-y-8">
                     {data.map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50 py-8">
                           <td className="border px-2 py-4.5 text-xs">
                              {row.tipo_contrato}
                           </td>
                           <td className="border px-2 py-4.5 text-xs">
                              {row.regimen}
                           </td>
                           <td className="border px-2 py-4.5 text-xs">
                              {row.periodo}
                           </td>
                           <td className="border px-2 py-4.5 text-xs">
                              {row.afp}
                           </td>
                           <td className="border px-2 py-4.5 text-xs">
                              {row.dias_labor}
                           </td>
                           <td className="border px-2 py-4.5 text-xs">
                              {row.sueldo_basico}
                           </td>
                           <td className="border px-2 py-4.5 text-xs">
                              {row.sueldo_del_mes}
                           </td>
                           <td className="border px-2 py-4.5 text-xs">
                              {row.descanso_medico}
                           </td>
                           <td className="border px-2 py-4.5 text-xs">
                              {row.licencia_con_goce_de_haber}
                           </td>
                           <td className="border px-2 py-4.5 text-xs">
                              {row.licencia_sin_goce_de_haber}
                           </td>
                           <td className="border px-2 py-4.5 text-xs">
                              {row.vacaciones}
                           </td>
                           <td className="border px-2 py-4.5 text-xs">
                              {row.gratificacion}
                           </td>
                           <td className="border px-2 py-4.5 text-xs">
                              {row.cts}
                           </td>
                           <td className="border px-2 py-4.5 text-xs">
                              {row.h_extras_primera_quincena}
                           </td>
                           <td className="border px-2 py-4.5 text-xs">
                              {row.h_extras_segunda_quincena}
                           </td>
                           <td className="border px-2 py-4.5 text-xs">
                              {row.faltas_primera_quincena}
                           </td>
                           <td className="border px-2 py-4.5 text-xs">
                              {row.faltas_segunda_quincena}
                           </td>
                           <td className="border px-2 py-4.5 text-xs">
                              {row.tardanza_primera_quincena}
                           </td>
                           <td className="border px-2 py-4.5 text-xs">
                              {row.tardanza_segunda_quincena}
                           </td>
                           <td className="border px-2 py-4.5 text-xs">
                              {row.bono_primera_quincena}
                           </td>
                           <td className="border px-2 py-4.5 text-xs">
                              {row.bono_segunda_quincena}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>

            <AlertDialogFooter className="mt-4">
               <AlertDialogCancel>Cerrar</AlertDialogCancel>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   );
}
