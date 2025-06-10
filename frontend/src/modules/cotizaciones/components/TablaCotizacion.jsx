"use client";

import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import {
   Tooltip,
   TooltipTrigger,
   TooltipContent,
   TooltipProvider,
} from "@/components/ui/tooltip";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Edit, Eye, FileDown, Settings } from "lucide-react";

// Componente para texto truncado con tooltip
const TruncatedText = ({ text, maxLength = 20 }) => {
   if (!text) return "—";

   const shouldTruncate = text.length > maxLength;
   const displayText = shouldTruncate
      ? `${text.substring(0, maxLength)}...`
      : text;

   return (
      <TooltipProvider>
         <Tooltip>
            <TooltipTrigger asChild>
               <div className="truncate max-w-[150px]">{displayText}</div>
            </TooltipTrigger>
            {shouldTruncate && <TooltipContent>{text}</TooltipContent>}
         </Tooltip>
      </TooltipProvider>
   );
};

export default function TablaCotizacion({
   cotizaciones = [],
   onDownloadPDF,
   setCotizacionPrevisualizada,
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

   // Definición de columnas
   const allColumns = [
      {
         id: "codigo_documento",
         name: "Cod. Doc",
         selector: (row) => row.codigo_documento || "—",
         cell: (row) => <TruncatedText text={row.codigo_documento} />,
         sortable: true,
         omit: !visibleColumns.codigo_documento,
      },
      {
         id: "cliente",
         name: "Cliente",
         selector: (row) => row.cliente?.razon_social || "—",
         cell: (row) => <TruncatedText text={row.cliente?.razon_social} />,
         sortable: true,
         omit: !visibleColumns.cliente,
      },
      {
         id: "obra",
         name: "Obra",
         selector: (row) => row.obra?.nombre || "—",
         cell: (row) => <TruncatedText text={row.obra?.nombre} />,
         sortable: true,
         omit: !visibleColumns.obra,
      },
      {
         id: "uso",
         name: "Uso",
         selector: (row) => row.uso?.descripcion || "—",
         sortable: true,
         omit: !visibleColumns.uso,
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
               <Button variant="outline" size="icon">
                  <Edit />
               </Button>
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

   return (
      <div className="w-full px-4">
         <div className="flex justify-end mb-4">
            <ColumnSelector
               visibleColumns={visibleColumns}
               setVisibleColumns={setVisibleColumns}
            />
         </div>

         <DataTable
            columns={allColumns.filter((col) => !col.omit)}
            data={cotizaciones || []}
            highlightOnHover
            pointerOnHover
            customStyles={customStyles}
            noDataComponent="No hay cotizaciones disponibles"
         />
      </div>
   );
}

// Componente para seleccionar columnas visibles
function ColumnSelector({ visibleColumns, setVisibleColumns }) {
   const [open, setOpen] = useState(false);
   const [tempVisibleColumns, setTempVisibleColumns] = useState(visibleColumns);

   useEffect(() => {
      setTempVisibleColumns(visibleColumns);
   }, [visibleColumns]);

   const handleSave = () => {
      setVisibleColumns(tempVisibleColumns);
      setOpen(false);
   };

   const handleCancel = () => {
      setTempVisibleColumns(visibleColumns);
      setOpen(false);
   };

   const toggleColumn = (columnId) => {
      setTempVisibleColumns((prev) => ({
         ...prev,
         [columnId]: !prev[columnId],
      }));
   };

   const columnOptions = [
      { id: "codigo_documento", label: "Cod. Doc" },
      { id: "cliente", label: "Cliente" },
      { id: "obra", label: "Obra" },
      { id: "uso", label: "Uso" },
      { id: "tipo_cotizacion", label: "Tipo" },
      { id: "estado", label: "Estado" },
      { id: "acciones", label: "Acciones" },
   ];

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="mt-4">
               <Settings className="h-4 w-4 mr-2 " />
               Columnas
            </Button>
         </DialogTrigger>
         <DialogContent className="!max-w-80" >
            <DialogHeader>
               <DialogTitle>Seleccionar columnas visibles</DialogTitle>
            </DialogHeader>
            <div className="py-4">
               {columnOptions.map((column) => (
                  <div
                     key={column.id}
                     className="flex items-center space-x-2 mb-2"
                  >
                     <Checkbox
                        id={column.id}
                        checked={tempVisibleColumns[column.id]}
                        onCheckedChange={() => toggleColumn(column.id)}
                     />
                     <label
                        htmlFor={column.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 !text-neutral-600"
                     >
                        {column.label}
                     </label>
                  </div>
               ))}
            </div>
            <div className="flex justify-end gap-2">
               <Button variant="outline" onClick={handleCancel}>
                  Cancelar
               </Button>
               <Button onClick={handleSave}>Guardar</Button>
            </div>
         </DialogContent>
      </Dialog>
   );
}
