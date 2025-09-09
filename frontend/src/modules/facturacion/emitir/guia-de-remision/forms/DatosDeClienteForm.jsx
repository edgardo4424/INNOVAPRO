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
import { Search } from "lucide-react";
import { toast } from "react-toastify";
import factilizaService from "../../../service/FactilizaService";
import ModalListaDeClientes from "@/modules/facturacion/components/modal/ModalListaDeClientes";

const DatosDeClienteForm = () => {

    const { guiaTransporte, setGuiaTransporte } = useGuiaTransporte();

    const { cliente_Tipo_Doc, cliente_Num_Doc, cliente_Razon_Social, cliente_Direccion } = guiaTransporte;


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
            const promise = factilizaService.metodoOpcional(
                cliente_Tipo_Doc,
                cliente_Num_Doc
            );
            toast.promise(
                promise,
                {
                    pending: "Buscando información del cliente",
                    success: "Información encontrada",
                    error: "Ocurrió un error al buscar la información del cliente",
                }
            );
            const { data, status, success } = await promise;
            console.log("data", data);

            if (status === 200 && success) {
                let razonSocial = "";
                let direccion = "";

                if (cliente_Tipo_Doc === "1") {
                    razonSocial = data.nombre_completo;
                    direccion = data.direccion_completa;
                } else if (cliente_Tipo_Doc === "6") {
                    razonSocial = data.nombre_o_razon_social;
                    direccion = data.direccion;
                } else if (cliente_Tipo_Doc === "4") {
                    razonSocial = `${data.nombres} ${data.apellido_paterno} ${data.apellido_materno}`;
                }

                setGuiaTransporte((prev) => ({
                    ...prev,
                    cliente_Razon_Social: razonSocial,
                    cliente_Direccion: direccion,
                }));
            }
        } catch (error) {
            console.error("Error al buscar:", error);
            toast.error("Ocurrió un error al buscar la información del cliente.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setGuiaTransporte((prevGuiaTransporte) => ({
            ...prevGuiaTransporte,
            [name]: value,
        }));
    };

    const handleSelectChange = (value, name) => {
        setGuiaTransporte((prevValores) => ({
            ...prevValores,
            [name]: value,
        }));
    };

    return (
        <div className="overflow-y-auto p-4 sm:p-6 lg:px-8 lg:py-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold py-3  text-gray-800">
                    Datos del Cliente
                </h1>
                <ModalListaDeClientes setContext={setGuiaTransporte} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 mb-8">
                <div>
                    <Label
                        htmlFor="cliente_Tipo_Doc"
                        className="block text-sm font-semibold text-gray-700 text-left mb-1"
                    >
                        Tipo Documento Cliente
                    </Label>
                    <Select
                        name="cliente_Tipo_Doc"
                        value={cliente_Tipo_Doc}
                        onValueChange={(e) => {
                            handleSelectChange(e, "cliente_Tipo_Doc");
                        }}
                    >
                        <SelectTrigger className="w-full border border-gray-300 rounded-md shadow-sm">
                            <SelectValue placeholder="Selecciona un tipo de Documento" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="6">RUC</SelectItem>
                            <SelectItem value="1">DNI - Documento Nacional de Identidad</SelectItem>
                            <SelectItem value="4">CARNET DE EXTRANJERIA</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label
                        htmlFor="cliente_Num_Doc"
                        className="block text-sm font-semibold text-gray-700 text-left mb-1"
                    >
                        Número Documento Cliente
                    </Label>
                    <div className="flex gap-2">
                        <Input
                            type="number"
                            id="cliente_Num_Doc"
                            name="cliente_Num_Doc"
                            value={cliente_Num_Doc}
                            onChange={handleChange}
                            className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                        <button
                            onClick={handleBuscar}
                            className="p-2 bg-innova-blue/90 rounded-md text-white hover:bg-innova-blue-hover focus:outline-none focus:ring-2 focus:ring-innova-blue focus:ring-offset-2 transition-colors duration-200 cursor-pointer"
                        >
                            <Search className="h-5 w-5" />
                        </button>
                    </div>
                </div>
                <div className="col-span-1 md:col-span-2 lg:col-span-1">
                    <Label
                        htmlFor="cliente_Razon_Social"
                        className="block text-sm font-semibold text-gray-700 text-left mb-1"
                    >
                        Razón Social Cliente
                    </Label>
                    <Input
                        type="text"
                        id="cliente_Razon_Social"
                        name="cliente_Razon_Social"
                        value={cliente_Razon_Social}
                        onChange={handleChange}
                        className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                </div>
                <div className="col-span-1 md:col-span-2 lg:col-span-3">
                    <Label
                        htmlFor="cliente_Direccion"
                        className="block text-sm font-semibold text-gray-700 text-left mb-1"
                    >
                        Dirección Cliente
                    </Label>
                    <Input
                        type="text"
                        id="cliente_Direccion"
                        name="cliente_Direccion"
                        value={cliente_Direccion}
                        onChange={handleChange}
                        className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                </div>
            </div>
        </div>
    );
};

export default DatosDeClienteForm;
