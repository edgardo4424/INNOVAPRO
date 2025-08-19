import { useState } from "react";

import {
   AlertDialog,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import ObraForm from "../forms/ObraForm";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

export default function ModalAgregarObra({ onSubmit }) {
   const [open, setOpen] = useState(false);

   const handleCancel = (e) => {
      e.preventDefault();
      setOpen(false);
   };

   const closeModal = () => setOpen(false);

   return (
       <AlertDialog open={open} onOpenChange={setOpen}>
         <AlertDialogTrigger asChild>
            <Button variant={"secondary"}>
               <UserPlus />
               <span className="hidden md:block">Agregar Obra</span>
            </Button>
         </AlertDialogTrigger>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>Agrega una nueva obra</AlertDialogTitle>
               <AlertDialogDescription>
                  Ingresa los datos correctamente para registrar una obra
               </AlertDialogDescription>
            </AlertDialogHeader>
            <ObraForm
               onSubmit={onSubmit}
               closeModal={closeModal}
               handleCancel={handleCancel}

            />
         </AlertDialogContent>
      </AlertDialog>
     
   );
}
