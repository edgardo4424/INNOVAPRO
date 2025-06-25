"use client";

import { useState } from "react";
import DataTable from "react-data-table-component";
import {
   Tooltip,
   TooltipTrigger,
   TooltipContent,
   TooltipProvider,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Edit, Eye, FileDown, Settings } from "lucide-react";
import { ColumnSelector } from "@/shared/components/ColumnSelector";

// Componente para texto truncado con tooltip
const TruncatedText = ({ text }) => {
   if (!text) return "—";
   return (
      <TooltipProvider>
         <Tooltip>
            <TooltipTrigger asChild>
               <div className="truncate ">{text}</div>
            </TooltipTrigger>
            <TooltipContent>{text}</TooltipContent>
         </Tooltip>
      </TooltipProvider>
   );
};

export default function TablaCotizacion({
   cotizaciones = [],
   onDownloadPDF,
   setCotizacionPrevisualizada,
   onContinuarWizard,
}) {
   // Estado para las columnas visibles
   const [visibleColumns, setVisibleColumns] = useState({
      codigo_documento: true,
      cliente: true,
      obra: true,
      uso: true,
      tipo_cotizacion: true,
      estado: true,
      acciones: true,
   });
   const columnOptions = [
      { id: "codigo_documento", label: "Cod. Doc" },
      { id: "cliente", label: "Cliente" },
      { id: "obra", label: "Obra" },
      { id: "uso", label: "Uso" },
      { id: "tipo_cotizacion", label: "Tipo" },
      { id: "estado", label: "Estado" },
      { id: "acciones", label: "Acciones" },
   ];

   // Definición de columnas
   const allColumns = [
      {
         id: "codigo_documento",
         name: "Cod. Doc",
         selector: (row) => row.codigo_documento || "—",
         cell: (row) => <TruncatedText text={row.codigo_documento} />,
         sortable: true,
         omit: !visibleColumns.codigo_documento,
         grow: 2,
      },
      {
         id: "cliente",
         name: "Cliente",
         selector: (row) => row.cliente?.razon_social || "—",
         cell: (row) => <TruncatedText text={row.cliente?.razon_social} />,
         sortable: true,
         omit: !visibleColumns.cliente,
         grow: 2,
      },
      {
         id: "obra",
         name: "Obra",
         selector: (row) => row.obra?.nombre || "—",
         cell: (row) => <TruncatedText text={row.obra?.nombre} />,
         sortable: true,
         omit: !visibleColumns.obra,
         grow: 2,
      },
      {
         id: "uso",
         name: "Uso",
         selector: (row) => row.uso?.descripcion || "—",
         cell: (row) => <TruncatedText text={row.uso?.descripcion} />,
         sortable: true,
         omit: !visibleColumns.uso,
         grow: 2,
      },
      {
         id: "tipo_cotizacion",
         name: "Tipo",
         selector: (row) => row.tipo_cotizacion || "—",
         sortable: true,
         omit: !visibleColumns.tipo_cotizacion,
      },
      {
         id: "estado",
         name: "Estado",
         selector: (row) => row.estados_cotizacion?.nombre || "—",
         sortable: true,
         omit: !visibleColumns.estado,
      },
      {
         id: "acciones",
         name: "Acciones",
         cell: (row) => (
            <div className="flex gap-1 justify-start">
               <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onDownloadPDF(row.id)}
               >
                  <FileDown />
               </Button>
               <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCotizacionPrevisualizada(row.id)}
               >
                  <Eye />
               </Button>
               
               {row.estados_cotizacion.nombre === "Despiece generado" && (
                  <Button 
                     variant="outline" 
                     size="icon"
                     onClick={() => onContinuarWizard(row.id)}
                  >
                     <Edit />
                  </Button>
               )}
               
            </div>
         ),
         omit: !visibleColumns.acciones,
         ignoreRowClick: true,
         width: "150px",
      },
   ];

   // Estilos personalizados para DataTable
   const customStyles = {
      headRow: {
         style: {
            backgroundColor: "#f9fafb",
            borderBottomWidth: "1px",
         },
      },
      rows: {
         style: {
            minHeight: "60px",
            fontSize: "14px",
         },
         highlightOnHoverStyle: {
            backgroundColor: "#f3f4f6",
         },
      },
   };
   const paginationOptions = {
      rowsPerPageText: "Filas por página",
      rangeSeparatorText: "de",
      selectAllRowsItem: true,
      selectAllRowsItemText: "Todos",
   };
   return (
      <div className="w-full px-4 max-w-7xl">
         <div className="flex justify-end mt-6">
            <ColumnSelector
               visibleColumns={visibleColumns}
               setVisibleColumns={setVisibleColumns}
               columnOptions={columnOptions}
            />
         </div>

         <DataTable
            columns={allColumns.filter((col) => !col.omit)}
            data={cotizaciones || []}
            highlightOnHover
            pointerOnHover
            pagination
            paginationPerPage={5}
            paginationRowsPerPageOptions={[5, 10, 15, 20]}
            customStyles={customStyles}
            paginationComponentOptions={paginationOptions}
            noDataComponent="No hay cotizaciones disponibles"
         />
      </div>
   );
}