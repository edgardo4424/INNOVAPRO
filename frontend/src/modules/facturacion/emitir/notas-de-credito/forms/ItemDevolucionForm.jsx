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
import ModalListarItem from '../components/modal/ModalListarItem';
import { valorInicialProducto } from '../utils/valoresInicialNota';
import { useEffect, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
const ItemDevolucionForm = ({ closeModal }) => {
    const { notaCreditoDebito, setNotaCreditoDebito, itemActual, setItemActual } = useNota();
    const { detalle } = notaCreditoDebito;
    const [itemDevolucionForm, setItemDevolucionForm] = useState(valorInicialProducto);

    const handleInput = (e) => {
        const { name, value } = e.target;
        if (name === "cantidad" && !/^\d*\.?\d*$/.test(value)) return;
        if (name === "cantidad" && +value > itemActual?.cantidad) return;
        if (name === "monto_Valor_Unitario" && !/^\d*\.?\d*$/.test(value)) return;
        if (name === "monto_Valor_Unitario" && +value > itemActual?.monto_Valor_Unitario) return;
        setItemDevolucionForm(prev => ({
            ...prev,
            [name]: value,
        }));
    }

    const handleSave = () => {

        setItemActual(valorInicialProducto);
        closeModal();
    }


    const handleCancel = () => {
        setItemActual(valorInicialProducto);
        closeModal();
    }

    const handleEliminar = () => {
        setNotaCreditoDebito((prev) => ({
            ...prev,
            detalle: prev.detalle.filter((detalleItem) => detalleItem.id !== itemActual.id),
        }))
        setItemActual(valorInicialProducto);
        closeModal();
    }

    // Carga inicial del ítem
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
                        value={itemDevolucionForm.cantidad ?? ""}
                        onChange={handleInput}
                        className="border-1 border-gray-400"
                    />
                    {
                        itemActual.id > 0 &&
                        <span className='text-xs text-gray-500'>
                            La cantidad Limite: {itemActual.cantidad}
                        </span>
                    }
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
                        list="piezas-lista"
                    />
                    {
                        itemActual.id > 0 &&
                        <span className='text-xs text-gray-500'>
                            Monto Unitario Limite: {itemActual.monto_Valor_Unitario}
                        </span>
                    }
                </div>

                {/* IGV */}
                <div className='flex flex-col gap-1 col-span-full md:col-span-1 lg:col-span-1'>
                    <Label>IGV</Label>
                    <Input
                        type="number"
                        name="igv"
                        value={itemDevolucionForm.igv}
                        step="0.01"
                        // onChange={handleInputChange}
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

                {/* Precio Unitario */}
                <div className='flex flex-col gap-1 col-span-full md:col-span-2 lg:col-span-1'>
                    <Label>Precio Unitario</Label>
                    <Input
                        type="number"
                        name="monto_Precio_Unitario"
                        value={itemDevolucionForm.monto_Precio_Unitario}
                        step="0.01"
                        // onChange={handleInputChange}
                        className="border-1 border-gray-400"
                        disabled
                    />
                </div>
            </form>
            <div className="flex justify-end gap-3 border-t pt-4 mt-4 flex-wrap">
                {
                    notaCreditoDebito.detalle.some(detalleItem => detalleItem.id === itemActual.id) &&
                    <Button
                        variant="outline"
                        onClick={handleEliminar}
                        className={"cursor-pointer hover:bg-red-600 bg-red-400 hover:text-white text-white border-2 w-full md:w-auto"}> {/* Full width on small, auto on medium+ */}
                        Eliminar
                    </Button>
                }
                <Button variant="outline"
                    onClick={handleCancel}
                    className={"cursor-pointer hover:bg-red-50 hover:text-red-600 border-2 w-full md:w-auto"}>
                    Cancelar
                </Button>
                <Button
                    // The button is disabled if the corrected text is empty or only has spaces.
                    // disabled={isSaveDisabled}
                    onClick={handleSave}
                    form="form-producto" className={"cursor-pointer bg-blue-600 hover:bg-blue-800 w-full md:w-auto"}>
                    Guardar
                </Button>
            </div>
        </div>
    )
}

export default ItemDevolucionForm
