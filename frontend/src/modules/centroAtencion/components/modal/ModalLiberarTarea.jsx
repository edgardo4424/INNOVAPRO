import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Unlock, X } from "lucide-react";
import { toast } from "react-toastify";
import centroAtencionService from "../../services/centroAtencionService";

export default function ModalLiberarTarea({
  open,
  setOpen,
  tarea,
  cerrarTarea,
}) {
  const handleLiberar = async () => {
    try {
      const { mensaje, tarea: data_respuesta } =
        await centroAtencionService.liberarTarea(tarea.id);
      if (data_respuesta) {
        toast.success(mensaje);
      }
    } catch (error) {
      toast.error("❌ Error interno al liberar la tarea");
    } finally {
      setOpen(false);
      cerrarTarea?.();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className=" flex cursor-pointer items-center gap-2 border-2 border-gray-300 bg-white text-gray-600 transition-all duration-300 hover:scale-105 hover:bg-white hover:text-black">
          <Unlock className="size-5 transform transition-transform duration-500 " />
          <span className="hidden md:block">LIBERAR</span>
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white/95 px-6 pt-10 pb-6 shadow-2xl backdrop-blur-md">
        {/* Botón cerrar */}
        <button
          onClick={() => setOpen(false)}
          //   disabled={isLoading}
          className="absolute top-4 right-4 text-black transition-colors hover:text-red-600"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Encabezado */}
        <AlertDialogHeader className="space-y-1 text-center">
          <AlertDialogTitle className="text-2xl font-bold text-slate-800">
            Liberar tarea #{tarea?.id}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-sm text-slate-600">
           ¿Seguro de liberar esta tarea?
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Footer con botones */}
        <AlertDialogFooter className="mt-4 flex items-center !justify-center gap-x-5">
          <Button
            className={
              "cursor-pointer bg-red-500 text-lg transition-all duration-200 hover:scale-105 hover:bg-red-500"
            }
            onClick={() => setOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            className={
              "cursor-pointer bg-green-500 text-lg transition-all duration-200 hover:scale-105 hover:bg-green-500"
            }
            onClick={handleLiberar}
          >
            Liberar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
