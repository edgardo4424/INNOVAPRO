import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
   Tooltip,
   TooltipContent,
   TooltipProvider,
   TooltipTrigger,
} from "@/components/ui/tooltip";
import { Eye } from "lucide-react";
import DetalleVacacionesModal from "./DetalleVacacionesModal";
import { obtenerContratoActual } from "../utils/contrato_actual";

const TableTrabajadoresVacaciones = ({ filteredEmployees }) => {
   const fechaIngreso = (contratos) => {
      if (contratos.length === 0) return null;
      const ordenados = [...contratos].sort(
         (a, b) => new Date(a.fecha_inicio) - new Date(b.fecha_inicio)
      );
      return ordenados[0].fecha_inicio;
   };
   console.log(filteredEmployees);

   return (
      <div className="overflow-x-auto">
         <table className="w-full">
            <thead>
               <tr className="border-b text-xs">
                  <th className="text-left py-3 px-4 font-medium">Empleado</th>
                  <th className="text-left py-3 px-4 font-medium">
                     Razón Social
                  </th>
                  <th className="text-left py-3 px-4 font-medium">Área</th>
                  <th className="text-left py-3 px-4 font-medium">
                     Días Tomados
                  </th>
                  <th className="text-left py-3 px-4 font-medium">
                     Días Vendidos
                  </th>
                  <th className="py-3 px-4 font-medium text-center">
                     Acciones
                  </th>
               </tr>
            </thead>
            <tbody>
               {filteredEmployees.map((employee) => {
                  const totalTomado = employee.vacaciones.reduce(
                     (sum, vac) => sum + vac.dias_tomados,
                     0
                  );
                  const totalVendido = employee.vacaciones.reduce(
                     (sum, vac) => sum + vac.dias_vendidos,
                     0
                  );
                  const filialActual = obtenerContratoActual(
                     employee.contratos_laborales
                  );

                  return (
                     <tr
                        key={employee.id}
                        className="border-b hover:bg-gray-50"
                     >
                        <td className="py-3 px-4">
                           <div>
                              <div className="font-medium">{`${employee.nombres} ${employee.apellidos}`}</div>
                              <div className="text-sm text-gray-500">
                                 Ingreso:{" "}
                                 {fechaIngreso(employee.contratos_laborales)
                                    ? fechaIngreso(employee.contratos_laborales)
                                    : "No disponible"}
                              </div>
                           </div>
                        </td>
                        <td className="py-3 px-1.5 max-w-28 ">
                           <TooltipProvider>
                              <Tooltip>
                                 <TooltipTrigger asChild>
                                    <div className="truncate text-sm lowercase">
                                       {filialActual?.razon_social}
                                    </div>
                                 </TooltipTrigger>
                                 <TooltipContent>
                                    {filialActual?.razon_social}
                                 </TooltipContent>
                              </Tooltip>
                           </TooltipProvider>
                        </td>
                        <td className="py-3 px-4 text-xs">
                           {employee.cargo.area.nombre}
                        </td>
                        <td className="py-3 px-4">{totalTomado}</td>
                        <td className="py-3 px-4">
                           <Badge
                              variant="outline"
                              className="text-green-600 border-green-600"
                           >
                              {totalVendido}
                           </Badge>
                        </td>
                        <td className="py-3 px-4  text-center">
                           <DetalleVacacionesModal datosEmpleado={employee} />
                        </td>
                     </tr>
                  );
               })}
            </tbody>
         </table>
      </div>
   );
};
export default TableTrabajadoresVacaciones;
