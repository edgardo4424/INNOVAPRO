import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useBandeja } from "@/modules/facturacion/context/BandejaContext";
import { Download, EyeIcon, FileText } from "lucide-react";

const codigosMotivoCredito = [
  {
    value: "01",
    label: "01 - Anulación de la operación",
    descripcion: "ANULACION DE OPERACION",
  },
  {
    value: "02",
    label: "02 - Anulación por error en el RUC",
    descripcion: "ANULACION POR ERROR EN EL RUC",
  },
  {
    value: "03",
    label: "03 - Corrección por error en la descripción",
    descripcion: "CORRECCION POR ERROR EN LA DESCRIPCION",
  },
  {
    value: "04",
    label: "04 - Descuento global",
    descripcion: "DESCUENTO GLOBAL",
  },
  {
    value: "05",
    label: "05 - Descuento por ítem",
    descripcion: "DESCUENTO POR ITEM",
  },
  {
    value: "06",
    label: "06 - Devolución total",
    descripcion: "DEVOLUCION TOTAL",
  },
  {
    value: "07",
    label: "07 - Devolución por ítem",
    descripcion: "DEVOLUCION POR ITEM",
  },
  // { value: "08", label: "08 - Bonificación" },
  // { value: "09", label: "09 - Disminución en el valor" },
  {
    value: "10",
    label: "10 - Otros Conceptos",
    descripcion: "OTROS CONCEPTOS",
  },
];

const codigosMotivosDebito = [
  {
    value: "01",
    label: "01 - Intereses por mora",
    descripcion: "INTERESES POR MORA",
  },
  {
    value: "02",
    label: "02 - Aumento en el valor",
    descripcion: "AUMENTO EN EL VALOR",
  },
  {
    value: "03",
    label: "03 - Penalidades/ otros conceptos",
    descripcion: "PENALIDADES/ OTROS CONCEPTOS",
  },
];

const TablaNotas = ({
  documentos,
  setIdDocumento,
  setModalOpen,
  setModalDescargar,
  setDocumentoADescargar,
  setDocumentoAVisualizar,
  setDocumentoAAnular,
  setModalAnular,
  setModalVisualizarAfectado,
  setDocumentoAfectadoVisualizar,
}) => {
  const { filiales } = useBandeja();

  const filialActural = (ruc) => {
    if (filiales.length === 0) return "";
    const { razon_social } = filiales?.find((filial) => filial.ruc === ruc);
    return razon_social;
  };

  const obtenerDescripcionMotivo = (motivo_Cod, tipo_Doc) => {
    if (tipo_Doc === "07") {
      const motivoCredito = codigosMotivoCredito.find(
        (motivoCredito) => motivoCredito.value === motivo_Cod,
      );
      return motivoCredito ? motivoCredito.descripcion : "Desconocido";
    } else {
      const motivoDebito = codigosMotivosDebito.find(
        (motivoDebito) => motivoDebito.value === motivo_Cod,
      );
      return motivoDebito ? motivoDebito.descripcion : "Desconocido";
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "EMITIDA":
        return "text-green-600 bg-green-100 border border-green-200";
      case "RECHAZADA":
        return "text-red-600 bg-red-100 border border-red-200";
      case "ANULADA-NOTA":
        return "text-red-600 bg-red-100 border border-red-200";
      case "ANULADA":
        return "text-red-600 bg-red-100 border border-red-200";
      case "MODIFICADA-NOTA":
        return "text-blue-600 bg-blue-100 border border-blue-200";
      case "OBSERVADA":
        return "text-yellow-600 bg-yellow-100 border border-yellow-200";
      case "PENDIENTE":
        return "text-orange-600 bg-orange-100 border border-orange-200";
      default:
        return "text-gray-600 bg-gray-100 border border-gray-200";
    }
  };

  // Función para obtener el texto a mostrar del estado
  const getEstadoTexto = (estado) => {
    switch (estado) {
      case "EMITIDA":
        return "EMITIDO";
      case "RECHAZADA":
        return "RECHAZADO";
      case "PENDIENTE":
        return "CARGANDO";
      case "ANULADA-NOTA":
        return "ANULADA POR NOTA";
      case "MODIFICADA-NOTA":
        return "MODIFICADA POR NOTA";
      default:
        return estado;
    }
  };

  return (
    <div className="w-full rounded-xl border-1 border-gray-200">
      <table className="min-w-full overflow-hidden rounded-xl bg-white shadow-md">
        <thead className="bg-innova-blue text-white">
          <tr>
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
              Documento
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
              Serie-Correlativo
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
              Fecha Emision
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
              Filial
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
              Nro. Doc - Cliente
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
              Montivo
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
              Estado
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {documentos.map((nota, index) => (
            <tr
              key={nota.id}
              className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} border-b border-gray-200`}
            >
              <td className="px-6 py-3 text-xs text-gray-700">
                {nota.tipo_Doc == "07" ? "Credito" : "Debito"}
              </td>
              <td className="px-6 py-3 text-xs text-gray-700">{`${nota.serie}-${nota.correlativo}`}</td>
              <td className="px-6 py-3 text-xs text-gray-700">
                {new Date(nota.fecha_Emision).toLocaleDateString("es-PE", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </td>
              <td className="px-6 py-3 text-xs text-gray-700">
                {filialActural(nota.empresa_Ruc)}
              </td>
              <td className="flex flex-col px-2 py-3 text-xs text-gray-700">
                <span>{nota.cliente_Razon_Social || ""}</span>
                <span>{nota.cliente_Num_Doc || ""}</span>
              </td>
              <td className="px-6 py-3 text-xs font-medium text-gray-700">
                {obtenerDescripcionMotivo(nota.motivo_Cod, nota.tipo_Doc)}
              </td>
              <td className="py-3">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${getEstadoColor(nota.estado)}`}
                >
                  {getEstadoTexto(nota.estado)}
                </span>
              </td>
              <td className="px-6 py-3">
                <div className="flex justify-start gap-x-2">
                  <Tooltip side="bottom" align="center" className="mr-2">
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => {
                          setIdDocumento(nota.id);
                          setModalOpen(true);
                          setDocumentoAVisualizar({
                            correlativo: String(nota.correlativo),
                            serie: nota.serie,
                            empresa_ruc: nota.empresa_Ruc,
                            tipo_doc: nota.tipo_Doc,
                          });
                        }}
                        className="rounded p-1 transition-colors hover:bg-blue-100"
                      >
                        <EyeIcon className="h-5 w-5 cursor-pointer text-blue-600 hover:text-blue-800" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Ver nota</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip side="bottom" align="center" className="mr-2">
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => {
                          setIdDocumento(nota.id);
                          setModalDescargar(true);
                          setDocumentoADescargar({
                            serie: nota.serie,
                            correlativo: nota.correlativo,
                            numRuc: nota.empresa_Ruc,
                            tipoDoc: nota.tipo_Doc,
                            numDocumentoComprobante: nota.cliente_Num_Doc,
                            razonSocial: nota.cliente_Razon_Social,
                          });
                        }}
                      >
                        <Download className="h-5 w-5 cursor-pointer text-green-600 hover:text-green-800" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Descargar</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip side="bottom" align="center" className="mr-2">
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => {
                          setIdDocumento(nota.id);
                          setModalVisualizarAfectado(true);
                          const [serie, correlativo] =
                            nota.afectado_Num_Doc.split("-");
                          setDocumentoAfectadoVisualizar({
                            serie: serie,
                            correlativo: correlativo,
                            empresa_ruc: nota.empresa_Ruc,
                            tipo_doc: nota.afectado_Tipo_Doc,
                          });
                        }}
                        className="rounded p-1 transition-colors hover:bg-yellow-100"
                      >
                        <FileText className="h-5 w-5 cursor-pointer text-yellow-600 hover:text-yellow-700" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Ver documento</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaNotas;
