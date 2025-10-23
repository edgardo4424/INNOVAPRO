import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, PersonStanding, X } from "lucide-react";
import { useState } from "react"; // Necesitas useState para manejar el loading

import { Button } from "@/components/ui/button";
import TablaPiezasVerificarStock from "../tabla/TablaPiezasVerificarStock";

let piezas = [
  {
    despiece_id: 792,
    pieza_id: 3,
    cantidad: 4,
    peso_kg: "15.60",
    precio_venta_dolares: "84.36",
    precio_venta_soles: "312.08",
    precio_alquiler_soles: "15.60",
    esAdicional: false,
    pieza_stock_actual: 76,
    estado: true,
    text: "Hay piezas disponibles",
  },
  {
    despiece_id: 793,
    pieza_id: 4,
    cantidad: 2,
    peso_kg: "87.02",
    precio_venta_dolares: "470.42",
    precio_venta_soles: "1740.56",
    precio_alquiler_soles: "87.02",
    esAdicional: false,
    pieza_stock_actual: 2688,
    estado: true,
    text: "Hay piezas disponibles",
  },
  {
    despiece_id: 794,
    pieza_id: 9,
    cantidad: 4,
    peso_kg: "28.64",
    precio_venta_dolares: "154.76",
    precio_venta_soles: "572.68",
    precio_alquiler_soles: "28.64",
    esAdicional: false,
    pieza_stock_actual: 1141,
    estado: true,
    text: "Hay piezas disponibles",
  },
  {
    despiece_id: 795,
    pieza_id: 13,
    cantidad: 7,
    peso_kg: "83.37",
    precio_venta_dolares: "450.45",
    precio_venta_soles: "1666.77",
    precio_alquiler_soles: "83.37",
    esAdicional: false,
    pieza_stock_actual: 35,
    estado: true,
    text: "Hay piezas disponibles",
  },
  {
    despiece_id: 796,
    pieza_id: 42,
    cantidad: 2,
    peso_kg: "13.92",
    precio_venta_dolares: "75.20",
    precio_venta_soles: "278.22",
    precio_alquiler_soles: "13.92",
    esAdicional: false,
    pieza_stock_actual: 839,
    estado: true,
    text: "Hay piezas disponibles",
  },
  {
    despiece_id: 797,
    pieza_id: 54,
    cantidad: 1,
    peso_kg: "15.81",
    precio_venta_dolares: "85.44",
    precio_venta_soles: "316.13",
    precio_alquiler_soles: "15.81",
    esAdicional: false,
    pieza_stock_actual: 2172,
    estado: true,
    text: "Hay piezas disponibles",
  },
  {
    despiece_id: 798,
    pieza_id: 70,
    cantidad: 2,
    peso_kg: "65.48",
    precio_venta_dolares: "353.90",
    precio_venta_soles: "1309.42",
    precio_alquiler_soles: "65.48",
    esAdicional: false,
    pieza_stock_actual: 876,
    estado: true,
    text: "Hay piezas disponibles",
  },
  {
    despiece_id: 799,
    pieza_id: 76,
    cantidad: 2,
    peso_kg: "65.48",
    precio_venta_dolares: "353.90",
    precio_venta_soles: "1309.42",
    precio_alquiler_soles: "65.48",
    esAdicional: false,
    pieza_stock_actual: 2937,
    estado: true,
    text: "Hay piezas disponibles",
  },
  {
    despiece_id: 800,
    pieza_id: 83,
    cantidad: 1,
    peso_kg: "132.91",
    precio_venta_dolares: "718.44",
    precio_venta_soles: "2658.21",
    precio_alquiler_soles: "132.91",
    esAdicional: false,
    pieza_stock_actual: 1648,
    estado: true,
    text: "Hay piezas disponibles",
  },
  {
    despiece_id: 801,
    pieza_id: 97,
    cantidad: 2,
    peso_kg: "11.86",
    precio_venta_dolares: "64.16",
    precio_venta_soles: "237.38",
    precio_alquiler_soles: "11.86",
    esAdicional: false,
    pieza_stock_actual: 592,
    estado: true,
    text: "Hay piezas disponibles",
  },
  {
    despiece_id: 802,
    pieza_id: 100,
    cantidad: 2,
    peso_kg: "4.48",
    precio_venta_dolares: "24.18",
    precio_venta_soles: "89.50",
    precio_alquiler_soles: "4.48",
    esAdicional: false,
    pieza_stock_actual: 785,
    estado: true,
    text: "Hay piezas disponibles",
  },
  {
    despiece_id: 803,
    pieza_id: 149,
    cantidad: 2,
    peso_kg: "0.30",
    precio_venta_dolares: "8.10",
    precio_venta_soles: "30.00",
    precio_alquiler_soles: "0.00",
    esAdicional: false,
    pieza_stock_actual: 1516,
    estado: true,
    text: "Hay piezas disponibles",
  },
  {
    despiece_id: 804,
    pieza_id: 156,
    cantidad: 8,
    peso_kg: "72.00",
    precio_venta_dolares: "389.20",
    precio_venta_soles: "1440.00",
    precio_alquiler_soles: "72.00",
    esAdicional: false,
    pieza_stock_actual: 360,
    estado: true,
    text: "Hay piezas disponibles",
  },
  {
    despiece_id: 805,
    pieza_id: 163,
    cantidad: 8,
    peso_kg: "12.00",
    precio_venta_dolares: "64.88",
    precio_venta_soles: "240.00",
    precio_alquiler_soles: "0.00",
    esAdicional: false,
    pieza_stock_actual: 166,
    estado: true,
    text: "Hay piezas disponibles",
  },
  {
    despiece_id: 806,
    pieza_id: 165,
    cantidad: 8,
    peso_kg: "12.00",
    precio_venta_dolares: "64.88",
    precio_venta_soles: "240.00",
    precio_alquiler_soles: "0.00",
    esAdicional: false,
    pieza_stock_actual: 7,
    estado: false,
    text: "Piezas insuficientes",
  },
];

export default function ModalValidarStock({
  open,
  setOpen,
  cotizacion_id,
  pedidoView,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [piezasRecibidas, setPiezasRecibidas] = useState([]);
  const [estadoStock, setEstadoStock] = useState(null); // null = sin validar

  const bgBotonEstado = (estado) => {
    switch (estado) {
      case true:
        return "bg-green-500";
      case false:
        return "bg-red-500";
      default:
        return "bg-blue-500";
    }
  };

  const handleValidar = async () => {
    try {
      setIsLoading(true);
      setEstadoStock(null);

      setTimeout(() => {
        // const piezas = ... // datos desde backend
        const piezasOrdenadas = [...piezas].sort(
          (a, b) => Number(a.estado) - Number(b.estado),
        );
        setPiezasRecibidas(piezasOrdenadas);
        setEstadoStock(false);
      }, 2500);
    } catch (error) {
      console.error("❌ Error al validar stock:", error);
      setEstadoStock(null);
    } finally {
      // Se libera el loader un poco después para efecto suave
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
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
              {pedidoView?.nro_Pedido || "—"}
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
              <p className="italic">No hay piezas registradas.</p>
            </div>
          )}
        </div>

        {/* 🟢 Botón de acción */}
        <div className="flex justify-center">
          <Button
            onClick={handleValidar}
            disabled={estadoStock !== null || isLoading}
            className={`w-full max-w-xs font-semibold transition-colors ${bgBotonEstado(estadoStock)} ${isLoading ? "cursor-not-allowed" : `hover:${bgBotonEstado(estadoStock)} hover:text-white`}`}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Consultando...
              </>
            ) : estadoStock !== null ? (
              <>
                {estadoStock
                  ? "El Stock cumple con el pedido"
                  : "El Stock no cumple con el pedido"}
              </>
            ) : (
              "Validar Stock"
            )}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
