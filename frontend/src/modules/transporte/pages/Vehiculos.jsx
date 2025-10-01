import React from "react";
import VehiculosLayout from "../components/vehiculos/layout/VehiculosLayout";

const Vehiculos = () => {
  return (
    <div className="flex w-full flex-col items-center  py-6 md:px-8">
      <div className="w-full max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold md:text-3xl">
            Gestión de Vehículos
          </h2>
        </div>
        <VehiculosLayout />
      </div>
    </div>
  );
};

export default Vehiculos;
