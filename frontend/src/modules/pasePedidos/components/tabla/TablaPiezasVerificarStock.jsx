import React from "react";

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
      <div className="scroll-hide max-h-80 overflow-y-auto">
        <table className="min-w-full divide-y divide-slate-300">
          {/* Encabezado fijo */}
          <thead className="sticky top-0 z-10 bg-slate-200 text-slate-700">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold tracking-wider uppercase">
                Código
              </th>
              <th className="px-3 py-2 text-center text-xs font-semibold tracking-wider uppercase">
                Cantidad Requerida
              </th>

              <th className="px-3 py-2 text-center text-xs font-semibold tracking-wider uppercase">
                Stock
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold tracking-wider uppercase">
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
                <td className="px-3 py-2 text-sm font-medium text-slate-800">
                  {item?.cod_Producto || "—"}
                </td>
                <td className="px-3 py-2 text-center text-sm text-slate-700">
                  {item?.cantidad}
                </td>
                <td className="px-3 py-2 text-center text-sm text-slate-700">
                  {item?.pieza_stock_actual}
                </td>
                <td className="px-3 py-2 text-sm">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${bgBotonEstado(
                      item?.estado,
                    )}`}
                  >
                    {item?.text}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaPiezasVerificarStock;
