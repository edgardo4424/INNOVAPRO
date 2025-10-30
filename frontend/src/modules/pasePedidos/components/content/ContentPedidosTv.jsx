import React, { useEffect, useState } from "react";
import { Clock, Archive, Package } from "lucide-react";
import CardPedido from "../card/CardPedido";
import pedidosService from "../../service/PedidosService";

const ContentPedidosTv = () => {
  const [pedidos, setPedidos] = useState({
    Confirmadas: [],
    Almacen: [],
    Despachados: [],
  });

  const getFechaActual = () => {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");
    return `${anio}-${mes}-${dia}`;
  };

  const obtenerPedidos = async () => {
    try {
      const fechaActual = getFechaActual();
      const { mensaje, confirmado, almacen, despachado } =
        await pedidosService.obtenerPasesPedidosTv(fechaActual);
      setPedidos({
        Confirmadas: confirmado.list || [],
        Almacen: almacen.list || [],
        Despachados: despachado.list || [],
      });
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
    }
  };

  useEffect(() => {
    obtenerPedidos();
  }, []);

  const COLUMNAS = [
    {
      title: "Confirmado",
      key: "Confirmado",
      icon: Clock,
      list: pedidos.Confirmadas,
      borderColor: "border-yellow-500/90",
    },
    {
      title: "Emitido",
      key: "Emitido",
      icon: Archive,
      list: pedidos.Almacen,
      borderColor: "border-blue-500/90",
    },
    {
      title: "Despachado",
      key: "Despachado",
      icon: Package,
      list: pedidos.Despachados,
      borderColor: "border-green-500/90",
    },
  ];

  return (
    <div className="font-mulish grid w-11/12 grid-cols-1 gap-[1px] bg-slate-900 md:grid-cols-3">
      {COLUMNAS.map((columna) => (
        <div
          key={columna.key}
          className={`border-t-6 ${columna.key !== "Despachados" && "border-r-2 border-r-slate-700"} bg-slate-800 ${columna.borderColor} flex h-full flex-col`}
        >
          {/* Encabezado de columna */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-700 bg-slate-900/80 p-4 backdrop-blur-md">
            <div className="flex items-center space-x-2">
              <columna.icon className="h-5 w-5 text-slate-400" />
              <h2 className="text-lg font-semibold tracking-tight !text-slate-100">
                {columna.title}
              </h2>
            </div>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-700 text-xs font-semibold text-slate-200">
              {columna.list.length}
            </span>
          </div>

          {/* Contenido */}
          <div className="scroll-hide flex flex-1 flex-col gap-y-3 overflow-y-auto p-3">
            {columna.list.length > 0 ? (
              columna.list.map((pedido) => (
                <CardPedido key={pedido.id} pedido={pedido} />
              ))
            ) : (
              <div className="p-8 text-center text-slate-500 italic">
                No hay pedidos en esta etapa.
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContentPedidosTv;
