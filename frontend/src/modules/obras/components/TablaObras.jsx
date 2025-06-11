import { Button } from "@/components/ui/button";
import {
   Tooltip,
   TooltipContent,
   TooltipTrigger,
} from "@/components/ui/tooltip";
import { Edit, Trash2 } from "lucide-react";
import DataTable from "react-data-table-component";
export default function TablaObras({ obras, onEditar, onEliminar }) {
   if (obras.length === 0) {
      return <p>No hay obras registradas.</p>;
   }
   const columns = [
      {
         name: "Nombre",
           selector: row => row.nombre ?? "",
         sortable: true,
         grow: 2,
         cell: (row) => (
            <Tooltip>
               <TooltipTrigger className="truncate">
                  {row.nombre || "—"}
               </TooltipTrigger>
               <TooltipContent>{row.nombre || "—"}</TooltipContent>
            </Tooltip>
         ),
      },
      {
         name: "Dirección",
         selector: (row) => row.direccion || "—",
         sortable: true,
         grow: 2,
      },
      {
         name: "Ubicación",
         selector: (row) => `${row.ubicacion || "—"}`,
         sortable: true,
         grow: 1,
      },
      {
         name: "estado",
         selector: (row) => row.estado || "—",
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
               >
                  <Edit className="h-4 w-4" />
               </Button>
               <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEliminar(row.id)}
               >
                  <Trash2 className="h-4 w-4" />
               </Button>
            </div>
         ),
         ignoreRowClick: true,
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
            data={obras}
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
