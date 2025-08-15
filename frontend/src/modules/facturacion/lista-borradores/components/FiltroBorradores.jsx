import React from 'react'
import { toast } from 'react-toastify';

const FiltroBorradores = ({ filtro, setFiltro, documentTypes, handleAplicarFiltros }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 mb-8 p-6 bg-white rounded-xl shadow-md items-end border-2">
            <div className="flex flex-col">
                <label
                    htmlFor="search"
                    className="mb-2 font-semibold text-gray-600 text-sm"
                >
                    Buscar por ID/Cliente:
                </label>
                <input
                    type="text"
                    id="search"
                    placeholder="Ej. F001-0001 o Juan Pérez"
                    value={filtro.cliente_num_doc}
                    onChange={(e) =>
                        setFiltro({ ...filtro, cliente_num_doc: e.target.value })
                    }
                    className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
            </div>

            <div className="flex flex-col">
                <label
                    htmlFor="docType"
                    className="mb-2 font-semibold text-gray-600 text-sm"
                >
                    Tipo de Documento:
                </label>
                <select
                    id="docType"
                    value={filtro.tip_doc}
                    onChange={(e) => setFiltro({ ...filtro, tip_doc: e.target.value })}
                    className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none bg-white bg-no-repeat bg-[right_0.75rem_center] bg-[length:16px_12px] bg-[url('data:image/svg+xml,%3Csvg_xmlns=%27http://www.w3.org/2000/svg%27_viewBox=%270_0_16_16%27%3E%3Cpath_fill=%27none%27_stroke=%27%23343a40%27_stroke-linecap=%27round%27_stroke-linejoin=%27round%27_stroke-width=%272%27_d=%27M2_5l6_6_6-6%27/%3E%3C/svg%3E')]"
                >
                    {documentTypes.map((type) => (
                        <option key={type.name} value={type.value}>
                            {type.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col">
                <label className="mb-2 font-semibold text-gray-600 text-sm">
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
                    className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
            </div>

            <div className="flex flex-col">
                <label className="mb-2 font-semibold text-gray-600 text-sm">
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
                    className="p-3 border border-gray-300 rounded-lg focus:ring-blue-[#1b274a] focus:border-blue-500 text-sm"
                />
            </div>

            <div className="flex flex-col">
                <label
                    htmlFor="docType"
                    className="mb-2 font-semibold text-gray-600 text-sm"
                >
                    Items por Página:
                </label>
                <select
                    id="docType"
                    value={filtro.limit}
                    onChange={(e) => setFiltro({ ...filtro, limit: e.target.value })}
                    className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none bg-white bg-no-repeat bg-[right_0.75rem_center] bg-[length:16px_12px] bg-[url('data:image/svg+xml,%3Csvg_xmlns=%27http://www.w3.org/2000/svg%27_viewBox=%270_0_16_16%27%3E%3Cpath_fill=%27none%27_stroke=%27%23343a40%27_stroke-linecap=%27round%27_stroke-linejoin=%27round%27_stroke-width=%272%27_d=%27M2_5l6_6_6-6%27/%3E%3C/svg%3E')]"
                >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="">FULL</option>
                </select>
            </div>

            {/* Botón para "Aplicar Filtros" (en una app real, esto activaría el filtrado) */}
            <button
                className="col-span-1 sm:col-span-2 md:col-span-1 lg:col-span-1 mt-auto px-6 py-3 bg-innova-blue cursor-pointer text-white font-bold rounded-lg shadow-md hover:scale-102 transition duration-300"
                onClick={handleAplicarFiltros}
            >
                Aplicar Filtros
            </button>
        </div>
    )
}

export default FiltroBorradores
