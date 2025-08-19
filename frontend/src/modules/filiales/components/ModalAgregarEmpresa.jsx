import {
   AlertDialog,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { BadgePlus } from "lucide-react";
import { useState } from "react";
import EmpresaForm from "../forms/EmpresaForm";

export default function ModalAgregarEmpresa({
   onSubmit,
}) {
   const [open, setOpen] = useState(false);

   const handleCancel = (e) => {
      e.preventDefault();
      setOpen(false);
   };

   const handleClose = () => setOpen(false);

   return (
      <AlertDialog open={open} onOpenChange={setOpen}>
         <AlertDialogTrigger asChild>
            <Button variant={"secondary"}>
               <BadgePlus />
               <span className="hidden md:block">Agregar Filial</span>
            </Button>
         </AlertDialogTrigger>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>Crear Filial</AlertDialogTitle>
               <AlertDialogDescription className="text-center">
                  Complete correctamente los datos para crear la Filial
               </AlertDialogDescription>
            </AlertDialogHeader>
            <EmpresaForm
               onSubmit={onSubmit}
               closeModal={handleClose}
               handleCancel={handleCancel}
            />
         </AlertDialogContent>
      </AlertDialog>
   );
}
