import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function SolicitarCondicionesModal({ cotizacion, onConfirmar, children }) {
  const [open, setOpen] = useState(false);
  const [tiempo, setTiempo] = useState("");
  const [referencia, setReferencia] = useState("");
  const [nota, setNota] = useState("");
  const [estimadoEquipo, setEstimadoEquipo] = useState("");

  const handleConfirmar = () => {
    const extras = {
      tiempo: tiempo.trim(),
      referencia: referencia.trim(),
      nota: nota.trim(),
      estimadoEquipo: estimadoEquipo.trim(),
    };
    onConfirmar(cotizacion, extras);
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <div onClick={() => setOpen(true)}>{children}</div>
      </AlertDialogTrigger>

      <AlertDialogContent className="sm:max-w-[60%] md:max-w-[60%] lg:max-w-[40%] xl:max-w-[30%]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">Solicitar condiciones de alquiler</AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-gray-600">
            Completa los siguientes campos antes de enviar la solicitud al área de administración.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col gap-2 ">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-800">Tiempo estimado</label>
            <Input
              placeholder="Ej: 4 meses aprox"
              value={tiempo}
              onChange={(e) => setTiempo(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-800">Estimado de equipo</label>
            <Input
                placeholder="Ej: 20 puntales aprox"
                value={estimadoEquipo}
                onChange={(e) => setEstimadoEquipo(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-800">Referencia</label>
            <Input
              placeholder="Ej: Central, Techado, Cliente X"
              value={referencia}
              onChange={(e) => setReferencia(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-800">Nota</label>
            <Textarea
              placeholder="Ej: Cliente me está pidiendo con urgencia..."
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel className="text-sm">Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmar}
          >
            Enviar solicitud
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}