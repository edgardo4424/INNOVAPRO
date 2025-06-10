"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
   Tooltip,
   TooltipContent,
   TooltipTrigger,
} from "@/components/ui/tooltip";
import {
   Eye,
   ChevronDown,
   ChevronRight,
   Clipboard,
   ShieldUser,
   Orbit,
   Activity,
} from "lucide-react";
import DataTable from "react-data-table-component";

const statusConfig = {
   Pendiente: {
      label: "Pendiente",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
   },
   "En proceso": {
      label: "En proceso",
      color: "bg-blue-100 text-blue-800 border-blue-200",
   },
   Finalizada: {
      label: "Finalizada",
      color: "bg-green-100 text-green-800 border-green-200",
   },
   Cancelada: {
      label: "Cancelada",
      color: "bg-red-100 text-red-800 border-red-200",
   },
   Devuelta: {
      label: "Devuelta",
      color: "bg-orange-100 text-orange-800 border-orange-200",
   },
};

// Componente para la fila expandida
const ExpandedComponent = ({ data, onSeleccionarTarea }) => (
   <div className="py-4 px-8 bg-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
         {/* Tarea */}
         <div className=" flex items-center gap-2 justify-start">
            <div className="flex items-center text-neutral-700 gap-1">
               <Clipboard className="w-4 h-4" />
               <div className="text-sm font-medium ">Tarea:</div>
            </div>
            <div className="text-sm text-gray-900">{data.tipoTarea || "—"}</div>
         </div>

         {/* Estado */}
         <div className=" flex items-center gap-2 justify-start">
            <div className="flex items-center text-neutral-700 gap-1">
               <Orbit className="w-4 h-4" />
               <div className="text-sm font-medium ">Estado: </div>
            </div>
            <div>
               <Badge
                  className={`${
                     statusConfig[data.estado].color
                  } border font-medium`}
               >
                  {statusConfig[data.estado].label}
               </Badge>
            </div>
         </div>

         {/* Responsable */}
         <div className=" flex items-center gap-2 justify-start">
            <div className="flex items-center text-neutral-700 gap-1">
               <ShieldUser className="w-4 h-4" />
               <div className="text-sm font-medium ">Responsable: </div>
            </div>
            <div className="text-sm text-gray-900">
               {data.tecnico_asignado?.nombre || "—"}
            </div>
         </div>

         {/* Acciones */}
         <div className=" flex items-center gap-2 justify-start">
            <div className="flex items-center text-neutral-700 gap-1">
               <Activity className="w-4 h-4" />
               <div className="text-sm font-medium ">Acciones: </div>
            </div>
            <div className="flex gap-2">
               <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onSeleccionarTarea(data)}
                  className=" hover:bg-blue-50 hover:text-blue-600"
               >
                  <Eye className="h-4 w-4 " />
               </Button>
            </div>
         </div>
      </div>
   </div>
);

export default function TablaTareas({
   tareas,
   ordenarTareas,
   columnaOrdenada,
   orden,
   onSeleccionarTarea,
}) {
   // Columnas principales (solo información esencial)
   const columns = [
      {
         name: "Id",
         sortable: true,
         selector: (row) => row.id || "—",
         width: "80px",
      },
      {
         name: "Cliente",
         selector: (row) => row.cliente.razon_social ?? "",
         sortable: true,
         grow: 2,
         cell: (row) => (
            <TooltipProvider>
               <Tooltip>
                  <TooltipTrigger className="truncate">
                     {row.cliente.razon_social || "—"}
                  </TooltipTrigger>
                  <TooltipContent>
                     {row.cliente.razon_social || "—"}
                  </TooltipContent>
               </Tooltip>
            </TooltipProvider>
         ),
      },
      {
         name: "Obra",
         selector: (row) => row.obra.nombre ?? "",
         sortable: true,
         grow: 2,
         cell: (row) => (
            <TooltipProvider>
               <Tooltip>
                  <TooltipTrigger className="truncate">
                     {row.obra.nombre || "—"}
                  </TooltipTrigger>
                  <TooltipContent>{row.obra.nombre || "—"}</TooltipContent>
               </Tooltip>
            </TooltipProvider>
         ),
      },
      {
         name: "Comercial",
         selector: (row) => row.usuario_solicitante.nombre ?? "",
         sortable: true,
         grow: 2,
         cell: (row) => (
            <TooltipProvider>
               <Tooltip>
                  <TooltipTrigger className="truncate">{`${
                     row.usuario_solicitante.nombre || "—"
                  }`}</TooltipTrigger>
                  <TooltipContent>{`${
                     row.usuario_solicitante.nombre || "—"
                  }`}</TooltipContent>
               </Tooltip>
            </TooltipProvider>
         ),
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
            cursor: "pointer",
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
      expanderButton: {
         style: {
            color: "#6b7280",
            fontSize: "18px",
            backgroundColor: "transparent",
            borderRadius: "2px",
            transition: "all 0.2s",
            "&:hover": {
               backgroundColor: "#f3f4f6",
            },
         },
      },
   };

   return (
      <div className="w-full px-4">
         <DataTable
            columns={columns}
            data={tareas}
            responsive
            striped
            highlightOnHover
            expandableRows
            expandableRowsComponent={(props) => (
               <ExpandedComponent
                  {...props}
                  onSeleccionarTarea={onSeleccionarTarea}
               />
            )}
            expandableIcon={{
               collapsed: <ChevronRight className="h-4 w-4" />,
               expanded: <ChevronDown className="h-4 w-4" />,
            }}
            customStyles={customStyles}
            noDataComponent={
               <div className="flex items-center justify-center py-12">
                  <p className="text-muted-foreground">
                     No hay tareas registradas.
                  </p>
               </div>
            }
         />
      </div>
   );
}
