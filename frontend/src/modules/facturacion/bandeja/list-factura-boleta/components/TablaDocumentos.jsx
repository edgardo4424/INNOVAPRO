import { BookX, Download, EyeIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useBandeja } from "@/modules/facturacion/context/BandejaContext";

const TablaDocumentos = ({
  documentos,
  setIdDocumento,
  setModalOpen,
  setModalDescargar,
  setDocumentoADescargar,
  setDocumentoAVisualizar,
  setDocumentoAAnular,
  setModalAnular,
}) => {
  const { filiales } = useBandeja();

  const filialActural = (ruc) => {
    if (filiales.length === 0) return "";
    const { razon_social } = filiales.find((filial) => filial.ruc === ruc);
    return razon_social;
  };

  // Función para obtener el color del estado
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
              Tipo Doc
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
              Serie-Correlativo
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
              Fecha Emision
            </th>
            {/* <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider">Empresa RUC</th> */}
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
              Filial
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
              Nro. Doc - Cliente
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
              Monto Imp. Venta
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
          {documentos.map((factura, index) => (
            <tr
              key={factura.id}
              className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} border-b border-gray-200 transition-colors hover:bg-gray-100`}
            >
              <td className="px-2 py-3 text-xs text-gray-700">
                {factura.tipo_doc == "01" ? "Factura" : "Boleta"}
              </td>
              <td className="px-2 py-3 text-xs font-medium text-gray-700">
                {`${factura.serie}-${factura.correlativo}`}
              </td>
              <td className="px-6 py-3 text-xs text-gray-700">
                {new Date(factura.fecha_emision).toLocaleDateString("es-PE", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </td>
              <td className="px-2 py-3 text-xs text-gray-700">
                <span>{filialActural(factura.empresa_ruc) || ""}</span>
              </td>
              <td className="flex flex-col px-2 py-3 text-xs text-gray-700">
                <span>{`${factura.cliente_num_doc || ""} -`}</span>
                <span>{factura.cliente_razon_social || ""}</span>
              </td>
              <td className="px-2 py-3 text-xs font-medium text-gray-700">
                {`${factura.tipo_moneda} ${factura.monto_imp_venta}`}
              </td>
              <td className="min-w-[160px] py-3">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${getEstadoColor(factura.estado)}`}
                >
                  {getEstadoTexto(factura.estado)}
                </span>
              </td>
              <td className="px-2 py-3">
                <div className="flex justify-start gap-x-2">
                  <Tooltip side="bottom" align="center" className="mr-2">
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => {
                          setIdDocumento(factura.id);
                          setModalOpen(true);
                          setDocumentoAVisualizar({
                            correlativo: String(factura.correlativo),
                            serie: factura.serie,
                            empresa_ruc: factura.empresa_ruc,
                            tipo_doc: factura.tipo_doc,
                          });
                        }}
                        className="rounded p-1 transition-colors hover:bg-blue-100"
                      >
                        <EyeIcon className="h-5 w-5 cursor-pointer text-blue-600 hover:text-blue-800" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Ver documento</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip side="bottom" align="center" className="mr-2">
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => {
                          setIdDocumento(factura.id);
                          setModalDescargar(true);
                          setDocumentoADescargar({
                            serie: factura.serie,
                            correlativo: factura.correlativo,
                            numRuc: factura.empresa_ruc,
                            tipoDoc: factura.tipo_doc,
                            numDocumentoComprobante: factura.cliente_num_doc,
                          });
                        }}
                        className="rounded p-1 transition-colors hover:bg-green-100"
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
                        disabled={factura.estado !== "EMITIDA"}
                        onClick={() => {
                          setIdDocumento(factura.id);
                          setModalAnular(true);
                          setDocumentoAAnular({
                            empresa_ruc: factura.empresa_ruc,
                            tipo_Doc: factura.tipo_doc,
                            serie: factura.serie,
                            correlativo: factura.correlativo,
                            anulacion_Motivo: "",
                            estado_Documento: "0",
                          });
                        }}
                        className={`${factura.estado !== "EMITIDA" ? "" : "text-red-500 hover:bg-red-100 hover:text-red-700"}p-1 rounded transition-colors`}
                      >
                        <BookX className="h-5 w-5 cursor-pointer" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {factura.estado !== "EMITIDA" ? (
                        <p>Documento anulado</p>
                      ) : (
                        <p>Anular</p>
                      )}
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

export default TablaDocumentos;
