import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/context/AuthContext";
import { getMotivoTrasladoDescription } from "@/modules/facturacion/utils/formateos";
import { Badge, BadgeCheck, EyeIcon, FileInput } from "lucide-react";
import { useNavigate } from "react-router-dom";

const bgEstado = (estado) => {
  switch (estado) {
    case "Confirmado":
      // 🟢 Verde: Listo, Aprobado
      return "bg-green-400 !text-white";
    case "Pre Confirmado":
      // 🟡 Amarillo/Azul: En proceso, En revisión (Si quieres que el azul signifique 'Proceso Activo')
      return "bg-yellow-400 !text-white";
    case "Por Confirmar":
      // 🔴 Rojo/Naranja: Requiere atención inmediata, Falta aprobación crítica
      return "bg-orange-400 !text-white";
    default:
      return "bg-gray-400 !text-white";
  }
};

const TablaConfirmado = ({
  listaPedidos,
  setOpen,
  setPedidoView,
  setOpenCotizacion,
  setCotizacion_id,
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
      cliente_Razon_Social: "",
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
    };

    const tipoGuia = "transporte-publico";
    // doc.tranporte === "CLIENTE" ? "transporte-publico" : "transporte-privado";

    const body = {
      guia: guiaIncial,
      codigo_traslado: valoresTraslado,
      peso_total_kilo: Number(doc.guia_Envio_Peso_Total).toFixed(4),
      tipoGuia,
    };

    const documento = [body, { id_pedido: doc.id_pedido }];

    console.log(guiaIncial);

    navigate("/facturacion/emitir/guia", { state: documento });
  };

  const actPlasmarPedido = (usuario) => {
    switch (usuario) {
      case "CEO":
        return true;
      case "Jefe de Almacén":
        return true;
      case "Auxiliar de oficina":
        return true;
      default:
        return false;
    }
  };

  const actValidarPedido = (usuario) => {
    switch (usuario) {
      case "CEO":
        return true;
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
                <td
                  className={
                    "px-3 py-3 text-xs text-gray-700 " +
                    bgEstado(pedido.estado) +
                    ""
                  }
                >
                  {pedido.estado}
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

                    {actValidarPedido(user.rol) && (
                      <Tooltip side="bottom" align="center" className="mr-2">
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => {
                              setOpenCotizacion(true);
                              setCotizacion_id(pedido.cotizacion_id);
                              setPedidoView(pedido);
                            }}
                            className="rounded p-1 transition-colors hover:bg-orange-100"
                          >
                            <Badge className="h-5 w-5 cursor-pointer text-orange-600 hover:text-orange-800" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Validar Pedido</p>
                        </TooltipContent>
                      </Tooltip>
                    )}

                    {/* <Tooltip side="bottom" align="center" className="mr-2">
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => {
                            setOpen(true);
                            setPedidoView(pedido);
                          }}
                          className="rounded p-1 transition-colors hover:bg-green-100"
                        >
                          <BadgeCheck className="h-5 w-5 cursor-pointer text-green-600 hover:text-green-800" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Pedido Validado</p>
                      </TooltipContent>
                    </Tooltip> */}

                    {actPlasmarPedido(user.rol) && (
                      <Tooltip side="bottom" align="center" className="mr-2">
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => {
                              plasmarPedido(pedido);
                            }}
                            className="rounded p-1 transition-colors hover:bg-yellow-100"
                          >
                            <FileInput className="h-5 w-5 cursor-pointer text-yellow-600 hover:text-yellow-700" />
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
