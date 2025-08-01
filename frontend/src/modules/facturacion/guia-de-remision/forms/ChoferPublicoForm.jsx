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
import { Trash } from "lucide-react";

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

    // const handleBuscar = async (e, index) => {
    //     e.preventDefault();

    //     const chofer = guiaTransporte.chofer[index];

    //     if (!chofer.nro_doc) {
    //         toast.error("Por favor, ingresa el número de documento del chofer.");
    //         return;
    //     }

    //     try {
    //         const promise = facturacionService.metodoOpcional(
    //             "licencia",
    //             chofer.nro_doc
    //         );

    //         toast.promise(
    //             promise,
    //             {
    //                 loading: "Buscando información del chofer...",
    //                 success: "Información del chofer encontrada exitosamente.",
    //                 error: "Ocurrió un error al buscar la información del chofer. Intenta de nuevo.",
    //             }
    //         );

    //         const { data, status, success } = await promise;

    //         if (status === 200 && success) {
    //             // Asegúrate de que los nombres de las propiedades coincidan con la respuesta de tu API
    //             const nombres = data.nombres || '';
    //             const apellidos = `${data.apellido_paterno || ''} ${data.apellido_materno || ''}`.trim();
    //             const licencia = data.licencia?.numero || data.lincencia?.numero || ''; // Ajuste para posible typo en 'lincencia'

    //             setGuiaTransporte((prev) => ({
    //                 ...prev,
    //                 chofer: prev.chofer.map((c, i) => {
    //                     if (i === index) {
    //                         return {
    //                             ...c,
    //                             nombres,
    //                             apellidos,
    //                             licencia
    //                         };
    //                     }
    //                     return c;
    //                 })
    //             }));
    //         } else {
    //             toast.error(data?.message || "No se encontró información para el documento ingresado.");
    //         }
    //     } catch (error) {
    //         console.error("Error al buscar:", error);
    //         toast.error("Hubo un problema al conectar con el servicio de búsqueda.");
    //     }
    // };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6 text-blue-800 border-b pb-2">
                Datos del Transportista
            </h2>
            {guiaTransporte.chofer.map((chofer, index) => (
                <div
                    key={index}
                    className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-6 mb-6 p-6 border border-gray-400 shadow-lg rounded-md"
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
                            Número Documento
                        </Label>
                        <Input
                            type="text"
                            id={`chofer-${index}-nro_doc`}
                            name="nro_doc"
                            value={chofer.nro_doc}
                            onChange={(e) => handleChange(e.target.value, e.target.name, index)}
                            className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                    </div>
                    <div className="col-span-1 md:col-span-2 lg:col-span-1">
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
