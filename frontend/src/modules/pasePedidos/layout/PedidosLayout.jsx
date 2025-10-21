import React from "react";
import { Outlet } from "react-router-dom";

const PedidosLayout = () => {
  return (
    <div className="bandeja-layout">
      <Outlet />
    </div>
  );
};

export default PedidosLayout;
