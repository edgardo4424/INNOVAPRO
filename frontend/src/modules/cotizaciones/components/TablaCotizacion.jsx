import { useEffect, useMemo, useState } from "react";

import {
   Tooltip,
   TooltipTrigger,
   TooltipContent,
   TooltipProvider,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Edit, Eye, FileDown, Settings } from "lucide-react";
import { ColumnSelector } from "@/shared/components/ColumnSelector";
import { Input } from "@/components/ui/input";

import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);
import "ag-grid-community/styles/ag-theme-quartz.css";

// Componente para texto truncado con tooltip
const TruncatedText = ({ text }) => {
   if (!text) return "—";
   return (
      <TooltipProvider>
         <Tooltip>
            <TooltipTrigger asChild>
               <div className="truncate ">{text}</div>
            </TooltipTrigger>
            <TooltipContent>{text}</TooltipContent>
         </Tooltip>
      </TooltipProvider>
   );
};

export default function TablaCotizacion({
   data = [],
   onDownloadPDF,
   setCotizacionPrevisualizada,
   onContinuarWizard,
}) {
   const [text, setText] = useState("");
   const [cotizaciones, setCotizaciones] = useState([]);
   useEffect(() => {
      setCotizaciones(data);
   }, [data]);

   // Estado para las columnas visibles
   const [visibleColumns, setVisibleColumns] = useState({
      codigo_documento: true,
      cp: true,
      cliente: true,
      obra: true,
      uso: true,
      tipo_cotizacion: true,
      estado: true,
      acciones: true,
   });
   const columnOptions = [
      { id: "codigo_documento", label: "Cod. Doc" },
      { id: "cp", label: "CP" },
      { id: "cliente", label: "Cliente" },
      { id: "obra", label: "Obra" },
      { id: "uso", label: "Uso" },
      { id: "tipo_cotizacion", label: "Tipo" },
      { id: "estado", label: "Estado" },
      { id: "acciones", label: "Acciones" },
   ];

   // Definición de columnas

   const columns = useMemo(
      () =>
         [
            visibleColumns.codigo_documento && {
               field: "codigo_documento",
               headerName: "Cod. Doc",
               cellRendererFramework: (params) => (
                  <TruncatedText text={params.codigo_documento} />
               ),
            },
            visibleColumns.cp && {
               field: "despiece.cp",
               headerName: "CP",
               cellRendererFramework: (params) => (
                  <TruncatedText text={params.despiece?.cp} />
               ),
               sortable: true,
            },
            visibleColumns.cliente && {
               field: "cliente.razon_social",
               headerName: "Cliente",
               cellRendererFramework: (params) => (
                  <TruncatedText text={params.cliente?.razon_social} />
               ),
            },

            visibleColumns.obra && {
               field: "obra.nombre",
               headerName: "Obra",
               cellRendererFramework: (params) => (
                  <TruncatedText text={params.obra?.nombre} />
               ),
               sortable: true,
            },
            visibleColumns.uso && {
               field: "uso.descripcion",
               headerName: "Uso",
               cellRendererFramework: (params) => (
                  <TruncatedText text={params.uso?.descripcion} />
               ),
               sortable: true,
            },
            visibleColumns.tipo_cotizacion && {
               field: "tipo_cotizacion",
               headerName: "Tipo",
               sortable: true,
            },
            visibleColumns.estado && {
               field: "estados_cotizacion.nombre",
               headerName: "Estado",
               sortable: true,
            },
            {
               headerName: "Accioness",
               sortable: false,
               cellRenderer: (params) => {
                  const row = params.data;

                  return (
                     <div className="flex gap-1 justify-start">
                        {row.estados_cotizacion.nombre === "Por Aprobar" && (
                           <>
                              <Button
                                 variant="outline"
                                 size="icon"
                                 onClick={() => onDownloadPDF(row.id)}
                              >
                                 <FileDown />
                              </Button>
                              <Button
                                 variant="outline"
                                 size="icon"
                                 onClick={() =>
                                    setCotizacionPrevisualizada(row.id)
                                 }
                              >
                                 <Eye />
                              </Button>
                           </>
                        )}
                        {row.estados_cotizacion.nombre ===
                           "Despiece generado" && (
                           <Button
                              variant="outline"
                              size="icon"
                              onClick={() => onContinuarWizard(row.id)}
                           >
                              <Edit />
                           </Button>
                        )}
                     </div>
                  );
               },
            },
         ].filter(Boolean),
      [visibleColumns]
   );

   useEffect(() => {
      if (!text) {
         setCotizaciones(data);
      } else {
         const lowerText = text.toLowerCase();

         const filtro = data.filter((item) => {
            const codigo = (item.codigo_documento ?? "")
               .toString()
               .toLowerCase();
            const cliente = (item.cliente.razon_social ?? "")
               .toString()
               .toLowerCase();
            const obra = (item.obra.nombre ?? "").toString().toLowerCase();

            // Devuelve true si coincide en alguno de los campos
            return (
               codigo.includes(lowerText) ||
               cliente.includes(lowerText) ||
               obra.includes(lowerText)
            );
         });

         setCotizaciones(filtro);
      }
   }, [text]);

   return (
      <div className="w-full px-4 max-w-7xl">
         <article className="flex flex-col md:flex-row justify-between mt-6">
            <section className="relative flex-1 w-full md:max-w-80 ">
               <Input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Filtra por código, cliente o obra"
                  className="w-full"
               />
            </section>
            <ColumnSelector
               visibleColumns={visibleColumns}
               setVisibleColumns={setVisibleColumns}
               columnOptions={columnOptions}
            />
         </article>

         <AgGridReact
            rowData={cotizaciones}
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
