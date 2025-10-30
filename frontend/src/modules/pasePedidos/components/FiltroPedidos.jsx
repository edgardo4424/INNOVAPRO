import { useAuth } from "@/context/AuthContext";
import { Building2, CheckCircle, UserCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { usePedidos } from "../context/PedidosContenxt";
import coleccionEstadosPedidos from "../utils/coleccionEstadosPedidos";

const FiltroPedidos = ({ filtroPedidos, setFiltroPedidos, filiales }) => {
  const [estados, setEstados] = useState([]);
  const { user } = useAuth();
  const { listaComerciales } = usePedidos(); // ✅ obtener la lista de comerciales
  const { estado, filial, fecha_incio, fecha_final, comercial } = filtroPedidos;

  const handleFiltroChange = (name, value) => {
    setFiltroPedidos((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (!user) return;
    const result = coleccionEstadosPedidos(user.rol);
    setEstados(result);
  }, [user]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 duration-300">
      {/* Grid adaptable */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-4">
        {/* 1. FILIAL */}
        <div className="flex flex-col">
          <label
            htmlFor="filial-select"
            className="mb-1 text-xs font-medium text-gray-500"
          >
            Filial:
          </label>
          <div className="relative">
            <Building2 className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <select
              id="filial-select"
              className="w-full appearance-none rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 text-sm text-gray-700 transition duration-150 ease-in-out focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              value={filial}
              onChange={(e) => handleFiltroChange("filial", e.target.value)}
            >
              <option value="">Todas las Filiales</option>
              {filiales.map((filial) => (
                <option key={filial.id} value={filial.ruc}>
                  {filial.razon_social}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 2. ESTADO */}
        <div className="flex flex-col">
          <label
            htmlFor="estado-select"
            className="mb-1 text-xs font-medium text-gray-500"
          >
            Estado:
          </label>
          <div className="relative">
            <CheckCircle className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <select
              id="estado-select"
              className="w-full cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 text-sm text-gray-700 transition duration-150 ease-in-out focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              value={estado}
              onChange={(e) => handleFiltroChange("estado", e.target.value)}
            >
              {estados.map((d) => (
                <option key={d.id} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 3. COMERCIAL (solo visible para CEO) */}
        {user?.rol === "CEO" && (
          <div className="flex flex-col">
            <label
              htmlFor="comercial-select"
              className="mb-1 text-xs font-medium text-gray-500"
            >
              Comercial:
            </label>
            <div className="relative">
              <UserCircle2 className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <select
                id="comercial-select"
                className="w-full cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 text-sm text-gray-700 transition duration-150 ease-in-out focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                value={comercial}
                onChange={(e) => handleFiltroChange("comercial", e.target.value)}
              >
                <option value="">Todos los comerciales</option>
                {listaComerciales.map((com, i) => (
                  <option key={i} value={com}>
                    {com}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FiltroPedidos;
