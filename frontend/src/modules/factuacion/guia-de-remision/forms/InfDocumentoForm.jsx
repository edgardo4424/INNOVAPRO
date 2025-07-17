import React from "react";

const InfDocumentoForm = () => {
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6 text-blue-800 border-b pb-2">
                Información del Documento
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 mb-8">
                {" "}
                {/* Added gap-y for vertical spacing on small screens */}
                <div>
                    <label
                        htmlFor="tipo_Doc"
                        className="block text-sm text-gray-700 text-left mb-1 font-semibold"
                    >
                        Tipo de Documento
                    </label>
                    <input
                        type="text"
                        id="tipo_Doc"
                        name="tipo_Doc"
                        // value={formData.tipo_Doc}
                        // onChange={handleChange}
                        className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />{" "}
                    {/* Removed sm:text-sm as it's redundant here */}
                </div>
                <div>
                    <label
                        htmlFor="serie"
                        className="block text-sm text-gray-700 text-left mb-1 font-semibold"
                    >
                        Serie
                    </label>
                    <input
                        type="text"
                        id="serie"
                        name="serie"
                        // value={formData.serie}
                        // onChange={handleChange}
                        className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                </div>
                <div>
                    <label
                        htmlFor="correlativo"
                        className="block text-sm text-gray-700 text-left mb-1 font-semibold"
                    >
                        Correlativo
                    </label>
                    <input
                        type="text"
                        id="correlativo"
                        name="correlativo"
                        // value={formData.correlativo}
                        // onChange={handleChange}
                        className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                </div>
                <div className="col-span-1 md:col-span-2 lg:col-span-3">
                    {" "}
                    {/* Made observation span full width on small screens too */}
                    <label
                        htmlFor="observacion"
                        className="block text-sm text-gray-700 text-left mb-1 font-semibold"
                    >
                        Observación
                    </label>
                    <textarea
                        id="observacion"
                        name="observacion"
                        // value={formData.observacion}
                        // onChange={handleChange}
                        rows="3"
                        className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    ></textarea>
                </div>
                <div>
                    <label
                        htmlFor="fecha_Emision"
                        className="block text-sm text-gray-700 text-left mb-1 font-semibold"
                    >
                        Fecha de Emisión
                    </label>
                    <input
                        type="datetime-local"
                        id="fecha_Emision"
                        name="fecha_Emision"
                        // value={formData.fecha_Emision}
                        // onChange={handleChange}
                        className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                </div>
            </div>
        </div>
    );
};

export default InfDocumentoForm;
