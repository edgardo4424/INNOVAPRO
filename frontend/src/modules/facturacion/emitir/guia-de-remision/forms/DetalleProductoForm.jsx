import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/Label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useGuiaTransporte } from "@/modules/facturacion/context/GuiaTransporteContext";
import React from "react";
import { Package, Trash } from "lucide-react"; // Importamos el icono de bote de basura
import { Textarea } from "@/components/ui/textarea";

// Define el estado inicial para un nuevo detalle de producto
const detalleInicial = {
    unidad: "",
    cantidad: "",
    cod_Producto: "",
    descripcion: "",
};

const DetalleProductoForm = () => {
    // Obtenemos el estado de la guía de transporte y la función para actualizarlo
    const { guiaTransporte, setGuiaTransporte } = useGuiaTransporte();

    // Función unificada para manejar cambios en inputs y selects
    // Recibe el nuevo valor, el nombre del campo y el índice del detalle que se está modificando
    const handleChange = (value, name, index) => {
        setGuiaTransporte(prev => ({
            ...prev,
            // Mapeamos el array 'detalle' para crear uno nuevo
            detalle: prev.detalle.map((item, i) =>
                // Si el índice coincide, creamos un nuevo objeto para ese detalle con el valor actualizado
                i === index ? {
                    ...item,
                    [name]: name === "cantidad" ? parseFloat(value) : value
                } : item
            ),
        }));
    };

    // Función para agregar un nuevo detalle de producto al array
    const addDetalle = () => {
        setGuiaTransporte(prev => ({
            ...prev,
            // Añadimos un nuevo objeto 'detalleInicial' al final del array 'detalle'
            detalle: [
                ...prev.detalle,
                detalleInicial
            ],
        }));
    };

    // Función para eliminar un detalle de producto del array por su índice
    const removeDetalle = (index) => {
        setGuiaTransporte(prev => ({
            ...prev,
            // Filtramos el array 'detalle' para excluir el elemento en el índice dado
            detalle: prev.detalle.filter((_, i) => i !== index),
        }));
    };

    // Define las opciones para el select de Unidad
    const unitOptions = [
        { value: "KGM", label: "KGM - Kilogramo" },
        { value: "TNE", label: "TNE - Tonelada" },
        { value: "GRM", label: "GRM - Gramo" },
        { value: "LBR", label: "LBR - Libra" },
        { value: "ONZ", label: "ONZ - Onza" },
    ];

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6 text-blue-800 border-b pb-2">
                Detalle de Productos
            </h2>
            {/* Mapeamos sobre el array 'detalle' para renderizar un formulario por cada producto */}
            {guiaTransporte.detalle.map((item, index) => (
                <div
                    key={index}
                    className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-6 mb-6 p-6 border border-gray-400 rounded-md"
                >
                    {/* Botón para eliminar un detalle de producto (visible si hay más de uno) */}
                    {index > 0 && (
                        <div className="flex items-center justify-center absolute top-2 right-2">
                            <button
                                type="button"
                                className="text-red-500 hover:text-red-600 scale-105 transition-all duration-300 cursor-pointer"
                                onClick={() => removeDetalle(index)}
                            >
                                <Trash />
                            </button>
                        </div>
                    )}

                    {/* Campo Unidad (ahora un Select) */}
                    <div className="md:col-span-2">
                        <Label
                            htmlFor={`detalle-${index}-unidad`}
                            className="block text-sm font-semibold text-gray-700 text-left mb-1"
                        >
                            Unidad
                        </Label>
                        <Select
                            name="unidad"
                            value={item.unidad}
                            onValueChange={(value) => handleChange(value, "unidad", index)}
                        >
                            <SelectTrigger className="w-full border border-gray-300 rounded-md shadow-sm">
                                <SelectValue placeholder="Selecciona una unidad" />
                            </SelectTrigger>
                            <SelectContent>
                                {unitOptions.map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Campo Cantidad */}
                    <div>
                        <Label
                            htmlFor={`detalle-${index}-cantidad`}
                            className="block text-sm font-semibold text-gray-700 text-left mb-1"
                        >
                            Cantidad
                        </Label>
                        <Input
                            type="number"
                            id={`detalle-${index}-cantidad`}
                            name="cantidad"
                            value={item.cantidad}
                            onChange={(e) => handleChange(e.target.value, e.target.name, index)}
                            className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                            step="0.01"
                        />
                    </div>

                    {/* Campo Código de Producto */}
                    <div>
                        <Label
                            htmlFor={`detalle-${index}-cod_Producto`}
                            className="block text-sm font-semibold text-gray-700 text-left mb-1"
                        >
                            Código de Producto
                        </Label>
                        <Input
                            type="text"
                            id={`detalle-${index}-cod_Producto`}
                            name="cod_Producto"
                            value={item.cod_Producto}
                            onChange={(e) => handleChange(e.target.value.toUpperCase(), e.target.name, index)}
                            className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                    </div>

                    {/* Campo Descripción */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-4">
                        <Label
                            htmlFor={`detalle-${index}-descripcion`}
                            className="block text-sm font-semibold text-gray-700 text-left mb-1"
                        >
                            Descripción
                        </Label>
                        <Textarea
                            id="descripcion"
                            name="descripcion"
                            value={item.descripcion.toUpperCase()}
                            onChange={(e) => handleChange(e.target.value.toUpperCase(), e.target.name, index)}
                            rows="2"
                            className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        ></Textarea>
                    </div>
                </div>
            ))}
            <div className="flex justify-start mb-8">
                <button
                    type="button"
                    onClick={addDetalle}
                    className="px-5 flex justify-center items-center gap-x-2 py-2 cursor-pointer bg-green-600 text-white font-medium rounded-md hover:bg-green-700 w-full md:w-auto"
                >
                    <Package className="size-6 md:size-7" />
                    <span className="w-full text-center">
                        Agregar Producto
                    </span>
                </button>
            </div>
        </div>
    );
};

export default DetalleProductoForm;
