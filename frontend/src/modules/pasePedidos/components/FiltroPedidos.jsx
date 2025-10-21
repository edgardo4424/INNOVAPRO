import {
  Building2,
  Calendar,
  CheckCircle,
  Filter,
  RotateCcw,
  Search,
} from "lucide-react";
import { usePedidos } from "../context/PedidosContenxt";

const FiltroPedidos = () => {
  const { filiales, handleFilterChange, handleReset } = usePedidos();

  // Función dummy para manejar la búsqueda/aplicación
  const handleSearch = () => {
    console.log("Búsqueda aplicada");
    // Aquí iría la lógica para aplicar todos los filtros de estado
    // handleApplyFilters();
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 duration-300">
      {/* Grid de Filtros: Adaptable para desktop y apilado en móvil */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-4">
        {/* 1. CAMPO DE BÚSQUEDA GENERAL
        <div className="flex flex-col lg:col-span-2">
          <label
            htmlFor="search-text"
            className="mb-1 text-xs font-medium text-gray-500"
          >
            Buscar (Pedido / OT):
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              id="search-text"
              placeholder="Ej: OT-12345 o Columna A"
              className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pr-4 pl-10 text-sm text-gray-700 transition duration-150 ease-in-out placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              // onChange={(e) => handleFilterChange('searchText', e.target.value)}
            />
          </div>
        </div> */}

        {/* 2. FILIAL */}
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
              // onChange={(e) => handleFilterChange('filial', e.target.value)}
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

        {/* 3. ESTADO */}
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
              className="w-full appearance-none rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 text-sm text-gray-700 transition duration-150 ease-in-out focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              // onChange={(e) => handleFilterChange('estado', e.target.value)}
            >
              <option value="">Todos</option>
              <option value="Confirmado">Confirmado</option>
              <option value="Pre Confirmado">Pre Confirmado</option>
              <option value="Por Confirmar">Por Confirmar</option>
            </select>
          </div>
        </div>

        {/* 4. FECHA */}
        <div className="flex flex-col">
          <label
            htmlFor="fecha-input"
            className="mb-1 text-xs font-medium text-gray-500"
          >
            Fecha de Despacho:
          </label>
          <div className="relative">
            <Calendar className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <input
              type="date"
              id="fecha-input"
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 text-sm text-gray-700 transition duration-150 ease-in-out focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              // onChange={(e) => handleFilterChange('fecha', e.target.value)}
            />
          </div>
        </div>

        {/* BOTONES DE ACCIÓN (Ocupan la última columna en desktop) */}
        <div className="flex items-end gap-3 pt-2 lg:pt-0">
          <button
            onClick={handleSearch}
            className="bg-innova-blue flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-blue-700 hover:shadow-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Search className="mr-1 h-4 w-4" />
            Buscar
          </button>

          <button
            onClick={handleReset}
            className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-md transition-all duration-200 hover:bg-gray-100 hover:text-red-500 focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FiltroPedidos;
