import { Button } from "@/components/ui/button";
import {
   Tooltip,
   TooltipContent,
   TooltipTrigger,
} from "@/components/ui/tooltip";
import { Edit, Trash2 } from "lucide-react";
import DataTable from "react-data-table-component";
import ModalEditarObra from "./ModalEditarObra";
import { useState } from "react";
import { ColumnSelector } from "@/shared/components/ColumnSelector";
export default function TablaObras({ obras, onSubmit, onEditar, onEliminar }) {
   
   console.log('obras', obras);
   const [visibleColumns, setVisibleColumns] = useState({
         nombre: true,
         direccion: true,
         ubicacion: true,
         estado: true,
         acciones: true,
      });
      const columnOptions = [
         { id: "nombre", label: "Nombre" },
         { id: "direccion", label: "Dirección" },
         { id: "ubicacion", label: "Ubicación" },
         { id: "estado", label: "Estado" },
         { id: "acciones", label: "Acciones" },
      ];

    if (obras.length === 0) {
      return (
         <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">
               No hay obras registradas.
            </p>
         </div>
      );
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
         omit: !visibleColumns.nombre,
      },
      {
         name: "Dirección",
         selector: (row) => row.direccion || "—",
         sortable: true,
         grow: 2,
         omit: !visibleColumns.direccion,
      },
      {
         name: "Ubicación",
         selector: (row) => `${row.ubicacion || "—"}`,
         sortable: true,
         grow: 1,
         omit: !visibleColumns.ubicacion,
      },
      {
         name: "Estado",
         selector: (row) => row.estado || "—",
         sortable: true,
         grow: 2,
         omit: !visibleColumns.estado,
      },
      {
         name: "Acciones",
         cell: (row) => (
            <div className="flex gap-2">
               {/* <Button
                  variant="outline"
                  size={"icon"}
                  onClick={() => onEditar(row)}
               >
                  <Edit className="h-4 w-4" />
               </Button> */}
               <ModalEditarObra onSubmit={onSubmit} obra={row} />
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
         omit: !visibleColumns.acciones,
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
