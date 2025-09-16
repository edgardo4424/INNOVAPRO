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

const serieGuia = [
    { value: "T001" },
    { value: "T002" },
    { value: "T003" },
    { value: "T004" },
    { value: "T005" },
];

const InfDocumentoForm = () => {

    const { guiaTransporte, setGuiaTransporte, tipoGuia, setTipoGuia, filiales, setGuiaDatosInternos } = useGuiaTransporte();

    const { tipo_Doc, serie, correlativo, observacion, empresa_Ruc } = guiaTransporte;
    const [correlativos, setCorrelativos] = useState([]);
    const [correlativoEstado, setCorrelativoEstado] = useState(false);
    const [loadingCorrelativo, setLoadingCorrelativo] = useState(false);

    const rucsFiliales = filiales.map((filial) => ({ ruc: filial.ruc }));


    const activarCorrelativo = (e) => {
        e.preventDefault();
        setCorrelativoEstado(!correlativoEstado);
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
        if (loadingCorrelativo) return;
        if (e) {
            e.preventDefault();
        }
        try {
            setLoadingCorrelativo(true);
            const rucsAndSeries = filiales.map((filial) => ({
                ruc: filial.ruc,
                serie: serieGuia,
            }));

            const { data } = await facturaService.obtenerCorrelativoGuia(rucsAndSeries);
            setCorrelativos(data);
        } catch (error) {
            console.error("Error al obtener correlativos:", error);
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
        // Buscar y establecer el correlativo bas ndose en la serie y el RUC actual
        if (correlativos.length > 0 && guiaTransporte.empresa_Ruc && guiaTransporte.serie) {
            const correlativoEncontrado = correlativos.find(
                (item) => item.ruc === guiaTransporte.empresa_Ruc && item.serie === guiaTransporte.serie
            );
            const siguienteCorrelativo = correlativoEncontrado ? correlativoEncontrado.siguienteCorrelativo : "0001";
            setGuiaTransporte((prev) => ({
                ...prev,
                correlativo: siguienteCorrelativo,
            }));
        }
    }, [guiaTransporte.empresa_Ruc, guiaTransporte.serie, correlativos]);

    useEffect(() => {
        if (guiaTransporte.empresa_Ruc) {
            setGuiaDatosInternos((prevValores) => ({
                ...prevValores,
                guia_Envio_Partida_Ruc: guiaTransporte.empresa_Ruc,
                guia_Envio_Llegada_Ruc: guiaTransporte.empresa_Ruc
            }))
        }
    }, [guiaTransporte.empresa_Ruc])

    useEffect(() => {
        if (tipoGuia === "traslado-misma-empresa") {
            const filialSameRuc = filiales.find((filial) => filial.ruc === guiaTransporte.empresa_Ruc);
            console.log(filialSameRuc)
            setGuiaTransporte((prevValores) => ({
                ...prevValores,
                cliente_Tipo_Doc: "6",
                cliente_Num_Doc: filialSameRuc.ruc,
                cliente_Razon_Social: filialSameRuc.razon_social,
                cliente_Direccion: filialSameRuc.direccion
            }))
        }
    }, [tipoGuia])

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
                            <SelectItem value="transporte-publico">Guia de Remision - Transporte Publico</SelectItem>
                            <SelectItem value="transporte-privado">Guia de Remision - Transporte Privado</SelectItem>
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
                        <Select
                            value={serie}
                            name="serie"
                            onValueChange={(value) => handleSelectChange(value, "serie")}
                        >
                            <SelectTrigger className="w-full border border-gray-300 rounded-md shadow-sm">
                                <SelectValue placeholder="Selecciona una serie" />
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    serieGuia.map((item) => (
                                        <SelectItem key={item.value} value={item.value}>
                                            {item.value}
                                        </SelectItem>
                                    ))
                                }
                            </SelectContent>
                        </Select>

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
                        <button
                            className="p-2 bg-innova-blue rounded-md text-white hover:bg-innova-blue-hover focus:outline-none focus:ring-2 focus:ring-innova-blue focus:ring-offset-2 transition-colors duration-200 cursor-pointer"
                            // disabled={correlativoEstado}
                            onClick={(e) => buscarCorrelativo(e)}
                        >
                            {loadingCorrelativo ? <LoaderCircle className="size-5 animate-spin" /> : <Search className="size-5" />}
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
