import React from "react";

const DatosDeEmpresaForm = () => {
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6 text-blue-800 border-b pb-2">
                Datos de la Empresa
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 mb-8">
                <div>
                    <label
                        htmlFor="empresa_Ruc"
                        className="block text-sm font-semibold text-gray-700 text-left mb-1"
                    >
                        RUC Empresa
                    </label>
                    <input
                        type="text"
                        id="empresa_Ruc"
                        name="empresa_Ruc"
                        // value={formData.empresa_Ruc}
                        // onChange={handleChange}
                        className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                </div>
            </div>
        </div>
    );
};

export default DatosDeEmpresaForm;
