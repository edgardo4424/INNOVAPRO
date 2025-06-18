import { useState } from "react";
import ObraForm from "../forms/ObraForm";
import { Button } from "@/components/ui/button";
import { BadgePlus, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
export default function ModalAgregarObra({  onSubmit }) {

  const [open, setOpen] = useState(false);

  const handleCancel = (e) => {
    e.preventDefault();
    setOpen(false);
  };

  const handleClose = () => setOpen(false)

  return (
 
  
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="btn-agregar">
           <BadgePlus />
          <span className="hidden md:block">Agregar Obra</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Crear obra</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Completa los datos correctamente para crear una obra
          </AlertDialogDescription>
        </AlertDialogHeader>
        <ObraForm
         modo="crear"

          closeModal={handleClose}
          handleCancel={handleCancel}
          onSubmit={onSubmit}
        />
      </AlertDialogContent>
    </AlertDialog>


  );
}