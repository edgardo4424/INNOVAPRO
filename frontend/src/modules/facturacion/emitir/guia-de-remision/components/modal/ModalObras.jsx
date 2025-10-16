import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Construction, X } from "lucide-react";
import TablaObras from "../tabla/TablaObras";

export default function ModalObras({ open, setOpen }) {
  const closeModal = () => {
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <div className="flex items-start justify-start md:items-end">
        <AlertDialogTrigger asChild>
          <Button className="bg-innova-blue hover:bg-innova-blue-hover focus:ring-innova-blue cursor-pointer rounded-md p-2 text-white transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none">
            <span className="flex text-xs">
              <Construction className="size-5" />
            </span>
          </Button>
        </AlertDialogTrigger>
      </div>
      <AlertDialogContent className="flex flex-col gap-4 md:min-w-3xl">
        {/* ❌ Botón cerrar */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
          onClick={closeModal}
        >
          <X />
        </button>

        {/* 🧾 Encabezado */}
        <AlertDialogHeader>
          <AlertDialogTitle>Lista de Obras</AlertDialogTitle>
          <AlertDialogDescription className="hidden text-center md:block">
            Al seleccionar una fila, obra se plasmara en la guia de remision
            junto con el cliente
          </AlertDialogDescription>
        </AlertDialogHeader>

        <TablaObras />

      </AlertDialogContent>
    </AlertDialog>
  );
}
