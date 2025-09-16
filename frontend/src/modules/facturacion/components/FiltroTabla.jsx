import { BrushCleaning } from "lucide-react";
import React from "react";
import { toast } from "react-toastify";
import { useBandeja } from "../context/BandejaContext";

const FiltroTabla = ({
  filtro,
  setFiltro,
  documentTypes,
  handleAplicarFiltros,
  handleLimpiarFiltros,
}) => {
  const { filiales } = useBandeja();

  return (
    <div className="relative mb-8 grid grid-cols-1 gap-5 rounded-xl border-2 bg-white p-6 shadow-md sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
      <div className="flex flex-col">
        <label
          htmlFor="search"
          className="mb-2 text-sm font-semibold text-gray-600"
        >
          Buscar por Doc/Cliente:
        </label>
        <input
          type="text"
          id="search"
          placeholder="Ej. 12345678901"
          value={filtro.cliente_num_doc}
          onChange={(e) =>
            setFiltro({ ...filtro, cliente_num_doc: e.target.value })
          }
          className="rounded-lg border border-gray-300 p-3 text-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col">
        <label
          htmlFor="docType"
          className="mb-2 text-sm font-semibold text-gray-600"
        >
          Tipo de Documento:
        </label>
        <select
          id="docType"
          value={filtro.tip_doc}
          onChange={(e) => setFiltro({ ...filtro, tip_doc: e.target.value })}
          className="appearance-none rounded-lg border border-gray-300 bg-white bg-[url('data:image/svg+xml,%3Csvg_xmlns=%27http://www.w3.org/2000/svg%27_viewBox=%270_0_16_16%27%3E%3Cpath_fill=%27none%27_stroke=%27%23343a40%27_stroke-linecap=%27round%27_stroke-linejoin=%27round%27_stroke-width=%272%27_d=%27M2_5l6_6_6-6%27/%3E%3C/svg%3E')] bg-[length:16px_12px] bg-[right_0.75rem_center] bg-no-repeat p-3 text-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {documentTypes.map((type) => (
            <option key={type.name} value={type.value}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label
          htmlFor="filial"
          className="mb-2 text-sm font-semibold text-gray-600"
        >
          Filial:
        </label>
        <select
          id="filial"
          value={filtro.empresa_ruc}
          onChange={(e) =>
            setFiltro({ ...filtro, empresa_ruc: e.target.value })
          }
          className="appearance-none rounded-lg border border-gray-300 bg-white bg-[url('data:image/svg+xml,%3Csvg_xmlns=%27http://www.w3.org/2000/svg%27_viewBox=%270_0_16_16%27%3E%3Cpath_fill=%27none%27_stroke=%27%23343a40%27_stroke-linecap=%27round%27_stroke-linejoin=%27round%27_stroke-width=%272%27_d=%27M2_5l6_6_6-6%27/%3E%3C/svg%3E')] bg-[length:16px_12px] bg-[right_0.75rem_center] bg-no-repeat p-3 text-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Todas las filiales</option>
          {filiales.map((fil) => (
            <option key={fil.ruc} value={fil.ruc}>
              {fil.razon_social}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="mb-2 text-sm font-semibold text-gray-600">
          Fecha Desde:
        </label>
        <input
          type="date"
          value={filtro.fec_des}
          onChange={(e) => {
            const fecha = new Date(e.target.value);
            if (filtro.fec_ast && fecha > new Date(filtro.fec_ast)) {
              toast.error("La fecha desde debe ser menor a la fecha hasta");
            } else {
              setFiltro({ ...filtro, fec_des: e.target.value });
            }
          }}
          className="rounded-lg border border-gray-300 p-3 text-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-2 text-sm font-semibold text-gray-600">
          Fecha Hasta:
        </label>
        <input
          type="date"
          value={filtro.fec_ast}
          onChange={(e) => {
            const fecha = new Date(e.target.value);
            if (filtro.fec_des && fecha < new Date(filtro.fec_des)) {
              toast.error("La fecha hasta debe ser mayor a la fecha desde");
            } else {
              setFiltro({ ...filtro, fec_ast: e.target.value });
            }
          }}
          className="rounded-lg border border-gray-300 p-3 text-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col">
        <label
          htmlFor="docType"
          className="mb-2 text-sm font-semibold text-gray-600"
        >
          Items por Página:
        </label>
        <select
          id="docType"
          value={filtro.limit}
          onChange={(e) => setFiltro({ ...filtro, limit: e.target.value })}
          className="appearance-none rounded-lg border border-gray-300 bg-white bg-[url('data:image/svg+xml,%3Csvg_xmlns=%27http://www.w3.org/2000/svg%27_viewBox=%270_0_16_16%27%3E%3Cpath_fill=%27none%27_stroke=%27%23343a40%27_stroke-linecap=%27round%27_stroke-linejoin=%27round%27_stroke-width=%272%27_d=%27M2_5l6_6_6-6%27/%3E%3C/svg%3E')] bg-[length:16px_12px] bg-[right_0.75rem_center] bg-no-repeat p-3 text-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="">FULL</option>
        </select>
      </div>

      {/* Contenedor para los botones de acción */}
      <div className="mt-auto flex flex-col gap-2 sm:col-span-2 sm:flex-row lg:col-span-3 xl:col-span-5 2xl:col-span-6">
        <button
          className="bg-innova-blue cursor-pointer rounded-lg px-6 py-3 font-bold text-white shadow-md transition duration-300 hover:scale-102"
          onClick={handleAplicarFiltros}
        >
          Aplicar Filtros
        </button>
        <button
          className="text-innova-blue border-innova-blue hover:bg-innova-blue flex cursor-pointer items-center justify-center gap-1 rounded-lg border-2 px-6 py-3 text-sm font-bold shadow-md transition duration-300 hover:text-white"
          onClick={handleLimpiarFiltros}
        >
          <BrushCleaning className="inline-block" />
          Limpiar
        </button>
      </div>
    </div>
  );
};

export default FiltroTabla;
