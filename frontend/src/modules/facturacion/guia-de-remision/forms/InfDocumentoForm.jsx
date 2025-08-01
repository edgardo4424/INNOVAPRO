import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar22 } from "../../factura-boleta/components/Calendar22";
import { useGuiaTransporte } from "@/context/Factura/GuiaTransporteContext";

const InfDocumentoForm = () => {

    const { guiaTransporte, setGuiaTransporte } = useGuiaTransporte();

    const { tipo_Doc, serie, correlativo, observacion } = guiaTransporte;

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newValue = typeof value === 'string' ? value.toUpperCase() : value;
        setGuiaTransporte((prevGuiaTransporte) => ({
            ...prevGuiaTransporte,
            [name]: newValue,
        }));
    };

    const handleSelectChange = (value, name) => {
        setGuiaTransporte((prevValores) => ({
            ...prevValores,
            [name]: value,
        }));
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-2 flex">
                Información del Documento
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 mb-8">
                {/* Added gap-y for vertical spacing on small screens */}
                <div>
                    <Label
                        htmlFor="tipo_Doc"
                        className="block text-sm text-gray-700 text-left mb-1 font-semibold"
                    >
                        Tipo de Documento
                    </Label>
                    <Select
                        name="tipo_operacion"
                        value={tipo_Doc}
                        onValueChange={(e) => {
                            handleSelectChange(e, "tipo_Doc");
                        }}
                    >
                        <SelectTrigger className="w-full border border-gray-300 rounded-md shadow-sm"> {/* Estilo de borde mejorado */}
                            <SelectValue placeholder="Selecciona un tipo de Documento" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="09">Guia de Remision</SelectItem>
                            {/* <SelectItem value="07">Nota de Credito</SelectItem> */}
                            {/* <SelectItem value="08">Nota de Debito</SelectItem> */}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label
                        htmlFor="serie"
                        className="block text-sm text-gray-700 text-left mb-1 font-semibold"
                    >
                        Serie
                    </Label>
                    <Input
                        type="text"
                        id="serie"
                        name="serie"
                        value={serie}
                        onChange={handleChange}
                        className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none text-sm"
                    />
                </div>
                <div>
                    <Label
                        htmlFor="correlativo"
                        className="block text-sm text-gray-700 text-left mb-1 font-semibold"
                    >
                        Correlativo
                    </Label>
                    <Input
                        type="text"
                        id="correlativo"
                        name="correlativo"
                        value={correlativo}
                        onChange={handleChange}
                        className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none text-sm"
                    />
                </div>
                <div className="col-span-1 md:col-span-2 lg:col-span-2">
                    <Label
                        htmlFor="observacion"
                        className="block text-sm text-gray-700 text-left mb-1 font-semibold"
                    >
                        Observación
                    </Label>
                    <Textarea
                        id="observacion"
                        name="observacion"
                        value={observacion}
                        onChange={handleChange}
                        rows="2"
                        className="h-22 px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 text-sm"
                    ></Textarea>
                </div>
                <div>
                    <Label
                        htmlFor="fecha_Emision"
                        className="block text-sm text-gray-700 text-left mb-1 font-semibold"
                    >
                        Fecha de Emisión
                    </Label>
                    <Calendar22
                        tipo={"fecha_Emision"}
                        Dato={guiaTransporte}
                        setDato={setGuiaTransporte}
                        type="datetime-local"
                        id="fecha_Emision"
                        name="fecha_Emision"
                        className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none text-sm"
                    />
                </div>
            </div>
        </div>
    );
};

export default InfDocumentoForm;
