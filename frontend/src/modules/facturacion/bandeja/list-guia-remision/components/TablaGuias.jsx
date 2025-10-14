import { Download, EyeIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useBandeja } from "@/modules/facturacion/context/BandejaContext";

const TablaGuias = ({
  documentos,
  setIdDocumento,
  setModalOpen,
  setDocumentoAVisualizar,
  setModalDescargar,
  setGuiaADescargar,
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
            {/* <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider">Usuario</th> */}
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
              Estado
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {documentos.map((guia, index) => (
            <tr
              key={guia.id}
              className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} border-b border-gray-200`}
            >
              {/* <td className="py-3 px-6 text-xs text-gray-700">{guia.id}</td> */}
              {/* <td className="py-3 px-6 text-xs text-gray-700">{guia.tipo_doc}</td> */}
              <td className="px-6 py-3 text-xs text-gray-700">{`${guia.serie}-${guia.correlativo}`}</td>
              <td className="px-6 py-3 text-xs text-gray-700">
                {new Date(guia.fecha_emision).toLocaleDateString("es-PE", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </td>
              <td className="px-6 py-3 text-xs text-gray-700">
                {filialActural(guia.empresa_ruc)}
              </td>
              <td className="flex flex-col px-2 py-3 text-xs text-gray-700">
                <span>{guia.cliente_razon_social || ""}</span>
                <span>{guia.cliente_num_doc || ""}</span>
              </td>
              {/* <td className="py-3 px-6 text-xs text-gray-700">{guia.usuario_id}</td> */}
              <td className="py-3">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${getEstadoColor(guia.estado)}`}
                >
                  {getEstadoTexto(guia.estado)}
                </span>
              </td>
              <td className="px-6 py-3">
                <div className="flex justify-start gap-x-2">
                  <Tooltip side="bottom" align="center" className="mr-2">
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => {
                          setIdDocumento(guia.id);
                          setModalOpen(true);
                          setDocumentoAVisualizar({
                            correlativo: String(guia.correlativo),
                            serie: guia.serie,
                            empresa_ruc: guia.empresa_ruc,
                            tipo_doc: guia.tipo_doc,
                          });
                        }}
                      >
                        <EyeIcon className="h-5 w-5 cursor-pointer text-blue-600 hover:text-blue-800" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Ver guia</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip side="bottom" align="center" className="mr-2">
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => {
                          setIdDocumento(guia.id);
                          setModalDescargar(true);
                          setGuiaADescargar({
                            serie: guia.serie,
                            correlativo: guia.correlativo,
                            numRuc: guia.empresa_ruc,
                            tipoDoc: guia.tipo_doc,
                            numDocumentoComprobante: guia.cliente_num_doc,
                            razonSocial: guia.cliente_razon_social,
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
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaGuias;
