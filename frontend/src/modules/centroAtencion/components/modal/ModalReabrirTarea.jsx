import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, RotateCcw, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import centroAtencionService from "../../services/centroAtencionService";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function ModalReabrirTarea({
  open,
  setOpen,
  tarea,
  cerrarTarea,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [respuesta, setRespuesta] = useState("");
  const [tipoSolicitud, setTipoSolicitud] = useState("");
  const [renderSolicitud, setRenderSolicitud] = useState(false);
  const [checkSolicitud, setCheckSolicitud] = useState(false);

  const handleConfirm = async () => {
    if (!respuesta.trim()) {
      toast.warning("Debes ingresar una descripción del motivo");
      return;
    }
    try {
      setIsLoading(true);
      const payload = {
        correccion: respuesta,
      };
      if (
        tarea?.detalles?.pedido_id &&
        tarea?.detalles?.tipoSolicitud &&
        checkSolicitud &&
        renderSolicitud
      ) {
        payload.detalles = {
          ...tarea.detalles,
          tipoSolicitudAnterior: tarea?.detalles?.tipoSolicitud,
          tipoSolicitud: tipoSolicitud,
        };
      }
      const { status, success, mensaje } =
        await centroAtencionService.corregirTarea(tarea.id, payload);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTipoSolicitud(value);
  };

  useEffect(() => {
    if (open) {
      if (tarea?.detalles?.pedido_id && tarea?.detalles?.tipoSolicitud) {
        setTipoSolicitud(tarea?.detalles?.tipoSolicitud);
        setRenderSolicitud(true);
      }
    }
  }, [open]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="group flex cursor-pointer items-center gap-2 bg-blue-600 text-white transition-all hover:bg-blue-700">
          <RotateCcw className="size-5 transform transition-transform duration-500 group-hover:rotate-[360deg]" />
          <span className="hidden md:block">REABRIR TAREA</span>
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
            Reabrir tarea #{tarea?.id}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-sm text-slate-600">
            {`¿Estas seguro de reabrir la tarea #${tarea?.id}?`}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div>
          {renderSolicitud && (
            <div className="flex justify-between space-y-2">
              <div className="flex w-full items-end justify-start gap-x-4">
                <Label
                  htmlFor="tipoSolicitud"
                  className="font-semibold text-gray-700"
                >
                  Actualizar el tipo de solicitud ?
                </Label>
                <Input
                  type="checkbox"
                  name="checkSolicitud"
                  id="checkSolicitud"
                  checked={checkSolicitud}
                  className={"size-5 shadow-none"}
                  onChange={(e) => setCheckSolicitud(!checkSolicitud)}
                />
              </div>
              <div>
                <Select
                  name="tipoSolicitud"
                  value={tipoSolicitud}
                  disabled={!checkSolicitud}
                  onValueChange={(e) =>
                    handleChange({
                      target: { name: "tipoSolicitud", value: e },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione la acción..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nuevo Despiece">
                      Nuevo Despiece
                    </SelectItem>
                    <SelectItem value="Validación de Stock">
                      Validación de Stock / Material
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          {/* Descripción */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="descripcion"
              className="text-sm font-medium text-slate-700"
            >
              Descripción / Detalle
            </label>
            <Textarea
              id="descripcion"
              value={respuesta}
              onChange={(e) => setRespuesta(e.target.value)}
              placeholder="Ejemplo: Se requiere corregir las medidas del plano adjunto..."
              className="h-32 resize-none border-slate-300 text-sm focus:border-blue-600 focus:ring-blue-600"
              disabled={isLoading}
            />
          </div>
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
