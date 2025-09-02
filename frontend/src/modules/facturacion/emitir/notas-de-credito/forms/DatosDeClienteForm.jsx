import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import ModalListaDeClientes from "@/modules/facturacion/components/modal/ModalListaDeClientes";
import { useNota } from "@/modules/facturacion/context/NotaContext";
import { Search } from "lucide-react";

const DatosDeClienteForm = () => {

    const { notaCreditoDebito, setNotaCreditoDebito, filiales } = useNota();
    const { cliente_Tipo_Doc, cliente_Num_Doc, cliente_Razon_Social, cliente_Direccion } = notaCreditoDebito;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNotaCreditoDebito((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (value) => {
        setNotaCreditoDebito((prev) => ({ ...prev, cliente_Tipo_Doc: value }));
    };

    return (
        <div className=" p-4 sm:px-6 lg:px-8 ">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold py-3  text-gray-800">
                    Datos del Cliente
                </h1>
                <ModalListaDeClientes setContext={setNotaCreditoDebito} />
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
                            onChange={handleInputChange}
                            className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                        <button
                            // onClick={handleBuscar}
                            className="p-2 bg-blue-500 rounded-md text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 cursor-pointer"
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
                        onChange={handleInputChange}
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
                        onChange={handleInputChange}
                        className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                </div>
            </div>
        </div>
    )
}

export default DatosDeClienteForm
