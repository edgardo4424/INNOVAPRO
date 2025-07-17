import React from "react";

const DatosGuiaEnvioPublicoForm = () => {
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6 text-blue-800 border-b pb-2">
                Datos de la Guía de Envío
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 mb-8">
                <div>
                    <label
                        htmlFor="guia_Envio_Cod_Traslado"
                        className="block text-sm font-semibold text-gray-700 text-left mb-1"
                    >
                        Código de Traslado
                    </label>
                    <input
                        type="text"
                        id="guia_Envio_Cod_Traslado"
                        name="guia_Envio_Cod_Traslado"
                        // value={formData.guia_Envio_Cod_Traslado}
                        // onChange={handleChange}
                        className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                </div>
                <div>
                    <label
                        htmlFor="guia_Envio_Des_Traslado"
                        className="block text-sm font-semibold text-gray-700 text-left mb-1"
                    >
                        Descripción Traslado
                    </label>
                    <input
                        type="text"
                        id="guia_Envio_Des_Traslado"
                        name="guia_Envio_Des_Traslado"
                        // value={formData.guia_Envio_Des_Traslado}
                        // onChange={handleChange}
                        className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                </div>
                <div>
                    <label
                        htmlFor="guia_Envio_Mod_Traslado"
                        className="block text-sm font-semibold text-gray-700 text-left mb-1"
                    >
                        Modalidad de Traslado
                    </label>
                    <input
                        type="text"
                        id="guia_Envio_Mod_Traslado"
                        name="guia_Envio_Mod_Traslado"
                        // value={formData.guia_Envio_Mod_Traslado}
                        // onChange={handleChange}
                        className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                </div>
                <div>
                    <label
                        htmlFor="guia_Envio_Peso_Total"
                        className="block text-sm font-semibold text-gray-700 text-left mb-1"
                    >
                        Peso Total
                    </label>
                    <input
                        type="number"
                        id="guia_Envio_Peso_Total"
                        name="guia_Envio_Peso_Total"
                        // value={formData.guia_Envio_Peso_Total}
                        // onChange={handleChange}
                        className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        step="0.01"
                    />
                </div>
                <div>
                    <label
                        htmlFor="guia_Envio_Und_Peso_Total"
                        className="block text-sm font-semibold text-gray-700 text-left mb-1"
                    >
                        Unidad de Peso
                    </label>
                    <input
                        type="text"
                        id="guia_Envio_Und_Peso_Total"
                        name="guia_Envio_Und_Peso_Total"
                        // value={formData.guia_Envio_Und_Peso_Total}
                        // onChange={handleChange}
                        className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                </div>
                <div>
                    <label
                        htmlFor="guia_Envio_Fec_Traslado"
                        className="block text-sm font-semibold text-gray-700 text-left mb-1"
                    >
                        Fecha de Traslado
                    </label>
                    <input
                        type="datetime-local"
                        id="guia_Envio_Fec_Traslado"
                        name="guia_Envio_Fec_Traslado"
                        // value={formData.guia_Envio_Fec_Traslado}
                        // onChange={handleChange}
                        className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                </div>
                <div>
                    <label
                        htmlFor="guia_Envio_Partida_Ubigeo"
                        className="block text-sm font-semibold text-gray-700 text-left mb-1"
                    >
                        Ubigeo de Partida
                    </label>
                    <input
                        type="text"
                        id="guia_Envio_Partida_Ubigeo"
                        name="guia_Envio_Partida_Ubigeo"
                        // value={formData.guia_Envio_Partida_Ubigeo}
                        // onChange={handleChange}
                        className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                </div>
                <div className="col-span-1 md:col-span-2 lg:col-span-3">
                    {" "}
                    {/* Made address span full width on small screens too */}
                    <label
                        htmlFor="guia_Envio_Partida_Direccion"
                        className="block text-sm font-semibold text-gray-700 text-left mb-1"
                    >
                        Dirección de Partida
                    </label>
                    <input
                        type="text"
                        id="guia_Envio_Partida_Direccion"
                        name="guia_Envio_Partida_Direccion"
                        // value={formData.guia_Envio_Partida_Direccion}
                        // onChange={handleChange}
                        className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                </div>
                <div>
                    <label
                        htmlFor="guia_Envio_Llegada_Ubigeo"
                        className="block text-sm font-semibold text-gray-700 text-left mb-1"
                    >
                        Ubigeo de Llegada
                    </label>
                    <input
                        type="text"
                        id="guia_Envio_Llegada_Ubigeo"
                        name="guia_Envio_Llegada_Ubigeo"
                        // value={formData.guia_Envio_Llegada_Ubigeo}
                        // onChange={handleChange}
                        className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                </div>
                <div className="col-span-1 md:col-span-2 lg:col-span-3">
                    {" "}
                    {/* Made address span full width on small screens too */}
                    <label
                        htmlFor="guia_Envio_Llegada_Direccion"
                        className="block text-sm font-semibold text-gray-700 text-left mb-1"
                    >
                        Dirección de Llegada
                    </label>
                    <input
                        type="text"
                        id="guia_Envio_Llegada_Direccion"
                        name="guia_Envio_Llegada_Direccion"
                        // value={formData.guia_Envio_Llegada_Direccion}
                        // onChange={handleChange}
                        className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                </div>
            </div>
        </div>
    );
};

export default DatosGuiaEnvioPublicoForm;
