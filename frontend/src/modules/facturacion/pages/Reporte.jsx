import React from "react";
import ReportesForm from "../emitir/reportes/ReportesForm";

const Reporte = () => {
  return (
    <div className="flex w-full flex-col items-center py-6 md:px-8">
      <div className="w-full">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold md:text-3xl">Generar Reportes</h2>
        </div>
        <ReportesForm />
      </div>
    </div>
  );
};

export default Reporte;
