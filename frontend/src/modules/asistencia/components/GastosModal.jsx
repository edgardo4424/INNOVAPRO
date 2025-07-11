import {
   AlertDialog,
   AlertDialogContent,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";
import { Briefcase } from "lucide-react";
import { useState } from "react";
import { useGastos } from "../hooks/useGastos";

const GastosModal = ({ trabajador, asistencia, onUpdateGastos }) => {

   const { nuevaDescripcion,
      setNuevaDescripcion,
      nuevoMonto,
      setNuevoMonto,
      agregarGasto,
      eliminarGasto } = useGastos(asistencia, onUpdateGastos)
   return (
      <AlertDialog>
         <AlertDialogTrigger asChild>
            <Button variant={'outline'} size={'sm'}>
               <Briefcase className="h-3 w-3" />
               Gastos ({asistencia.gastos.length})
            </Button>
         </AlertDialogTrigger>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>
                  Gastos - {trabajador.nombres} {trabajador.apellidos}
               </AlertDialogTitle>
            </AlertDialogHeader>
            <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
               {asistencia.gastos.map((gasto) => (
                  <div
                     key={gasto.id}
                     className="flex justify-between items-center p-2 bg-gray-50 rounded"
                  >
                     <div>
                        <p className="text-sm font-medium">
                           {gasto.descripcion}
                        </p>
                        <p className="text-xs text-gray-600">
                           S/ {gasto.monto}
                        </p>
                     </div>
                     <Button
                        variant="outline"
                        size="sm"
                        onClick={() => eliminarGasto(gasto.id)}
                        className="text-red-600 hover:text-red-700"
                     >
                        ×
                     </Button>
                  </div>
               ))}
            </div>

            {/* Agregar Nuevo Gasto */}
            <div className="space-y-3">
               <div>
                  <Label className="text-xs">Descripción</Label>
                  <Input
                     placeholder="Ej: Transporte, Almuerzo, Materiales"
                     value={nuevaDescripcion}
                     onChange={(e) => setNuevaDescripcion(e.target.value)}
                  />
               </div>
               <div>
                  <Label className="text-xs">Monto (S/)</Label>
                  <Input
                     type="number"
                     step="0.01"
                     placeholder="0.00"
                     value={nuevoMonto}
                     onChange={(e) => setNuevoMonto(e.target.value)}
                  />
               </div>
               <div className="flex gap-2">
                  <Button onClick={agregarGasto} size="sm" className="flex-1">
                     Agregar Gasto
                  </Button>
               </div>
            </div>

            {/* Total */}
            <div className="border-t pt-3 mt-4">
               <p className="text-sm font-semibold">
                  Total: S/{" "}
                  {asistencia.gastos
                     .reduce((sum, g) => sum + g.monto, 0)
                     }
               </p>
            </div>
            <AlertDialogFooter>
               <AlertDialogCancel>Cerrar</AlertDialogCancel>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   );
};
export default GastosModal;
