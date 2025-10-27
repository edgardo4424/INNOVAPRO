import React, { useEffect, useState } from "react";
import { Clock, Archive, Package } from "lucide-react";
import CardPedido from "../card/CardPedido";

const pedidosConfirmados = [
  {
    id: 1,
    contrato_id: 1,
    contrato_nombre: "Contrato A",
    filial: "22235154875",
    razon_social: "Encofrados Innova S.a.C.",
    cliente_ruc: "20602860338",
    cliente_razon_social: "Deister Software Peru S.a.C.",
    pedido_guia_id: null,
    guia_nro: null,
    estado: "Confirmado",
    fecha_confirmacion: new Date(),
    fecha_despacho: null,
    despachado: false,
  },
  {
    id: 1,
    contrato_id: 1,
    contrato_nombre: "Contrato A",
    filial: "22235154875",
    razon_social: "Encofrados Innova S.a.C.",
    cliente_ruc: "20602860338",
    cliente_razon_social: "Deister Software Peru S.a.C.",
    pedido_guia_id: null,
    guia_nro: null,
    estado: "Confirmado",
    fecha_confirmacion: new Date(),
    fecha_despacho: null,
    despachado: false,
  },
  {
    id: 1,
    contrato_id: 1,
    contrato_nombre: "Contrato A",
    filial: "22235154875",
    razon_social: "Encofrados Innova S.a.C.",
    cliente_ruc: "20602860338",
    cliente_razon_social: "Deister Software Peru S.a.C.",
    pedido_guia_id: null,
    guia_nro: null,
    estado: "Confirmado",
    fecha_confirmacion: new Date(),
    fecha_despacho: null,
    despachado: false,
  },
  {
    id: 1,
    contrato_id: 1,
    contrato_nombre: "Contrato A",
    filial: "22235154875",
    razon_social: "Encofrados Innova S.a.C.",
    cliente_ruc: "20602860338",
    cliente_razon_social: "Deister Software Peru S.a.C.",
    pedido_guia_id: null,
    guia_nro: null,
    estado: "Confirmado",
    fecha_confirmacion: new Date(),
    fecha_despacho: null,
    despachado: false,
  },
  {
    id: 1,
    contrato_id: 1,
    contrato_nombre: "Contrato A",
    filial: "22235154875",
    razon_social: "Encofrados Innova S.a.C.",
    cliente_ruc: "20602860338",
    cliente_razon_social: "Deister Software Peru S.a.C.",
    pedido_guia_id: null,
    guia_nro: null,
    estado: "Confirmado",
    fecha_confirmacion: new Date(),
    fecha_despacho: null,
    despachado: false,
  },
  {
    id: 1,
    contrato_id: 1,
    contrato_nombre: "Contrato A",
    filial: "22235154875",
    razon_social: "Encofrados Innova S.a.C.",
    cliente_ruc: "20602860338",
    cliente_razon_social: "Deister Software Peru S.a.C.",
    pedido_guia_id: null,
    guia_nro: null,
    estado: "Confirmado",
    fecha_confirmacion: new Date(),
    fecha_despacho: null,
    despachado: false,
  },
  {
    id: 1,
    contrato_id: 1,
    contrato_nombre: "Contrato A",
    filial: "22235154875",
    razon_social: "Encofrados Innova S.a.C.",
    cliente_ruc: "20602860338",
    cliente_razon_social: "Deister Software Peru S.a.C.",
    pedido_guia_id: null,
    guia_nro: null,
    estado: "Confirmado",
    fecha_confirmacion: new Date(),
    fecha_despacho: null,
    despachado: false,
  },
  {
    id: 1,
    contrato_id: 1,
    contrato_nombre: "Contrato A",
    filial: "22235154875",
    razon_social: "Encofrados Innova S.a.C.",
    cliente_ruc: "20602860338",
    cliente_razon_social: "Deister Software Peru S.a.C.",
    pedido_guia_id: null,
    guia_nro: null,
    estado: "Confirmado",
    fecha_confirmacion: new Date(),
    fecha_despacho: null,
    despachado: false,
  },
];

const pedidosAlmacen = [
  {
    id: 2,
    contrato_id: 1,
    contrato_nombre: "Contrato B",
    filial: "22235154875",
    razon_social: "Encofrados Innova S.a.C.",
    cliente_ruc: "22235154875",
    cliente_razon_social:
      "Stefanini It Solutions Peru Sociedad Anonima Cerrada",
    pedido_guia_id: 1,
    guia_nro: "T005-00000006",
    estado: "Emitido",
    fecha_confirmacion: new Date(),
    fecha_despacho: null,
    despachado: false,
  },
  {
    id: 3,
    contrato_id: 2,
    contrato_nombre: "Contrato C",
    filial: "22235154875",
    razon_social: "Encofrados Innova S.a.C.",
    cliente_ruc: "22235154875",
    cliente_razon_social: "Avantica Technologies S.a.C. | Encora",
    pedido_guia_id: 2,
    guia_nro: "T005-00000007",
    estado: "Emitido",
    fecha_confirmacion: new Date(),
    fecha_despacho: null,
    despachado: false,
  },
];

const pedidosDespachados = [
  {
    id: 4,
    contrato_id: 1,
    contrato_nombre: "Contrato D",
    filial: "22235154875",
    razon_social: "Encofrados Innova S.a.C.",
    cliente_ruc: "22235154875",
    cliente_razon_social: "Casio Peru E.I.R.L.",
    pedido_guia_id: 3,
    guia_nro: "T005-00000008",
    estado: "Despachado",
    fecha_confirmacion: new Date(),
    fecha_despacho: new Date(),
    despachado: true,
  },
];
const ContentPedidosTv = () => {
  const [pedidos, setPedidos] = useState({
    Confirmadas: pedidosConfirmados || [],
    Almacen: pedidosAlmacen || [],
    Despachados: pedidosDespachados || [],
  });

  // ✅ Se actualiza cada vez que cambian las props
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
      borderColor: "border-yellow-400/90",
    },
    {
      title: "Emitido",
      key: "Emitido",
      icon: Archive,
      list: pedidos.Almacen,
      borderColor: "border-blue-400/90",
    },
    {
      title: "Despachado",
      key: "Despachado",
      icon: Package,
      list: pedidos.Despachados,
      borderColor: "border-green-400/90",
    },
  ];

  return (
    <div className="font-mulish grid min-h-[70vh] grid-cols-1 gap-[1px] bg-slate-900 md:grid-cols-3">
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
          <div className="scroll-hide flex max-h-[80vh] flex-grow flex-col gap-y-3 overflow-y-auto p-3">
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
