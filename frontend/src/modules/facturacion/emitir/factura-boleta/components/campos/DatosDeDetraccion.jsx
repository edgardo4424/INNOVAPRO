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
import { RotateCcw, SquarePen } from "lucide-react";
import { useEffect, useState } from "react";
import { Arraydetracciones, ArrayFormasDePago } from "../../utils/codDetraccion";

const DatosDeDetraccion = () => {
    const {
        factura,
        setFactura,
        detraccion,
        setDetraccion,
        filiales,
        setDetraccionActivado,
    } = useFacturaBoleta();
    const {
        tipo_Operacion,
        monto_Oper_Gravadas,
        tipo_Moneda,
        monto_Imp_Venta,
        sub_Total,
    } = factura;

    const [detraccionesValores, setDetraccionesValores] =
        useState(Arraydetracciones);
    const [activarMonto, setActivarMonto] = useState(false);
    const [errors, setErrors] = useState({});

    const handleInputChange = (field, value) => {
        setDetraccion((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Limpiar error del campo cuando el usuario empiece a escribir
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: undefined,
            }));
        }
    };

    const activar = () => {
        setActivarMonto(!activarMonto);
    };

    // Función para resetear el monto de detracción al valor calculado por defecto
    const resetearMontoDetraccion = () => {
        if (detraccion.detraccion_percent) {
            const nuevoMontoCalculado = Number(
                ((sub_Total * Number(detraccion.detraccion_percent)) / 100).toFixed(2),
            );
            setDetraccion((prev) => ({
                ...prev,
                detraccion_mount: nuevoMontoCalculado,
            }));
        }
    };

    const handleSelectPorcentaje = (value) => {
        const rawDetraccionMount = Number(
            ((sub_Total * Number(value)) / 100).toFixed(2),
        );

        setDetraccion((prev) => ({
            ...prev,
            detraccion_percent: Number(value),
            detraccion_cod_bien_detraccion: "",
            detraccion_mount: rawDetraccionMount,
        }));

        setDetraccionesValores(
            Arraydetracciones.filter((item) => item.porcentaje === Number(value)),
        );
    };

    useEffect(() => {
        if (detraccion.detraccion_percent) {
            const rawDetraccionMount = Number(
                ((sub_Total * Number(detraccion.detraccion_percent)) / 100).toFixed(2),
            );

            setDetraccion((prev) => ({
                ...prev,
                detraccion_mount: rawDetraccionMount,
            }));
        }
    }, [sub_Total, detraccion.detraccion_percent]);

    useEffect(() => {
        if (filiales.length > 0 && factura.empresa_Ruc != "") {
            const filialEncontrada = filiales.find(
                (filial) => filial.ruc === factura.empresa_Ruc,
            );
            setDetraccion((prev) => ({
                ...prev,
                detraccion_cta_banco: filialEncontrada.cuenta_banco,
            }));
        }
    }, [factura.empresa_Ruc, filiales]);

    useEffect(() => {
        setFactura((prev) => ({
            ...prev,
            forma_pago: []
        }))
    }, [detraccion]);

    if (factura.tipo_Doc == "03") return null;

    if (factura.tipo_Operacion != "1001") return <></>;

    return (
        <div className="overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div>
                <h1 className="pb-2 text-2xl font-bold">Detracción</h1>
                {factura.tipo_Operacion == "1001" && (
                    <div className="grid w-full grid-cols-1 gap-x-4 gap-y-5 pb-8 sm:grid-cols-2 md:gap-x-6 md:gap-y-8 lg:grid-cols-2">
                        {/* Porcentaje de detracción */}
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Label htmlFor="detraccion_percent">
                                    Porcentaje de Detracción (%){" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    name="detraccion_percent"
                                    value={detraccion.detraccion_percent}
                                    onValueChange={handleSelectPorcentaje}
                                    placeholder="Selecciona un porcentaje"
                                >
                                    <SelectTrigger className="w-full rounded-md border border-gray-300 shadow-sm">
                                        <SelectValue placeholder="Selecciona un porcentaje de detracción" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={4}>4%</SelectItem>
                                        <SelectItem value={10}>10%</SelectItem>
                                        <SelectItem value={12}>12%</SelectItem>
                                        <SelectItem value={15}>15%</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="justify-self-end">
                                {/* Monto de detracción */}
                                <Label htmlFor="detraccion_mount">
                                    Monto de Detracción {tipo_Moneda == "PEN" ? "(S/)" : "($)"}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <div className="justi flex items-center">
                                    <div className="relative">
                                        <Input
                                            type="text"
                                            id="detraccion_mount"
                                            placeholder="Ej: 120.00"
                                            step="0.01"
                                            min="0"
                                            value={detraccion.detraccion_mount}
                                            disabled={!activarMonto}
                                            onChange={(e) =>
                                                handleInputChange("detraccion_mount", e.target.value)
                                            }
                                            className="appearance-none"
                                        />
                                        <button
                                            onClick={activar}
                                            className={`absolute top-1/2 right-2 -translate-y-1/2 transform ${activarMonto ? "text-innova-blue" : "text-gray-400"}`}
                                        >
                                            <SquarePen />
                                        </button>
                                    </div>
                                    <button
                                        // Se cambió onClick={activar} a la nueva función de reseteo
                                        onClick={resetearMontoDetraccion}
                                        className="bg-innova-blue hover:bg-innova-blue-hover cursor-pointer rounded-md p-1 text-white transition-all duration-150"
                                    >
                                        <RotateCcw className="size-5 rotate-90 transition-transform duration-250 hover:-rotate-90" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Tipo de Venta */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="detraccion_cod_bien_detraccion">
                                Tipo de Detracción <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                name="detraccion_cod_bien_detraccion"
                                value={detraccion.detraccion_cod_bien_detraccion}
                                onValueChange={(value) =>
                                    handleInputChange("detraccion_cod_bien_detraccion", value)
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecciona un tipo de venta" />
                                </SelectTrigger>
                                <SelectContent>
                                    {detraccionesValores.map((item) => (
                                        <SelectItem
                                            key={item.value}
                                            value={item.value}
                                            className={item.act ? "block" : "hidden"}
                                            disabled={!item.act}
                                        >
                                            {item.value} - {item.description}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Código de medio de pago */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="detraccion_cod_medio_pago">
                                Código de Medio de Pago <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                id="detraccion_cod_medio_pago"
                                name="detraccion_cod_medio_pago"
                                value={detraccion.detraccion_cod_medio_pago}
                                onValueChange={(value) =>
                                    handleInputChange("detraccion_cod_medio_pago", value)
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecciona cod. medio de pago" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        ArrayFormasDePago.map((item) => (
                                            <SelectItem
                                                key={item.value}
                                                value={item.value}
                                                className={item.act ? "block" : "hidden"}
                                                disabled={!item.act}
                                            >
                                                {item.description}
                                            </SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Cuenta de banco */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="detraccion_cta_banco">
                                Cuenta de Banco <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="text"
                                id="detraccion_cta_banco"
                                placeholder="Número de cuenta"
                                value={detraccion.detraccion_cta_banco}
                                onChange={(e) =>
                                    handleInputChange("detraccion_cta_banco", e.target.value)
                                }
                                disabled
                                className={"cursor-not-allowed border-2 border-gray-400"}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DatosDeDetraccion;
