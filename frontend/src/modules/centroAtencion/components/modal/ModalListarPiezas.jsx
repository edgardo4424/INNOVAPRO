import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { View, X } from "lucide-react";
import { useEffect, useState } from "react"; // Necesitas useState para manejar el loading

import { Button } from "@/components/ui/button";
import centroAtencionService from "../../services/centroAtencionService";
import TablaListaPïezas from "../tabla/TablaListaPïezas";

export default function ModalListarPiezas({
  open,
  setOpen,
  cotizacion_id,
  content,
}) {
  const [listaPiezas, setListaPiezas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const ObtenerCotizacion = async () => {
    const { cotizacion, despiece, uso_nombre, zonas } =
      await centroAtencionService.obtenerCotizacion(cotizacion_id);

    setListaPiezas(despiece);
    console.log(despiece);
  };
  useEffect(() => {
    if (open) {
      ObtenerCotizacion();
    }
  }, [open]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="cursor-pointer bg-green-500 duration-300 hover:scale-105 hover:bg-green-600">
          <View />
          <span className="hidden md:block">Ver piezas de este pedido</span>
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="flex flex-col gap-6 border border-slate-200 bg-white/95 pt-10 shadow-xl backdrop-blur-md md:max-w-3xl">
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
            Lista de Piezas
          </AlertDialogTitle>
          <AlertDialogDescription className="mt-1 text-sm text-slate-600">
            {""}
          </AlertDialogDescription>
        </div>

            {/* 📦 Contenido */}
        <TablaListaPïezas piezasRecibidas={listaPiezas} />
      </AlertDialogContent>
    </AlertDialog>
  );
}
