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
import { Calendar22 } from "../components/Calendar22";
import { validarModal } from '../utils/validarModal';
import { PagoValidarEstados, valorIncialPago } from '../utils/valoresInicial';

const PagoForm = ({ closeModal }) => {
    const { factura, setFactura, pagoActual, pagoValida, setPagoActual, validarCampos, setPagoValida } = useFacturaBoleta();

    const { forma_pago: ListaDePago } = factura;

    const montoTotalPagos = ListaDePago.reduce(
        (total, pago) => total + (parseFloat(pago.monto) || 0),
        0
    );

    let montoRestante = (factura.monto_Imp_Venta - montoTotalPagos).toFixed(2);

    const [activeButton, setActiveButton] = useState(false);
    const [montoActivo, setMontoActivo] = useState(false);
    const [numeroCuotas, setNumeroCuotas] = useState(1);
    const [cuotasGeneradas, setCuotasGeneradas] = useState([]);

    // ?? Datos para calculadora
    const [showCalculadora, setShowCalculadora] = useState(false);
    const [daysToAdd, setDaysToAdd] = useState("");

    const montoTotalFactura = parseFloat(factura.monto_Imp_Venta || 0);
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

        const montoTotalDisponible = parseFloat(montoRestante);
        const montoPorCuota = (montoTotalDisponible / numCuotas).toFixed(2);
        const cuotas = [];

        for (let i = 0; i < numCuotas; i++) {
            let monto = parseFloat(montoPorCuota);

            // Ajustar la última cuota para compensar redondeos
            if (i === numCuotas - 1) {
                const sumaAnteriores = cuotas.reduce((sum, c) => sum + c.monto, 0);
                monto = montoTotalDisponible - sumaAnteriores;
            }

            cuotas.push({
                tipo: "CREDITO",
                monto: monto,
                cuota: ListaDePago.length + i + 1,
                fecha_Pago: getEndOfMonth(i)
            });
        }

        return cuotas;
    };

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

    // Manejar cambio en número de cuotas
    const handleCuotasChange = (e) => {
        const value = e.target.value;
        const numCuotas = parseInt(value);

        if (value === "" || isNaN(numCuotas) || numCuotas < 1) {
            setNumeroCuotas(""); // Asigna una cadena vacía para que el input se muestre vacío
            setCuotasGeneradas([]); // Limpia las cuotas
        } else {
            setNumeroCuotas(numCuotas);
            if (pagoActual.tipo === "CREDITO") {
                const nuevasCuotas = generarCuotas(numCuotas, parseFloat(pagoActual.monto.toFixed(2)));
                const nuevasCuotasConDosDecimales = nuevasCuotas.map(cuota => ({
                    ...cuota,
                    monto: parseFloat(cuota.monto.toFixed(2))
                }));
                console.log(nuevasCuotasConDosDecimales)
                setCuotasGeneradas(nuevasCuotasConDosDecimales);
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

        setPagoActual(prev => ({
            ...prev,
            fecha_Pago: fechaPagoISO,
        }));

        setShowCalculadora(false);
        setDaysToAdd("");
    };

    const handleSelectChange = (value, name) => {
        setPagoActual((prevValores) => ({
            ...prevValores,
            [name]: value,
        }));
    };

    const handleAgregar = async () => {
        let validar;

        if (pagoActual.tipo === "CONTADO") {
            // Validar pago CONTADO
            validar = await validarModal("pago", pagoActual, factura);
        } else if (pagoActual.tipo === "CREDITO") {
            // Validar pago CREDITO con cuotas generadas
            if (cuotasGeneradas.length === 0) {
                toast.error("Debe generar al menos una cuota", { position: "top-right" });
                return;
            }

            validar = await validarModal("pago", pagoActual, factura, cuotasGeneradas);
        } else {
            validar = await validarModal("pago", pagoActual, factura);
        }

        if (!validar.validos) {
            if (validar.message) {
                toast.error(validar.message, { position: "top-right" });
            }
            setPagoValida(validar.errores);
            return;
        }


        if (pagoActual.tipo === "CONTADO") {
            // Lógica para CONTADO (sin cambios)
            if (pagoActual.monto > montoRestante) {
                toast.error("El monto de la cuota no puede ser mayor al monto restante", { position: "top-right" });
                return;
            }

            setFactura((prevFactura) => ({
                ...prevFactura,
                forma_pago: [
                    ...prevFactura.forma_pago,
                    {
                        ...pagoActual,
                    }
                ],
            }));

            setPagoActual(valorIncialPago);
        } else if (pagoActual.tipo === "CREDITO") {
            // Lógica para CREDITO con cuotas múltiples
            if (cuotasGeneradas.length === 0) {
                toast.error("Debe generar al menos una cuota", { position: "top-right" });
                return;
            }

            // Validar que todas las cuotas tengan fecha
            const cuotasSinFecha = cuotasGeneradas.some(cuota => !cuota.fecha_Pago);
            if (cuotasSinFecha) {
                toast.error("Todas las cuotas deben tener fecha de pago", { position: "top-right" });
                return;
            }

            // Agregar todas las cuotas a la factura
            setFactura((prevFactura) => ({
                ...prevFactura,
                forma_pago: [
                    ...prevFactura.forma_pago,
                    ...cuotasGeneradas
                ],
            }));

            // Limpiar formulario
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
        if (pagoActual.tipo === "CREDITO") {
            setMontoActivo(true); // Deshabilitar monto manual para crédito
            setCuotasGeneradas([]);
            setNumeroCuotas(""); // Muestra vacío al cambiar a crédito
        } else {
            setMontoActivo(false);
            setPagoActual(prev => ({
                ...prev,
                cuota: 0,
                monto: parseFloat(montoRestante)
            }));
            setCuotasGeneradas([]);
        }
    }, [pagoActual.tipo, montoRestante]);

    return (
        <div className="overflow-y-auto col-span-4 w-full">
            <form
                action=""
                className="w-full grid grid-cols-4 gap-x-2 gap-y-3 py-8"
            >
                {/* Método de pago */}
                <div className="flex flex-col gap-1 col-span-4 md:col-span-2">
                    <Label>Método de pago</Label>
                    <Select
                        name="tipo"
                        onValueChange={(e) => {
                            handleSelectChange(e, "tipo");
                        }}
                        value={pagoActual.tipo || ""}
                    >
                        <SelectTrigger className="w-full border-1 border-gray-400">
                            <SelectValue placeholder="Selecciona un tipo" />
                        </SelectTrigger>
                        <SelectContent>
                            {!factura.forma_pago.some(item => item.tipo === "CONTADO") && (
                                <SelectItem value="CONTADO">CONTADO</SelectItem>
                            )}
                            <SelectItem value="CREDITO">CREDITO</SelectItem>
                        </SelectContent>
                    </Select>
                    {pagoValida.tipo && (
                        <span className="text-red-500 text-sm">
                            Debes seleccionar un método de pago
                        </span>
                    )}
                </div>

                {/* Número de cuotas (solo para CREDITO) */}
                {pagoActual.tipo === "CREDITO" && (
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

                {/* Monto (solo para CONTADO) */}
                {pagoActual.tipo === "CONTADO" && (
                    <div className="flex flex-col gap-1 col-span-4 md:col-span-2">
                        <Label>Monto a pagar</Label>
                        <Input
                            type="number"
                            name="monto"
                            placeholder="Monto"
                            className="border-1 border-gray-400"
                            onWheel={(e) => e.target.blur()}
                            value={pagoActual.monto}
                            onChange={handleInputChange}
                            disabled={montoActivo}
                        />
                        <p className="text-sm pl-4 text-gray-600">
                            Monto Restante: {factura.tipo_Moneda} {montoRestante}
                        </p>
                        {pagoValida.monto && (
                            <span className="text-red-500 text-sm">
                                Debes ingresar un monto
                            </span>
                        )}
                    </div>
                )}

                {/* Fecha de Pago (solo para CONTADO) */}
                {pagoActual.tipo === "CONTADO" && (
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
                        {pagoValida.fecha_Pago && (
                            <span className="text-red-500 text-sm">
                                Debes ingresar una fecha
                            </span>
                        )}
                        {showCalculadora && (
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
                        )}
                    </div>
                )}
            </form>

            {/* Vista previa de cuotas generadas */}
            {pagoActual.tipo === "CREDITO" && cuotasGeneradas.length > 0 && (
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
                                    <Calendar22
                                        Dato={{ fecha_Pago: cuota.fecha_Pago }}
                                        setDato={(newData) => {
                                            actualizarFechaCuota(index, newData.fecha_Pago);
                                        }}
                                        tipo="fecha_Pago"
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