import { Button } from "@/components/ui/button";
import {
   Tooltip,
   TooltipContent,
   TooltipTrigger,
} from "@/components/ui/tooltip";
import { Edit, Trash2 } from "lucide-react";
import DataTable from "react-data-table-component";
import ModalEditarContacto from "./ModalEditarContacto";

export default function TablaContactos({ contactos, onSubmit, onEliminar,clientes,obras }) {
   if (contactos.length === 0) {
      return <p>No hay contactos registrados.</p>;
   }

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

   const columns = [
      {
         name: "Nombre",
         sortable: true,
         selector: (row) => row.nombre ?? "",
         grow: 1,
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
         name: "Email",
         selector: (row) => row.email ?? "",
         sortable: true,
         grow: 1,
         cell: (row) => (
            <Tooltip>
               <TooltipTrigger className="truncate">
                  {row.email || "—"}
               </TooltipTrigger>
               <TooltipContent>{row.email || "—"}</TooltipContent>
            </Tooltip>
         ),
      },
      {
         name: "Teléfono",
         selector: (row) => row.telefono || "-",
         sortable: true,
         grow: 1,
      },
      {
         name: "Cargo",
         selector: (row) => row.cargo || "-",
         sortable: true,
         grow: 1,
      },
      {
         name: "Clientes",
         selector: (row) => row.clientes_asociados ?? "",
         sortable: true,
         grow: 2,
         cell: (row) => (
            <Tooltip>
               <TooltipTrigger className="truncate">{`${
                  row.clientes_asociados
                     ?.map((c) => c.razon_social)
                     .join(", ") || "—"
               }`}</TooltipTrigger>
               <TooltipContent>{`${
                  row.clientes_asociados
                     ?.map((c) => c.razon_social)
                     .join(", ") || "—"
               }`}</TooltipContent>
            </Tooltip>
         ),
      },
      {
         name: "Obras",
           selector: row => row.obras_asociadas ?? "",
         sortable: true,
         grow: 2,
         cell: (row) => (
            <Tooltip>
               <TooltipTrigger className="truncate">
                  {`${
                     row.obras_asociadas?.map((o) => o.nombre).join(", ") || "—"
                  }`}
               </TooltipTrigger>
               <TooltipContent>{`${
                  row.obras_asociadas?.map((o) => o.nombre).join(", ") || "—"
               }`}</TooltipContent>
            </Tooltip>
         ),
      },
      {
         name: "Acciones",
         cell: (row) => (
            <div className="flex gap-2">
               {/* <Button
                  variant="outline"
                  size={"icon"}
                  onClick={() => onEditar(row)}
                  className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
               >
                  <Edit className="h-4 w-4" />
               </Button> */}
               <ModalEditarContacto
               contacto={row}
               clientes={clientes}
               obras={obras}
               onSubmit={onSubmit}
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
      },
   ];
   return (
      <div className="w-full  px-4">
         <DataTable
            columns={columns}
            data={contactos}
            responsive
            striped
            highlightOnHover
            customStyles={customStyles}
            noDataComponent={
               <div className="flex items-center justify-center py-12">
                  <p className="text-muted-foreground">
                     No hay Contactos registrados.
                  </p>
               </div>
            }
         />
      </div>
   );
}
