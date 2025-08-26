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
import { useGuiaTransporte } from "@/modules/facturacion/context/GuiaTransporteContext";
import { LoaderCircle, Search, SquarePen } from "lucide-react";
import { useState } from "react";
import { Calendar22 } from "../../factura-boleta/components/Calendar22";
import facturaService from "../../../service/FacturaService";
import { toast } from "react-toastify";

const InfDocumentoForm = () => {

    const { guiaTransporte, setGuiaTransporte, tipoGuia, setTipoGuia } = useGuiaTransporte();

    const { tipo_Doc, serie, correlativo, observacion } = guiaTransporte;
    const [correlativoEstado, setCorrelativoEstado] = useState(false);
    const [serieEstado, setSerieEstado] = useState(false);
    const [loadingCorrelativo, setLoadingCorrelativo] = useState(false);


    const activarCorrelativo = (e) => {
        e.preventDefault();
        setCorrelativoEstado(!correlativoEstado);
    }
    const activarSerie = (e) => {
        console.log("clicl")
        e.preventDefault();
        setSerieEstado(!serieEstado);
    }
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


    const buscarCorrelativo = async (e) => {
        e.preventDefault();
        try {
            setLoadingCorrelativo(true);
            // Lógica para buscar el correlativo
            const { mensaje, estado, correlativos } = await facturaService.obtenerCorrelativoGuia();


            if (estado) {
                setGuiaTransporte({
                    ...guiaTransporte,
                    correlativo: correlativos
                })
            }

            setCorrelativoEstado(false);
            setLoadingCorrelativo(false);

        } catch (error) {
            toast.error('Error al obtener el correlativo: ' + error.message);
            setLoadingCorrelativo(false);
        } finally {
            setLoadingCorrelativo(false);
        }
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
                        Tipo de Guia a Emitir
                    </Label>
                    <Select
                        name="tipo_operacion"
                        value={tipoGuia}
                        onValueChange={(e) => {
                            setTipoGuia(e);
                        }}
                    >
                        <SelectTrigger className="w-full border border-gray-300 rounded-md shadow-sm"> {/* Estilo de borde mejorado */}
                            <SelectValue placeholder="Selecciona un tipo de Documento" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="transporte-privado">Guia de Remision - Transporte Privado</SelectItem>
                            <SelectItem value="transporte-publico">Guia de Remision - Transporte Publico</SelectItem>
                            <SelectItem value="traslado-misma-empresa">Nota de Remision - Traslado Interno</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

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
                    <div className="relative w-full">
                        <Input
                            type="text"
                            id="serie"
                            name="serie"
                            className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none text-sm"
                            value={serie}
                            onChange={handleChange}
                            disabled={!serieEstado}
                        />
                        <button onClick={activarSerie} className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${serieEstado ? "text-blue-500" : "text-gray-400"} `}>
                            <SquarePen />
                        </button>
                    </div>
                </div>
                <div>
                    <Label
                        htmlFor="correlativo"
                        className="block text-sm text-gray-700 text-left mb-1 font-semibold"
                    >
                        Correlativo
                    </Label>
                    <div className="flex justify-between gap-x-2">
                        <div className="relative w-full">
                            <Input
                                type="text"
                                id="correlativo"
                                name="correlativo"
                                value={correlativo}
                                onChange={handleChange}
                                disabled={!correlativoEstado}
                                className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none text-sm"
                            />
                            <button onClick={activarCorrelativo} className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${correlativoEstado ? "text-blue-500" : "text-gray-400"} `}>
                                <SquarePen />
                            </button>
                        </div>
                        <button className={`bg-blue-500 hover:bg-blue-600  cursor-pointer  text-white rounded-md px-2 `}
                            disabled={correlativoEstado}
                            onClick={(e) => buscarCorrelativo(e)}
                        >
                            {loadingCorrelativo ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <Search />}
                        </button>
                    </div>
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
                <div className="col-span-1 md:col-span-2 lg:col-span-3">
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

            </div>
        </div>
    );
};

export default InfDocumentoForm;
