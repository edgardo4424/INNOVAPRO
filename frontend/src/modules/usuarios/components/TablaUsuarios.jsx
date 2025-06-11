import DataTable from "react-data-table-component";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { ColumnSelector } from "@/shared/components/ColumnSelector";
import { useState } from "react";

export default function TablaUsuarios({ usuarios, onEditar, onEliminar }) {
   const [visibleColumns, setVisibleColumns] = useState({
      nombre: true,
      email: true,
      rol: true,
      acciones: true,
   });
   const columnOptions = [
      { id: "nombre", label: "Nombre" },
      { id: "email", label: "Email" },
      { id: "rol", label: "Rol" },
      { id: "acciones", label: "Acciones" },
   ];
   if (usuarios.length === 0) {
      return (
         <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">
               No hay usuarios registrados.
            </p>
         </div>
      );
   }

   const columns = [
      {
         name: "Nombre",
         selector: (row) => row.nombre || "—",
         sortable: true,
         omit: !visibleColumns.nombre,
      },
      {
         name: "Email",
         selector: (row) => row.email || "—",
         sortable: true,
         omit: !visibleColumns.email,
      },
      {
         name: "Rol",
         selector: (row) => row.rol || "—",
         sortable: true,
         omit: !visibleColumns.rol,
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
      <div className="w-full px-4">
         <div className="flex justify-end mb-4">
            <ColumnSelector
               visibleColumns={visibleColumns}
               setVisibleColumns={setVisibleColumns}
               columnOptions={columnOptions}
            />
         </div>
         <DataTable
            columns={columns}
            data={usuarios}
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
