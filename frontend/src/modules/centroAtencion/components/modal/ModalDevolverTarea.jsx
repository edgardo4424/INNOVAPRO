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
import { Textarea } from "@/components/ui/textarea";
import { Loader2, RotateCcw, X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import centroAtencionService from "../../services/centroAtencionService";

export default function ModalDevolverTarea({
  open,
  setOpen,
  tarea,
  cerrarTarea,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [respuesta, setRespuesta] = useState("");

  const handleConfirm = async () => {
    if (!respuesta.trim()) {
      toast.warning("Debes ingresar una descripción del motivo");
      return;
    }

    try {
      setIsLoading(true);
      const { status } = await centroAtencionService.devolverTarea(tarea.id, {
        motivo: respuesta,
      });

      if (status === 200) {
        toast.success("✅ Tarea reabierta con éxito");
        setOpen(false);
        cerrarTarea?.();
      } else {
        toast.error("❌ No se pudo reabrir la tarea");
      }
    } catch (error) {
      console.error("Error al reabrir tarea:", error);
      toast.error("❌ Error interno al reabrir la tarea");
    } finally {
      setIsLoading(false);
    }
  };
  console.log(tarea.detalles);
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="group flex cursor-pointer items-center gap-2 bg-amber-500 text-white transition-all hover:bg-amber-500">
          <RotateCcw className="size-5 transform transition-transform duration-500 group-hover:rotate-[360deg]" />
          <span className="hidden md:block">DEVOLVER</span>
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white/95 px-6 pt-10 pb-6 shadow-2xl backdrop-blur-md md:max-w-2xl">
        {/* Botón cerrar */}
        <button
          onClick={() => setOpen(false)}
          disabled={isLoading}
          className="absolute top-4 right-4 text-slate-400 transition-colors hover:text-red-600"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Encabezado */}
        <AlertDialogHeader className="space-y-1 text-center">
          <AlertDialogTitle className="text-2xl font-bold text-slate-800">
            Devolver tarea #{tarea?.id}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-slate-600">
            {""}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Descripción */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="descripcion"
            className="text-sm font-medium text-slate-700"
          >
            Descripción / Detalle del porque devuelve esta tarea
          </label>
          <Textarea
            id="descripcion"
            value={respuesta}
            onChange={(e) => setRespuesta(e.target.value)}
            placeholder="Ejemplo: No cumple con la especificación..."
            className="h-32 resize-none border-slate-300 text-sm focus:border-blue-600 focus:ring-blue-600"
            disabled={isLoading}
          />
        </div>

        {/* Footer con botones */}
        <AlertDialogFooter className="mt-4 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
            className="border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
          >
            {isLoading && (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            )}
            Confirmar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
