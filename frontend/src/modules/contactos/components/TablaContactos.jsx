import { Button } from "@/components/ui/button";
import {
   Tooltip,
   TooltipContent,
   TooltipTrigger,
} from "@/components/ui/tooltip";
import { Edit, Trash2 } from "lucide-react";
import DataTable from "react-data-table-component";
import ModalEditarContacto from "./ModalEditarContacto";
import { useState } from "react";
import { ColumnSelector } from "@/shared/components/ColumnSelector";
import { customStylesTable } from "@/utils/customTableStyle";

export default function TablaContactos({
   contactos,
   onSubmit,
   onEliminar,
   clientes,
   obras,
}) {
   if (contactos.length === 0) {
      return <p>No hay contactos registrados.</p>;
   }

   const [visibleColumns, setVisibleColumns] = useState({
      nombre: true,
      email: true,
      telefono: true,
      cargo: true,
      clientes: true,
      obras: true,
      acciones: true,
   });
   const columnOptions = [
      { id: "nombre", label: "Nombre" },
      { id: "email", label: "Email" },
      { id: "telefono", label: "Teléfono" },
      { id: "cargo", label: "Cargo" },/* 
      { id: "clientes", label: "Clientes" },
      { id: "obras", label: "Obras" }, */
      { id: "acciones", label: "Acciones" },
   ];

   

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
         omit: !visibleColumns.nombre
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
         omit: !visibleColumns.email
      },
      {
         name: "Teléfono",
         selector: (row) => row.telefono || "-",
         sortable: true,
         grow: 1,
         omit: !visibleColumns.telefono
      },
      {
         name: "Cargo",
         selector: (row) => row.cargo || "-",
         sortable: true,
         grow: 1,
         omit: !visibleColumns.cargo
      },
      /* {
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
         omit: !visibleColumns.clientes
      },
      {
         name: "Obras",
         selector: (row) => row.obras_asociadas ?? "",
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
         omit: !visibleColumns.obras
      }, */
      {
         name: "Acciones",
         cell: (row) => (
            <div className="flex gap-2">
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
         omit: !visibleColumns.acciones
      },
   ];
   return (
      <div className="w-full  px-4 max-w-7xl">
         <div className="flex justify-end">
            <ColumnSelector
               visibleColumns={visibleColumns}
               setVisibleColumns={setVisibleColumns}
               columnOptions={columnOptions}
            />
         </div>
         <DataTable
            columns={columns}
            data={contactos}
            responsive
            striped
            highlightOnHover
            customStyles={customStylesTable}
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
