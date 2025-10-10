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
import { formatearFecha } from "../../utils/formatearFecha";

export default function ModalInfoDetallesQuincenal({ data }) {
   console.log('data', data);
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
         <AlertDialogContent className="!max-w-none md:w-3xl overflow-auto max-h-[90vh]">
            <AlertDialogHeader>
               <AlertDialogTitle>Resumen - {data[0].nombres} {data[0].apellidos}</AlertDialogTitle>
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
                      
                        {/* <th className="truncate text-xs border px-2 py-2">Fecha Ingreso</th> */}
                        <th className="truncate text-xs border px-2 py-2">Días Labor.</th>
                        <th className="truncate text-xs border px-2 py-2">Sueldo Base</th>
                        <th className="truncate text-xs border px-2 py-2">Sueldo Quincenal</th>
                     </tr>
                  </thead>
                  <tbody className="space-y-8">
                     {data.map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50 py-8 text-center">
                           <td className="border px-2 py-4.5 text-xs">
                              {row.tipo_contrato}
                           </td>
                           <td className="border px-2 py-4.5 text-xs">
                              {row.regimen}
                           </td>
                        
                           {/* <td className="border px-2 py-4.5 text-xs">
                              {formatearFecha(row.fecha_ingreso)}
                           </td> */}
                           <td className="border px-2 py-4.5 text-xs">
                              {row.dias_laborados}
                           </td>
                           <td className="border px-2 py-4.5 text-xs">
                              {Number(row.sueldo_base).toFixed(2)}
                           </td>
                           <td className="border px-2 py-4.5 text-xs">
                              {Number(row.sueldo_quincenal).toFixed(2)}
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
