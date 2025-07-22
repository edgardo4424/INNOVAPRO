import React, { useState } from "react";

const DetalleProductoForm = () => {
    const [detalle, setDetalle] = useState([{ unidad: "", cantidad: 0, cod_Producto: "", descripcion: "" }]);

    const handleDetalleChange = (e, index) => {
        const newDetalle = [...detalle];
        newDetalle[index][e.target.name] = e.target.value;
        setDetalle(newDetalle);
    };

    const addDetalle = () => {
        setDetalle([
            ...detalle,
            { unidad: "", cantidad: 0, cod_Producto: "", descripcion: "" },
        ]);
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6 text-blue-800 border-b pb-2">
                Detalle de Productos
            </h2>
            {detalle.map((item, index) => (
                <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-6 mb-6 p-6 border border-gray-200 rounded-md"
                >
                    <div>
                        <label
                            htmlFor={`detalle-${index}-unidad`}
                            className="block text-sm font-medium text-gray-700 text-left mb-1"
                        >
                            Unidad
                        </label>
                        <input
                            type="text"
                            id={`detalle-${index}-unidad`}
                            name="unidad"
                            value={item.unidad}
                            onChange={(e) => handleDetalleChange(e, index)}
                            className="px-3 py-2 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor={`detalle-${index}-cantidad`}
                            className="block text-sm font-medium text-gray-700 text-left mb-1"
                        >
                            Cantidad
                        </label>
                        <input
                            type="number"
                            id={`detalle-${index}-cantidad`}
                            name="cantidad"
                            value={item.cantidad}
                            onChange={(e) => handleDetalleChange(e, index)}
                            className="px-3 py-2 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                            step="0.01"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor={`detalle-${index}-cod_Producto`}
                            className="block text-sm font-medium text-gray-700 text-left mb-1"
                        >
                            Código de Producto
                        </label>
                        <input
                            type="text"
                            id={`detalle-${index}-cod_Producto`}
                            name="cod_Producto"
                            value={item.cod_Producto}
                            onChange={(e) => handleDetalleChange(e, index)}
                            className="px-3 py-2 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                    </div>
                    <div className="col-span-1 md:col-span-2 lg:col-span-1">
                        <label
                            htmlFor={`detalle-${index}-descripcion`}
                            className="block text-sm font-medium text-gray-700 text-left mb-1"
                        >
                            Descripción
                        </label>
                        <input
                            type="text"
                            id={`detalle-${index}-descripcion`}
                            name="descripcion"
                            value={item.descripcion}
                            onChange={(e) => handleDetalleChange(e, index)}
                            className="px-3 py-2 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                    </div>
                </div>
            ))}
            <div className="flex justify-start mb-8">
                <button
                    type="button"
                    onClick={addDetalle}
                    className="px-5 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 w-full sm:w-auto text-left"
                >
                    {" "}
                    {/* Full width on mobile, left-aligned text */}
                    Agregar Producto
                </button>
            </div>
        </div>
    );
};

export default DetalleProductoForm;

