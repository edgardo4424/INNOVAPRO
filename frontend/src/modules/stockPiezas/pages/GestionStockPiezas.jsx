import { ColumnSelector } from "@/shared/components/ColumnSelector";
import TablaStockPiezas from "../components/TablaStockPiezas";
import { useState } from "react";

const GestionStockPiezas = () => {
   const [visibleColumns, setVisibleColumns] = useState({
      item: true,
      descripcion: true,
      stock_disponible: true,
      por_aprobar: true,
      stock_fijo: true,
      piezas_en_contrato: true,
   });

   const columnOptions = [
      { id: "item", label: "Item" },
      { id: "descripcion", label: "Descripción" },
      { id: "stock_disponible", label: "Stock Disponible" },
      { id: "por_aprobar", label: "Piezas cotizadas" },
      { id: "stock_fijo", label: "Stock Fijo" },
      { id: "piezas_en_contrato", label: "Piezas en contrato" },
   ];
   return (
      <div className="min-h-full flex-1  flex flex-col items-center">
         <div className="w-full px-4 max-w-7xl">
            <div className="flex items-center justify-between my-6">
               <h2 className=" text-2xl md:text-3xl font-bold text-gray-800 !text-start">
                  Tabla de Stock de Piezas Cotizadas
               </h2>
               <ColumnSelector
                  visibleColumns={visibleColumns}
                  setVisibleColumns={setVisibleColumns}
                  columnOptions={columnOptions}
                  className="mb-0"
               />
            </div>

            <TablaStockPiezas visibleColumns={visibleColumns} />
         </div>
      </div>
   );
};
export default GestionStockPiezas;
