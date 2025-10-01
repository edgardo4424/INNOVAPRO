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
import VehiculoForm from "../form/VehiculoForm";

export default function ModalNuevoVehiculo({ open, setOpen }) {
  const closeModal = () => setOpen(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="bg-innova-blue hover:bg-innova-blue-hover cursor-pointer hover:scale-105">
          <ClipboardPlus />
          <span className="hidden md:block">Nuevo Vehiculo</span>
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
          <AlertDialogTitle>Datos del Vehiculo</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Ingresa los datos correctamente para crear o editar un Vehiculo.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* 📦 Formulario */}
        <VehiculoForm />
      </AlertDialogContent>
    </AlertDialog>
  );
}
