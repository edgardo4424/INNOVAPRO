import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useGuiaTransporte } from "@/context/Factura/GuiaTransporteContext";

import { choferInicialPublico } from "../utils/valoresIncialGuia";
import { Search, Trash } from "lucide-react";
import facturaService from "../../service/FacturaService";
import { toast } from "react-toastify";

const ChoferPublicoForm = () => {
    const { guiaTransporte, setGuiaTransporte } = useGuiaTransporte();

    const handleChange = (value, name, index) => {
        setGuiaTransporte(prev => ({
            ...prev,
            chofer: prev.chofer.map((chofer, i) =>
                i === index ? { ...chofer, [name]: value } : chofer
            ),
        }));
    };

    const addChofer = () => {
        setGuiaTransporte(prev => ({
            ...prev,
            chofer: [
                ...prev.chofer,
                choferInicialPublico
            ],
        }));
    };


    // Función para eliminar un chofer
    const removeChofer = (index) => {
        setGuiaTransporte(prev => ({
            ...prev,
            chofer: prev.chofer.filter((_, i) => i !== index),
        }));
    };

    const handleBuscar = async (e, index) => {
        e.preventDefault();

        const chofer = guiaTransporte.chofer[index];

        if (chofer.nro_doc.length !== 11) {
            toast.error("El número de documento del chofer debe tener 11 dígitos.");
            return;
        }

        try {
            const promise = facturaService.obtenerMtc(chofer.nro_doc);
            toast.promise(
                promise,
                {
                    pending: "Buscando información del transportista",
                    success: "Información encontrada",
                    error: "Ocurrió un error al buscar la información del transportista",
                }
            );
            const { mensaje, estado, data, status } = await promise;

            if (data.status == 200 && estado) {
                const nombres = data.razon_social || '';
                const nro_mtc = data.codigo_mtc || '';

                setGuiaTransporte((prev) => ({
                    ...prev,
                    chofer: prev.chofer.map((c, i) => {
                        if (i === index) {
                            return {
                                ...c,
                                nombres,
                                nro_mtc
                            };
                        }
                        return c;
                    })
                }));
            } else {
                // toast.error(mensaje || "No se encontró información del transportista.");
            }
        } catch (error) {
            // console.error("Error al buscar:", error);
            // toast.error("Hubo un problema al conectar con el servicio de búsqueda.");
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6 text-blue-800 border-b pb-2">
                Datos del Transportista
            </h2>
            {guiaTransporte.chofer.map((chofer, index) => (
                <div
                    key={index}
                    className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-y-4 gap-x-6 mb-6 p-6 border border-gray-400 shadow-lg rounded-md"
                >

                    {/* Botón para eliminar chofer (visible si hay más de uno) */}
                    {index > 0 && (
                        <div className="flex items-center justify-center absolute top-2 right-2">
                            <button
                                type="button"
                                className="text-red-500 hover:text-red-600 scale-105 transition-all duration-300 cursor-pointer"
                                onClick={() => removeChofer(index)}
                            >
                                <Trash />
                            </button>
                        </div>
                    )}
                    <div>
                        <Label
                            htmlFor={`chofer-${index}-tipo_doc`}
                            className="block text-sm font-semibold text-gray-700 text-left mb-1"
                        >
                            Tipo Documento
                        </Label>
                        <Select
                            name="tipo_doc"
                            value={chofer.tipo_doc}
                            onValueChange={(value) => handleChange(value, "tipo_doc", index)}
                        >
                            <SelectTrigger className="w-full border border-gray-300 rounded-md shadow-sm">
                                <SelectValue placeholder="Selecciona un tipo de Documento" />
                            </SelectTrigger>
                            <SelectContent>
                                {/* <SelectItem value="1">DNI - Documento Nacional de Identidad</SelectItem> */}
                                <SelectItem value="6">RUC</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label
                            htmlFor={`chofer-${index}-nro_doc`}
                            className="block text-sm font-semibold text-gray-700 text-left mb-1"
                        >
                            Nro. Documento
                        </Label>
                        <div className="flex gap-x-1">
                            <Input
                                type="text"
                                id={`chofer-${index}-nro_doc`}
                                name="nro_doc"
                                value={chofer.nro_doc}
                                onChange={(e) => handleChange(e.target.value.slice(0, 11), e.target.name, index)}
                                className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                maxLength={11}
                            />
                            <button
                                type="button" // Importante: usa type="button" para evitar que el botón envíe el formulario
                                onClick={(e) => handleBuscar(e, index)}
                                className="p-2 bg-blue-500 rounded-md text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 cursor-pointer"
                            >
                                <Search className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                    <div className="col-span-1 md:col-span-2 lg:col-span-2">
                        <Label
                            htmlFor={`chofer-${index}-nombres`}
                            className="block text-sm font-semibold text-gray-700 text-left mb-1"
                        >
                            Razón Social / Nombres
                        </Label>
                        <Input
                            type="text"
                            id={`chofer-${index}-nombres`}
                            name="nombres"
                            value={chofer.nombres}
                            onChange={(e) => handleChange(e.target.value, e.target.name, index)}
                            className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                    </div>
                    <div>
                        <Label
                            htmlFor={`chofer-${index}-nro_mtc`}
                            className="block text-sm font-semibold text-gray-700 text-left mb-1"
                        >
                            Número MTC
                        </Label>
                        <Input
                            type="text"
                            id={`chofer-${index}-nro_mtc`}
                            name="nro_mtc"
                            value={chofer.nro_mtc}
                            onChange={(e) => handleChange(e.target.value, e.target.name, index)}
                            className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                    </div>
                </div>
            ))}
            <div className="flex justify-start mb-8">
                <button
                    type="button"
                    onClick={addChofer}
                    className="px-5 py-2 cursor-pointer bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 w-full sm:w-auto text-left"
                >
                    Agregar Transportista
                </button>
            </div>
        </div>
    );
};

export default ChoferPublicoForm;
