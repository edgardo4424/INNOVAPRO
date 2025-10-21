import React from "react";
import ContentPedidosTv from "../components/content/ContentPedidosTv";

const PedidosTv = () => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-gray-100 py-6 md:px-8">
      <div className="w-full">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-blue-600 md:text-3xl font-sans">
            Pase de Pedidos
          </h2>
        </div>
        <ContentPedidosTv />
      </div>
    </div>
  );
};

//  confirmadas
// despacho
//  despachado
export default PedidosTv;
