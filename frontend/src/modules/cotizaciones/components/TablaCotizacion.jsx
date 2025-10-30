import { useEffect, useMemo, useState } from "react";
import {
   Tooltip,
   TooltipTrigger,
   TooltipContent,
   TooltipProvider,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Edit, Eye, FileDown, FileSignature } from "lucide-react";
import { ColumnSelector } from "@/shared/components/ColumnSelector";
import { Input } from "@/components/ui/input";

import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

import "ag-grid-community/styles/ag-theme-quartz.css";

import { obtenerTodos } from "../services/cotizacionesService"

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
   onCrearContrato,
   user,
}) {
   const [text, setText] = useState("");
   const [cotizaciones, setCotizaciones] = useState([]);

   // Cuando cambia la data, aplanamos la estructura para AG grid
   useEffect(() => {
      const flattened = data.map((item) => ({
         ...item,
         despiece_cp: item.despiece?.cp ?? "-",
         cliente_razon_social: item.cliente?.razon_social ?? "-",
         obra_nombre: item.obra?.nombre ?? "-",
         uso_descripcion: item.uso?.descripcion ?? "-",
         estado_nombre: item.estados_cotizacion?.nombre ?? "-",
      }))
      setCotizaciones(flattened);
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

   // Opciones para el selector de columnas 
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

   // Definición de columnas de AG grid
   const columns = useMemo(
      () =>
         [
            visibleColumns.codigo_documento &&
            {
               headerName: "Acciones",
               sortable: false,
               width: 150,
               cellRenderer: (params) => {
                  const row = params.data;

                  return (
                     <div className="flex gap-1 justify-start">
                        {/* Descarga y previsualización de PDF */}
                        {(
                           row.estado_nombre === "Por Aprobar" ||
                           row.estado_nombre === "Aprobado"/*  ||
                           row.estado_nombre === "Condiciones Solicitadas" ||
                           row.estado_nombre === "Validar Condiciones" */
                        ) && (
                           <>
                              <Tooltip>
                                 <TooltipTrigger asChild>
                                    <Button
                                       variant="outline"
                                       size="icon"
                                       onClick={() => onDownloadPDF(row.id)}
                                    >
                                       <FileDown />
                                    </Button>
                                 </TooltipTrigger>
                                 <TooltipContent>
                                    <p>Descargar PDF</p>
                                 </TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                 <TooltipTrigger asChild>
                                    <Button
                                       variant="outline"
                                       size="icon"
                                       onClick={() =>
                                          setCotizacionPrevisualizada(row.id)
                                       }
                                    >
                                       <Eye />
                                    </Button>
                                    </TooltipTrigger>
                                 <TooltipContent>
                                    <p>Previsualizar PDF</p>
                                 </TooltipContent>
                              </Tooltip>
                           </>
                        )}

                        {/* Continuar el Wizard si ya hay despiece generado por OT */}
                        {row.estado_nombre ===
                           "Despiece generado" && (
                           <Button
                              variant="outline"
                              size="icon"
                              onClick={() => onContinuarWizard(row.id)}
                           >
                              <Edit />
                           </Button>
                        )}

                        {/* Crear contrato (Cuando ya las condiciones están cumplidas) */}
                        {row.estado_nombre === "Por Aprobar" && typeof onCrearContrato === "function" && (
                           <Tooltip>
                              <TooltipTrigger asChild>
                                 <Button 
                                    variant="outline"
                                    size="icon"
                                    onClick={()=> onCrearContrato(row.id)}
                                 >
                                    <FileSignature />
                                 </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                 <p>Crear Contrato</p>
                              </TooltipContent>
                           </Tooltip>
                        )}
                     </div>
                  );
               },
            }, 
            {
               field: "codigo_documento",
               headerName: "Cod. Doc",
               width: 195,
               cellRenderer: (params) => (
                  <TruncatedText text={params.value} />
               ),
            },
            visibleColumns.cp && {
               field: "despiece_cp",
               headerName: "CP",
               width: 50,
               cellRenderer: (params) => (
                  <TruncatedText text={params.value} />
               ),
               sortable: true,
            },
            visibleColumns.cliente && {
               field: "cliente_razon_social",
               headerName: "Cliente",
               width: 250,
               cellRenderer: (params) => (
                  <TruncatedText text={params.value} />
               ),
            },

            visibleColumns.obra && {
               field: "obra_nombre",
               headerName: "Obra",
               width: 190,
               cellRenderer: (params) => (
                  <TruncatedText text={params.value} />
               ),
               sortable: true,
            },
            visibleColumns.uso && {
               field: "uso_descripcion",
               headerName: "Uso",
               width: 250,
               cellRenderer: (params) => (
                  <TruncatedText text={params.value} />
               ),
               sortable: true,
            },
            visibleColumns.tipo_cotizacion && {
               field: "tipo_cotizacion",
               headerName: "Tipo",
               width: 85,
               sortable: true,
            },
            visibleColumns.estado && {
               field: "estado_nombre",
               headerName: "Estado",
               width: 190,
               sortable: true,
            },
         ].filter(Boolean),
      [visibleColumns, user.id]
   );

   // filtro de búsqueda por texto (codigo, cliente, obra)
   useEffect(() => {
      if (!text) {
         setCotizaciones(
            data.map((item) => ({
               ...item,
               despiece_cp: item.despiece?.cp ?? "—",
               cliente_razon_social: item.cliente?.razon_social ?? "—",
               obra_nombre: item.obra?.nombre ?? "—",
               uso_descripcion: item.uso?.descripcion ?? "—",
               estado_nombre: item.estados_cotizacion?.nombre ?? "—",
            }))
         );
      } else {
         const lowerText = text.toLowerCase();
         const filtro = data.filter((item) => {
            const codigo = (item.codigo_documento ?? "").toLowerCase();
            const cliente = (item.cliente.razon_social ?? "").toLowerCase();
            const obra = (item.obra.nombre ?? "").toLowerCase();
            const uso = (item.uso?.descripcion ?? "").toLowerCase();
            const estado = (item.estados_cotizacion?.nombre ?? "").toLowerCase();

            // Devuelve true si coincide en alguno de los campos
            return (
               codigo.includes(lowerText) ||
               cliente.includes(lowerText) ||
               obra.includes(lowerText) ||
               uso.includes(lowerText) ||
               estado.includes(lowerText)
            );
         }).map((item) => ({
            ...item,
            despiece_cp: item.despiece?.cp ?? "—",
            cliente_razon_social: item.cliente?.razon_social ?? "—",
            obra_nombre: item.obra?.nombre ?? "—",
            uso_descripcion: item.uso?.descripcion ?? "—",
            estado_nombre: item.estados_cotizacion?.nombre ?? "—",
         }))

         setCotizaciones(filtro);
      }
   }, [text, data]);

   return (
      <div className="w-full px-4 max-w-7xl">
         {/* Filtro y selector de columnas */}
         <article className="flex flex-col md:flex-row justify-between mt-6">
            <section className="relative flex-1 w-full md:max-w-80 ">
               <Input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Filtra por código, cliente, obra, uso, o estado"
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
