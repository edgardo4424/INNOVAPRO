import { getTipoDocCliente } from "@/modules/facturacion/utils/formateos";
import { SquarePen, UserX } from "lucide-react";

const TablaChoferes = ({
  choferes,
  setOpenEliminar,
  setChoferEliminar,
  setOpen,
  setForm,
  loading,
}) => {
  return (
    <div className="w-full rounded-xl border-1 border-gray-200">
      <table className="min-w-full overflow-hidden rounded-xl bg-white shadow-md">
        <thead className="bg-innova-blue text-white">
          <tr>
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
              Vehiculo
            </th>
            <th className="px-3 py-3 text-center text-xs font-semibold tracking-wider uppercase">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {choferes.length > 0 ? (
            choferes.map((chofer, index) => (
              <tr key={index} className="transition-all hover:bg-gray-50">
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
                  {getTipoDocCliente(chofer?.tipo_doc) || "N/A"} -{" "}
                  {chofer?.nro_doc || "N/A"}
                </td>
                <td className="px-3 py-2 text-sm whitespace-nowrap text-gray-500">
                  {chofer?.vehiculo?.nro_placa || "N/A"}
                </td>
                <td className="flex justify-center gap-x-3 px-3 py-2 text-sm text-gray-500">
                  <button
                    onClick={() => {
                      const { vehiculo, ...rest } = chofer;
                      setOpen(true);
                      setForm({ ...rest, id_vehiculo: vehiculo?.id || null });
                    }}
                    className="text-innova-blue cursor-pointer transition-all hover:text-blue-500"
                  >
                    <SquarePen className="size-6" />
                  </button>
                  <button
                    onClick={() => {
                      setOpenEliminar(true);
                      setChoferEliminar(chofer);
                    }}
                    className="text-innova-blue cursor-pointer transition-all hover:text-red-500"
                  >
                    <UserX className="size-6" />
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
                {loading ? "Cargando..." : "No se encontraron choferes"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablaChoferes;
