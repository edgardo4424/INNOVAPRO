import { SquarePen } from "lucide-react";

const TablaVehiculos = ({ vehiculos }) => {
  return (
    <div className="w-full rounded-xl border-1 border-gray-200">
      <table className="min-w-full overflow-hidden rounded-xl bg-white shadow-md">
        <thead className="bg-innova-blue text-white">
          <tr>
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
              #
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
              Número de Placa
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
              Marca
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
              Modelo
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
              Color
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
              Capacidad
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
              Año
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
              Certificado vehicular
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
              Transportista
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {vehiculos.length > 0 ? (
            vehiculos.map((vehiculo, index) => (
              <tr key={index}>
                <td className="px-3 py-2 text-sm whitespace-nowrap text-gray-500">
                  {index + 1}
                </td>
                <td className="px-3 py-2 text-sm whitespace-nowrap text-gray-500">
                  {vehiculo?.nro_placa || "N/A"}
                </td>
                <td className="px-3 py-2 text-sm whitespace-nowrap text-gray-500">
                  {vehiculo?.marca || "N/A"}
                </td>
                <td className="px-3 py-2 text-sm whitespace-nowrap text-gray-500">
                  {vehiculo?.modelo || "N/A"}
                </td>
                <td className="px-3 py-2 text-sm whitespace-nowrap text-gray-500">
                  {vehiculo?.color || "N/A"}
                </td>
                <td className="px-3 py-2 text-sm whitespace-nowrap text-gray-500">
                  {vehiculo?.capacidad || "N/A"} - {vehiculo?.unidad || "N/A"}
                </td>
                <td className="px-3 py-2 text-sm whitespace-nowrap text-gray-500">
                  {vehiculo?.anio || "N/A"}
                </td>
                <td className="px-3 py-2 text-sm whitespace-nowrap text-gray-500">
                  {vehiculo?.certificado_vehicular || "N/A"}
                </td>
                <td className="px-3 py-2 text-sm whitespace-nowrap text-gray-500">
                  {vehiculo?.transportista.razon_social || "-"}
                </td>
                <td className="px-3 py-2 text-sm flex  justify-center text-gray-500">
                  <button className="text-innova-blue hover:text-innova-blue-hover cursor-pointer">
                    <SquarePen  className="size-6"/>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="px-3 py-2 text-sm whitespace-nowrap text-gray-500">
                No se encontraron vehiculos
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablaVehiculos;
