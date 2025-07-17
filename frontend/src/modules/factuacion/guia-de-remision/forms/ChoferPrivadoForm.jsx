import React, { useState } from "react";

const ChoferPrivadoForm = () => {
    const [formData, setFormData] = useState({
        chofer: [
            {
                tipo_doc: "",
                nro_doc: "",
                nombres: "",
                apellidos: "",
                licencia: "",
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
                    apellidos: "",
                    licencia: "",
                    nro_mtc: "",
                },
            ],
        });
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6 text-blue-800 border-b pb-2">
                Datos del Chofer
            </h2>
            {formData.chofer.map((chofer, index) => (
                <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 mb-6 p-6 border border-gray-200 rounded-md"
                >
                    <div>
                        <label
                            htmlFor={`chofer-${index}-tipo`}
                            className="block text-sm font-medium text-gray-700 text-left mb-1"
                        >
                            Tipo
                        </label>
                        <input
                            type="text"
                            id={`chofer-${index}-tipo`}
                            name="tipo"
                            value={chofer.tipo}
                            onChange={(e) => handleChoferChange(e, index)}
                            className="px-3 py-2 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
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
                    <div>
                        <label
                            htmlFor={`chofer-${index}-licencia`}
                            className="block text-sm font-medium text-gray-700 text-left mb-1"
                        >
                            Licencia
                        </label>
                        <input
                            type="text"
                            id={`chofer-${index}-licencia`}
                            name="licencia"
                            value={chofer.licencia}
                            onChange={(e) => handleChoferChange(e, index)}
                            className="px-3 py-2 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor={`chofer-${index}-nombres`}
                            className="block text-sm font-medium text-gray-700 text-left mb-1"
                        >
                            Nombres
                        </label>
                        <input
                            type="text"
                            id={`chofer-${index}-nombres`}
                            name="nombres"
                            value={chofer.nombres}
                            onChange={(e) => handleChoferChange(e, index)}
                            className="px-3 py-2 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor={`chofer-${index}-apellidos`}
                            className="block text-sm font-medium text-gray-700 text-left mb-1"
                        >
                            Apellidos
                        </label>
                        <input
                            type="text"
                            id={`chofer-${index}-apellidos`}
                            name="apellidos"
                            value={chofer.apellidos}
                            onChange={(e) => handleChoferChange(e, index)}
                            className="px-3 py-2 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                    Agregar Transportista
                </button>
            </div>
        </div>
    );
};

export default ChoferPrivadoForm;

