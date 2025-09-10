"use client";

import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Lock } from "lucide-react"; // 👈 asegúrate de tener lucide-react instalado
import { useState } from "react";

export function ModalCerrarPlanilla({ guardarPlanilla }) {
   const [isOpen, setIsOpen] = useState(false);
   const handleClose = () => {
      setIsOpen(false);
   };

   const handleSave = () => {
      guardarPlanilla();
      handleClose();
   };

   return (
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
         <AlertDialogTrigger asChild>
            <Button
               variant="default"
               className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 shadow-md rounded-lg"
            >
               Guardar
            </Button>
         </AlertDialogTrigger>
         <AlertDialogContent className="max-w-lg rounded-xl shadow-xl border border-gray-200">
            <AlertDialogHeader className="flex items-center gap-2">
               <ShieldAlert className="h-6 w-6 text-red-600" />
               <AlertDialogTitle className="text-xl font-bold text-gray-900">
                  Confirmar guardado de registros
               </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription className="mt-3 text-gray-700 leading-relaxed text-base">
               ⚠️ Una vez confirmes, los registros de{" "}
               <span className="font-semibold">Planilla Mensual </span>
               quedarán{" "}
               <span className="font-semibold text-red-600">
                   guardados y bloqueados
               </span>
               .
               <br />
               <span className="flex items-center mt-2 text-gray-800">
                  <Lock className="h-4 w-4 mr-2 text-gray-600" />
                  No se podrán modificar a menos que realices el trámite
                  correspondiente.
               </span>
            </AlertDialogDescription>
            <AlertDialogFooter className="mt-6">
               <Button
                  className="px-5 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-800 font-medium"
                  onClick={handleClose}
               >
                  Cancelar
               </Button>
               <Button className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md" onClick={handleSave}>
                  Guardar
               </Button>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   );
}
