import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { UserRoundSearch, X } from "lucide-react";
import ChoferForm from "../../forms/ChoferForm";

export default function ModalChoferes({ open, setOpen }) {
  const closeModal = () => {
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <div className="flex items-start justify-start md:items-end">
        <AlertDialogTrigger asChild>
          <Button className="text-innova-blue size-[10px] cursor-pointer bg-white hover:scale-105 hover:bg-white hover:text-yellow-500">
            <span className="flex text-xs">
              <UserRoundSearch className="size-5" />
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
          <AlertDialogTitle>Lista de Choferes</AlertDialogTitle>
          <AlertDialogDescription className="hidden text-center md:block">
            Al seleccionar un chofer se plasmara en la guia de remision
          </AlertDialogDescription>
        </AlertDialogHeader>

        <ChoferForm closeModal={closeModal} />
      </AlertDialogContent>
    </AlertDialog>
  );
}
