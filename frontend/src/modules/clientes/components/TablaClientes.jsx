import { Button } from "@/components/ui/button";
import {
   Tooltip,
   TooltipContent,
   TooltipTrigger,
} from "@/components/ui/tooltip";
import { Edit, Trash2 } from "lucide-react";
import React from "react";
import DataTable from "react-data-table-component";

export default function TablaClientes({ clientes, onEditar, onEliminar }) {
   if (clientes.length === 0) {
      return <p>No hay clientes para mostrar.</p>;
   }

   const columns = [
      {
         name: "Razón Social / Nombre",
         sortable: true,
           selector: row => row.razon_social ?? "",
         grow: 3,
         cell: (row) => (
            <Tooltip>
               <TooltipTrigger className="truncate">{row.razon_social || "—"}</TooltipTrigger>
               <TooltipContent >{row.razon_social || "—"}</TooltipContent>
            </Tooltip>
         ),
      },
      {
         name: "Tipo",
         selector: (row) => row.tipo || "—",
         sortable: true,
         grow: 2,
      },
      {
         name: "RUC / DNI",
         selector: (row) => `${row.ruc || row.dni || "—"}`,
         sortable: true,
         grow: 1,
      },
      {
         name: "Teléfono",
         selector: (row) => row.telefono || "—",
         sortable: true,
         grow: 2,
      },
      {
         name: "Email",
           selector: row => row.email ?? "",
         sortable: true,
         grow: 2,
         cell: (row) => (
            <Tooltip>
               <TooltipTrigger className="truncate">{row.email || "—"}</TooltipTrigger>
               <TooltipContent >{row.email || "—"}</TooltipContent>
            </Tooltip>
         ),
      },
      {
         name: "Domicilio fiscal",
         sortable: true,
         grow: 2,
         cell: (row) => (
            <Tooltip>
               <TooltipTrigger className="truncate">{row.domicilio_fiscal|| "—"}</TooltipTrigger>
               <TooltipContent >{row.domicilio_fiscal || "—"}</TooltipContent>
            </Tooltip>
         ),
      },
      {
         name: "Representante Legal",
           selector: row => row.representante_legal ?? "",
         sortable: true,
         grow: 2,
         cell: (row) => (
            <Tooltip>
               <TooltipTrigger className="truncate">{row.representante_legal || "—"}</TooltipTrigger>
               <TooltipContent >{row.representante_legal || "—"}</TooltipContent>
            </Tooltip>
         ),
      },
      {
         name: "Dni Representante",
         selector: (row) => row.dni_representante || "—",
         sortable: true,
         grow: 2,
      },
      {
         name: "Acciones",
         cell: (row) => (
            <div className="flex gap-2">
               <Button
                  variant="outline"
                  size={"icon"}
                  onClick={() => onEditar(row)}
                  className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
               >
                  <Edit className="h-4 w-4" />
               </Button>
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
         // button: true,
         width: "120px",
      },
   ];

   const customStyles = {
      header: {
         style: {
            minHeight: "56px",
            paddingLeft: "16px",
            paddingRight: "16px",
         },
      },
      headRow: {
         style: {
            borderTopStyle: "solid",
            borderTopWidth: "1px",
            borderTopColor: "#e5e7eb",
            backgroundColor: "#f9fafb",
            minHeight: "48px",
         },
      },
      headCells: {
         style: {
            paddingLeft: "16px",
            paddingRight: "16px",
            fontSize: "14px",
            fontWeight: "600",
            color: "#374151",
         },
      },
      rows: {
         style: {
            minHeight: "56px",
            "&:hover": {
               backgroundColor: "#f9fafb",
            },
         },
         stripedStyle: {
            backgroundColor: "#fafafa",
         },
      },
      cells: {
         style: {
            paddingLeft: "16px",
            paddingRight: "16px",
            fontSize: "14px",
            color: "#6b7280",
         },
      },
   };
   return (
      <div className="w-full px-4">
         <DataTable
            columns={columns}
            data={clientes}
            responsive
            striped
            highlightOnHover
            customStyles={customStyles}
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
