import { ThumbsDown, ThumbsUp } from "lucide-react";

const TablaPiezasVerificarStock = ({ piezasRecibidas }) => {
  const bgBotonEstado = (estado) => {
    switch (estado) {
      case true:
        return "bg-green-500 !text-white";
      case false:
        return "bg-red-500 !text-white";
      default:
        return "bg-blue-500 !text-white";
    }
  };

  return (
    <div className="w-full rounded-lg border border-slate-300 bg-slate-50">
      {/* Contenedor principal para el scroll horizontal en móviles */}
      <div className="overflow-x-auto">
        <div className="scroll-hide max-h-80 overflow-y-auto">

          <table className="min-w-full divide-y divide-slate-300">
            {/* Encabezado fijo */}
            <thead className="sticky top-0 z-10 bg-innova-blue text-white">
              <tr>
                {/* Código: Siempre visible, ancho flexible */}
                <th className="p-2 text-left text-xs font-semibold tracking-wider uppercase whitespace-nowrap">
                  Código
                </th>
                {/* Descripción: Esencial, pero puede requerir más espacio */}
                <th className="p-2 text-left text-xs font-semibold tracking-wider uppercase whitespace-nowrap">
                  Descripción
                </th>
                {/* Cantidad Requerida: Se mantiene */}
                <th className="p-2 text-center text-xs font-semibold tracking-wider uppercase whitespace-nowrap">
                  Cant. Req.
                </th>
                {/* Stock: Se mantiene */}
                <th className="p-2 text-center text-xs font-semibold tracking-wider uppercase whitespace-nowrap">
                  Stock
                </th>
                {/* Estado: Esencial, ancho fijo y pequeño */}
                <th className="p-2 text-center text-xs font-semibold tracking-wider uppercase whitespace-nowrap w-1/12">
                  Estado
                </th>
              </tr>
            </thead>

            {/* Cuerpo scrollable */}
            <tbody className="divide-y divide-slate-200 bg-white">
              {piezasRecibidas?.map((item, index) => (
                <tr
                  key={index}
                  className={`transition-colors ${
                    item?.estado
                      ? "hover:bg-slate-100"
                      : "bg-red-100 hover:bg-red-200"
                  }`}
                >
                  {/* Código */}
                  <td className="px-2 py-2 text-xs font-medium text-slate-800 whitespace-nowrap">
                    {item?.item || "—"}
                  </td>
                  {/* Descripción: Usamos 'text-left' en el cuerpo, aunque el encabezado sea 'text-left', es mejor ser explícito. */}
                  <td className="px-2 py-2 text-left text-xs text-slate-700">
                    {item?.descripcion}
                  </td>
                  {/* Cantidad Requerida */}
                  <td className="px-2 py-2 text-center text-xs text-slate-700 whitespace-nowrap">
                    {item?.cantidad}
                  </td>
                  {/* Stock */}
                  <td className="px-2 py-2 text-center text-xs text-slate-700 whitespace-nowrap">
                    {item?.pieza_stock_actual}
                  </td>
                  {/* Estado */}
                  <td className="px-2 py-2 text-center text-xs w-1/12 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center justify-center rounded-full p-1 text-xs font-semibold ${bgBotonEstado(
                        item?.estado,
                      )}`}
                    >
                      {/* Reducimos el tamaño del icono en pantallas pequeñas (opcional) */}
                      {item?.estado ? <ThumbsUp size={16} /> : <ThumbsDown size={16} />} 
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TablaPiezasVerificarStock;