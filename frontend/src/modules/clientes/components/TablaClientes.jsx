import { Button } from "@/components/ui/button";
import {
   Tooltip,
   TooltipContent,
   TooltipTrigger,
} from "@/components/ui/tooltip";
import { Edit, Trash2 } from "lucide-react";
import React, { useState } from "react";
import DataTable from "react-data-table-component";
import ModalEditarCliente from "./ModalEditarCliente";
import { ColumnSelector } from "@/shared/components/ColumnSelector";
import { customStylesTable } from "@/utils/customTableStyle";

export default function TablaClientes({
   clientes,
   onEliminar,
   actualizarCliente,
}) {
   
   const [visibleColumns, setVisibleColumns] = useState({
      razon_social: true,
      tipo: true,
      ruc: true,
      telefono: true,
      email: true,
      domicilio_fiscal: true,
      representante_legal: true,
      dni_representante: true,
      acciones: true,
   });
   const columnOptions = [
      { id: "razon_social", label: "Razón social" },
      { id: "tipo", label: "Tipo" },
      { id: "ruc", label: "Ruc/Dni" },
      { id: "telefono", label: "Teléfono" },
      { id: "email", label: "Email" },
      { id: "domicilio_fiscal", label: "Dirección fiscal" },
      { id: "representante_legal", label: "Representante" },
      { id: "dni_representante", label: "Cargo" },
      { id: "acciones", label: "Acciones" },
   ];

     if (clientes.length === 0) {
      return (
         <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">
               No hay clientes registrados.
            </p>
         </div>
      );
   }

   const columns = [
      {
         name: "Razón Social / Nombre",
         sortable: true,
         selector: (row) => row.razon_social ?? "",
         grow: 3,
         cell: (row) => (
            <Tooltip>
               <TooltipTrigger className="truncate">
                  {row.razon_social || "—"}
               </TooltipTrigger>
               <TooltipContent>{row.razon_social || "—"}</TooltipContent>
            </Tooltip>
         ),
         omit: !visibleColumns.razon_social,
      },
      {
         name: "Tipo",
         selector: (row) => row.tipo || "—",
         sortable: true,
         grow: 2,
         omit: !visibleColumns.tipo,
      },
      {
         name: "RUC / DNI",
         selector: (row) => `${row.ruc || row.dni || "—"}`,
         sortable: true,
         grow: 2,
         omit: !visibleColumns.ruc,
      },
      {
         name: "Teléfono",
         selector: (row) => row.telefono || "—",
         sortable: true,
         grow: 2,
         omit: !visibleColumns.telefono,
      },
      {
         name: "Email",
         selector: (row) => row.email ?? "",
         sortable: true,
         grow: 2,
         cell: (row) => (
            <Tooltip>
               <TooltipTrigger className="truncate">
                  {row.email || "—"}
               </TooltipTrigger>
               <TooltipContent>{row.email || "—"}</TooltipContent>
            </Tooltip>
         ),
         omit: !visibleColumns.email,
      },
      {
         name: "Domicilio fiscal",
         sortable: true,
         grow: 2,
         cell: (row) => (
            <Tooltip>
               <TooltipTrigger className="truncate">
                  {row.domicilio_fiscal || "—"}
               </TooltipTrigger>
               <TooltipContent>{row.domicilio_fiscal || "—"}</TooltipContent>
            </Tooltip>
         ),
         omit: !visibleColumns.domicilio_fiscal,
      },
      {
         name: "Representante Legal",
         selector: (row) => row.representante_legal ?? "",
         sortable: true,
         grow: 2,
         cell: (row) => (
            <Tooltip>
               <TooltipTrigger className="truncate">
                  {row.representante_legal || "—"}
               </TooltipTrigger>
               <TooltipContent>{row.representante_legal || "—"}</TooltipContent>
            </Tooltip>
         ),
         omit: !visibleColumns.representante_legal,
      },
      {
         name: "Dni Representante",
         selector: (row) => row.dni_representante || "—",
         sortable: true,
         grow: 2,
         omit: !visibleColumns.dni_representante,
      },
      {
         name: "Acciones",
         cell: (row) => (
            <div className="flex gap-2">
               <ModalEditarCliente
                  cliente={row}
                  actualizarCliente={actualizarCliente}
               />
               <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEliminar(row.id)}
                  className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
               >
                  <Trash2 className="h-4 w-4" />
               </Button>
            </div>
         ),
         ignoreRowClick: true,
         width: "120px",
         omit: !visibleColumns.acciones,
      },
   ];

   
   return (
      <div className="w-full max-w-7xl">
         <div className="flex justify-end">
            <ColumnSelector
               visibleColumns={visibleColumns}
               setVisibleColumns={setVisibleColumns}
               columnOptions={columnOptions}
            />
         </div>
         <DataTable
            columns={columns}
            data={clientes}
            responsive
            striped
            highlightOnHover
            customStyles={customStylesTable}
            noDataComponent={
               <div className="flex items-center justify-center py-12">
                  <p className="text-muted-foreground">
                     No hay usuarios registrados.
                  </p>
               </div>
            }
         />
      </div>
   );
}
