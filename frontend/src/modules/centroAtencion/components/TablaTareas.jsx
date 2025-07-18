"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
   Tooltip,
   TooltipContent,
   TooltipTrigger,
} from "@/components/ui/tooltip";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);
import "ag-grid-community/styles/ag-theme-quartz.css";

import { Eye, Clipboard, ShieldUser } from "lucide-react";
import { useMemo } from "react";
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

export default function TablaTareas({
   tareas,
   onSeleccionarTarea,
   visibleColumns,
}) {
   const columns = useMemo(
      () =>
         [
            visibleColumns.id && {
               headerName: "Id",
               field: "id",
               sortable: true,
               width: 80,
               valueGetter: (params) => params.data?.id || "—",
            },
            visibleColumns.cliente && {
               headerName: "Cliente",
               field: "cliente.razon_social",
               sortable: true,
               flex: 2,
               cellRenderer: (params) => {
                  const valor = params.data?.cliente?.razon_social || "—";
                  return (
                     <TooltipProvider>
                        <Tooltip>
                           <TooltipTrigger className="truncate">
                              {valor}
                           </TooltipTrigger>
                           <TooltipContent>{valor}</TooltipContent>
                        </Tooltip>
                     </TooltipProvider>
                  );
               },
            },
            visibleColumns.obra && {
               headerName: "Obra",
               field: "obra.nombre",
               sortable: true,
               flex: 2,
               cellRenderer: (params) => {
                  const valor = params.data?.obra?.nombre || "—";
                  return (
                     <TooltipProvider>
                        <Tooltip>
                           <TooltipTrigger className="truncate">
                              {valor}
                           </TooltipTrigger>
                           <TooltipContent>{valor}</TooltipContent>
                        </Tooltip>
                     </TooltipProvider>
                  );
               },
            },
            visibleColumns.comercial && {
               headerName: "Comercial",
               field: "usuario_solicitante.nombre",
               sortable: true,
               flex: 2,
               cellRenderer: (params) => {
                  const valor = params.data?.usuario_solicitante?.nombre || "—";
                  return (
                     <TooltipProvider>
                        <Tooltip>
                           <TooltipTrigger className="truncate">
                              {valor}
                           </TooltipTrigger>
                           <TooltipContent>{valor}</TooltipContent>
                        </Tooltip>
                     </TooltipProvider>
                  );
               },
            },
            visibleColumns.tarea && {
               headerName: "Tarea",
               field: "tipoTarea",
               flex: 2,
               cellRenderer: (params) => {
                  const valor = params.data?.tipoTarea || "—";
                  return (
                     <div className="flex items-center gap-2 justify-center">
                        <Clipboard className="w-4 h-4 text-neutral-700" />
                        <div className="text-sm text-gray-900">{valor}</div>
                     </div>
                  );
               },
            },
            visibleColumns.estado && {
               headerName: "Estado",
               field: "estado",
               flex: 1,
               cellRenderer: (params) => {
                  const estado = params.data?.estado;
                  const config = statusConfig[estado];
                  return (
                     <div>
                        <Badge className={`${config.color} border font-medium`}>
                           {config.label}
                        </Badge>
                     </div>
                  );
               },
            },
            visibleColumns.responsable && {
               headerName: "Responsable",
               field: "tecnico_asignado.nombre",
               flex: 2,
               cellRenderer: (params) => {
                  const nombre = params.data?.tecnico_asignado?.nombre || "—";
                  return (
                     <div className="flex items-center gap-2 justify-start">
                        <ShieldUser className="w-4 h-4 text-neutral-700" />
                        <div className="text-sm text-gray-900">{nombre}</div>
                     </div>
                  );
               },
            },
            visibleColumns.acciones && {
               headerName: "Acciones",
               field: "acciones",
               width: 120,
               cellRenderer: (params) => {
                  const row = params.data;
                  return (
                     <div className="flex items-center gap-2 justify-start">
                        <Button
                           variant="outline"
                           size="icon"
                           onClick={() => onSeleccionarTarea(row)}
                           className="hover:bg-blue-50 hover:text-blue-600"
                        >
                           <Eye className="h-4 w-4" />
                        </Button>
                     </div>
                  );
               },
               suppressCellSelection: true,
            },
         ].filter(Boolean),
      [visibleColumns]
   );

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

   const paginationOptions = {
      rowsPerPageText: "Filas por página",
      rangeSeparatorText: "de",
      selectAllRowsItem: true,
      selectAllRowsItemText: "Todos",
   };
   return (
      <div className="w-full px-4 max-w-7xl">
         <AgGridReact
            rowData={tareas}
            columnDefs={columns}
            overlayLoadingTemplate={
               '<span class="ag-overlay-loading-center">Cargando...</span>'
            }
            overlayNoRowsTemplate="<span>No hay registros para mostrar</span>"
            pagination={true}
            paginationPageSize={20}
            loadingOverlayComponentParams={{ loadingMessage: "Cargando..." }}
            domLayout="autoHeight"
            rowHeight={50}
            headerHeight={50}
            animateRows={true}
            enableCellTextSelection={true}
            suppressCellFocus={true}
            paginationAutoPageSize={false}
            localeText={{
               page: "Página",
               more: "más",
               to: "a",
               of: "de",
               next: "Siguiente",
               last: "Última",
               first: "Primera",
               previous: "Anterior",
               loadingOoo: "Cargando...",
               noRowsToShow: "No hay registros para mostrar",
               pageSizeSelectorLabel: "N° de filas",
            }}
         />
      </div>
   );
}
