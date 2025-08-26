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
import { choferInicialPrivado } from "../utils/valoresIncialGuia";
import { Search, Trash, UserRoundPlus } from "lucide-react";
import factilizaService from "../../../service/FactilizaService";
import { toast } from "react-toastify";

const ChoferPrivadoForm = () => {
    const { guiaDatosPrivado, setGuiaDatosPrivado } = useGuiaTransporte();

    // Función unificada para manejar cambios en inputs y selects
    const handleChange = (value, name, index) => {
        setGuiaDatosPrivado(prev => ({
            ...prev,
            chofer: prev.chofer.map((chofer, i) =>
                i === index ? { ...chofer, [name]: value } : chofer
            ),
        }));
    };

    // Función para agregar un nuevo chofer
    const addChofer = () => {
        setGuiaDatosPrivado(prev => ({
            ...prev,
            chofer: [
                ...prev.chofer,
                choferInicialPrivado
            ],
        }));
    };

    // Función para eliminar un chofer
    const removeChofer = (index) => {
        setGuiaDatosPrivado(prev => ({
            ...prev,
            chofer: prev.chofer.filter((_, i) => i !== index),
        }));
    };

    // Función para buscar información del chofer
    const handleBuscar = async (e, index) => {
        e.preventDefault();

        const chofer = guiaDatosPrivado.chofer[index];

        if (!chofer.nro_doc) {
            toast.error("Por favor, ingresa el número de documento del chofer.");
            return;
        }

        try {
            const { data: data_inf, status: status_inf, success: suscces_inf } = await factilizaService.obtenerPersonaPorDni(chofer.nro_doc);

            const { data: data_lic, status: status_lic, success: suscces_lic } = await factilizaService.obtenerLicenciaPorDni(chofer.nro_doc);

            if (status_inf == 200 && status_lic == 200) {
                toast.success('Chofer Encontrado')
                // ?? Asegúrate de que los nombres de las propiedades coincidan con la respuesta de tu API
                const nombres = data_inf.nombres || '';
                const apellidos = `${data_inf.apellido_paterno || ''} ${data_inf.apellido_materno || ''}`.trim();
                const licencia = data_lic.licencia?.numero || '';

                setGuiaDatosPrivado((prev) => ({
                    ...prev,
                    chofer: prev.chofer.map((c, i) => {
                        if (i === index) {
                            return {
                                ...c,
                                nombres,
                                apellidos,
                                licencia
                            };
                        }
                        return c;
                    })
                }));
            } else {
                toast.error(data?.message || "No se encontró información para el documento ingresado.");
            }
        } catch (error) {
            console.error("Error al buscar:", error);
            toast.error("Hubo un problema al conectar con el servicio de búsqueda.");
        }
    };

    return (
        <div className="mb-8">
            <h2 className="text-2xl  font-semibold mb-6 text-blue-800 border-b pb-2">
                Datos del Chofer
            </h2>
            {guiaDatosPrivado.chofer.map((chofer, index) => (
                <div
                    key={index}
                    className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 mb-6 p-6 border border-gray-400  rounded-md"
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

                    {/* Campo Tipo de Chofer */}
                    <div>
                        <Label
                            htmlFor={`chofer-${index}-tipo`}
                            className="block text-sm font-semibold text-gray-700 text-left mb-1"
                        >
                            Tipo
                        </Label>
                        <Select
                            name="tipo"
                            value={chofer.tipo}
                            onValueChange={(value) => handleChange(value, "tipo", index)}
                        >
                            <SelectTrigger className="w-full border border-gray-300 rounded-md shadow-sm">
                                <SelectValue placeholder="Selecciona un tipo de chofer" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Principal">PRINCIPAL</SelectItem>
                                <SelectItem value="Secundario">SECUNDARIO</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Campo Tipo de Documento */}
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
                                <SelectItem value="1">DNI - Documento Nacional de Identidad</SelectItem>
                                {/* Puedes añadir más tipos de documento aquí */}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Campo Número de Documento y Botón de Búsqueda */}
                    <div>
                        <Label
                            htmlFor={`chofer-${index}-nro_doc`}
                            className="block text-sm font-semibold text-gray-700 text-left mb-1"
                        >
                            Número Documento
                        </Label>
                        <div className="flex gap-2">
                            <Input
                                type="text" // Cambiado a text para flexibilidad, puedes restringir con 'number' si solo son dígitos
                                id={`chofer-${index}-nro_doc`}
                                name="nro_doc"
                                value={chofer.nro_doc}
                                onChange={(e) => handleChange(e.target.value, e.target.name, index)}
                                className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
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

                    {/* Campo Licencia */}
                    <div>
                        <Label
                            htmlFor={`chofer-${index}-licencia`}
                            className="block text-sm font-semibold text-gray-700 text-left mb-1"
                        >
                            Licencia
                        </Label>
                        <Input
                            type="text"
                            id={`chofer-${index}-licencia`}
                            name="licencia"
                            value={chofer.licencia}
                            onChange={(e) => handleChange(e.target.value, e.target.name, index)}
                            className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                    </div>

                    {/* Campo Nombres */}
                    <div>
                        <Label
                            htmlFor={`chofer-${index}-nombres`}
                            className="block text-sm font-semibold text-gray-700 text-left mb-1"
                        >
                            Nombres
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

                    {/* Campo Apellidos */}
                    <div>
                        <Label
                            htmlFor={`chofer-${index}-apellidos`}
                            className="block text-sm font-semibold text-gray-700 text-left mb-1"
                        >
                            Apellidos
                        </Label>
                        <Input
                            type="text"
                            id={`chofer-${index}-apellidos`}
                            name="apellidos"
                            value={chofer.apellidos}
                            onChange={(e) => handleChange(e.target.value, e.target.name, index)}
                            className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                    </div>
                </div>
            ))}
            <div className="">
                <button
                    type="button"
                    onClick={addChofer}
                    className="px-5 flex justify-center items-center gap-x-2 py-2 cursor-pointer bg-green-600 text-white font-medium rounded-md hover:bg-green-700 w-full md:w-auto"
                >
                    <UserRoundPlus className="size-6 md:size-7" />
                    <span className="w-full text-center">
                        Agregar Chofer</span>
                </button>
            </div>
        </div>
    );
};

export default ChoferPrivadoForm;