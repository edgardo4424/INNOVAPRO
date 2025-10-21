import React from "react";

const TablaItems = ({ items = [] }) => {
  return (
    // Contenedor principal sin scroll
    <div className="w-full border-1 border-gray-200  bg-white">
      {/* La tabla se convierte en un contenedor de flexbox para el encabezado y el cuerpo */}
      <table className="min-w-full">
        {/* Encabezado Fijo */}
        <thead className="bg-innova-blue text-white sticky top-0 z-10">
          <tr>
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
              Item
            </th>
            <th className="w-full px-3 py-3 text-center text-xs font-semibold tracking-wider uppercase">
              Descripción
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
              Cantidad
            </th>
          </tr>
        </thead>
      </table>
      

      <div className="max-h-50 overflow-y-scroll">
        <table className="min-w-full">

          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  {item.cod_Producto}
                </td>
                <td className="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  {item.descripcion}
                </td>
                <td className="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  {item.cantidad}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaItems;