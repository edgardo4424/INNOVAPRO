import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useFacturaBoleta } from "@/context/Factura/FacturaBoletaContext";
import { Search } from "lucide-react";
import { toast } from "react-toastify";

const DatosDelCliente = () => {
    const { factura, setFactura, facturaValida, metodo } = useFacturaBoleta();
    const {
        cliente_Tipo_Doc,
        cliente_Num_Doc,
        cliente_Razon_Social,
        cliente_Direccion,
    } = factura;

    const handleBuscar = async (e) => {
        e.preventDefault();

        if (!cliente_Tipo_Doc) {
            toast.error("Debes seleccionar el tipo de documento del cliente.");
            return;
        }

        if (!cliente_Num_Doc?.trim()) {
            toast.error("Debes ingresar el número de documento del cliente.");
            return;
        }

        try {
            // Asumo que 'obtenerMiInformacion' es una función que busca datos del cliente.
            // Es importante que esta función actualice el estado 'factura' con la información obtenida.
            const response = await metodo.obtenerMiInformacion();
            // Ejemplo de cómo podrías actualizar el estado con los datos obtenidos:
            // setFactura(prev => ({
            //     ...prev,
            //     cliente_Razon_Social: response.razonSocial,
            //     cliente_Direccion: response.direccion,
            // }));
            // toast.success("Información del cliente encontrada.");
        } catch (error) {
            console.error("Error al buscar:", error);
            toast.error("Ocurrió un error al buscar la información del cliente.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFactura((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (value) => {
        setFactura((prev) => ({ ...prev, cliente_Tipo_Doc: value }));
    };

    return (
        <div className="overflow-y-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-2xl font-bold py-3 text-gray-800">
                Datos del Cliente
            </h1>
            <form
                className="w-full grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5 md:gap-x-6 md:gap-y-8"
                onSubmit={handleBuscar}
            >
                {/* Tipo de Documento */}
                <div className="flex flex-col gap-1 col-span-full sm:col-span-1">
                    <Label htmlFor="cliente_tipo_doc">Tipo de Documento</Label>
                    <Select value={cliente_Tipo_Doc} onValueChange={handleSelectChange}>
                        <SelectTrigger className="w-full border border-gray-300 rounded-md shadow-sm">
                            <SelectValue placeholder="Selecciona tipo de documento" />
                        </SelectTrigger>
                        <SelectContent>
                            {factura.tipo_Doc === "01" && (
                                <SelectItem value="6">RUC</SelectItem>
                            )}
                            {factura.tipo_Doc === "03" && (
                                <>
                                    <SelectItem value="6">RUC</SelectItem>
                                    <SelectItem value="1">
                                        DNI - Documento Nacional de Identidad
                                    </SelectItem>
                                    <SelectItem value="4">CARNET DE EXTRANJERIA</SelectItem>
                                </>
                            )}
                        </SelectContent>
                    </Select>
                    <span
                        className={`text-red-500 text-sm mt-1 ${facturaValida.cliente_Tipo_Doc ? "block" : "hidden"
                            }`}
                    >
                        Debes seleccionar el tipo de documento del cliente.
                    </span>
                </div>

                {/* Número de Documento */}
                <div className="flex flex-col gap-1 col-span-full sm:col-span-1">
                    <Label htmlFor="cliente_num_doc">Número de Documento</Label>
                    <div className="flex gap-2">
                        <Input
                            type="number"
                            name="cliente_Num_Doc"
                            id="cliente_num_doc"
                            placeholder="RUC o DNI"
                            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 flex-grow"
                            value={cliente_Num_Doc || ""}
                            onChange={handleInputChange}
                        />
                        <button
                            type="submit"
                            className="p-2 bg-blue-500 rounded-md text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200" // Estilos de botón mejorados
                        >
                            <Search className="h-5 w-5" />
                        </button>
                    </div>
                    <span
                        className={`text-red-500 text-sm mt-1 ${facturaValida.cliente_Num_Doc ? "block" : "hidden"
                            }`}
                    >
                        Debes ingresar el número de documento del cliente.
                    </span>
                </div>

                {/* Razón Social */}
                <div className="flex flex-col gap-1 col-span-1">
                    <Label htmlFor="cliente_razon_social">Razón Social</Label>
                    <Input
                        type="text"
                        name="cliente_Razon_Social"
                        id="cliente_razon_social"
                        placeholder="Razón Social"
                        className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" // Estilos mejorados
                        value={cliente_Razon_Social || ""}
                        onChange={handleInputChange}
                    />
                    <span
                        className={`text-red-500 text-sm mt-1 ${facturaValida.cliente_Razon_Social ? "block" : "hidden"
                            }`}
                    >
                        Debes ingresar la razón social del cliente.
                    </span>
                </div>

                {/* Dirección */}
                <div className="flex flex-col gap-1 col-span-1">
                    <Label htmlFor="cliente_direccion">Dirección</Label>
                    <Input
                        type="text"
                        name="cliente_Direccion"
                        id="cliente_direccion"
                        placeholder="Dirección"
                        className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        value={cliente_Direccion || ""}
                        onChange={handleInputChange}
                    />
                </div>
            </form>
        </div>
    );
};

export default DatosDelCliente;
