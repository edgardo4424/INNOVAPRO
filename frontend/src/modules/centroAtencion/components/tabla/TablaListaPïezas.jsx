import React from "react";

const TablaListaPïezas = ({ piezasRecibidas = [] }) => {
  return (
    <div className="">
      <div className="max-h-[400px] overflow-x-auto overflow-y-auto rounded-lg scroll-hide">
        <table className="min-w-full border-collapse border border-gray-300 bg-white">
          <thead>
            <tr>
              <th className="bg-innova-blue border border-gray-300 px-4 py-2 text-xs text-white sticky top-0">
                Item
              </th>
              <th className="bg-innova-blue border border-gray-300 px-4 py-2 text-xs text-white sticky top-0">
                Descripción
              </th>
              <th className="bg-innova-blue border border-gray-300 px-4 py-2 text-xs text-white sticky top-0">
                Total
              </th>
              <th className="bg-innova-blue border border-gray-300 px-4 py-2 text-xs text-white sticky top-0">
                Peso U. (kg)
              </th>
              <th className="bg-innova-blue border border-gray-300 px-4 py-2 text-xs text-white sticky top-0">
                Peso Total (kg)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {piezasRecibidas.map((pieza) => (
              <tr key={pieza.pieza_id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 text-xs text-gray-800">
                  {pieza.item}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-xs text-gray-800">
                  {pieza.descripcion}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-xs text-gray-800">
                  {pieza.total}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-xs text-gray-800">
                  {pieza.peso_u_kg}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-xs text-gray-800">
                  {pieza.peso_kg}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mensaje de "No hay datos" (sin cambios) */}
      {piezasRecibidas.length === 0 && (
        <p className="mt-4 text-center text-gray-500">
          No hay piezas para mostrar.
        </p>
      )}
    </div>
  );
};

export default TablaListaPïezas;
