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
import { Calculator } from 'lucide-react';
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Calendar24 } from '../../notas-de-credito/components/calendar24';
import { Calendar22 } from "../components/Calendar22";
import { validarModal } from '../utils/validarModal';
import { PagoValidarEstados, valorIncialPago } from '../utils/valoresInicial';

const PagoForm = ({ closeModal }) => {
    const { factura, setFactura, pagoActual, pagoValida, setPagoActual, retencionActivado, retencion, detraccion, setPagoValida } = useFacturaBoleta();

    const { forma_pago: ListaDePago } = factura;

    const montoTotalPagos = ListaDePago.reduce(
        (total, pago) => total + (parseFloat(pago.monto) || 0),
        0
    );

    let montoRestante = parseFloat(
        (retencionActivado
            ? factura.monto_Imp_Venta - retencion.descuento_monto
            : factura.tipo_Operacion == "1001" && !retencionActivado
                ? factura.monto_Imp_Venta - detraccion.detraccion_mount
                : factura.monto_Imp_Venta
        ).toFixed(2)
    );

    const [activeButton, setActiveButton] = useState(false);
    const [montoActivo, setMontoActivo] = useState(false);
    const [numeroCuotas, setNumeroCuotas] = useState(1);
    const [cuotasGeneradas, setCuotasGeneradas] = useState([]);

    // ?? Datos para calculadora
    const [showCalculadora, setShowCalculadora] = useState(false);
    const [daysToAdd, setDaysToAdd] = useState("");

    const montoTotalFactura = montoRestante.toFixed(2);
    const pagosCompletos = montoTotalPagos >= montoTotalFactura;

    // Función para generar fecha de fin de mes
    const getEndOfMonth = (monthsToAdd) => {
        const now = new Date();
        const target = new Date(now.getFullYear(), now.getMonth() + monthsToAdd + 1, 0); // Último día del mes

        const ymdPeru = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'America/Lima',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(target);

        return `${ymdPeru}T00:00:00-05:00`;
    };

    // Función para generar las cuotas automáticamente
    const generarCuotas = (numCuotas) => {
        if (numCuotas <= 0 || !factura.monto_Imp_Venta) return [];

        const montoTotalDisponible = parseFloat(montoRestante).toFixed(2);
        const montoPorCuota = (montoTotalDisponible / numCuotas).toFixed(2);
        const cuotas = [];

        for (let i = 0; i < numCuotas; i++) {
            let monto = parseFloat(montoPorCuota);

            // Ajustar la última cuota para compensar redondeos
            if (i === numCuotas - 1) {
                const sumaAnteriores = cuotas.reduce((sum, c) => sum + parseFloat(c.monto), 0);
                monto = parseFloat((montoTotalDisponible - sumaAnteriores).toFixed(2));
            }

            cuotas.push({
                tipo: "Credito",
                monto: monto,
                cuota: ListaDePago.length + i + 1,
                fecha_Pago: getEndOfMonth(i)
            });
        }

        return cuotas;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        const pago = pagoActual[0]; // Acceder al primer objeto del array

        // Permitir que el campo quede vacío sin bloquearlo
        if (value === "") {
            setPagoActual([{
                ...pago,
                [name]: value,
            }]);
            return;
        }

        const valorNumerico = parseFloat(value);

        // Validación: No permitir negativos ni NaN
        if (isNaN(valorNumerico) || valorNumerico < 0) {
            return;
        }

        // Validar solo si es el campo 'monto'
        if (name === "monto") {
            const previo = parseFloat(pago.monto) || 0;
            const sumaReal = montoTotalPagos - previo + valorNumerico;

            if (sumaReal > montoTotalFactura) {
                return;
            }
        }

        // Modificar el primer objeto del array
        const updatedPago = { ...pago, [name]: valorNumerico };
        setPagoActual([updatedPago]);
    };

    // Manejar cambio en número de cuotas
    const handleCuotasChange = (e) => {
        const value = e.target.value;
        const numCuotas = parseInt(value);

        if (value === "" || isNaN(numCuotas) || numCuotas < 1) {
            setNumeroCuotas("");
            setCuotasGeneradas([]);
        } else {
            setNumeroCuotas(numCuotas);
            if (pagoActual[0].tipo === "Credito") {
                const nuevasCuotas = generarCuotas(numCuotas);
                setCuotasGeneradas(nuevasCuotas);
            }
        }
    };

    // Actualizar fecha de una cuota específica
    const actualizarFechaCuota = (index, nuevaFecha) => {
        const cuotasActualizadas = [...cuotasGeneradas];
        cuotasActualizadas[index] = {
            ...cuotasActualizadas[index],
            fecha_Pago: nuevaFecha
        };
        setCuotasGeneradas(cuotasActualizadas);
    };

    // Función para calcular la nueva fecha al añadir días
    const handleCalculateDate = () => {
        const days = parseInt(daysToAdd, 10);
        if (isNaN(days)) {
            toast.error("Por favor, ingresa un número válido de días.", { position: "top-right" });
            return;
        }

        const now = new Date();
        const target = new Date(now);
        target.setDate(now.getDate() + (days - 1));

        const ymdPeru = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'America/Lima',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(target);

        const fechaPagoISO = `${ymdPeru}T00:00:00-05:00`;

        setPagoActual(prev => {
            const newPago = { ...prev[0], fecha_Pago: fechaPagoISO };
            return [newPago];
        });

        setShowCalculadora(false);
        setDaysToAdd("");
    };

    const handleSelectChange = (value, name) => {
        setPagoActual((prevValores) => {
            const newPago = { ...prevValores[0], [name]: value };
            return [newPago];
        });
    };

    const handleAgregar = async () => {
        let validar;

        const pago = pagoActual[0]; // Acceder al primer objeto

        if (pago.tipo === "Contado") {
            validar = await validarModal("pago", pago, factura, cuotasGeneradas);
        } else if (pago.tipo === "Credito") {
            if (cuotasGeneradas.length === 0) {
                toast.error("Debe generar al menos una cuota", { position: "top-right" });
                return;
            }
            validar = await validarModal("pago", pago, factura, cuotasGeneradas);
        } else {
            validar = await validarModal("pago", pago, factura);
        }

        if (!validar.validos) {
            if (validar.message) {
                toast.error(validar.message, { position: "top-right" });
            }
            setPagoValida(validar.errores);
            return;
        }

        if (pago.tipo === "Contado") {
            if (pago.monto > montoRestante) {
                toast.error("El monto de la cuota no puede ser mayor al monto restante", { position: "top-right" });
                return;
            }

            setFactura((prevFactura) => ({
                ...prevFactura,
                forma_pago: [
                    ...prevFactura.forma_pago,
                    pago // Se agrega el objeto, no un array
                ],
            }));
            setPagoActual(valorIncialPago);
        } else if (pago.tipo === "Credito") {
            if (cuotasGeneradas.length === 0) {
                toast.error("Debe generar al menos una cuota", { position: "top-right" });
                return;
            }

            const cuotasSinFecha = cuotasGeneradas.some(cuota => !cuota.fecha_Pago);
            if (cuotasSinFecha) {
                toast.error("Todas las cuotas deben tener fecha de pago", { position: "top-right" });
                return;
            }

            setFactura((prevFactura) => ({
                ...prevFactura,
                forma_pago: [
                    ...prevFactura.forma_pago,
                    ...cuotasGeneradas
                ],
            }));

            setPagoActual(valorIncialPago);
            setCuotasGeneradas([]);
            setNumeroCuotas(1);
        }
        closeModal();
    };

    useEffect(() => {
        setActiveButton(false);
        setPagoValida(PagoValidarEstados);
    }, []);

    useEffect(() => {
        if (pagoActual[0].tipo === "Credito") {
            setMontoActivo(true);
            setCuotasGeneradas([]);
            setNumeroCuotas("");
        } else {
            setMontoActivo(false);
            setPagoActual(prev => [{
                ...prev[0],
                cuota: 0,
                monto: parseFloat(montoRestante)
            }]);
            setCuotasGeneradas([]);
        }
    }, [pagoActual[0].tipo, montoRestante]);

    return (
        <div className="overflow-y-auto col-span-4 w-full">
            <form
                action=""
                className="w-full grid grid-cols-4 gap-x-2 gap-y-3 py-8"
            >
                {/* ... (el resto del JSX es el mismo) ... */}
                {/* Método de pago */}
                <div className="flex flex-col gap-1 col-span-4 md:col-span-2">
                    <Label>Método de pago</Label>
                    <Select
                        name="tipo"
                        onValueChange={(e) => {
                            handleSelectChange(e, "tipo");
                        }}
                        value={pagoActual[0].tipo || ""}
                    >
                        <SelectTrigger className="w-full border-1 border-gray-400">
                            <SelectValue placeholder="Selecciona un tipo" />
                        </SelectTrigger>
                        <SelectContent>
                            {!factura.forma_pago.some(item => item.tipo === "Contado") && (
                                <SelectItem value="Contado">Contado</SelectItem>
                            )}
                            <SelectItem value="Credito">Credito</SelectItem>
                        </SelectContent>
                    </Select>
                    {pagoValida.tipo && (
                        <span className="text-red-500 text-sm">
                            Debes seleccionar un método de pago
                        </span>
                    )}
                </div>

                {/* Número de cuotas (solo para Credito) */}
                {pagoActual[0].tipo === "Credito" && (
                    <div className="flex flex-col gap-1 col-span-4 md:col-span-2">
                        <Label>Número de cuotas</Label>
                        <Input
                            type="number"
                            placeholder="Número de cuotas"
                            className="border-1 border-gray-400"
                            value={numeroCuotas}
                            onChange={handleCuotasChange}
                            min="1"
                        />
                    </div>
                )}

                {/* Monto (solo para Contado) */}
                {pagoActual[0].tipo === "Contado" && (
                    <div className="flex flex-col gap-1 col-span-4 md:col-span-2">
                        <Label>Monto a pagar</Label>
                        <Input
                            type="number"
                            name="monto"
                            placeholder="Monto"
                            className="border-1 border-gray-400"
                            onWheel={(e) => e.target.blur()}
                            value={pagoActual[0].monto}
                            onChange={handleInputChange}
                            disabled
                        />
                        {/* <p className="text-sm pl-4 text-gray-600">
                            Monto Restante: {factura.tipo_Moneda} {montoRestante}
                        </p> */}
                        {pagoValida.monto && (
                            <span className="text-red-500 text-sm">
                                Debes ingresar un monto
                            </span>
                        )}
                    </div>
                )}

                {/* Fecha de Pago (solo para Contado) */}
                {pagoActual[0].tipo === "Contado" && (
                    <div className="flex flex-col gap-1 col-span-4 md:col-span-2">
                        <Label>Fecha de Pago:</Label>
                        <Input
                            type="date"
                            name="fecha_Pago"
                            className="border-1 border-gray-400"
                            value={pagoActual[0].fecha_Pago?.split('T')[0]}
                            disabled
                        />
                    </div>
                )}
            </form>

            {/* Vista previa de cuotas generadas */}
            {pagoActual[0].tipo === "Credito" && cuotasGeneradas.length > 0 && (
                <div className="mt-4 border rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3">Cuotas Generadas:</h3>
                    <div className="space-y-3 overflow-y-auto max-h-[300px]">
                        {cuotasGeneradas.map((cuota, index) => (
                            <div key={index} className="grid grid-cols-3 gap-3 p-3 bg-gray-50 rounded">
                                <div>
                                    <Label className="text-sm">Cuota {cuota.cuota}</Label>
                                    <p className="text-sm font-medium">
                                        {factura.tipo_Moneda} {cuota.monto.toFixed(2)}
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <Label className="text-sm">Fecha de Pago:</Label>
                                    <Calendar24
                                        initialDate={cuota.fecha_Pago}
                                        setDato={(newData) => {
                                            actualizarFechaCuota(index, newData.fecha_Pago);
                                        }}
                                        tipo="fecha_Pago" // `tipo` ya no es tan crítico, pero se mantiene por convención
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-3 pt-3 border-t">
                        <p className="text-sm text-gray-600">
                            Total: {factura.tipo_Moneda} {cuotasGeneradas.reduce((sum, c) => sum + c.monto, 0).toFixed(2)}
                        </p>
                    </div>
                </div>
            )}

            {/* Botones de acción */}
            <div className="flex justify-end gap-3 border-t pt-4">
                <Button
                    variant="outline"
                    onClick={closeModal}
                    className="hover:bg-red-50 hover:text-red-600 border-2 border-gray-400 cursor-pointer"
                >
                    Cancelar
                </Button>
                <Button
                    disabled={activeButton}
                    onClick={handleAgregar}
                    className="bg-blue-600 hover:bg-blue-800 cursor-pointer"
                >
                    Guardar
                </Button>
            </div>
        </div>
    );
};

export default PagoForm;