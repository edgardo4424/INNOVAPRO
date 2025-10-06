import { useBandeja } from "@/modules/facturacion/context/BandejaContext";
import { BrushCleaning } from "lucide-react";
import React from "react";
import { toast } from "react-toastify";

const FiltroReporte = ({
  filtro,
  setFiltro,
  handleAplicarFiltros,
  handleLimpiarFiltros,
}) => {
  const { filiales } = useBandeja();

  const toggleCheckbox = (key) => {
    setFiltro({
      ...filtro,
      [key]: !filtro[key],
    });
  };

  return (
    <div className="mb-4 flex flex-col rounded-lg border bg-white px-4 py-3 shadow-sm">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {/* Documento Cliente */}
        <div className="flex flex-col">
          <label
            htmlFor="search"
            className="mb-1 text-xs font-semibold text-gray-600"
          >
            Documento
          </label>
          <input
            type="text"
            id="search"
            placeholder="Ej. 12345678901"
            value={filtro.cliente_num_doc}
            onChange={(e) =>
              setFiltro({ ...filtro, cliente_num_doc: e.target.value })
            }
            className="rounded-md border border-gray-300 p-2 text-xs focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Razon Social */}
        <div className="flex flex-col">
          <label
            htmlFor="razonSocial"
            className="mb-1 text-xs font-semibold text-gray-600"
          >
            Razón Social
          </label>
          <input
            type="text"
            id="razonSocial"
            placeholder="Ej. Encofrados Innova"
            value={filtro.cliente_razon_social}
            onChange={(e) =>
              setFiltro({ ...filtro, cliente_razon_social: e.target.value })
            }
            className="rounded-md border border-gray-300 p-2 text-xs focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Filial */}
        <div className="flex flex-col">
          <label
            htmlFor="filial"
            className="mb-1 text-xs font-semibold text-gray-600"
          >
            Filial
          </label>
          <select
            id="filial"
            value={filtro.empresa_ruc}
            onChange={(e) =>
              setFiltro({ ...filtro, empresa_ruc: e.target.value })
            }
            className="rounded-md border border-gray-300 bg-white p-2 text-xs focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Todas</option>
            {filiales.map((fil) => (
              <option key={fil.ruc} value={fil.ruc}>
                {fil.razon_social}
              </option>
            ))}
          </select>
        </div>

        {/* Fecha Desde */}
        <div className="flex flex-col">
          <label className="mb-1 text-xs font-semibold text-gray-600">
            Fecha Desde
          </label>
          <input
            type="date"
            value={filtro.fec_des ? filtro.fec_des.split("T")[0] : ""}
            onChange={(e) => {
              const fecha = e.target.value;
              if (
                filtro.fec_ast &&
                new Date(fecha) > new Date(filtro.fec_ast)
              ) {
                toast.error("La fecha desde debe ser menor a la fecha hasta");
              } else {
                // Siempre asignar 05:00 am
                setFiltro({ ...filtro, fec_des: `${fecha}T05:00:00` });
              }
            }}
            className="rounded-md border border-gray-300 p-2 text-xs focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Fecha Hasta */}
        <div className="flex flex-col">
          <label className="mb-1 text-xs font-semibold text-gray-600">
            Fecha Hasta
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
                toast.warn(
                  "La fecha hasta debe ser mayor o igual a la fecha desde",
                );
              } else {
                // Siempre asignar 23:50
                setFiltro({
                  ...filtro,
                  fec_ast: `${fecha ? `${fecha}T23:50:00` : ""}`,
                });
              }
            }}
            className="rounded-md border border-gray-300 p-2 text-xs focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Botones */}
        <div className="mt-auto flex gap-2">
          <button
            className="bg-innova-blue flex-1 rounded-md px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:scale-105"
            onClick={handleAplicarFiltros}
          >
            Aplicar
          </button>
          <button
            className="border-innova-blue text-innova-blue hover:bg-innova-blue flex-1 rounded-md border-2 px-3 py-2 text-xs font-bold shadow-sm transition hover:text-white"
            onClick={handleLimpiarFiltros}
          >
            <BrushCleaning className="inline-block h-3 w-3" /> Limpiar
          </button>
        </div>
      </div>

      {/* Tipos de documento */}
      <div className="mt-3 flex flex-wrap gap-3 text-xs">
        {[
          { key: "ac_factura", label: "Factura" },
          { key: "ac_boleta", label: "Boleta" },
          { key: "ac_n_credito", label: "Nota Crédito" },
          { key: "ac_n_debito", label: "Nota Débito" },
          { key: "ac_guia", label: "Guía" },
        ].map((doc) => (
          <label key={doc.key} className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={filtro[doc.key]}
              onChange={() => toggleCheckbox(doc.key)}
              className="h-3 w-3"
            />
            {doc.label}
          </label>
        ))}
      </div>
    </div>
  );
};

export default FiltroReporte;
