import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EyeIcon, FileInput } from "lucide-react";
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

const TablaConfirmado = ({ listaPedidos, setOpen, setPedidoView }) => {
  const navigate = useNavigate();

  const plasmarPedido = async (doc) => {
    const guiaIncial = {
      tipo_Doc: "09",
      serie: "T005",
      correlativo: "",
      observacion: doc.observacion,
      // ?Datos del comprobante de referencia
      obra: doc.obra,
      nro_contrato: doc.nro_contrato,
      estado_Documento: "0",
      empresa_Ruc: doc.empresa_Ruc,

      cliente_Tipo_Doc: doc.cliente_Tipo_Doc,
      cliente_Num_Doc: doc.cliente_Num_Doc,
      cliente_Razon_Social: "",
      cliente_Direccion: "",

      guia_Envio_Peso_Total: Number(doc.guia_Envio_Peso_Total),
      guia_Envio_Und_Peso_Total: doc.guia_Envio_Und_Peso_Total,

      guia_Envio_Partida_Ubigeo: "",
      guia_Envio_Partida_Direccion: "",
      guia_Envio_Llegada_Ubigeo: "",
      guia_Envio_Llegada_Direccion: "",

      guia_Envio_Vehiculo_Placa: "",
      nroCirculacion: "",

      detalle: doc.detalle,

      chofer: [],
    };

    const valoresTraslado = {
      guia_Envio_Cod_Traslado: doc.guia_Envio_Cod_Traslado,
    };

    const tipoGuia =
      doc.tranporte === "CLIENTE" ? "transporte-publico" : "transporte-privado";

    const body = {
      guia: guiaIncial,
      codigo_traslado: valoresTraslado,
      tipoGuia,
    };

    const documento = [body, { id_pedido: doc.id_pedido }];

    console.log(guiaIncial);

    navigate("/facturacion/emitir/guia", { state: documento });
  };

  return (
    <div className="w-full rounded-xl border-1 border-gray-200">
      <table className="min-w-full overflow-hidden rounded-xl bg-white shadow-md">
        <thead className="bg-innova-blue text-white">
          <tr>
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
              Nro. Pedido
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
              Filial
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
              Cliente
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
              Obra
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
              Fecha Entrega
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
                key={pedido.id_pedido}
                className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} border-b border-gray-200`}
              >
                <td className="py-3 pl-2 text-xs text-gray-700">
                  {pedido.nro_Pedido}
                </td>
                <td className="py-3 pl-2 text-xs text-gray-700">
                  {pedido.filial}
                </td>
                <td className="py-3 pl-2 text-xs text-gray-700">
                  {pedido.cliente_Razon_Social}
                </td>
                <td className="py-3 pl-2 text-xs text-gray-700">
                  {pedido.obra}
                </td>
                <td className="py-3 pl-2 text-xs text-gray-700">
                  {pedido.f_Entrega}
                </td>
                <td
                  className={
                    "py-3 pl-2 text-xs text-gray-700 " +
                    bgEstado(pedido.estado) +
                    ""
                  }
                >
                  {pedido.estado}
                </td>
                <td className="py-3 pl-2 text-xs text-gray-700">
                  <div className="flex justify-center gap-x-2">
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
