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
import { useEffect, useState } from "react";
import { Calendar22 } from "../../factura-boleta/components/Calendar22";
import facturaService from "../../../service/FacturaService";
import { toast } from "react-toastify";

const InfDocumentoForm = () => {

    const { guiaTransporte, setGuiaTransporte, tipoGuia, setTipoGuia, filiales } = useGuiaTransporte();

    const { tipo_Doc, serie, correlativo, observacion, empresa_Ruc } = guiaTransporte;
    const [correlativos, setCorrelativos] = useState([]);
    const [correlativoEstado, setCorrelativoEstado] = useState(false);
    const [serieEstado, setSerieEstado] = useState(false);
    const [loadingCorrelativo, setLoadingCorrelativo] = useState(false);

    const rucsFiliales = filiales.map((filial) => ({ ruc: filial.ruc }));


    const activarCorrelativo = (e) => {
        e.preventDefault();
        setCorrelativoEstado(!correlativoEstado);
    }
    const activarSerie = (e) => {
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
        if (e) {
            e.preventDefault();
        }
        try {
            setLoadingCorrelativo(true);
            // Lógica para buscar el correlativo
            const { message, status, data } = await facturaService.obtenerCorrelativoGuia(rucsFiliales);

            setCorrelativos(data);

            let { correlativo, ruc } = data.filter((item) => item.ruc === guiaTransporte.empresa_Ruc)[0];

            if (status) {
                setGuiaTransporte((prevValores) => ({
                    ...prevValores,
                    correlativo: `${correlativo}`,
                }))
                setCorrelativoEstado(false);
                setLoadingCorrelativo(false);
            }

        } catch (error) {
            toast.error('Error al obtener el correlativo: ' + error.message);
            setLoadingCorrelativo(false);
        } finally {
            setLoadingCorrelativo(false);
        }
    };

    useEffect(() => {
        if (filiales.length !== 0) {
            buscarCorrelativo();
        }
    }, [filiales]);

    useEffect(() => {
        if (filiales.length !== 0) {
            const correlativoData = correlativos.find((item) => item.ruc === guiaTransporte.empresa_Ruc);
            const { correlativo, ruc } = correlativoData || {};

            setGuiaTransporte((prevValores) => ({
                ...prevValores,
                correlativo: `${correlativo}`
            }))
        }
    }, [guiaTransporte.tipo_Doc, guiaTransporte.empresa_Ruc]);

    return (
        <div className="overflow-y-auto p-4 sm:p-6 lg:px-8 lg:py-4">
            <h2 className="text-2xl font-semibold mb-2 flex">
                Información del Documento
            </h2>
            <form
                onSubmit={e => e.preventDefault()}
                action=""
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 mb-8">
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
                            // disabled={correlativoEstado}
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
                <div>
                    <div>
                        <Label
                            htmlFor="empresa_Ruc"
                            className="block text-sm text-gray-700 text-left mb-1 font-semibold"
                        >
                            RUC Empresa
                        </Label>
                        <Select
                            value={empresa_Ruc}
                            name="empresa_Ruc"
                            onValueChange={(e) => {
                                handleSelectChange(e, "empresa_Ruc");
                            }}
                        >
                            <SelectTrigger className="w-full border border-gray-300 rounded-md shadow-sm">
                                <SelectValue placeholder="Selecciona un codigo" />
                            </SelectTrigger>
                            <SelectContent>
                                {filiales.map((filial) => (
                                    <SelectItem key={filial.id} value={filial.ruc}>
                                        {filial.razon_social} - {filial.ruc}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
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

            </form>
        </div>
    );
};

export default InfDocumentoForm;
