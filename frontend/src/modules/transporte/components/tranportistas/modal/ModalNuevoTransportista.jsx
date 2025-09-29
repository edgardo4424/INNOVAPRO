import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ClipboardPlus, X } from "lucide-react";
import TransporteForm from "../form/TransporteForm";
  
  export default function ModalNuevoTransportista({ open, setOpen,Form, setForm, refresh }) {
    const closeModal = () => setOpen(false);
  
    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button className="bg-innova-blue hover:bg-innova-blue-hover cursor-pointer hover:scale-105">
            <ClipboardPlus />
            <span className="hidden md:block">Nuevo Transporte</span>
          </Button>
        </AlertDialogTrigger>
  
        <AlertDialogContent className="flex flex-col gap-4 md:min-w-3xl">
          {/* ❌ Botón cerrar arriba */}
          <button
            className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-red-600"
            onClick={closeModal}
          >
            <X />
          </button>
  
          {/* 🧾 Encabezado */}
          <AlertDialogHeader>
            <AlertDialogTitle>Datos del Transporte</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Ingresa los datos correctamente para crear o editar un transporte.
            </AlertDialogDescription>
          </AlertDialogHeader>
  
          {/* 📦 Formulario */}
          <TransporteForm closeModal={closeModal} refresh={refresh} Form={Form}  setForm={setForm}/>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  