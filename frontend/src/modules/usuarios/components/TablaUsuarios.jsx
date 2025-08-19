import DataTable from "react-data-table-component";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { ColumnSelector } from "@/shared/components/ColumnSelector";
import { useState } from "react";
import ModalEditarUsuario from "./ModalEditarUsuario";
import { customStylesTable } from "@/utils/customTableStyle";

export default function TablaUsuarios({ usuarios, onEliminar, onSubmit }) {
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
               {/*Aquí se vera el boton para abrir el modal*/}
               <ModalEditarUsuario onSubmit={onSubmit} user={row} />
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
            data={usuarios}
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
