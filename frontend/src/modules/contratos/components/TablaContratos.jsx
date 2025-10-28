import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Edit, Eye, FileDown, FileText, SquareCheckBig, FileCog } from "lucide-react";
import { ColumnSelector } from "@/shared/components/ColumnSelector";
import { Input } from "@/components/ui/input";

import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

import "ag-grid-community/styles/ag-theme-quartz.css";

import SolicitarCondicionesModal from "./SolicitarCondicionesModal";
import CondicionesModal from "./CondicionesModal";

import { obtenerContratos } from "../services/contratosService";

// Texto truncado con tooltip
const TruncatedText = ({ text }) => {
  if (!text) return "—";
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="truncate">{text}</div>
        </TooltipTrigger>
        <TooltipContent>{text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default function TablaContratos({
  data = [],
  onDownloadPDF,
  setContratoPrevisualizado,
  onContinuarWizard,
  onSolicitarCondicionesAlquiler,
  user,
}) {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [contratos, setContratos] = useState([]);

  // Aplanado defensivo (contrato es extensión de cotización)
  useEffect(() => {
    const flattened = (data || []).map((item) => {
      return ({
      ...item,
      // claves comunes
      cotizacionId: item.cotizacion?.id ?? null,
      filial_id: item.filial?.id ?? item.filial_id ?? null,
      filial_razon_social: item.filial?.razon_social ?? null,
      uso_id: item.uso?.id ?? item.uso_id ?? null,
      codigo_contrato: item.ref_contrato ?? "-",
      cliente_razon_social: item.cliente?.razon_social ?? "-",
      obra_nombre: item.obra?.nombre ?? "-",
      uso_descripcion: item.uso?.descripcion ?? "-",
      tipo: item.tipo ?? item.tipo_servicio ?? "-",
      estado_contrato: item.estado ?? "-",
      estado_condiciones: item.estado_condiciones ?? "-",
      fecha_inicio: item.fecha_inicio ?? item.vigencia?.inicio ?? null,
      fecha_fin: item.fecha_fin ?? item.vigencia?.fin ?? null,
    })});
    setContratos(flattened);
  }, [data]);

  const [visibleColumns, setVisibleColumns] = useState({
    codigo: true,
    cliente: true,
    filial: true,
    obra: true,
    uso: true,
    tipo: true,
    estado: true,
    estado_condiciones: true,
    vigencia: true,
    acciones: true,
  });

  const columnOptions = [
    { id: "codigo", label: "Código" },
    { id: "cliente", label: "Cliente" },
    { id: "filial", label: "Filial" },
    { id: "obra", label: "Obra" },
    { id: "uso", label: "Uso" },
    { id: "tipo", label: "Tipo" },
    { id: "estado", label: "Estado" },
    { id: "estado_condiciones", label: "Estado Condiciones"},
    { id: "vigencia", label: "Vigencia" },
    { id: "acciones", label: "Acciones" },
  ];

  const columns = useMemo(
    () =>
      [
        visibleColumns.codigo && {
          field: "codigo_contrato",
          headerName: "Código",
          width: 190,
          cellRenderer: (p) => <TruncatedText text={p.value} />,
        },
        visibleColumns.filial && {
          field: "filial_razon_social",
          headerName: "Filial",
          width: 200,
          cellRenderer: (p) => <TruncatedText text={p.value} />,
        },
        visibleColumns.cliente && {
          field: "cliente_razon_social",
          headerName: "Cliente",
          width: 200,
          cellRenderer: (p) => <TruncatedText text={p.value} />,
        },
        visibleColumns.obra && {
          field: "obra_nombre",
          headerName: "Obra",
          width: 150,
          cellRenderer: (p) => <TruncatedText text={p.value} />,
          sortable: true,
        },
        visibleColumns.uso && {
          field: "uso_descripcion",
          headerName: "Uso",
          width: 150,
          cellRenderer: (p) => <TruncatedText text={p.value} />,
          sortable: true,
        },
        visibleColumns.tipo && {
          field: "tipo",
          headerName: "Tipo",
          width: 80,
          sortable: true,
        },
        visibleColumns.estado && {
          field: "estado_contrato",
          headerName: "Estado",
          width: 150,
          cellRenderer: (p) => <TruncatedText text={p.value} />,
          sortable: true,
        },
        visibleColumns.estado_condiciones && {
          field: "estado_condiciones",
          headerName: "Estado Condiciones",
          width: 150,
          cellRenderer: (p) => <TruncatedText text={p.value} />,
          sortable: true,
        },
        visibleColumns.vigencia && {
          headerName: "Vigencia",
          width: 200,
          valueGetter: (p) => {
            const i = p.data?.fecha_inicio ? new Date(p.data.fecha_inicio) : null;
            const f = p.data?.fecha_fin ? new Date(p.data.fecha_fin) : null;
            if (!i && !f) return "—";
            const fmt = (d) =>
              `${`${d.getDate()}`.padStart(2, "0")}/${`${d.getMonth() + 1}`.padStart(2, "0")}/${d.getFullYear()}`;
            return `${i ? fmt(i) : "—"} - ${f ? fmt(f) : "—"}`;
          },
          cellRenderer: (p) => <TruncatedText text={p.value} />,
          sortable: false,
        },
        {
          headerName: "Acciones",
          sortable: false,
          width: 200,
          cellRenderer: (params) => {
            const row = params.data;

            const puedeEditar =
              ["Borrador", "Por Firmar"].includes(row.estado_contrato) &&
              row?.usuario?.id === user?.id;

            const puedeDescargar =
              ["Por Firmar", "Vigente", "Vencido", "Resuelto"].includes(row.estado_contrato);

            const puedeSolicitarCondiciones =
              ["Creado"].includes(row.estado_condiciones);

            return (
              <div className="flex gap-1 justify-start">
                {/* Documentos (plantilla → DOCX/PDF) */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        navigate(`/contratos/${row.id}/documentos`, {
                          state: {
                            codigo_contrato: row.ref_contrato ?? null,
                            filialId: row.filial_id ?? null,
                            filial_razon_social: row.filial?.razon_social ?? null,
                            usoId: row.uso_id ?? null,
                            cotizacionId: row.cotizacion.id ?? null,
                            uso: row.uso_descripcion ?? null,
                          },
                        })
                      }
                    >
                      <FileCog />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Documentos</p>
                  </TooltipContent>
                </Tooltip>

                {/* Descargar PDF */}
                {puedeDescargar && (
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
                          onClick={() => setContratoPrevisualizado(row.id)}
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

                {/* Continuar wizard (editar flujo) */}
                {puedeEditar && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onContinuarWizard(row.id)}
                      >
                        <Edit />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Continuar / Editar</p>
                    </TooltipContent>
                  </Tooltip>
                )}

                {/* Solicitar condiciones de alquiler para el mismo usuario */}
                {puedeSolicitarCondiciones &&
                (
                  <SolicitarCondicionesModal
                    contrato={row}
                    onConfirmar={onSolicitarCondicionesAlquiler}
                  >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <SquareCheckBig />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Solicitar Condiciones de Alquiler</p>
                    </TooltipContent>
                  </Tooltip>
                  </SolicitarCondicionesModal>
                )}

                {/* Validar condiciones, si corresponde */}
                {row.estado_condiciones === "Validando Condiciones" &&
                 row.usuario.id === user.id && (
                 <CondicionesModal 
                    contratoId={row.id} 
                    onActualizarCotizaciones={async () => {
                      const res = await obtenerContratos();
                      setContratos(
                        res.map((item) => ({
                          ...item,
                          codigo_contrato: item.ref_contrato  ?? "—",
                          cliente_razon_social: item.cliente?.razon_social ?? "—",
                          obra_nombre: item.obra?.nombre ?? "—",
                          uso_descripcion: item.uso?.descripcion ?? "—",
                          tipo: item.tipo ?? item.tipo_servicio ?? "—",
                          estado_contrato: item.estado_condiciones ?? "—",
                          fecha_inicio: item.fecha_inicio ?? item.vigencia?.inicio ?? null,
                          fecha_fin: item.fecha_fin ?? item.vigencia?.fin ?? null,
                        }))
                      )
                    }}
                  />
                )}
              </div>
            );
          },
        },
      ].filter(Boolean),
    [visibleColumns, user?.id]
  );

  // Filtro texto
  useEffect(() => {
    if (!text) {
      setContratos(
        (data || []).map((item) => ({
          ...item,
          filial_id: item.filial?.id ?? item.filial_id ?? null,
          filial_razon_social: item.filial?.razon_social ?? null,
          uso_id: item.uso?.id ?? item.uso_id ?? null,
          codigo_contrato: item.ref_contrato  ?? "—",
          cliente_razon_social: item.cliente?.razon_social ?? "—",
          obra_nombre: item.obra?.nombre ?? "—",
          uso_descripcion: item.uso?.descripcion ?? "—",
          tipo: item.tipo ?? item.tipo_servicio ?? "—",
          estado_contrato: item.estado_condiciones ?? "—",
          fecha_inicio: item.fecha_inicio ?? item.vigencia?.inicio ?? null,
          fecha_fin: item.fecha_fin ?? item.vigencia?.fin ?? null,
        }))
      );
    } else {
      const lower = text.toLowerCase();
      const filtro = (data || [])
        .filter((item) => {
          const codigo = (item.ref_contrato ?? "").toLowerCase();
          const cliente = (item.cliente?.razon_social ?? "").toLowerCase();
          const filial = (item.filial?.razon_social ?? "").toLowerCase();
          const obra = (item.obra?.nombre ?? "").toLowerCase();
          const uso = (item.uso?.descripcion ?? "").toLowerCase();
          const estado = (
            item.estado_condiciones ??
            item.estado?.nombre ??
            ""
          ).toLowerCase();

          return (
            codigo.includes(lower) ||
            cliente.includes(lower) ||
            filial.includes(lower) ||
            obra.includes(lower) ||
            uso.includes(lower) ||
            estado.includes(lower)
          );
        })
        .map((item) => ({
          ...item,
          filial_id: item.filial?.id ?? item.filial_id ?? null,
          filial_razon_social: item.filial?.razon_social ?? null,
          uso_id: item.uso?.id ?? item.uso_id ?? null,
          codigo_contrato: item.ref_contrato ?? "—",
          cliente_razon_social: item.cliente?.razon_social ?? "—",
          obra_nombre: item.obra?.nombre ?? "—",
          uso_descripcion: item.uso?.descripcion ?? "—",
          tipo: item.tipo ?? item.tipo_servicio ?? "—",
          estado_contrato: item.estado_condiciones ?? "—",
          fecha_inicio: item.fecha_inicio ?? item.vigencia?.inicio ?? null,
          fecha_fin: item.fecha_fin ?? item.vigencia?.fin ?? null,
        }));

      setContratos(filtro);
    }
  }, [text, data]);

  return (
    <div className="w-full px-4 max-w-7xl">
      {/* Filtro + selector de columnas */}
      <article className="flex flex-col md:flex-row justify-between mt-6">
        <section className="relative flex-1 w-full md:max-w-80">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Filtra por código, cliente, obra, uso o estado"
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
        rowData={contratos}
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