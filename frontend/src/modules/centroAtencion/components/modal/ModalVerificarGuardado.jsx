import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { SaveAll, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import Loader from "@/shared/components/Loader";

export default function ModalVerificarGuardado({
  open,
  setOpen,
  loading,
  handleFormSubmit,
  mensaje = "¿estas seguro de esta accion?",
  isLoading,
}) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className={"gap-x-2 bg-blue-500 text-lg text-white"}>
          <SaveAll className="size-6" />
          <span>Guardar Nuevo Despiece</span>
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="flex flex-col gap-6 border border-slate-200 bg-white/95 pt-10 shadow-xl backdrop-blur-md">
        {/* ❌ Botón cerrar */}
        <button
          onClick={() => setOpen(false)}
          disabled={isLoading}
          className="absolute top-4 right-4 cursor-pointer text-slate-500 transition-colors hover:text-red-600"
        >
          <X />
        </button>

        {/* 🧾 Encabezado */}
        <div className="flex flex-col items-center text-center">
          <AlertDialogTitle className="text-xl font-bold text-slate-800">
            {""}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-md mt-1 text-gray-800">
            {mensaje}
          </AlertDialogDescription>
        </div>

        {/* 📦 Contenido */}
        <div className="flex justify-around">
          {isLoading ? (
            <div className="animate-spin">
              <Loader className="animate-spin text-green-500" />
            </div>
          ) : (
            <>
              <button
                disabled={isLoading}
                className="cursor-pointer rounded-xl border-2 border-red-500 bg-red-500 px-4 py-2 text-white transition-all duration-150 hover:scale-105"
              >
                Cancelar
              </button>
              <button
                onClick={handleFormSubmit}
                disabled={isLoading}
                className="cursor-pointer rounded-xl border-2 border-green-500 bg-green-500 px-4 py-2 text-white transition-all duration-150 hover:scale-105"
              >
                Guardar
              </button>
            </>
          )}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
