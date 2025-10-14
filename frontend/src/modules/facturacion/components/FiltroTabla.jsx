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
    <div className="relative mb-6 grid grid-cols-1 gap-5 rounded-xl border-2 bg-white px-6 py-3 shadow-md sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
      <div className="flex flex-col">
        <label
          htmlFor="search"
          className="mb-2 text-sm font-semibold text-gray-600"
        >
          Buscar Doc/Cliente:
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
          className="appearance-none rounded-lg border border-gray-300 bg-white bg-no-repeat p-3 text-sm focus:border-blue-500 focus:ring-blue-500"
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
          className="appearance-none rounded-lg border border-gray-300 bg-white bg-[length:16px_12px] bg-[right_0.75rem_center] bg-no-repeat p-3 text-sm focus:border-blue-500 focus:ring-blue-500"
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
          value={filtro.fec_des ? filtro.fec_des.split("T")[0] : ""}
          onChange={(e) => {
            const fecha = e.target.value;
            if (filtro.fec_ast && new Date(fecha) > new Date(filtro.fec_ast)) {
              toast.error("La fecha desde debe ser menor a la fecha hasta");
            } else {
              setFiltro({ ...filtro, fec_des: `${fecha}T05:00:00` });
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
          value={filtro.fec_ast ? filtro.fec_ast.split("T")[0] : ""}
          onChange={(e) => {
            const fecha = e.target.value;
            if (
              filtro.fec_des &&
              new Date(fecha) < new Date(filtro.fec_des) &&
              new Date(fecha) == new Date()
            ) {
              toast.error("La fecha hasta debe ser mayor a la fecha desde");
            } else {
              setFiltro({
                ...filtro,
                fec_ast: `${fecha ? `${fecha}T23:50:00` : ""}`,
              });
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
          className="appearance-none rounded-lg border border-gray-300 bg-white bg-[length:16px_12px] bg-[right_0.75rem_center] bg-no-repeat p-3 text-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="">FULL</option>
        </select>
      </div>

      {/* Contenedor para los botones de acción */}
      <div className="mt-auto flex flex-col gap-2 sm:flex-row xl:flex-col">
        <button
          className="bg-innova-blue 2xl:px-auto cursor-pointer rounded-lg px-4 py-3 text-sm font-bold text-white shadow-md transition duration-300 hover:scale-102"
          onClick={handleAplicarFiltros}
        >
          Aplicar Filtros
        </button>
        <button
          className="text-innova-blue border-innova-blue hover:bg-innova-blue 2xl:px-auto flex cursor-pointer items-center justify-center gap-1 rounded-lg border-2 px-4 py-2 text-sm font-bold shadow-md transition duration-300 hover:text-white"
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
