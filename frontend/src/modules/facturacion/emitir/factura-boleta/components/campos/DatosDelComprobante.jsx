import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useFacturaBoleta } from "@/modules/facturacion/context/FacturaBoletaContext";
import { LoaderCircle, Search, SquarePen } from "lucide-react";
import { useEffect } from "react";
import { Calendar22 } from "../Calendar22";

const DatosDelComprobante = () => {
    const { factura,
        setFactura,
        filiales,
        correlativos,
        correlativoEstado,
        setCorrelativoEstado,
        loadingCorrelativo,
        buscarCorrelativo,
        serieFactura,
        serieBoleta,
    } = useFacturaBoleta();


    const activarCorrelativo = (e) => {
        e.preventDefault();
        setCorrelativoEstado(!correlativoEstado);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFactura((prevValores) => ({
            ...prevValores,
            [name]: value,
        }));
    };

    const handleSelectChange = (value, name) => {
        setFactura((prevValores) => ({
            ...prevValores,
            [name]: value,
        }));
    };

    // Al cambiar el tipo de documento o la serie, actualizar el correlativo
    useEffect(() => {
        // Establecer la serie por defecto al cambiar el tipo de documento
        const nuevaSerie = factura.tipo_Doc === "01" ? "F001" : "B001";
        setFactura((prev) => ({
            ...prev,
            serie: nuevaSerie,
            correlativo: "" // Limpiar el correlativo para que se recalcule
        }));
    }, [factura.tipo_Doc]);

    useEffect(() => {
        // Buscar y establecer el correlativo basándose en la serie y el RUC actual
        if (correlativos.length > 0 && factura.empresa_Ruc && factura.serie) {
            const correlativoEncontrado = correlativos.find(
                (item) => item.ruc === factura.empresa_Ruc && item.serie === factura.serie
            );
            const siguienteCorrelativo = correlativoEncontrado ? correlativoEncontrado.siguienteCorrelativo : "0001";

            setFactura((prev) => ({
                ...prev,
                correlativo: siguienteCorrelativo,
            }));
        }
    }, [factura.empresa_Ruc, factura.serie, correlativos]);

    useEffect(() => {
        if (factura.tipo_Doc === "01") {
            setFactura((prev) => ({
                ...prev,
                relDocs: [],
            }));
        }
    }, [factura.tipo_Doc])

    return (
        <div className="overflow-y-auto p-4 sm:p-6 lg:px-8 lg:py-4">
            <h1 className="text-2xl font-bold py-3 text-gray-800">Datos del Comprobante</h1>
            <form
                onSubmit={(e) => e.preventDefault()}
                action=""
                className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5 md:gap-x-6 md:gap-y-8"
            >
                {/* Tipo de Operacion */}
                <div className="flex flex-col gap-1 col-span-full sm:col-span-1">
                    <Label htmlFor="tipo_operacion">Tipo de Venta</Label>
                    <Select
                        name="tipo_operacion"
                        value={factura.tipo_Operacion}
                        onValueChange={(value) => handleSelectChange(value, "tipo_Operacion")}
                    >
                        <SelectTrigger className="w-full border border-gray-300 rounded-md shadow-sm">
                            <SelectValue placeholder="Selecciona un tipo de operación" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0101">Venta Interna - (0101)</SelectItem>
                            <SelectItem value="1001">Operaciones Gravadas - (1001)</SelectItem>
                            <SelectItem value="0104">Venta Interna – Anticipos - (0104)</SelectItem>
                            <SelectItem value="0105">Venta Itinerante - (0105)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Serie */}
                <div className="flex flex-col gap-1 col-span-full sm:col-span-1">
                    <Label htmlFor="serie">Serie</Label>
                    <Select
                        value={factura.serie}
                        name="serie"
                        onValueChange={(value) => handleSelectChange(value, "serie")}
                    >
                        <SelectTrigger className="w-full border border-gray-300 rounded-md shadow-sm">
                            <SelectValue placeholder="Selecciona una serie" />
                        </SelectTrigger>
                        <SelectContent>
                            {factura.tipo_Doc === "01" ?
                                serieFactura.map((item) => (
                                    <SelectItem key={item.value} value={item.value}>
                                        {item.value}
                                    </SelectItem>
                                )) :
                                serieBoleta.map((item) => (
                                    <SelectItem key={item.value} value={item.value}>
                                        {item.value}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Correlativo */}
                <div className="flex flex-col gap-1 col-span-full sm:col-span-1">
                    <Label htmlFor="correlativo">Correlativo</Label>
                    <div className="flex justify-between gap-x-2">
                        <div className="relative w-full">
                            <Input
                                type="text"
                                name="correlativo"
                                id="correlativo"
                                placeholder="Correlativo"
                                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                value={factura.correlativo}
                                onChange={handleInputChange}
                                disabled={!correlativoEstado}
                            />
                            <button onClick={activarCorrelativo} className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${correlativoEstado ? "text-blue-500" : "text-gray-400"}`}>
                                <SquarePen />
                            </button>
                        </div>
                        <button className={`bg-blue-500 hover:bg-blue-600 cursor-pointer text-white rounded-md px-2`}
                            onClick={buscarCorrelativo}
                        >
                            {loadingCorrelativo ? <LoaderCircle className="size-5 animate-spin" /> : <Search className="size-5" />}
                        </button>
                    </div>
                </div>

                {/* Tipo de Documento */}
                <div className="flex flex-col gap-1 col-span-full sm:col-span-1">
                    <Label htmlFor="tipo_doc">Tipo de Documento</Label>
                    <Select
                        value={factura.tipo_Doc}
                        name="tipo_Doc"
                        onValueChange={(value) => handleSelectChange(value, "tipo_Doc")}
                    >
                        <SelectTrigger className="w-full border border-gray-300 rounded-md shadow-sm">
                            <SelectValue placeholder="Selecciona un tipo de documento" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="01">FACTURA</SelectItem>
                            <SelectItem value="03">BOLETA</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Tipo de Moneda */}
                <div className="flex flex-col gap-1 col-span-full sm:col-span-1">
                    <Label htmlFor="tipo_moneda">Tipo de Moneda</Label>
                    <Select
                        value={factura.tipo_Moneda}
                        name="tipo_Moneda"
                        onValueChange={(value) => handleSelectChange(value, "tipo_Moneda")}
                    >
                        <SelectTrigger className="w-full border border-gray-300 rounded-md shadow-sm">
                            <SelectValue placeholder="Qué moneda usas" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="PEN">SOLES</SelectItem>
                            <SelectItem value="USD">DÓLAR</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Fecha Emision */}
                <div className="flex flex-col gap-1 col-span-full sm:col-span-1">
                    <Label htmlFor="fecha_emision">Fecha Emisión</Label>
                    <Calendar22
                        Dato={factura}
                        setDato={setFactura}
                        tipo="fecha_Emision"
                    />
                </div>

                {/* Ruc de la empresa */}
                <div className="flex flex-col gap-1 col-span-full sm:col-span-1 md:col-span-2">
                    <Label htmlFor="empresa_Ruc">Ruc de la empresa</Label>
                    <Select
                        value={factura.empresa_Ruc}
                        name="empresa_Ruc"
                        onValueChange={(value) => handleSelectChange(value, "empresa_Ruc")}
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
            </form>
        </div>
    );
};

export default DatosDelComprobante;