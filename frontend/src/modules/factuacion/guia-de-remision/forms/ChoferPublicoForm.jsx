import React, { useState } from "react";

const ChoferPublicoForm = () => {
    const [formData, setFormData] = useState({
        chofer: [
            {
                tipo_doc: "",
                nro_doc: "",
                nombres: "",
                nro_mtc: "",
            },
        ],
    });

    const handleChoferChange = (e, index) => {
        const { name, value } = e.target;
        const newChofer = [...formData.chofer];
        newChofer[index][name] = value;
        setFormData({ chofer: newChofer });
    };

    const addChofer = () => {
        setFormData({
            chofer: [
                ...formData.chofer,
                {
                    tipo_doc: "",
                    nro_doc: "",
                    nombres: "",
                    nro_mtc: "",
                },
            ],
        });
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6 text-blue-800 border-b pb-2">
                Datos del Transportista
            </h2>
            {formData.chofer.map((chofer, index) => (
                <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-6 mb-6 p-6 border border-gray-200 rounded-md"
                >
                    <div>
                        <label
                            htmlFor={`chofer-${index}-tipo_doc`}
                            className="block text-sm font-medium text-gray-700 text-left mb-1"
                        >
                            Tipo Documento
                        </label>
                        <input
                            type="text"
                            id={`chofer-${index}-tipo_doc`}
                            name="tipo_doc"
                            value={chofer.tipo_doc}
                            onChange={(e) => handleChoferChange(e, index)}
                            className="px-3 py-2 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor={`chofer-${index}-nro_doc`}
                            className="block text-sm font-medium text-gray-700 text-left mb-1"
                        >
                            Número Documento
                        </label>
                        <input
                            type="text"
                            id={`chofer-${index}-nro_doc`}
                            name="nro_doc"
                            value={chofer.nro_doc}
                            onChange={(e) => handleChoferChange(e, index)}
                            className="px-3 py-2 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                    </div>
                    <div className="col-span-1 md:col-span-2 lg:col-span-1">
                        <label
                            htmlFor={`chofer-${index}-nombres`}
                            className="block text-sm font-medium text-gray-700 text-left mb-1"
                        >
                            Razón Social / Nombres
                        </label>
                        <input
                            type="text"
                            id={`chofer-${index}-nombres`}
                            name="nombres"
                            value={chofer.nombres}
                            onChange={(e) => handleChoferChange(e, index)}
                            className="px-3 py-2 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor={`chofer-${index}-nro_mtc`}
                            className="block text-sm font-medium text-gray-700 text-left mb-1"
                        >
                            Número MTC
                        </label>
                        <input
                            type="text"
                            id={`chofer-${index}-nro_mtc`}
                            name="nro_mtc"
                            value={chofer.nro_mtc}
                            onChange={(e) => handleChoferChange(e, index)}
                            className="px-3 py-2 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                    </div>
                </div>
            ))}
            <div className="flex justify-start mb-8">
                <button
                    type="button"
                    onClick={addChofer}
                    className="px-5 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 w-full sm:w-auto text-left"
                >
                    {" "}
                    {/* Full width on mobile, left-aligned text */}
                    Agregar Transportista
                </button>
            </div>
        </div>
    );
};

export default ChoferPublicoForm;
