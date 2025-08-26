import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useFacturaBoleta } from "@/modules/facturacion/context/FacturaBoletaContext";

const DatosDeDetraccion = () => {
    const { factura } = useFacturaBoleta();

    const {
        tipo_Operacion,
        detraccion_cod_bien_detraccion,
        detraccion_cod_medio_pago,
        detraccion_cta_banco,
        detraccion_percent,
        detraccion_mount,
    } = factura;

    const [formData, setFormData] = useState({
        habilitado: false,
        tipoVenta: "",
        codigoMedioPago: "",
        cuentaBanco: "",
        porcentajeDetraccion: "",
        montoDetraccion: "",
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
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

    const validateForm = () => {
        const newErrors = {};

        if (!formData.habilitado) {
            return true; // Si no está habilitado, no validamos
        }

        if (!formData.tipoVenta) {
            newErrors.tipoVenta = "Debes seleccionar el tipo de venta.";
        }

        if (!formData.codigoMedioPago.trim()) {
            newErrors.codigoMedioPago = "Debes ingresar el código de medio de pago.";
        }

        if (!formData.cuentaBanco.trim()) {
            newErrors.cuentaBanco = "Debes ingresar la cuenta de banco.";
        }

        if (!formData.porcentajeDetraccion.trim()) {
            newErrors.porcentajeDetraccion =
                "Debes ingresar el porcentaje de detracción.";
        } else {
            const porcentaje = Number.parseFloat(formData.porcentajeDetraccion);
            if (isNaN(porcentaje) || porcentaje < 0 || porcentaje > 100) {
                newErrors.porcentajeDetraccion =
                    "El porcentaje debe ser un número entre 0 y 100.";
            }
        }

        if (!formData.montoDetraccion.trim()) {
            newErrors.montoDetraccion = "Debes ingresar el monto de detracción.";
        } else {
            const monto = Number.parseFloat(formData.montoDetraccion);
            if (isNaN(monto) || monto < 0) {
                newErrors.montoDetraccion = "El monto debe ser un número positivo.";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Aquí iría la lógica para enviar los datos
            console.log("Datos de detracción:", formData);

            // Simular una petición async
            await new Promise((resolve) => setTimeout(resolve, 1000));

            alert("Datos guardados correctamente");
        } catch (error) {
            console.error("Error al guardar:", error);
            alert("Error al guardar los datos");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setFormData({
            habilitado: false,
            tipoVenta: "",
            codigoMedioPago: "",
            cuentaBanco: "",
            porcentajeDetraccion: "",
            montoDetraccion: "",
        });
        setErrors({});
    };

    if (tipo_Operacion !== "1001") return <></>;

    return (
        <div className="overflow-y-auto sm:p-6 lg:px-8 lg:py-4">
            <div>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-800">
                        Datos de Detracción
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        action=""
                        className="w-full grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5 pb-8 md:gap-x-6 md:gap-y-8"
                    >
                        {/* Checkbox para habilitar formulario */}
                        <div className="flex  items-center justify-start px-3 bg-gray-300 rounded-xl py-4 gap-1 col-span-full sm:col-span-1">
                            <Checkbox
                                id="habilitar_formulario"
                                checked={formData.habilitado}
                                onCheckedChange={(checked) =>
                                    handleInputChange("habilitado", checked)
                                }
                                className={"cursor-pointer"}
                            />
                            <Label
                                htmlFor="habilitar_formulario"
                                className="text-sm font-medium text-gray-700 cursor-pointer"
                            >
                                Habilitar formulario de detracción
                            </Label>
                        </div>
                        {!formData.habilitado ? (
                            <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-md">
                                <p>
                                    💡 Habilita el formulario para ingresar los datos de
                                    detracción.
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Tipo de Venta */}
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="detraccion_cod_bien_detraccion">
                                        Tipo de Detracción <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        name="detraccion_cod_bien_detraccion"
                                        disabled={!formData.habilitado}
                                        value={formData.tipoVenta}
                                        onValueChange={(value) =>
                                            handleInputChange("tipoVenta", value)
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Selecciona un tipo de venta" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {/* <SelectItem value="001">001 - Azúcar</SelectItem> */}
                                            {/* <SelectItem value="003">002 - Alcohol etílico</SelectItem> */}
                                            {/* <SelectItem value="004">004 - Recursos hidrobiológicos</SelectItem> */}
                                            {/* <SelectItem value="005">005 - Maíz amarillo duro</SelectItem> */}
                                            {/* <SelectItem value="006">006 - Algodón</SelectItem> */}
                                            {/* <SelectItem value="007">007 - Caña de azúcar</SelectItem> */}
                                            {/* <SelectItem value="008">008 - Madera</SelectItem> */}
                                            {/* <SelectItem value="009">009 - Arena y piedra</SelectItem> */}
                                            {/* <SelectItem value="010">010 - Residuos, subproductos, desechos, recortes y desperdicios</SelectItem> */}
                                            {/* <SelectItem value="011">011 - Bienes del inciso A) del Apéndice I de la Ley del IGV</SelectItem> */}
                                            <SelectItem value="012">012 - Intermediación laboral y tercerización</SelectItem>
                                            {/* <SelectItem value="013">013 - Animales vivos</SelectItem> */}
                                            {/* <SelectItem value="014">014 - Carnes y despojos comestibles</SelectItem> */}
                                            {/* <SelectItem value="015">015 - Abonos, cueros y pieles de origen animal</SelectItem> */}
                                            {/* <SelectItem value="016">016 - Aceite de pescado</SelectItem> */}
                                            {/* <SelectItem value="017">017 - Harina, polvo y “pellets” de pescado, crustáceos, moluscos y demás invertebrados acuáticos</SelectItem> */}
                                            {/* <SelectItem value="018">018 - Embarcaciones pesqueras</SelectItem> */}
                                            <SelectItem value="019">019 - Arrendamiento de bienes muebles</SelectItem>
                                            <SelectItem value="020">020 - Mantenimiento y reparación de bienes muebles</SelectItem>
                                            <SelectItem value="021">021 - Movimiento de carga</SelectItem>
                                            <SelectItem value="022">022 - Otros servicios empresariales</SelectItem>
                                            {/* <SelectItem value="023">023 - Leche</SelectItem> */}
                                            {/* <SelectItem value="024">024 - Comisión mercantil</SelectItem> */}
                                            {/* <SelectItem value="025">025 - Fabricación de bienes por encargo</SelectItem> */}
                                            <SelectItem value="026">026 - Servicio de transporte de personas</SelectItem>
                                            {/* <SelectItem value="029">029 - Algodón en rama sin desmontar</SelectItem> */}
                                            <SelectItem value="030">030 - Contratos de construcción</SelectItem>
                                            {/* <SelectItem value="031">031 - Oro gravado con el IGV</SelectItem> */}
                                            {/* <SelectItem value="032">032 - Páprika y otros frutos de los géneros capsicum o pimienta</SelectItem> */}
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
                                        disabled={!formData.habilitado}
                                        value={formData.codigoMedioPago}
                                        onValueChange={(value) =>
                                            handleInputChange("codigoMedioPago", value)
                                        }
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
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="detraccion_cta_banco">
                                        Cuenta de Banco <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="text"
                                        id="detraccion_cta_banco"
                                        placeholder="Número de cuenta"
                                        disabled={!formData.habilitado}
                                        value={formData.cuentaBanco}
                                        onChange={(e) =>
                                            handleInputChange("cuentaBanco", e.target.value)
                                        }
                                    />
                                </div>

                                {/* Porcentaje de detracción */}
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="detraccion_percent">
                                        Porcentaje de Detracción (%){" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="number"
                                        id="detraccion_percent"
                                        placeholder="Ej: 12.00"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        disabled={!formData.habilitado}
                                        value={formData.porcentajeDetraccion}
                                        onChange={(e) =>
                                            handleInputChange("porcentajeDetraccion", e.target.value)
                                        }
                                    />
                                </div>

                                {/* Monto de detracción */}
                                <div className="flex flex-col gap-2 sm:col-span-1">
                                    <Label htmlFor="detraccion_mount">
                                        Monto de Detracción (S/){" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="number"
                                        id="detraccion_mount"
                                        placeholder="Ej: 120.00"
                                        step="0.01"
                                        min="0"
                                        disabled={!formData.habilitado}
                                        value={formData.montoDetraccion}
                                        onChange={(e) =>
                                            handleInputChange("montoDetraccion", e.target.value)
                                        }
                                    />
                                </div>
                            </>
                        )}
                    </form>
                </CardContent>
            </div>
        </div>
    );
};

export default DatosDeDetraccion;
