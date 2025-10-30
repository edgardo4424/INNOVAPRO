import React, { useEffect, useState } from "react";
import { Clock, Archive, Package } from "lucide-react";
import CardPedido from "../card/CardPedido";
import pedidosService from "../../service/PedidosService";

const pedidosConfirmados = [
  {
    id: 2,
    contrato_id: 2,
    ref_contrato: "EI-CC-COM-LR1-0002_1",
    filial: "20562974998",
    razon_social: "ENCOFRADOS INNOVA S.A.C.",
    cliente_ruc: "12345678952",
    cliente_razon_social: "Fc barcelona",
    guias: [
      {
        id: 2,
        guia_nro: "T005-00005094",
      },
      {
        id: 1,
        guia_nro: "T005-00005090",
      },
    ],
    estado: "Incompleto",
    fecha_confirmacion: "2025-10-20T22:40:18.000Z",
  },
  {
    id: 4,
    contrato_id: 3,
    ref_contrato: "IA-CC-COM-LR1-0003_1",
    filial: "20555389052",
    razon_social: "INDEK ANDINA E.I.R.L",
    cliente_ruc: "78521495634",
    cliente_razon_social: "Atletico de madrid",
    guias: [],
    estado: "Stock Confirmado",
    fecha_confirmacion: "2025-11-28T22:40:18.000Z",
  },
];

const pedidosAlmacen = [
  {
    id: 2,
    contrato_id: 2,
    ref_contrato: "EI-CC-COM-LR1-0002_1",
    filial: "20562974998",
    razon_social: "ENCOFRADOS INNOVA S.A.C.",
    cliente_ruc: "12345678952",
    cliente_razon_social: "Fc barcelona",
    pedido_guia_id: 4,
    guia_nro: "T005-00005094",
    estado: "Emitido",
    fecha_emision_guia: "2025-10-27T19:48:00.000Z",
    fecha_despacho: "2025-10-29",
    fecha_confirmacion: "2025-10-20T22:40:18.000Z",
  },
];

const pedidosDespachados = [
  {
    id: 2,
    contrato_id: 2,
    ref_contrato: "EI-CC-COM-LR1-0002_1",
    filial: "20562974998",
    razon_social: "ENCOFRADOS INNOVA S.A.C.",
    cliente_ruc: "12345678952",
    cliente_razon_social: "Fc barcelona",
    pedido_guia_id: 3,
    guia_nro: "T005-00005090",
    estado: "Despachado",
    fecha_emision_guia: "2025-10-27T19:48:00.000Z",
    fecha_despacho: "2025-10-29",
    fecha_confirmacion: "2025-10-20T22:40:18.000Z",
  },
];

const ContentPedidosTv = () => {
  const [pedidos, setPedidos] = useState({
    Confirmadas: pedidosConfirmados || [],
    Almacen: pedidosAlmacen || [],
    Despachados: pedidosDespachados || [],
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
      const { mensaje, confirmados, almacen, despachados } =
        await pedidosService.obtenerPasesPedidosTv(fechaActual);
      setPedidos({
        Confirmadas: confirmados.list || [],
        Almacen: almacen.list || [],
        Despachados: despachados.list || [],
      });
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
    }
  };

  useEffect(() => {
    setPedidos({
      Confirmadas: pedidosConfirmados || [],
      Almacen: pedidosAlmacen || [],
      Despachados: pedidosDespachados || [],
    });
  }, [pedidosConfirmados, pedidosAlmacen, pedidosDespachados]);

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
