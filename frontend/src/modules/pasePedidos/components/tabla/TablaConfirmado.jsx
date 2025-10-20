import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EyeIcon, FileInput } from "lucide-react";

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
                        className="rounded p-1 transition-colors hover:bg-blue-100">
                          <EyeIcon className="h-5 w-5 cursor-pointer text-blue-600 hover:text-blue-800" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Ver Pedido</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip side="bottom" align="center" className="mr-2">
                      <TooltipTrigger asChild>
                        <button className="rounded p-1 transition-colors hover:bg-yellow-100">
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
