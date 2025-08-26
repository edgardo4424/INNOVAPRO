import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useGuiaTransporte } from "@/modules/facturacion/context/GuiaTransporteContext";

import { Search, Trash } from "lucide-react";
import { toast } from "react-toastify";
import facturaService from "../../../service/FacturaService";

const TransportistaPublicoForm = () => {
    const { guiaDatosPublico, setGuiaDatosPublico } = useGuiaTransporte();



    const handleBuscar = async (e, index) => {
        e.preventDefault();

        const transportista = guiaDatosPublico.transportista[index];

        if (transportista.nro_doc.length !== 11) {
            toast.error("El número de documento del chofer debe tener 11 dígitos.");
            return;
        }

        try {
            const promise = facturaService.obtenerMtc(transportista.nro_doc);
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

                setGuiaDatosPublico((prev) => ({
                    ...prev,
                    transportista: prev.transportista.map((c, i) => {
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
            <div
                className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-y-4 gap-x-6 mb-6 p-6 border border-gray-400  rounded-md"
            >

                <div>
                    <Label
                        htmlFor={`transportePublico-tipo_doc`}
                        className="block text-sm font-semibold text-gray-700 text-left mb-1"
                    >
                        Tipo Documento
                    </Label>
                    <Select
                        name="tipo_doc"
                        value={guiaDatosPublico.transportista.tipo_doc}
                        // onValueChange={(value) => handleChange(value, "tipo_doc", index)}
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
                        htmlFor={`chofer-nro_doc`}
                        className="block text-sm font-semibold text-gray-700 text-left mb-1"
                    >
                        Nro. Documento
                    </Label>
                    <div className="flex gap-x-1">
                        <Input
                            type="text"
                            id={`chofer-nro_doc`}
                            name="nro_doc"
                            value={guiaDatosPublico.transportista.nro_doc}
                            // onChange={(e) => handleChange(e.target.value.slice(0, 11), e.target.name, index)}
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
                        htmlFor={`chofer-nombres`}
                        className="block text-sm font-semibold text-gray-700 text-left mb-1"
                    >
                        Razón Social
                    </Label>
                    <Input
                        type="text"
                        id={`chofer-nombres`}
                        name="nombres"
                        value={guiaDatosPublico.transportista.razon_Social}
                        // onChange={(e) => handleChange(e.target.value, e.target.name, index)}
                        className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                </div>
                <div>
                    <Label
                        htmlFor={`chofer-nro_mtc`}
                        className="block text-sm font-semibold text-gray-700 text-left mb-1"
                    >
                        Número MTC
                    </Label>
                    <Input
                        type="text"
                        id={`chofer-nro_mtc`}
                        name="nro_mtc"
                        value={guiaDatosPublico.transportista.nro_mtc}
                        // onChange={(e) => handleChange(e.target.value, e.target.name, index)}
                        className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                </div>
            </div>
        </div>
    );
};

export default TransportistaPublicoForm;
