import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/context/AuthContext";
import { getMotivoTrasladoDescription } from "@/modules/facturacion/utils/formateos";
import {
  Badge,
  BadgeAlert,
  BadgeCheck,
  BadgeHelp,
  ClipboardCheck,
  ClipboardList,
  EyeIcon,
  FileInput,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const bgEstado = (estado) => {
  switch (estado) {
    case "Finalizado":
      return "bg-purple-700 !text-white";
    case "Stock Confirmado":
      return "bg-green-600 !text-white";
    case "Confirmado":
      return "bg-blue-600 !text-white";
    case "Pre Confirmado":
      return "bg-yellow-500 !text-white";
    case "Por Confirmar":
      return "bg-orange-500 !text-white";
    default:
      return "bg-gray-500 !text-white"; // 🔧 typo corregido
  }
};

const TablaConfirmado = ({
  listaPedidos,
  setOpen,
  setPedidoView,
  setOpenNuevaTarea,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const plasmarPedido = async (doc) => {
    const guiaIncial = {
      tipo_Doc: "09",
      serie: "T005",
      correlativo: "",
      observacion: doc.observacion || "",
      // ?Datos del comprobante de referencia
      obra: doc.obra ? doc.obra.toUpperCase() : "",
      nro_contrato: doc.nro_contrato ? doc.nro_contrato.toUpperCase() : "",
      estado_Documento: "0",
      empresa_Ruc: doc.empresa_Ruc,

      cliente_Tipo_Doc: doc.cliente_Tipo_Doc,
      cliente_Num_Doc: doc.cliente_Num_Doc,
      cliente_Razon_Social: doc.cliente_Razon_Social || "",
      cliente_Direccion: "",

      guia_Envio_Peso_Total: Number(doc.guia_Envio_Peso_Total).toFixed(4),
      guia_Envio_Und_Peso_Total: doc.guia_Envio_Und_Peso_Total,

      guia_Envio_Partida_Ubigeo: doc.guia_Envio_Partida_Ubigeo,
      guia_Envio_Partida_Direccion: doc.guia_Envio_Partida_Direccion,
      guia_Envio_Llegada_Ubigeo: doc.guia_Envio_Llegada_Ubigeo,
      guia_Envio_Llegada_Direccion: doc.guia_Envio_Llegada_Direccion,

      guia_Envio_Vehiculo_Placa: "",
      nroCirculacion: "",

      detalle: doc.detalle,

      chofer: [],
    };

    const valoresTraslado = {
      guia_Envio_Cod_Traslado: doc.guia_Envio_Cod_Traslado,
      guia_Envio_Des_Traslado: getMotivoTrasladoDescription(
        doc.guia_Envio_Cod_Traslado,
      ),
    };

    const tipoGuia = doc.ValoresPublico
      ? "transporte-publico"
      : "transporte-privado";

    const body = {
      guia: guiaIncial,
      ruc_filial: doc.empresa_Ruc,
      pedido_id: doc.pedido_id, // ✅ usa pedido_id, no id_pedido
      codigo_traslado: valoresTraslado,
      peso_total_kilo: Number(doc.guia_Envio_Peso_Total).toFixed(4),
      tipoGuia,
    };

    const documento = [body, { pedido_id: doc.pedido_id }];

    navigate("/facturacion/emitir/guia", { state: documento });
  };

  // disabled={pedido.estado !== "Stock Confirmado" || pedido.estado !== "Incompleto"}

  const actPlasmado = (estado) => {
    return !(estado === "Stock Confirmado" || estado === "Incompleto");
  };

  const actPlasmarPedido = (usuario, estadoPedido) => {
    switch (usuario) {
      case "Jefa de Almacén":
        if (
          estadoPedido === "Stock Confirmado" ||
          estadoPedido === "Incompleto"
        ) {
          return true;
        } else {
          return false;
        }
      case "Auxiliar de oficina":
        if (
          estadoPedido === "Stock Confirmado" ||
          estadoPedido === "Incompleto"
        ) {
          return true;
        } else {
          return false;
        }
      default:
        return false;
    }
  };

  const actNuevaTarea = (usuario) => {
    switch (usuario) {
      // case "CEO":
      //   return true;
      case "Técnico Comercial":
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="w-full rounded-xl border-1 border-gray-200">
      <table className="min-w-full overflow-hidden rounded-xl bg-white shadow-md">
        <thead className="bg-innova-blue text-white">
          <tr>
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
              Tipo de Pedido
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
              Filial
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
              Comercial
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
              Cliente
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
              Obra
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
              Peso Total
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
          {listaPedidos.map((pedido, index) => {
            return (
              <tr
                key={pedido.pedido_id}
                className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} border-b border-gray-200`}
              >
                <td className="px-3 py-3 text-xs text-gray-700">
                  {getMotivoTrasladoDescription(
                    pedido.guia_Envio_Cod_Traslado,
                  ) || "INDEFINIDO"}
                </td>
                <td className="px-3 py-3 text-xs text-gray-700">
                  {pedido.filial}
                </td>
                <td className="px-3 py-3 text-xs text-gray-700">
                  {pedido.cm_Usuario}
                </td>
                <td className="px-3 py-3 text-xs text-gray-700">
                  {pedido.cliente_Razon_Social}
                </td>
                <td className="px-3 py-3 text-xs text-gray-700 uppercase">
                  {pedido.obra}
                </td>
                <td className="px-3 py-3 text-xs text-gray-700 uppercase">
                  {pedido.guia_Envio_Peso_Total.toFixed(4) || 0}{" "}
                  {pedido.guia_Envio_Und_Peso_Total || ""}
                </td>
                <td>
                  <span
                    className={
                      "rounded-full px-3 py-2 text-xs text-gray-700 " +
                      bgEstado(pedido.estado) +
                      ""
                    }
                  >
                    {pedido.estado}
                  </span>
                </td>
                <td className="px-3 py-3 text-xs text-gray-700">
                  <div className="gap-x-auto flex justify-start">
                    <Tooltip side="bottom" align="center" className="mr-2">
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => {
                            setOpen(true);
                            setPedidoView(pedido);
                          }}
                          className="rounded p-1 transition-colors hover:bg-blue-100"
                        >
                          <EyeIcon className="h-5 w-5 cursor-pointer text-blue-600 hover:text-blue-800" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Ver Pedido</p>
                      </TooltipContent>
                    </Tooltip>

                    {actNuevaTarea(user.rol) &&
                      (pedido.tarea_id == null ? (
                        <Tooltip side="bottom" align="center" className="mr-2">
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => {
                                setOpenNuevaTarea(true);
                                setPedidoView(pedido);
                              }}
                              className="rounded p-1 transition-colors hover:bg-orange-100"
                            >
                              <ClipboardList className="h-5 w-5 cursor-pointer text-orange-600 hover:text-orange-800" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Generar Nueva Tarea</p>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <Tooltip side="bottom" align="center" className="mr-2">
                          <TooltipTrigger asChild>
                            <button
                              readOnly
                              className="rounded p-1 transition-colors hover:bg-green-100"
                            >
                              <ClipboardCheck className="h-5 w-5 cursor-pointer text-green-600 hover:text-green-800" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Ya tiene Tarea</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}

                    {pedido.estado == "Stock Confirmado" && (
                      <Tooltip side="bottom" align="center" className="mr-2">
                        <TooltipTrigger asChild>
                          <button
                            readOnly
                            className="rounded p-1 transition-colors hover:bg-green-100"
                          >
                            <BadgeCheck className="h-5 w-5 cursor-pointer text-green-600 hover:text-green-800" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Stock Validado</p>
                        </TooltipContent>
                      </Tooltip>
                    )}

                    {actPlasmarPedido(user.rol, pedido.estado) && (
                      <Tooltip side="bottom" align="center" className="mr-2">
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => {
                              plasmarPedido(pedido);
                            }}
                            disabled={actPlasmado(pedido.estado)}
                            className="rounded p-1 text-yellow-600 transition-colors hover:bg-yellow-100 hover:text-yellow-700 disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:bg-white disabled:hover:text-gray-400"
                          >
                            <FileInput className="h-5 w-5 cursor-pointer" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Emitir Pedido</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TablaConfirmado;
