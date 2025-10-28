import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Loader2,
  PackageCheck,
  PackageX,
  PersonStanding,
  Warehouse,
  X
} from "lucide-react";
import { useState } from "react"; // Necesitas useState para manejar el loading

import { Button } from "@/components/ui/button";
import centroAtencionService from "../../services/centroAtencionService";
import TablaPiezasVerificarStock from "../tabla/TablaPiezasVerificarStock";

export default function ModalValidarStock({
  open,
  setOpen,
  cotizacion_id,
  actNuevoDespieze,
  setActNuevoDespiece,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [piezasRecibidas, setPiezasRecibidas] = useState([]);
  const [estadoStock, setEstadoStock] = useState(null);

  const handleValidar = async () => {
    try {
      setIsLoading(true);
      setEstadoStock(null);
      const { piezas, estado } =
        await centroAtencionService.validarStockCotizacion(cotizacion_id);

      const piezasOrdenadas = [...piezas].sort(
        (a, b) => Number(a.estado) - Number(b.estado),
      );
      setPiezasRecibidas(piezasOrdenadas);
      setEstadoStock(estado);
    } catch (error) {
      console.error("❌ Error al validar stock:", error);
      setEstadoStock(null);
    } finally {
      setIsLoading(false);
    }
  };

  const activarDespiece = () => {
    setActNuevoDespiece(!actNuevoDespieze);
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="cursor-pointer bg-green-500 duration-300 hover:scale-105 hover:bg-green-600">
          <Warehouse />
          <span className="hidden md:block">VALIDAR STOCK</span>
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
            Verificación de Stock de Pedido
          </AlertDialogTitle>
          <AlertDialogDescription className="mt-1 text-sm text-slate-600">
            Confirma la disponibilidad de stock para el pedido N°{" "}
            <span className="font-semibold text-slate-900">
              {/* {content?.nro_Pedido || "—"} */}
            </span>
          </AlertDialogDescription>
        </div>

        {/* 📋 Contenido: Tabla de Piezas */}
        <div className="max-h-80 w-full bg-slate-50 pb-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-500">
              <Loader2 className="mb-3 h-8 w-8 animate-spin text-blue-500" />
              <p className="text-sm">Validando stock...</p>
            </div>
          ) : estadoStock !== null && piezasRecibidas.length > 0 ? (
            <TablaPiezasVerificarStock piezasRecibidas={piezasRecibidas} />
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-slate-500">
              <PersonStanding className="mb-2 h-10 w-10 opacity-50" />
              <p className="italic">Consulta tu stock</p>
            </div>
          )}
        </div>

        {/* 🟢 Botón de acción */}
        <div className="flex justify-center">
          {estadoStock == null && (
            <Button
              onClick={handleValidar}
              disabled={estadoStock !== null || isLoading}
              className={`w-full max-w-[200px] bg-blue-500 font-semibold transition-colors hover:bg-blue-600`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Consultando...
                </>
              ) : (
                "Validar Stock"
              )}
            </Button>
          )}
          {estadoStock !== null && (
            <div className="gap-6">
              <div className="grid grid-cols-2">
                {estadoStock ? (
                  <div className="col-span-2 w-full rounded-2xl border border-green-400 bg-green-100 px-4 py-4 text-center text-green-700 shadow-sm">
                    <h1 className="flex gap-x-3 text-lg font-semibold">
                      <PackageCheck />{" "}
                      <span>El stock cumple con las piezas solicitadas</span>
                    </h1>
                  </div>
                ) : (
                  <>
                    <div className="flex w-full items-center justify-center rounded-2xl border border-orange-400 bg-orange-100 text-center text-orange-700 shadow-sm">
                      <h1 className="flex items-center gap-x-2 p-2 text-sm font-semibold">
                        <PackageX />
                        <span>
                          El stock no cumple con las piezas solicitadas
                        </span>
                      </h1>
                    </div>
                    <div className="flex justify-center">
                      <Button
                        className={`cursor-pointer rounded-xl px-5 py-2 font-medium text-white shadow-md transition-all duration-300 ${actNuevoDespieze ? "bg-green-500 hover:bg-green-600" : "bg-orange-500 hover:bg-orange-600"} `}
                        onClick={activarDespiece}
                      >
                        {actNuevoDespieze
                          ? "Desactivar Nuevo Despiece"
                          : "Activar Nuevo Despiece"}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
