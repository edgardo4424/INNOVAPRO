import {
   AlertDialog,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ContactoForm from "../forms/ContactoForm";
import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ModalAgregarContacto({ clientes, obras, onSubmit }) {
   const [open, setOpen] = useState(false);
   const handleCancel = (e) => {
      e.preventDefault();
      setOpen(false);
   };

   const closeModal = () => {
      setOpen(false);
   };

   return (
      <AlertDialog open={open} onOpenChange={setOpen}>
         <AlertDialogTrigger asChild>
            <Button className="btn-agregar">
               <UserPlus />
               <span className="hidden md:block">Agregar Contacto</span>
            </Button>
         </AlertDialogTrigger>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>Agrega un nuevo contacto</AlertDialogTitle>
               <AlertDialogDescription>
                  Ingresa los dato correctamente para crear un contacto
               </AlertDialogDescription>
            </AlertDialogHeader>
            <ContactoForm
               onSubmit={onSubmit}
               closeModal={closeModal}
               handleCancel={handleCancel}
               clientes={clientes}
               obras={obras}
            />
         </AlertDialogContent>
      </AlertDialog>
   );
}
