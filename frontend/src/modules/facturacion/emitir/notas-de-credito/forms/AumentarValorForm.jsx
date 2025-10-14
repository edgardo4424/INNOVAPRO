import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { useNota } from "@/modules/facturacion/context/NotaContext";
import ModalListarItem from '../components/modal/ModalListarItem';
import { valorInicialProducto } from '../utils/valoresInicialNota';
import { useEffect, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';

const AumnetarValorForm = ({ closeModal }) => {
    const { notaCreditoDebito, setNotaCreditoDebito, itemActual, setItemActual } = useNota();
    const { detalle } = notaCreditoDebito;
    const [itemDevolucionForm, setItemDevolucionForm] = useState(valorInicialProducto);


    const handleInput = (e) => {
        const { name, value } = e.target;

        // La cantidad siempre será 1, por lo que solo necesitamos validar el valor unitario
        if (name === "monto_Valor_Unitario" && !/^\d*\.?\d*$/.test(value)) return;

        // Obtener valores para cálculos
        // La cantidad ahora siempre es la constante CANTIDAD_FIJA
        const cantidad = itemDevolucionForm.cantidad;
        const valorUnitario = name === "monto_Valor_Unitario" ? parseFloat(value || 0) : parseFloat(itemDevolucionForm.monto_Valor_Unitario || 0);

        // Usar el tip_Afe_Igv del item original (conservar la configuración fiscal)
        const tipAfeIgv = itemActual.tip_Afe_Igv || itemDevolucionForm.tip_Afe_Igv || "10";

        // Cálculos de impuestos basados en la nueva lógica
        let monto_Base_Igv = cantidad * valorUnitario;
        let igv = 0;
        let total_Impuestos = 0;
        let monto_Precio_Unitario = valorUnitario;
        let monto_Valor_Venta = cantidad * valorUnitario;

        // Aplicar cálculo según tipo de afectación IGV
        if (["10", "11", "12", "13", "14", "15", "16", "17"].includes(tipAfeIgv)) {
            // Operaciones gravadas con IGV (18%)
            igv = +(monto_Base_Igv * 0.18).toFixed(2);
            total_Impuestos = igv;
            monto_Precio_Unitario = +(valorUnitario * 1.18).toFixed(2);
        } else if (["20", "21", "30", "31", "32", "33", "34", "35", "36", "40"].includes(tipAfeIgv)) {
            // Operaciones exoneradas, inafectas o exportación (0% IGV)
            igv = 0;
            total_Impuestos = 0;
            monto_Precio_Unitario = valorUnitario;
        } else {
            // Caso por defecto: sin IGV
            igv = 0;
            total_Impuestos = 0;
            monto_Precio_Unitario = valorUnitario;
        }

        // Actualizar el estado con todos los valores calculados
        setItemDevolucionForm(prev => ({
            ...prev,
            [name]: value,
            cantidad: cantidad,
            monto_Base_Igv: +monto_Base_Igv.toFixed(2),
            igv,
            total_Impuestos,
            monto_Precio_Unitario,
            monto_Valor_Venta: +monto_Valor_Venta.toFixed(2),
            porcentaje_Igv: (["10", "11", "12", "13", "14", "15", "16", "17"].includes(tipAfeIgv)) ? 18 : 0,
        }));
    };

    // Recalcular cuando cambie el tipo de afectación IGV (si se permite cambiar)
    useEffect(() => {
        if (itemDevolucionForm.monto_Valor_Unitario) {
            handleInput({
                target: {
                    name: "monto_Valor_Unitario",
                    value: itemDevolucionForm.monto_Valor_Unitario
                }
            });
        }
    }, [itemDevolucionForm.tip_Afe_Igv]);

    const handleSave = () => {
        if (itemDevolucionForm.monto_Valor_Unitario <= 0 || itemDevolucionForm.cantidad <= 0) return;
        // La nueva lógica es crear una copia, no editar el original.
        const newItem = {
            ...itemDevolucionForm,
        };

        // Agregar el nuevo item a la lista de detalle
        setNotaCreditoDebito(prev => ({
            ...prev,
            detalle: [...prev.detalle, newItem]
        }));

        setItemActual(valorInicialProducto);
        closeModal();
    };

    const handleCancel = () => {
        setItemActual(valorInicialProducto);
        closeModal();
    };

    const handleEliminar = () => {
        setNotaCreditoDebito((prev) => ({
            ...prev,
            detalle: prev.detalle.filter((detalleItem) => detalleItem.id !== itemActual.id),
        }));
        setItemActual(valorInicialProducto);
        closeModal();
    };

    // Carga inicial del ítem, ajustando la cantidad a 1
    useEffect(() => {
        if (!itemActual || itemActual.id == null) return;

        setItemDevolucionForm(prev => ({
            ...prev,
            ...itemActual,
        }));
    }, [itemActual]);

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
                        value={itemDevolucionForm.cantidad}
                        onChange={handleInput}
                        className="border-1 border-gray-400"
                        step="0.01"
                        min="0"
                        disabled // Deshabilitar el input para evitar cambios
                    />
                </div>

                {/* Unidad */}
                <div className='flex flex-col gap-1 col-span-full md:col-span-1'>
                    <Label>Unidad</Label>
                    <Select value={itemDevolucionForm.unidad ?? ""} disabled>
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

                {/* Valor Unitario */}
                <div className='flex flex-col gap-1 col-span-full md:col-span-2 lg:col-span-1'>
                    <Label>Valor Unitario</Label>
                    <Input
                        type="number"
                        name="monto_Valor_Unitario"
                        value={itemDevolucionForm.monto_Valor_Unitario || ""}
                        step="0.01"
                        onChange={handleInput}
                        className="border-1 border-gray-400"
                        min="0"
                    />
                </div>

                {/* Porcentaje IGV */}
                <div className='flex flex-col gap-1 col-span-full md:col-span-1 lg:col-span-1'>
                    <Label>% IGV</Label>
                    <Input
                        type="number"
                        name="porcentaje_Igv"
                        value={itemDevolucionForm.porcentaje_Igv || 0}
                        step="0.01"
                        className="border-1 border-gray-400"
                        disabled
                    />
                </div>

                {/* IGV */}
                <div className='flex flex-col gap-1 col-span-full md:col-span-1 lg:col-span-1'>
                    <Label>IGV</Label>
                    <Input
                        type="number"
                        name="igv"
                        value={itemDevolucionForm.igv || 0}
                        step="0.01"
                        className="border-1 border-gray-400"
                        disabled
                    />
                </div>

                {/* Base IGV */}
                <div className='flex flex-col gap-1 col-span-full md:col-span-1 lg:col-span-1'>
                    <Label>Base IGV</Label>
                    <Input
                        type="number"
                        name="monto_Base_Igv"
                        value={itemDevolucionForm.monto_Base_Igv || 0}
                        step="0.01"
                        className="border-1 border-gray-400"
                        disabled
                    />
                </div>

                {/* Precio Unitario */}
                <div className='flex flex-col gap-1 col-span-full md:col-span-2 lg:col-span-1'>
                    <Label>Precio Unitario</Label>
                    <Input
                        type="number"
                        name="monto_Precio_Unitario"
                        value={itemDevolucionForm.monto_Precio_Unitario || 0}
                        step="0.01"
                        className="border-1 border-gray-400"
                        disabled
                    />
                </div>

                {/* Valor de Venta */}
                <div className='flex flex-col gap-1 col-span-full md:col-span-2 lg:col-span-1'>
                    <Label>Valor de Venta</Label>
                    <Input
                        type="number"
                        name="monto_Valor_Venta"
                        value={itemDevolucionForm.monto_Valor_Venta || 0}
                        step="0.01"
                        className="border-1 border-gray-400"
                        disabled
                    />
                </div>

                {/* Total Impuestos */}
                <div className='flex flex-col gap-1 col-span-full md:col-span-2 lg:col-span-1'>
                    <Label>Total Impuestos</Label>
                    <Input
                        type="number"
                        name="total_Impuestos"
                        value={itemDevolucionForm.total_Impuestos || 0}
                        step="0.01"
                        className="border-1 border-gray-400"
                        disabled
                    />
                </div>

                {/* Descripción */}
                <div className='flex flex-col gap-1 col-span-full md:col-span-2'>
                    <Label>Descripción</Label>
                    <Textarea
                        name="descripcion"
                        value={itemDevolucionForm.descripcion ?? ""}
                        disabled
                        className="border-1 border-gray-400 p-2 resize-none rounded-xl h-10"
                    />
                </div>
            </form>

            <div className="flex justify-end gap-3 border-t pt-4 mt-4 flex-wrap">
                {notaCreditoDebito.detalle.some(detalleItem => detalleItem.id === itemActual.id) && (
                    <Button
                        variant="outline"
                        onClick={handleEliminar}
                        className={"cursor-pointer hover:bg-red-600 bg-red-400 hover:text-white text-white border-2 w-full md:w-auto"}
                    >
                        Eliminar
                    </Button>
                )}

                <Button
                    variant="outline"
                    onClick={handleCancel}
                    className={"cursor-pointer hover:bg-red-50 hover:text-red-600 border-2 w-full md:w-auto"}
                >
                    Cancelar
                </Button>

                <Button
                    onClick={handleSave}
                    className={"cursor-pointer bg-blue-600 hover:bg-blue-800 w-full md:w-auto"}
                >
                    Guardar
                </Button>
            </div>
        </div>
    );
};

export default AumnetarValorForm;