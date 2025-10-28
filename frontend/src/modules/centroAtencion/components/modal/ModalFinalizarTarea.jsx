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
import { Check, X } from "lucide-react";
import centroAtencionService from "../../services/centroAtencionService";

export default function ModalFinzalizarTarea({
  open,
  setOpen,
  tarea,
  cerrarTarea,
}) {

  const handleFinalizar = async () => {
    try {
      const {mensaje,tarea:data_respuesta} = await centroAtencionService.finalizarTarea(tarea.id);
    if(data_respuesta && tarea?.detalles?.pedido_id && tipoSolicitud === "Validación de Stock"){
        const {mensaje} = await centroAtencionService.actualizarPasePedido(tarea?.detalles?.pedido_id);
    }
        
    
    } catch (error) {}
  };

  console.log(tarea?.detalles?.pedido_id);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="group flex cursor-pointer items-center gap-2 bg-teal-500 text-white transition-all hover:bg-teal-500">
          <Check className="size-5 transform transition-transform duration-500 group-hover:rotate-[360deg]" />
          <span className="hidden md:block">FINALIZAR</span>
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
            Finalizar tarea #{tarea?.id}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-sm text-slate-600">
            Despues de finalizar la tarea no se podra reabrir
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
            onClick={() => setOpen(false)}
          >
            Finalizar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
