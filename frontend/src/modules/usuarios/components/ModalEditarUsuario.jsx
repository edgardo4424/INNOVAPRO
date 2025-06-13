import UsuarioForm from "../forms/UsuarioForm";
import { DialogContent } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import {
   AlertDialog,
   AlertDialogContent,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export default function ModalEditarUsuario({
   onSubmit,
   user,
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
            <Button
               variant="outline"
               size={"icon"}
               className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
            >
               <Edit className="h-4 w-4" />
            </Button>
         </AlertDialogTrigger>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>Editar usuario</AlertDialogTitle>
            </AlertDialogHeader>
            <UsuarioForm
               modo="editar"
               usuario={user}
               onSubmit={onSubmit}
               closeModal={handleClose}
               handleCancel={handleCancel}
            />
         </AlertDialogContent>
      </AlertDialog>
   );
}
