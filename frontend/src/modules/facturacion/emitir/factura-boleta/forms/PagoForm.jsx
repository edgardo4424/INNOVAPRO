import { Button } from '@/components/ui/button';
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
import { toast } from "react-toastify";
import { Calendar22 } from "../components/Calendar22";
import { PagoValidarEstados } from '../utils/valoresInicial';
import { Calculator } from 'lucide-react';
const PagoForm = ({ closeModal }) => {
    const { factura, agregarPago, pagoActual, pagoValida, setPagoActual, validarCampos, setPagoValida } = useFacturaBoleta();

    const { forma_pago: ListaDePago } = factura;

    const montoTotalPagos = ListaDePago.reduce(
        (total, pago) => total + (parseFloat(pago.monto) || 0),
        0
    );

    const [activeButton, setActiveButton] = useState(false);

    // ?? Datos para calculadora
    const [showCalculadora, setShowCalculadora] = useState(false);
    const [daysToAdd, setDaysToAdd] = useState("");


    const montoTotalFactura = parseFloat(factura.monto_Imp_Venta || 0);
    const pagosCompletos = montoTotalPagos >= montoTotalFactura;

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Permitir que el campo quede vacío sin bloquearlo
        if (value === "") {
            setPagoActual({
                ...pagoActual,
                [name]: value,
            });
            return;
        }

        const valorNumerico = parseFloat(value);

        // Validación: No permitir negativos ni NaN
        if (isNaN(valorNumerico) || valorNumerico < 0) {
            return;
        }

        // Validar solo si es el campo 'monto'
        if (name === "monto") {
            const previo = parseFloat(pagoActual.monto) || 0;
            const sumaReal = montoTotalPagos - previo + valorNumerico;

            if (sumaReal > montoTotalFactura) {
                return;
            }
        }

        setPagoActual({
            ...pagoActual,
            [name]: valorNumerico,
        });
    };


    // Función para calcular la nueva fecha al añadir días
    const handleCalculateDate = () => {
        const days = parseInt(daysToAdd, 10);
        if (isNaN(days)) {
            toast.error("Por favor, ingresa un número válido de días.", { position: "top-right" });
            return;
        }

        const newDate = new Date();
        newDate.setDate(newDate.getDate() + days);

        // Actualiza el estado con la nueva fecha en formato ISO
        setPagoActual({
            ...pagoActual,
            fecha_Pago: newDate.toISOString().split('T')[0],
        });

        // Oculta el input de la calculadora
        setShowCalculadora(false);
        setDaysToAdd(""); // Limpiar el input
    };



    const handleSelectChange = (value, name) => {
        setPagoActual((prevValores) => ({
            ...prevValores,
            [name]: value,
        }));
    }



    const handleAgregar = async () => {
        const validar = await validarCampos("pago");
        if (validar === false) {
            return;
        }
        const nuevoTotal = montoTotalPagos + (parseFloat(pagoActual.monto) || 0);
        console.log("nuevoTotal", nuevoTotal);
        console.log("montoTotalFactura", montoTotalFactura);
        if (nuevoTotal > montoTotalFactura) {
            toast.error("El total de cuotas no puede exceder el monto de la factura.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }
        agregarPago();
        closeModal();
    };


    useEffect(() => {
        setActiveButton(false);
        setPagoValida(PagoValidarEstados)
    }, [])

    return (
        <div className=" overflow-y-auto  col-span-4 w-full">
            <form
                action=""
                className="w-full  grid grid-cols-4 gap-x-2 gap-y-3  py-8 "
            >
                {/* Unidad */}
                <div className="flex flex-col gap-1 col-span-4 md:col-span-2">
                    <Label>Metodo de pago</Label>
                    <Select
                        name="tipo"
                        onValueChange={(e) => {
                            handleSelectChange(e, "tipo");
                        }}
                    >
                        <SelectTrigger className="w-full border-1 border-gray-400">
                            <SelectValue placeholder="Selecciona un tipo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="CONTADO">CONTADO </SelectItem>
                            <SelectItem value="CREDITO">CREDITO</SelectItem>
                        </SelectContent>
                    </Select>
                    {
                        pagoValida.tipo && (
                            <span className="text-red-500 text-sm">
                                Debes seleccionar un metodo de pago
                            </span>
                        )
                    }
                </div>

                {/* Monto */}
                <div className="flex flex-col gap-1 col-span-4 md:col-span-2">
                    <Label>Monto de Pago con IGV</Label>
                    <Input
                        type="number"
                        name="monto"
                        placeholder="Monto"
                        className={"border-1 border-gray-400"}
                        onwheel={(e) => e.target.blur()}
                        value={pagoActual.monto}
                        onChange={handleInputChange}
                    />
                    {
                        pagoValida.monto && (
                            <span className="text-red-500 text-sm">
                                Debes ingresar un monto
                            </span>
                        )
                    }
                </div>

                {/* Cuota */}
                <div className="flex flex-col gap-1 col-span-4 md:col-span-2">
                    <Label>Cuotas</Label>
                    <Input
                        type="number"
                        name="cuota"
                        placeholder="cuota"
                        className={"border-1 border-gray-400"}
                        value={ListaDePago.length}
                        disabled
                    />
                </div>

                {/* Fecha Emision */}
                <div className="flex flex-col gap-1 col-span-4 md:col-span-2">
                    <div className='flex justify-between'>
                        <Label>Fecha de Pago:</Label>
                        <button
                            onClick={(e) => { e.preventDefault(); setShowCalculadora(!showCalculadora) }}
                            className='bg-purple-700 text-white p-1 rounded-md cursor-pointer'>
                            <Calculator />
                        </button>
                    </div>
                    <Calendar22 Dato={pagoActual} setDato={setPagoActual} tipo={"fecha_Pago"} />
                    {
                        pagoValida.fecha_Pago && (
                            <span className="text-red-500 text-sm">
                                Debes ingresar una fecha
                            </span>
                        )
                    }
                    {
                        showCalculadora && (
                            <div className="mt-2 flex items-center space-x-2">
                                <Input
                                    type="number"
                                    placeholder="Días"
                                    value={daysToAdd}
                                    onChange={(e) => setDaysToAdd(e.target.value)}
                                    className="w-24 border-1 border-gray-400"
                                />
                                <Button
                                    type="button"
                                    onClick={handleCalculateDate}
                                    className="bg-green-600 hover:bg-green-800 text-white"
                                >
                                    Aplicar
                                </Button>
                            </div>
                        )
                    }
                </div>

            </form>
            {/* 🔘 Botones de acción */}
            <div className="flex justify-end gap-3 border-t pt-4">
                <Button variant="outline" onClick={closeModal} className={"hover:bg-red-50 hover:text-red-600 border-2 border-gray-400"}>
                    Cancelar
                </Button>
                <Button
                    disabled={activeButton}
                    onClick={handleAgregar}
                    form="form-producto" className={"bg-blue-600 hover:bg-blue-800"}>
                    Guardar
                </Button>
            </div>
        </div>
    );
};

export default PagoForm;
