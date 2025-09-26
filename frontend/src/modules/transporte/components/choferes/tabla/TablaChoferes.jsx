import { SquarePen } from "lucide-react";

const TablaChoferes = ({ vehiculos: choferes }) => {
  return (
    <div className="w-full rounded-xl border-1 border-gray-200">
      <table className="min-w-full overflow-hidden rounded-xl bg-white shadow-md">
        <thead className="bg-innova-blue text-white">
          <tr>
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
              #
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
              Nombres
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
              Apellidos
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
              Nro. Licencia
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
              Nro. Documento
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {choferes.length > 0 ? (
            choferes.map((chofer, index) => (
              <tr key={index}>
                <td className="px-3 py-2 text-sm whitespace-nowrap text-gray-500">
                  {index + 1}
                </td>
                <td className="px-3 py-2 text-sm whitespace-nowrap text-gray-500">
                  {chofer?.nombres || "N/A"}
                </td>
                <td className="px-3 py-2 text-sm whitespace-nowrap text-gray-500">
                  {chofer?.apellidos || "N/A"}
                </td>
                <td className="px-3 py-2 text-sm whitespace-nowrap text-gray-500">
                  {chofer?.nro_licencia || "N/A"}
                </td>
                <td className="px-3 py-2 text-sm whitespace-nowrap text-gray-500">
                  {chofer?.nro_documento || "N/A"} - {chofer?.tipo_documento || "N/A"}
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
                No se encontraron choferes
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablaChoferes;
