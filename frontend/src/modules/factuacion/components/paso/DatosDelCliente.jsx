import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useFacturacion } from "@/context/FacturacionContext";
import { Search } from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "framer-motion"; // ✅ Importar motion

const DatosDelCliente = () => {
    const { factura, setFactura, facturaValida, metodo } = useFacturacion();
    const { cliente_Tipo_Doc, cliente_Num_Doc, cliente_Razon_Social, cliente_Direccion } = factura;

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
            const response = await metodo.obtenerMiInformacion();



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
        <motion.div className="max-h-[80dvh] min-h-[40dvh] overflow-y-auto p-2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <form
                className="w-full grid grid-cols-2 gap-x-2 gap-y-3"
                onSubmit={handleBuscar}
            >
                {/* Tipo de Documento */}
                <div className="flex flex-col gap-1 col-span-2 md:col-span-1">
                    <Label>Tipo de Documento</Label>
                    <Select value={cliente_Tipo_Doc} onValueChange={handleSelectChange}>
                        <SelectTrigger className="w-full border-1 border-gray-400">
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
                            {/* Agrega más tipos si los vas a usar */}
                        </SelectContent>
                    </Select>
                    <span
                        className={`text-red-500  text-sm ${facturaValida.cliente_Tipo_Doc ? "block" : "hidden"
                            }`}
                    >
                        Debes seleccionar el tipo de documento del cliente.
                    </span>
                </div>

                {/* Número de Documento */}
                <div className="flex flex-col gap-1 col-span-2 md:col-span-1">
                    <Label>Número de Documento</Label>
                    <div className="flex gap-2 pr-4">
                        <Input
                            type="number"
                            name="cliente_Num_Doc"
                            placeholder="RUC o DNI"
                            className="border-1 border-gray-400"
                            value={cliente_Num_Doc || ""}
                            onChange={handleInputChange}
                        />
                        <button
                            type="submit"
                            className="p-2 bg-blue-500 rounded-xl text-white"
                        >
                            <Search />
                        </button>
                    </div>
                    <span
                        className={`text-red-500  text-sm ${facturaValida.cliente_Num_Doc ? "block" : "hidden"
                            }`}
                    >
                        Debes ingresar el número de documento del cliente.
                    </span>
                </div>

                {/* Razón Social */}
                <div className="flex flex-col gap-1 col-span-2 md:col-span-1">
                    <Label>Razón Social</Label>
                    <Input
                        type="text"
                        name="cliente_Razon_Social"
                        placeholder="Razón Social"
                        className="border-1 border-gray-400"
                        value={cliente_Razon_Social || ""}
                        onChange={handleInputChange}
                    />
                    <span
                        className={`text-red-500  text-sm ${facturaValida.cliente_Razon_Social ? "block" : "hidden"
                            }`}
                    >
                        Debes ingresar la razón social del cliente.
                    </span>
                </div>

                {/* Dirección */}
                <div className="flex flex-col gap-1 col-span-2 md:col-span-1">
                    <Label>Dirección</Label>
                    <Input
                        type="text"
                        name="cliente_Direccion"
                        placeholder="Dirección"
                        className="border-1 border-gray-400"
                        value={cliente_Direccion || ""}
                        onChange={handleInputChange}
                    />
                </div>
            </form>
        </motion.div>
    );
};

export default DatosDelCliente;
