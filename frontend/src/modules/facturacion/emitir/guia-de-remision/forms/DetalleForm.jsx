import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/Label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useGuiaTransporte } from "@/modules/facturacion/context/GuiaTransporteContext";
import { Package, Trash } from "lucide-react"; // Importamos el icono de bote de basura
import { useState } from "react";
import TablaDetalles from "../components/tabla/TablaDetalles";
import ModalProducto from "../components/modal/ModalProducto";


const DetalleForm = () => {
    
    const { guiaTransporte, setGuiaTransporte } = useGuiaTransporte();

    const {
        guia_Envio_Peso_Total,
        guia_Envio_Und_Peso_Total,
    } = guiaTransporte

    const [open, setOpen] = useState(false);

    const handleSelectChange = (value, name) => {
        setGuiaTransporte((prevValores) => ({
            ...prevValores,
            [name]: value,
        }));
    };
    return (
        <div className=" overflow-y-auto  pb-10">
            <h1 className='text-2xl font-bold py-3'>Detalle de Producto</h1>
            <ModalProducto open={open} setOpen={setOpen} />
            <TablaDetalles open={open} setOpen={setOpen} />
            <div className="flex justify-end px-4 ">
                <div className="flex flex-col gap-x-2 gap-y-4 bg-gray-200 rounded-md p-4">
                    <h1 className="text-xl font-bold max-w-[350px] py-2">Selecciona con que Unidad de Peso se trabajara esta Guia</h1>
                    <div className="flex gap-x-4">
                        <Label
                            htmlFor="guia_Envio_Und_Peso_Total"
                            className="min-w-[120px] block text-sm font-semibold text-gray-700 text-left mb-1"
                        >
                            Unidad de Peso
                        </Label>
                        <Select
                            className="!bg-white"
                            name="guia_Envio_Und_Peso_Total"
                            value={guia_Envio_Und_Peso_Total}
                            onValueChange={(e) => {
                                handleSelectChange(e, "guia_Envio_Und_Peso_Total");
                            }}
                        >
                            <SelectTrigger className="w-full border bg-white border-gray-300 rounded-md shadow-sm"> {/* Estilo de borde mejorado */}
                                <SelectValue placeholder="Selecciona un unidad de peso" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="KGM">KGM - Kilogramo</SelectItem>
                                <SelectItem value="TNE">TNE - Tonelada</SelectItem>
                                <SelectItem value="GRM">GRM - Gramo</SelectItem>
                                <SelectItem value="LBR">LBR - Libra</SelectItem>
                                <SelectItem value="ONZ">ONZ - Onza</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex gap-x-4">
                        <Label
                            htmlFor="guia_Envio_Peso_Total"
                            className="min-w-[120px] block text-sm font-semibold text-gray-700 text-left mb-1"
                        >
                            Peso Total
                        </Label>
                        <Input
                            type="number"
                            id="guia_Envio_Peso_Total"
                            name="guia_Envio_Peso_Total"
                            value={guia_Envio_Peso_Total || ""}
                            className="bg-white px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                            step="0.01"
                        />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DetalleForm;
