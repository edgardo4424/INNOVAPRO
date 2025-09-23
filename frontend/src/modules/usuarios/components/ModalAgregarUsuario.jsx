import { Button } from "@/components/ui/button";
import UsuarioForm from "../forms/UsuarioForm";
import { UserPlus, X } from "lucide-react";
import {
   AlertDialog,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTrigger,
   AlertDialogContent,
   AlertDialogTitle,
   AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export default function ModalAgregarUsuario({
   onSubmit,
   trabajadores
}) {
   const [open, setOpen] = useState(false);

   const handleCancel = (e) => {
      e.preventDefault();
      setOpen(false);
   };

   const handleClose=()=>setOpen(false)

   return (
      <AlertDialog open={open} onOpenChange={setOpen}>
         <AlertDialogTrigger asChild>
            <Button className="btn-agregar">
               <UserPlus />
               <span className="hidden md:block">Crear Usuario</span>
            </Button>
         </AlertDialogTrigger>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>Crear usuario</AlertDialogTitle>
               <AlertDialogDescription className="text-center">
                  Completa los datos correctamente para crear un usuario
               </AlertDialogDescription>
            </AlertDialogHeader>
               <UsuarioForm
                  modo="crear"
                  onSubmit={onSubmit}
                  closeModal={handleClose}
                  handleCancel={handleCancel}
                  trabajadores={trabajadores}
               />

         </AlertDialogContent>
      </AlertDialog>
   );
}
