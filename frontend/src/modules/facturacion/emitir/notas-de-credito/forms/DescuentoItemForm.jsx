import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useNota } from "@/modules/facturacion/context/NotaContext";
import ModalListarItem from "../components/modal/ModalListarItem"
import { useEffect, useMemo, useState } from "react";
import { valorIncialDescuentoItem } from "../utils/valoresInicialNota";
import { Textarea } from '@/components/ui/textarea';

const DescuentoItemForm = ({ closeModal }) => {
    const { notaCreditoDebito, setNotaCreditoDebito, itemActual, setItemActual } = useNota();
    const { detalle } = notaCreditoDebito;

    const [itemDescuentoForm, setItemDescuentoForm] = useState(valorIncialDescuentoItem);
    const [valorDescuento, setValorDescuento] = useState(""); // string para porcentaje
    const [montoDescuentoInput, setMontoDescuentoInput] = useState(""); // string para monto fijo
    const [tipoDescuento, setTipoDescuento] = useState("porcentaje"); // 'porcentaje' o 'monto'
    const [botonDisabled, setBotonDisabled] = useState(true);

    const toNum = (v, def = 0) => {
        const n = Number(v);
        return Number.isFinite(n) ? n : def;
    };

    const porcentajeIgv = useMemo(() => toNum(itemActual?.porcentaje_Igv, 0), [itemActual]);
    const afectacionGravada = useMemo(() => {
        const tip = String(itemActual?.tip_Afe_Igv ?? "10");
        return ["10", "11", "12", "13", "14", "15", "16", "17"].includes(tip);
    }, [itemActual]);

    // Recalcular totales al cambiar % o ítem
    useEffect(() => {
        if (!itemActual || itemActual.id == null) return;

        const cantidad = toNum(itemActual.cantidad, 0);
        const valorUnitarioOriginal = toNum(itemActual.monto_Valor_Unitario ?? itemActual.valor_Unitario, 0);
        const montoBaseDescuento = +(valorUnitarioOriginal * cantidad).toFixed(2);

        let factor = 0;
        let montoDescuentoCalculado = 0;

        // Lógica de cálculo según el tipo de descuento
        if (tipoDescuento === 'porcentaje') {
            const pct = Math.min(Math.max(toNum(valorDescuento, 0), 0), 99.99);
            factor = +(pct / 100).toFixed(4);
            montoDescuentoCalculado = +(montoBaseDescuento * factor).toFixed(2);
            setMontoDescuentoInput(String(montoDescuentoCalculado));
        } else { // 'monto'
            montoDescuentoCalculado = toNum(montoDescuentoInput, 0);
            if (montoBaseDescuento > 0) {
                factor = +(montoDescuentoCalculado / montoBaseDescuento).toFixed(4);
            }
            setValorDescuento(String(+(factor * 100).toFixed(2)));
        }

        const valorVenta = +(montoBaseDescuento - montoDescuentoCalculado).toFixed(2);
        const baseIgv = afectacionGravada ? valorVenta : 0;
        const igv = afectacionGravada ? +(baseIgv * (porcentajeIgv / 100)).toFixed(2) : 0;
        const valorUnitarioConDesc = cantidad > 0 ? +(valorVenta / cantidad).toFixed(2) : 0;
        const precioUnitarioUI = cantidad > 0 ? +((valorVenta + igv) / cantidad).toFixed(2) : 0;
        const precio_Unitario_Xml = +((valorUnitarioOriginal * (1 + porcentajeIgv / 100))).toFixed(2);

        // Actualiza estado del formulario
        setItemDescuentoForm(prev => ({
            ...prev,
            id: itemActual.id,
            cantidad,
            unidad: itemActual.unidad ?? prev.unidad,
            descripcion: itemActual.descripcion ?? prev.descripcion,
            monto_Valor_Unitario: valorUnitarioConDesc,
            porcentaje_Igv: porcentajeIgv,
            tip_Afe_Igv: itemActual.tip_Afe_Igv,
            precio_Unitario_Xml,
            Descuentos: [{
                codTipo: "00",
                Factor: factor,
                montoBase: montoBaseDescuento,
                Monto: montoDescuentoCalculado
            }],
            monto_Valor_Venta: valorVenta,
            monto_Base_Igv: baseIgv,
            igv,
            total_Impuestos: igv,
            monto_Precio_Unitario: precioUnitarioUI,
        }));

        setBotonDisabled(!(itemActual?.id != null && (factor > 0 || montoDescuentoCalculado > 0)));
    }, [valorDescuento, montoDescuentoInput, tipoDescuento, itemActual, porcentajeIgv, afectacionGravada]);

    // Carga inicial del ítem
    useEffect(() => {
        if (!itemActual || itemActual.id == null) return;
        setItemDescuentoForm(prev => ({
            ...prev,
            ...itemActual,
        }));
        const factorExistente = toNum(itemActual?.Descuentos?.[0]?.Factor, 0);
        if (factorExistente > 0) {
            setValorDescuento(String((factorExistente * 100).toFixed(2)));
            setMontoDescuentoInput(""); // Clear the other field
            setTipoDescuento('porcentaje');
        } else {
            setValorDescuento("");
            setMontoDescuentoInput(String(toNum(itemActual?.Descuentos?.[0]?.Monto, 0)));
            setTipoDescuento('monto');
        }
    }, [itemActual]);

    const onChangeDescuentoPorcentaje = (e) => {
        const raw = e.target.value;
        if (raw === "") { setValorDescuento(""); return; }
        if (!/^\d*\.?\d*$/.test(raw)) return;
        const n = Number(raw);
        if (!Number.isFinite(n) || n > 99.99) return;
        const fixed = Math.floor(n * 100) / 100;
        setValorDescuento(String(fixed));
    };

    const onChangeDescuentoMonto = (e) => {
        const raw = e.target.value;
        if (raw === "") { setMontoDescuentoInput(""); return; }
        if (!/^\d*\.?\d*$/.test(raw)) return;
        const n = Number(raw);
        const montoBase = toNum(itemActual?.cantidad, 0) * toNum(itemActual?.monto_Valor_Unitario, 0);
        if (!Number.isFinite(n) || n > montoBase) return;
        setMontoDescuentoInput(raw);
    };

    const handleSave = () => {
        setBotonDisabled(true);
        const existe = detalle.some((d) => d.id == itemActual.id);
        setNotaCreditoDebito(prev => ({
            ...prev,
            detalle: existe
                ? prev.detalle.map(d => d.id === itemActual.id ? { ...itemDescuentoForm } : d)
                : [...prev.detalle, { ...itemDescuentoForm }],
        }));
        setItemActual(valorIncialDescuentoItem);
        closeModal();
    };

    const handleEliminar = () => {
        setBotonDisabled(true);
        setNotaCreditoDebito(prev => ({
            ...prev,
            detalle: prev.detalle.filter(d => d.id !== itemActual.id),
        }));
        setItemActual(valorIncialDescuentoItem);
        closeModal();
    };

    const handleCancel = () => {
        setBotonDisabled(true);
        setItemActual(valorIncialDescuentoItem);
        closeModal();
    };

    return (
        <div>
            <div className='flex justify-end'>
                <ModalListarItem />
            </div>

            <form
                onSubmit={(e) => e.preventDefault()}
                className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-2 gap-y-3"
            >
                {/* Cantidad */}
                <div className='flex flex-col gap-1 col-span-full md:col-span-2 lg:col-span-1'>
                    <Label>Cantidad</Label>
                    <Input
                        type="number"
                        name="cantidad"
                        value={itemDescuentoForm.cantidad ?? ""}
                        disabled
                        className="border-1 border-gray-400"
                    />
                </div>

                {/* Unidad */}
                <div className='flex flex-col gap-1 col-span-full md:col-span-1'>
                    <Label>Unidad</Label>
                    <Select value={itemDescuentoForm.unidad ?? ""} disabled>
                        <SelectTrigger className="w-full border-1 border-gray-400">
                            <SelectValue placeholder="Unidad" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="NIU">NIU - Unidades</SelectItem>
                            <SelectItem value="ZZ">ZZ - Servicio</SelectItem>
                            <SelectItem value="GRM">GRM - Gramo</SelectItem>
                            <SelectItem value="KGM">KGM - Kilogramo</SelectItem>
                            <SelectItem value="LTR">LTR - Litro</SelectItem>
                            <SelectItem value="MTR">MTR - Metro</SelectItem>
                            <SelectItem value="DZ">DZ - Docena</SelectItem>
                            <SelectItem value="BX">BX - Caja</SelectItem>
                            <SelectItem value="MLT">MLT - Mililitro</SelectItem>
                            <SelectItem value="MMT">MMT - Milímetro</SelectItem>
                            <SelectItem value="MMK">MMK - Milímetro Cuadrado</SelectItem>
                            <SelectItem value="MMQ">MMQ - Milímetro Cúbico</SelectItem>
                            <SelectItem value="CMK">CMK - Centímetro Cuadrado</SelectItem>
                            <SelectItem value="CMQ">CMQ - Centímetro Cúbico</SelectItem>
                            <SelectItem value="CMT">CMT - Centímetro Lineal</SelectItem>
                            <SelectItem value="CEN">CEN - Ciento de Unidades</SelectItem>
                            <SelectItem value="LEF">LEF - Hoja</SelectItem>
                            <SelectItem value="HLT">HLT - Hectolitro</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Descripción */}
                <div className='flex flex-col gap-1 col-span-full md:col-span-2'>
                    <Label>Descripción</Label>
                    <Textarea
                        name="descripcion"
                        value={itemDescuentoForm.descripcion ?? ""}
                        disabled
                        className="border-1 border-gray-400 p-2 resize-none rounded-xl h-10"
                    />
                </div>

                {/* Tipo de Descuento (Select) */}
                <div className='flex flex-col gap-1 col-span-full md:col-span-1 lg:col-span-1'>
                    <Label>Tipo de Descuento</Label>
                    <Select value={tipoDescuento} onValueChange={setTipoDescuento}>
                        <SelectTrigger className="w-full border-1 border-gray-400">
                            <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="porcentaje">Porcentaje</SelectItem>
                            <SelectItem value="monto">Monto Fijo</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Porcentaje o Monto */}
                <div className='flex flex-col gap-1 col-span-full md:col-span-1 lg:col-span-1'>
                    <Label>
                        {tipoDescuento === 'porcentaje' ? 'Porcentaje a descontar (%)' : 'Monto a descontar (S/)'}
                    </Label>
                    {tipoDescuento === 'porcentaje' ? (
                        <Input
                            type="number"
                            inputMode="decimal"
                            name="porcentajeDescuento"
                            value={valorDescuento}
                            step="0.01"
                            min="0"
                            max="99.99"
                            onChange={onChangeDescuentoPorcentaje}
                            placeholder="0.00"
                            className="border-1 border-gray-400"
                        />
                    ) : (
                        <Input
                            type="number"
                            inputMode="decimal"
                            name="montoDescuento"
                            value={montoDescuentoInput}
                            step="0.01"
                            min="0"
                            onChange={onChangeDescuentoMonto}
                            placeholder="0.00"
                            className="border-1 border-gray-400"
                        />
                    )}
                </div>

                {/* IGV */}
                <div className='flex flex-col gap-1 col-span-full md:col-span-1 lg:col-span-1'>
                    <Label>IGV</Label>
                    <Input
                        type="number"
                        name="igv"
                        value={itemDescuentoForm.igv ?? 0}
                        step="0.01"
                        className="border-1 border-gray-400"
                        disabled
                    />
                </div>

                {/* Importe de Venta (base sin IGV, post-descuento) */}
                <div className='flex flex-col gap-1 col-span-full md:col-span-1 lg:col-span-1'>
                    <Label>Importe de Venta</Label>
                    <Input
                        type="number"
                        name="monto_Valor_Venta"
                        value={itemDescuentoForm.monto_Valor_Venta ?? 0}
                        step="0.01"
                        className="border-1 border-gray-400"
                        disabled
                    />
                </div>
            </form>

            <div className="flex justify-end gap-3 border-t pt-4 mt-4 flex-wrap">
                {notaCreditoDebito.detalle.some(det => det.id === itemActual.id) && (
                    <Button
                        variant="outline"
                        onClick={handleEliminar}
                        className="cursor-pointer hover:bg-red-600 bg-red-400 hover:text-white text-white border-2 w-full md:w-auto"
                    >
                        Eliminar
                    </Button>
                )}
                <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="cursor-pointer hover:bg-red-50 hover:text-red-600 border-2 w-full md:w-auto"
                >
                    Cancelar
                </Button>
                <Button
                    disabled={botonDisabled}
                    onClick={handleSave}
                    className="cursor-pointer bg-blue-600 hover:bg-blue-800 w-full md:w-auto"
                >
                    Guardar
                </Button>
            </div>
        </div>
    );
};

export default DescuentoItemForm;