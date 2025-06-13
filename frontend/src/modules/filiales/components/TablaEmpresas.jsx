import DataTable from "react-data-table-component";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import {
   Tooltip,
   TooltipContent,
   TooltipTrigger,
} from "@/components/ui/tooltip";
import ModalEditarEmpresa from "./ModalEditarEmpresa";

export default function TablaEmpresas({ empresas, onEditar, onEliminar }) {
   if (empresas.length === 0) {
      return <p>No hay empresas registradas.</p>;
   }

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
      },
      {
         name: "Ruc",
         selector: (row) => row.ruc || "-",
         sortable: true,
         grow: 1,
      },
      {
         name: "Dirección Fiscal",
         selector: (row) => row.direccion_fiscal || "-",
         sortable: true,
         grow: 1,
      },
      {
         name: "Representante",
         sortable: true,
           selector: row => row.representante_legal ?? "",
         grow: 2,
         cell: (row) => (
            <Tooltip>
               <TooltipTrigger className="truncate">
                  {row.representante_legal || "—"}
               </TooltipTrigger>
               <TooltipContent>{row.representante_legal || "—"}</TooltipContent>
            </Tooltip>
         ),
      },
      {
         name: "Documento",
         selector: (row) =>
            `${row.tipo_documento || "—"} ${row.numero_documento || "—"}`,
         sortable: true,
         grow: 1,
      },
      {
         name: "Cargo",
           selector: row => row.cargo_representante ?? "",
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
      },
      {
         name: "Acciones",
         cell: (row) => (
            <div className="flex gap-2">
               <ModalEditarEmpresa
                  empresa={row}
                  onSubmit={onEditar}
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
      <div className="w-full  px-4">
         <DataTable
            columns={columns}
            data={empresas}
            responsive
            striped
            highlightOnHover
            customStyles={customStyles}
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
