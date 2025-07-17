import React from "react";

const EstadoYOtrosDatosForm = () => {
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6 text-blue-800 border-b pb-2">
                Estado y Otros Datos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 mb-8">
                <div>
                    <label
                        htmlFor="estado_Documento"
                        className="block text-sm font-medium text-gray-700 text-left mb-1"
                    >
                        Estado del Documento
                    </label>
                    <input
                        type="text"
                        id="estado_Documento"
                        name="estado_Documento"
                        // value={formData.estado_Documento}
                        // onChange={handleChange}
                        className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                </div>
                <div className="flex items-center pt-2 md:pt-5">
                    {" "}
                    {/* Adjusted padding for better alignment on mobile */}
                    <input
                        type="checkbox"
                        id="manual"
                        name="manual"
                        // checked={formData.manual}
                        // onChange={handleChange}
                        className="h-4 w-4  focus:ring-blue-500 text-gray-800 border-gray-400 rounded"
                    />
                    <label
                        htmlFor="manual"
                        className="ml-2 block text-sm font-medium text-gray-700"
                    >
                        Manual
                    </label>
                </div>
                <div>
                    <label
                        htmlFor="id_Base_Dato"
                        className="block text-sm font-medium text-gray-700 text-left mb-1"
                    >
                        ID Base de Datos
                    </label>
                    <input
                        type="text"
                        id="id_Base_Dato"
                        name="id_Base_Dato"
                        // value={formData.id_Base_Dato}
                        // onChange={handleChange}
                        className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                </div>
            </div>
        </div>
    );
};

export default EstadoYOtrosDatosForm;
