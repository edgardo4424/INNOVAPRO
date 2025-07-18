import { useEffect, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

import stockPiezasService from "../services/stockPiezasService";
import { ColumnSelector } from "@/shared/components/ColumnSelector";
ModuleRegistry.registerModules([AllCommunityModule]);
import "ag-grid-community/styles/ag-theme-quartz.css";
import SummaryStats from "./SummaryStats";
import {
   AlertTriangle,
   CheckCircle,
   Clock,
   Package,
   Search,
} from "lucide-react";
import { QuotedPartsCellRenderer, StockCellRenderer } from "./ColumnasTabla";
import StockLevelFilter from "./StockLevel";
import { Input } from "@/components/ui/input";

const TablaStockPiezas = ({ visibleColumns }) => {
   const gridOptions = {
      filters: {
         stockLevel: StockLevelFilter, // nombre y hook
      },
   };
   const [data, setData] = useState([]);
   const [loading, setLoading] = useState(false);

   const [textoFiltro, setTextoFiltro] = useState("");

   const piezasEnContratoChildren = [
      {
         headerName: "Por confirmar",
         field: "por_confirmar",
         sortable: true,
         flex: 1,
         minWidth: 130,
      },
      {
         headerName: "Pre-confirmado",
         field: "pre_confirmado",
         sortable: true,
         flex: 1,
         minWidth: 130,
      },
      {
         headerName: "Confirmado",
         field: "confirmado",
         sortable: true,
         flex: 1,
         minWidth: 130,
      },
   ];
   const columns = useMemo(
      () =>
         [
            visibleColumns.item && {
               headerName: "Item",
               field: "item",
               sortable: true,
               cellRenderer: (params) => (
                  <div className="flex items-center gap-2 py-1">
                     <Package className="h-4 w-4 text-blue-600" />
                     <span className="font-mono text-sm">{params.value}</span>
                  </div>
               ),
               flex: 1,
               minWidth: 120,
            },
            visibleColumns.descripcion && {
               headerName: "Descripción",
               field: "descripcion",
               sortable: true,
               cellStyle: { fontWeight: "500" },
               flex: 2,
               minWidth: 230,
            },
                        visibleColumns.stock_fijo && {
               headerName: "Stock Fijo",
               field: "stock_fijo",
               sortable: true,
               flex: 1,
               minWidth: 100,
            },
            visibleColumns.stock_disponible && {
               headerName: "Stock Disponible",
               field: "stock_disponible",
               sortable: true,
               cellRenderer: StockCellRenderer,
               flex: 1,
               minWidth: 150,
               filter: StockLevelFilter,
            },
            visibleColumns.por_aprobar && {
               headerName: "Piezas cotizadas",
               field: "por_aprobar",
               sortable: true,
               cellRenderer: QuotedPartsCellRenderer,
               flex: 1,
               minWidth: 150,
            },

            visibleColumns.piezas_en_contrato &&
               piezasEnContratoChildren.length > 0 && {
                  headerName: "Piezas en contrato",
                  children: piezasEnContratoChildren,
               },
         ].filter(Boolean),
      [visibleColumns]
   );

   useEffect(() => {
      const fetchData = async () => {
         setLoading(true);
         try {
            const result = await stockPiezasService.obtenerStockPiezas();
            const transformedData = result.piezas.map((p) => ({
               ...p,
               por_aprobar: Number(p["Por aprobar"]),
               por_confirmar: Math.floor(Math.random() * 10),
               pre_confirmado: Math.floor(Math.random() * 10),
               confirmado: Math.floor(Math.random() * 10),
            }));

            setData(transformedData);
         } catch (error) {
            console.error("Error al obtener el stock de piezas:", error);
         } finally {
            setLoading(false);
         }
      };

      fetchData();
   }, []);

   let filteredData = data;
   if (textoFiltro.trim()) {
      const filtro = textoFiltro.trim().toLowerCase();
      filteredData = data.filter(
         (item) =>
            (item.item && item.item.toLowerCase().includes(filtro)) ||
            (item.descripcion &&
               item.descripcion.toLowerCase().includes(filtro))
      );
   }

   return (
      <>
         <SummaryStats data={data} />
         <div className="relative mb-6 w-full md:w-1/2 lg:w-1/3">
            <Search className="absolute top-1/2 -translate-y-1/2 left-1 size-5" />
            <Input
               placeholder="Buscar por el nombre del producto o codigo"
               className="pl-8"
               value={textoFiltro}
               onChange={(e) => setTextoFiltro(e.target.value)}
            />
         </div>
         <div className="ag-theme-alpine">
            <AgGridReact
               // className=" mb-4"

               rowData={filteredData}
               columnDefs={columns}
               gridOptions={gridOptions}
               // suppressMovableColumns={true}
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
      </>
   );
};

export default TablaStockPiezas;
