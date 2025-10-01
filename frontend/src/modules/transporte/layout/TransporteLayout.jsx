import React from "react";
import { Outlet } from "react-router-dom";

const TransporteLayout = () => {
  return (
    <div className="bandeja-layout">
      <Outlet />
    </div>
  );
};

export default TransporteLayout;
