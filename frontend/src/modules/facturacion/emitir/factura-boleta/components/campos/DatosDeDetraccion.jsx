import { Button } from "@/components/ui/button";
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
import { useEffect, useState } from "react";
import { Arraydetracciones } from "../../utils/codRetenciones";

const DatosDeDetraccion = () => {
    const { factura, setFactura, detraccion, setDetraccion, detraccionActivado, setDetraccionActivado } = useFacturaBoleta();
    const { tipo_Operacion, monto_Oper_Gravadas, tipo_Moneda, monto_Imp_Venta, sub_Total } = factura;

    const [detraccionesValores, setDetraccionesValores] = useState(Arraydetracciones);
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

    // En handleSelectPorcentaje:

    const handleSelectPorcentaje = (value) => {
        setFactura((prev) => ({
            ...prev,
            forma_pago: [],
        }));

        const rawDetraccionMount = Number(((sub_Total * Number(value)) / 100).toFixed(2));
        console.log(sub_Total);
        console.log(rawDetraccionMount);


        setDetraccion((prev) => ({
            ...prev,
            detraccion_percent: Number(value),
            detraccion_cod_bien_detraccion: "",
            detraccion_mount: rawDetraccionMount,
        }));

        setFactura((prev) => ({
            ...prev,
            monto_Imp_Venta: sub_Total - rawDetraccionMount,
        }));

        setDetraccionesValores(
            Arraydetracciones.filter((item) => item.porcentaje === Number(value))
        );
    };

    // En useEffect:

    useEffect(() => {
        if (detraccion.detraccion_percent) {
            const rawDetraccionMount = Number(((sub_Total * Number(detraccion.detraccion_percent)) / 100).toFixed(2))

            setDetraccion((prev) => ({
                ...prev,
                detraccion_mount: rawDetraccionMount,
            }));
        }
    }, [sub_Total, detraccion.detraccion_percent]);

    if (factura.tipo_Doc == "03") return null

    if (factura.tipo_Operacion != "1001") return <></>;

    return (
        <div className='overflow-y-auto p-4 sm:p-6 lg:p-8'>
            <div>
                <h1 className="text-2xl font-bold pb-2">
                    Detracción
                </h1>
                {
                    factura.tipo_Operacion == "1001" && (
                        <form
                            action=""
                            className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5 pb-8 md:gap-x-6 md:gap-y-8"
                        >
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
                                        <SelectTrigger className="w-full border border-gray-300 rounded-md shadow-sm">
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

                                <div>
                                    {/* Monto de detracción */}
                                    <Label htmlFor="detraccion_mount">
                                        Monto de Detracción {tipo_Moneda == "PEN" ? "(S/)" : "($)"}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="number"
                                        id="detraccion_mount"
                                        placeholder="Ej: 120.00"
                                        step="0.01"
                                        min="0"
                                        value={detraccion.detraccion_mount}
                                        disabled
                                    // onChange={(e) => handleInputChange("detraccion_mount", e.target.value)}
                                    />
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
                                    onValueChange={(value) => handleInputChange("detraccion_cod_bien_detraccion", value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecciona un tipo de venta" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {detraccionesValores.map((item) => (
                                            <SelectItem key={item.value} value={item.value} className={item.act ? "block" : "hidden"} disabled={!item.act}>
                                                {item.value} - {item.description}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Código de medio de pago */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="detraccion_cod_medio_pago">
                                    Código de Medio de Pago{" "}
                                    <span className="text-red-500">*</span>
                                </Label>

                                <Select
                                    id="detraccion_cod_medio_pago"

                                    name="detraccion_cod_medio_pago"
                                    value={detraccion.detraccion_cod_medio_pago}
                                    onValueChange={(value) => handleInputChange("detraccion_cod_medio_pago", value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecciona cod. medio de pago" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="001">001 - Depósito en cuenta.  SUNAT</SelectItem>
                                        <SelectItem value="002">002 - Giro.  SUNAT</SelectItem>
                                        <SelectItem value="003">003 - Transferencia de fondos.  SUNAT</SelectItem>
                                        <SelectItem value="004">004 - Orden de pago.  SUNAT</SelectItem>
                                        <SelectItem value="005">005 - Tarjeta de débito.  SUNAT</SelectItem>
                                        <SelectItem value="006">006 - Tarjeta de crédito emitida en el país por una empresa del sistema financiero.  SUNAT</SelectItem>
                                        <SelectItem value="007">007 - Cheques con la cláusula “no negociable”, “intransferible”, “no a la orden” u otra equivalente.  SUNAT</SelectItem>
                                        <SelectItem value="008">008 - Efectivo (cuando no existe obligación de usar medio de pago).  SUNAT</SelectItem>
                                        <SelectItem value="009">009 - Efectivo (en los demás casos).  SUNAT</SelectItem>
                                        <SelectItem value="010">010 - Medios de pago usados en comercio exterior.  SUNAT</SelectItem>
                                        <SelectItem value="011">011 - Documentos emitidos por EDPYMES y cooperativas no autorizadas a captar depósitos.  SUNAT</SelectItem>
                                        <SelectItem value="012">012 - Tarjeta de crédito (país o exterior) emitida por empresa no perteneciente al sistema financiero.  SUNAT</SelectItem>
                                        <SelectItem value="013">013 - Tarjetas de crédito emitidas en el exterior por bancos o financieras no domiciliadas.  SUNAT</SelectItem>
                                        <SelectItem value="101">101 - Transferencias – comercio exterior.  SUNAT</SelectItem>
                                        <SelectItem value="102">102 - Cheques bancarios – comercio exterior.  SUNAT</SelectItem>
                                        <SelectItem value="103">103 - Orden de pago simple – comercio exterior.  SUNAT</SelectItem>
                                        <SelectItem value="104">104 - Orden de pago documentario – comercio exterior.  SUNAT</SelectItem>
                                        <SelectItem value="105">105 - Remesa simple – comercio exterior.  SUNAT</SelectItem>
                                        <SelectItem value="106">106 - Remesa documentaria – comercio exterior.  SUNAT</SelectItem>
                                        <SelectItem value="107">107 - Carta de crédito simple – comercio exterior.  SUNAT</SelectItem>
                                        <SelectItem value="108">108 - Carta de crédito documentario – comercio exterior.  SUNAT</SelectItem>
                                        <SelectItem value="999">999 - Otros medios de pago.  SUNAT</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Cuenta de banco */}
                            <div className="flex flex-col gap-2 lg:col-span-2">
                                <Label htmlFor="detraccion_cta_banco">
                                    Cuenta de Banco <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    type="text"
                                    id="detraccion_cta_banco"
                                    placeholder="Número de cuenta"
                                    value={detraccion.detraccion_cta_banco}
                                    onChange={(e) => handleInputChange("detraccion_cta_banco", e.target.value)}
                                />
                            </div>

                        </form>
                    )
                }
            </div>
        </div>
    );
};


export default DatosDeDetraccion;