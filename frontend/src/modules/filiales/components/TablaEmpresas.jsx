import DataTable from "react-data-table-component";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import {
   Tooltip,
   TooltipContent,
   TooltipTrigger,
} from "@/components/ui/tooltip";
import ModalEditarEmpresa from "./ModalEditarEmpresa";
import { useState } from "react";
import { ColumnSelector } from "@/shared/components/ColumnSelector";
import { customStylesTable } from "@/utils/customTableStyle";

export default function TablaEmpresas({ empresas, onEditar, onEliminar }) {
   if (empresas.length === 0) {
      return <p>No hay empresas registradas.</p>;
   }

   const [visibleColumns, setVisibleColumns] = useState({
      razon_social: true,
      ruc: true,
      direccion_fiscal: true,
      representante_legal: true,
      tipo_documento: true,
      cargo_representante: true,
      telefono: true,
      acciones: true,
   });
   const columnOptions = [
      { id: "razon_social", label: "Razón social" },
      { id: "ruc", label: "Ruc" },
      { id: "direccion_fiscal", label: "Dirección fiscal" },
      { id: "representante_legal", label: "Representante" },
      { id: "tipo_documento", label: "Tipo de documento" },
      { id: "cargo_representante", label: "Cargo" },
      { id: "telefono", label: "Teléfono" },
      { id: "acciones", label: "Acciones" },
   ];

   const columns = [
      {
         name: "Razón Social",
         selector: (row) => row.razon_social || "-",
         sortable: true,
         grow: 2,
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
         name: "Ruc",
         selector: (row) => row.ruc || "-",
         sortable: true,
         grow: 1,
         omit: !visibleColumns.ruc,
      },
      {
         name: "Dirección Fiscal",
         selector: (row) => row.direccion_fiscal || "-",
         sortable: true,
         grow: 1,
         omit: !visibleColumns.direccion_fiscal,
      },
      {
         name: "Representante",
         sortable: true,
         selector: (row) => row.representante_legal ?? "",
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
         name: "Documento",
         selector: (row) =>
            `${row.tipo_documento || "—"} ${row.numero_documento || "—"}`,
         sortable: true,
         grow: 1,
         omit: !visibleColumns.tipo_documento,
      },
      {
         name: "Cargo",
         selector: (row) => row.cargo_representante ?? "",
         sortable: true,
         grow: 1,
         cell: (row) => (
            <Tooltip>
               <TooltipTrigger className="truncate">
                  {row.cargo_representante || "—"}
               </TooltipTrigger>
               <TooltipContent>{row.cargo_representante || "—"}</TooltipContent>
            </Tooltip>
         ),
         omit: !visibleColumns.cargo_representante,
      },
      {
         name: "Teléfono",
         sortable: true,
         grow: 1,
         cells: (row) => (
            <p>
               📞 {row.telefono_representante || "—"}
               <br />
               🏢 {row.telefono_oficina || "—"}
            </p>
         ),
         omit: !visibleColumns.telefono,
      },
      {
         name: "Acciones",
         cell: (row) => (
            <div className="flex gap-2">
               <ModalEditarEmpresa empresa={row} onSubmit={onEditar} />
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
            data={empresas}
            responsive
            striped
            highlightOnHover
            customStyles={customStylesTable}
            noDataComponent={
               <div className="flex items-center justify-center py-12">
                  <p className="text-muted-foreground">
                     No hay empresas registradas.
                  </p>
               </div>
            }
         />
      </div>
   );
}
