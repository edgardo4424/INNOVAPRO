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
import { useNota } from "@/modules/facturacion/context/NotaContext";
import { useEffect, useState } from "react";
import ModalDocumentos from "../components/modal/ModalDocumentos";
import { ValorInicialDetalleNota } from "../utils/valoresInicialNota";

const codigosMotivoCredito = [
    { value: "01", label: "01 - Anulación de la operación" },
    { value: "02", label: "02 - Anulación por error en el RUC" },
    { value: "03", label: "03 - Corrección por error en la descripción" },
    { value: "04", label: "04 - Descuento global" },
    { value: "05", label: "05 - Descuento por ítem" },
    { value: "06", label: "06 - Devolución total" },
    { value: "07", label: "07 - Devolución por ítem" },
    // { value: "08", label: "08 - Bonificación" },
    // { value: "09", label: "09 - Disminución en el valor" },
    { value: "10", label: "10 - Otros Conceptos" },
];

const codigosMotivosDebito = [
    { value: "01", label: "01 - Intereses por mora" },
    { value: "02", label: "02 - Aumento en el valor" },
    { value: "03", label: "03 - Penalidades/ otros conceptos" },
]
const DocumentoAfectadoForm = () => {
    const { notaCreditoDebito, setNotaCreditoDebito, filiales, documentoAAfectar } = useNota();

    const [open, setOpen] = useState(false);

    const handleSelectChange = (value, name) => {
        setNotaCreditoDebito((prevValores) => ({
            ...prevValores,
            [name]: value,
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNotaCreditoDebito((prevValores) => ({
            ...prevValores,
            [name]: value,
        }));
    };


    useEffect(() => {
        setNotaCreditoDebito((prev) => ({
            ...prev,
            motivo_Cod: "",
            // motivo_Des: "",
        }))
    }, [notaCreditoDebito.tipo_Doc]);

    useEffect(() => {
        if (notaCreditoDebito.motivo_Cod === "01" || notaCreditoDebito.motivo_Cod === "02") {
            setNotaCreditoDebito((prev) => ({
                ...prev,
                ...documentoAAfectar,
                motivo_Des: "ANULACION DE LA OPERACION",
            }))
        } else if (notaCreditoDebito.motivo_Cod === "03") {
            setNotaCreditoDebito((prev) => ({
                ...prev,
                ...ValorInicialDetalleNota,
                motivo_Des: "CORRECCIÓN POR ERROR EN LA DESCRIPCIÓN",
            }))
        }
    }, [notaCreditoDebito.motivo_Cod]);

    return (
        <div className=" p-4 sm:px-6 lg:px-8 ">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold py-3  text-gray-800">
                    Datos del Documento Afectado
                </h1>
                <ModalDocumentos open={open} setOpen={setOpen} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 mb-8">
                <div>
                    <Label
                        htmlFor="afectado_Tipo_Doc"
                        className="block text-sm font-semibold text-gray-700 text-left mb-1"
                    >
                        Tipo Documento Afectado
                    </Label>
                    <Select
                        name="afectado_Tipo_Doc"
                        value={notaCreditoDebito.afectado_Tipo_Doc}
                        // onValueChange={(e) => {
                        //     handleSelectChange(e, "afectado_Tipo_Doc");
                        // }}
                        disabled
                    >
                        <SelectTrigger className="w-full border border-gray-300 rounded-md shadow-sm">
                            <SelectValue placeholder="Selecciona un tipo de Documento" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="01">Factura</SelectItem>
                            <SelectItem value="03">Boleta</SelectItem>
                            <SelectItem value="09">Guía de Remisión</SelectItem>
                            {/* <SelectItem value="03">Nota de Crédito</SelectItem> */}
                            {/* <SelectItem value="07">Nota de Débito</SelectItem> */}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label
                        htmlFor="afectado_Num_Doc"
                        className="block text-sm font-semibold text-gray-700 text-left mb-1"
                    >
                        Número Documento Afectado
                    </Label>
                    <Input
                        type="text"
                        id="afectado_Num_Doc"
                        name="afectado_Num_Doc"
                        value={notaCreditoDebito.afectado_Num_Doc}
                        // onChange={handleInputChange}
                        disabled
                        className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                </div>
                <div className="col-span-1 md:col-span-2 lg:col-span-1">
                    <Label
                        htmlFor="motivo_Cod"
                        className="block text-sm font-semibold text-gray-700 text-left mb-1"
                    >
                        Código Motivo
                    </Label>
                    <Select
                        name="motivo_Cod"
                        value={notaCreditoDebito.motivo_Cod}
                        onValueChange={(e) => {
                            handleSelectChange(e, "motivo_Cod");
                        }}
                    >
                        <SelectTrigger className="w-full border border-gray-300 rounded-md shadow-sm">
                            <SelectValue placeholder="Selecciona un tipo de Documento" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                notaCreditoDebito.tipo_Doc === "07"
                                    ? codigosMotivoCredito.map((item) => (
                                        <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                                    ))
                                    : codigosMotivosDebito.map((item) => (
                                        <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                                    ))
                            }
                        </SelectContent>
                    </Select>
                </div>
                <div className="col-span-1 md:col-span-2 lg:col-span-3">
                    <Label
                        htmlFor="motivo_Des"
                        className="block text-sm font-semibold text-gray-700 text-left mb-1"
                    >
                        Descripción Motivo
                    </Label>
                    <Textarea
                        value={notaCreditoDebito.motivo_Des}
                        type="text"
                        id="motivo_Des"
                        name="motivo_Des"
                        rows="2"
                        onChange={handleInputChange}
                        className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                    </Textarea>
                </div>
            </div>

        </div>
    )
}

export default DocumentoAfectadoForm
