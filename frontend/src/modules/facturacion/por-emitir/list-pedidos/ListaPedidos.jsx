import React from "react";
import TablaPedidos from "./components/tabla/TablaPedidos";

const ListaPedidos = () => {
  return (
    <div className="mx-auto flex flex-col items-center px-4 py-6 md:px-2 ">
      <TablaPedidos />
    </div>
  );
};

export default ListaPedidos;
