import { SquarePen } from "lucide-react";

const TablaTransportistas = ({ transportistas }) => {
  console.log(transportistas);
  return (
    <div className="w-full rounded-xl border-1 border-gray-200">
      <table className="min-w-full overflow-hidden rounded-xl bg-white shadow-md">
        <thead className="bg-innova-blue text-white">
          <tr>
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
              #
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
              Nro. Documento
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
              Razon Social
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
              Mtc
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
              Vehiculos
            </th>
            <th className="px-3 py-3 text-center text-xs font-semibold tracking-wider uppercase">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {transportistas.length > 0 ? (
            transportistas.map((transporte, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="px-3 py-2 text-sm whitespace-nowrap text-gray-500">
                  {index + 1}
                </td>
                <td className="px-3 py-2 text-sm whitespace-nowrap text-gray-500">
                  {transporte?.nro_doc || "N/A"}
                </td>
                <td className="px-3 py-2 text-sm whitespace-nowrap text-gray-500">
                  {transporte?.razon_social || "N/A"}
                </td>
                <td className="px-3 py-2 text-sm whitespace-nowrap text-gray-500">
                  {transporte?.nro_mtc || "N/A"}
                </td>
                <td className="space-y-1 px-3 py-2 text-sm whitespace-nowrap text-gray-500">
                  {transporte?.vehiculos.length > 0 ? (
                    transporte.vehiculos.map((vehiculo, index) => {
                      return (
                        <span key={index} className={`block ${index > 0 && "border-t border-gray-500"}`}>
                          {vehiculo?.marca || "N/A"}{" "}
                          {vehiculo?.color ? `(${vehiculo?.color})` : "N/A"} -{" "}
                          {vehiculo?.nro_placa || "N/A"}
                        </span>
                      );
                    })
                  ) : (
                    <span> - </span>
                  )}
                </td>
                <td className="flex justify-center px-3 py-2 text-sm text-gray-500">
                  <button className="text-innova-blue hover:text-innova-blue-hover cursor-pointer">
                    <SquarePen className="size-6" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={6}
                className="px-3 py-2 text-center text-sm whitespace-nowrap text-gray-500"
              >
                No se encontraron transportistas
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablaTransportistas;
