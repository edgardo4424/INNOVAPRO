import { useState } from "react";
import ObraForm from "../forms/ObraForm";

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

export default function ModalEditarObra({ obra, onSubmit }) {

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
          <AlertDialogTitle>Editar Obra</AlertDialogTitle>
        </AlertDialogHeader>
        <ObraForm
          modo="editar"
          obra={obra}
          closeModal={handleClose}
          handleCancel={handleCancel}
          onSubmit={onSubmit}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
}