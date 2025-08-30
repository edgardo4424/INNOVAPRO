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
import { Calendar22 } from "../Calendar22";
import { useEffect, useState } from "react";
import { LoaderCircle, Search, SquarePen } from "lucide-react";
import facturaService from "@/modules/facturacion/service/FacturaService";
import { toast } from "react-toastify";

const DatosDelComprobante = () => {
    const { factura, setFactura, filiales } = useFacturaBoleta();
    const [correlativos, setCorrelativos] = useState({});
    const [correlativoEstado, setCorrelativoEstado] = useState(false);
    const [loadingCorrelativo, setLoadingCorrelativo] = useState(false);


    const activarCorrelativo = (e) => {
        e.preventDefault();
        setCorrelativoEstado(!correlativoEstado);
    }
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

    const buscarCorrelativo = async (e) => {
        e.preventDefault();
        try {
            setLoadingCorrelativo(true);
            // Lógica para buscar el correlativo
            const { mensaje, estado, correlativos } = await facturaService.obtenerCorrelativo();

            setCorrelativos(correlativos);

            let tipoDoc = factura.tipo_Doc === "01" ? "Factura" : "Boleta";
            if (estado) {
                setFactura((prevValores) => ({
                    ...prevValores,
                    correlativo: tipoDoc === "Factura" ? `${correlativos.factura}` : `${correlativos.boleta}`,
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
        setFactura((prevValores) => ({
            ...prevValores,
            correlativo: factura.tipo_Doc === "01" ? correlativos.factura : correlativos.boleta,
        }))
    }, [factura.tipo_Doc])

    return (
        <div className="overflow-y-auto p-4 sm:p-6 lg:px-8 lg:py-4">
            <h1 className="text-2xl font-bold py-3 text-gray-800">Datos del Comprobante</h1>
            <form action="" className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5 md:gap-x-6 md:gap-y-8"> {/* Grid más flexible */}
                {/* Tipo de Operacion */}
                <div className="flex flex-col gap-1 col-span-full sm:col-span-1"> {/* Col-span-full para que ocupe todo el ancho en móviles */}
                    <Label htmlFor="tipo_operacion">Tipo de Venta</Label>
                    <Select
                        name="tipo_operacion"
                        value={factura.tipo_Operacion}
                        onValueChange={(e) => {
                            handleSelectChange(e, "tipo_Operacion");
                        }}
                    >
                        <SelectTrigger className="w-full border border-gray-300 rounded-md shadow-sm"> {/* Estilo de borde mejorado */}
                            <SelectValue placeholder="Selecciona un tipo de operación" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0101">Venta Interna - (0101)</SelectItem>
                            <SelectItem value="1001">Operaciones Gravadas - (1001)</SelectItem>
                            {/* <SelectItem value="0102">Exportación - (0102)</SelectItem> */}
                            {/* <SelectItem value="0103">No Domiciliados - (0103)</SelectItem> */}
                            <SelectItem value="0104">Venta Interna – Anticipos - (0104)</SelectItem>
                            <SelectItem value="0105">Venta Itinerante - (0105)</SelectItem>
                            {/* <SelectItem value="0106">Factura Guía - (0106)</SelectItem> */}
                            {/* <SelectItem value="0107">Venta Arroz Pilado - (0107)</SelectItem> */}
                            {/* <SelectItem value="0108">Factura - Comprobante de Percepción - (0108)</SelectItem> */}
                            {/* <SelectItem value="0110">Factura - Guía remitente - (0110)</SelectItem> */}
                            {/* <SelectItem value="0111">Factura - Guía transportista - (0111)</SelectItem> */}
                        </SelectContent>
                    </Select>
                </div>

                {/* Serie */}
                <div className="flex flex-col gap-1 col-span-full sm:col-span-1">
                    <Label htmlFor="serie">Serie</Label>
                    <Input
                        type="text"
                        name="serie"
                        id="serie"
                        placeholder="Serie"
                        className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        value={factura.serie || ""}
                        onChange={handleInputChange}
                    // disabled
                    />
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
                            <button onClick={activarCorrelativo} className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${correlativoEstado ? "text-blue-500" : "text-gray-400"} `}><SquarePen /></button>
                        </div>
                        <button className={`bg-blue-500 hover:bg-blue-600  cursor-pointer  text-white rounded-md px-2 `}
                            // disabled={correlativoEstado}
                            onClick={(e) => buscarCorrelativo(e)}>
                            {loadingCorrelativo ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <Search />}
                        </button>
                    </div>
                </div>

                {/* Tipo de Documento */}
                <div className="flex flex-col gap-1 col-span-full sm:col-span-1">
                    <Label htmlFor="tipo_doc">Tipo de Documento</Label>
                    <Select
                        value={factura.tipo_Doc}
                        name="tipo_Doc"
                        onValueChange={(e) => {
                            handleSelectChange(e, "tipo_Doc");
                        }}
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
                        onValueChange={(e) => {
                            handleSelectChange(e, "tipo_Moneda");
                        }}
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
            </form>
        </div>
    );
};

export default DatosDelComprobante;