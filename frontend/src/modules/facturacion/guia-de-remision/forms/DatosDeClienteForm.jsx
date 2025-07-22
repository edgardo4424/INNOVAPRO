import React from "react";

const DatosDeClienteForm = () => {
    return (
        <div>
            {" "}
            <h2 className="text-2xl font-semibold mb-6 text-blue-800 border-b pb-2">
                Datos del Cliente
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 mb-8">
                <div>
                    <label
                        htmlFor="cliente_Tipo_Doc"
                        className="block text-sm font-semibold text-gray-700 text-left mb-1"
                    >
                        Tipo Documento Cliente
                    </label>
                    <input
                        type="text"
                        id="cliente_Tipo_Doc"
                        name="cliente_Tipo_Doc"
                        // value={formData.cliente_Tipo_Doc}
                        // onChange={handleChange}
                        className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                </div>
                <div>
                    <label
                        htmlFor="cliente_Num_Doc"
                        className="block text-sm font-semibold text-gray-700 text-left mb-1"
                    >
                        Número Documento Cliente
                    </label>
                    <input
                        type="text"
                        id="cliente_Num_Doc"
                        name="cliente_Num_Doc"
                        // value={formData.cliente_Num_Doc}
                        // onChange={handleChange}
                        className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                </div>
                <div className="col-span-1 md:col-span-2 lg:col-span-1">
                    <label
                        htmlFor="cliente_Razon_Social"
                        className="block text-sm font-semibold text-gray-700 text-left mb-1"
                    >
                        Razón Social Cliente
                    </label>
                    <input
                        type="text"
                        id="cliente_Razon_Social"
                        name="cliente_Razon_Social"
                        // value={formData.cliente_Razon_Social}
                        // onChange={handleChange}
                        className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                </div>
                <div className="col-span-1 md:col-span-2 lg:col-span-3">
                    <label
                        htmlFor="cliente_Direccion"
                        className="block text-sm font-semibold text-gray-700 text-left mb-1"
                    >
                        Dirección Cliente
                    </label>
                    <input
                        type="text"
                        id="cliente_Direccion"
                        name="cliente_Direccion"
                        // value={formData.cliente_Direccion}
                        // onChange={handleChange}
                        className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                </div>
            </div>
        </div>
    );
};

export default DatosDeClienteForm;
