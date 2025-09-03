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
import { Textarea } from '@/components/ui/textarea';
import { useNota } from '@/modules/facturacion/context/NotaContext';
import { useEffect, useState } from 'react';
import ModalListarItem from '../components/modal/ModalListarItem';
import { valorInicialProducto } from '../utils/valoresInicialNota';

const ItemCambioDescipcion = ({ closeModal }) => {

    const { notaCreditoDebito, setNotaCreditoDebito, documentoAAfectar, itemActual, setItemActual } = useNota();
    const [textoCorregido, setTextoCorregido] = useState(valorInicialProducto.descripcion);

    useEffect(() => {
        if (itemActual.id != 0) {
            const itemDetalle = notaCreditoDebito.detalle.find(detalleItem => detalleItem.id === itemActual.id);
            const { descripcion } = itemDetalle || {};
            const startIndex = descripcion.indexOf('DEBE DECIR:') + 'DEBE DECIR:'.length;
            const endIndex = descripcion.indexOf('.', startIndex);
            const textoCorregidoDesdeDescripcion = endIndex === -1
                ? descripcion.substring(startIndex)
                : descripcion.substring(startIndex, endIndex);
            setTextoCorregido(textoCorregidoDesdeDescripcion);
        }
    }, []);

    const { detalle } = notaCreditoDebito;


    const handleInputChange = (e) => {
        const { value } = e.target;
        setTextoCorregido(value.toUpperCase());
    }

    // New validation check
    const isSaveDisabled = textoCorregido.trim() === '';

    const handleSave = () => {
        const itemYaExisteEnDetalle = detalle.some((detalleItem) => detalleItem.id == itemActual.id);

        if (itemYaExisteEnDetalle) {
            const itemDetalleDeDocumentoAAfectar = documentoAAfectar.detalle.find(detalleItem => detalleItem.id === itemActual.id);
            const { descripcion: descripcionDeDocumentoAAfectar } = itemDetalleDeDocumentoAAfectar || {};
            setNotaCreditoDebito((prev) => ({
                ...prev,
                detalle: detalle.map((detalleItem) => {
                    if (detalleItem.id === itemActual.id) {
                        return {
                            ...detalleItem,
                            descripcion: `DICE:${descripcionDeDocumentoAAfectar} DEBE DECIR:${textoCorregido}`,
                        };
                    }
                    return detalleItem;
                }),
            }));
        } else {
            setNotaCreditoDebito((prev) => ({
                ...prev,
                detalle: [
                    ...prev.detalle,
                    {
                        ...itemActual,
                        descripcion: `DICE:${itemActual.descripcion} DEBE DECIR:${textoCorregido}`,
                    }
                ],
            }));
        }
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

    return (
        <div>
            <div className='flex justify-end'>
                <ModalListarItem />
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                }}
                // Default to 1 column on small screens, 2 on medium, 4 on large
                className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-2 gap-y-3"
            >
                {/* Código de Producto */}
                <div className="flex flex-col gap-1 col-span-full md:col-span-1 relative">
                    <Label>Código de Producto</Label>
                    <Input
                        type="text"
                        placeholder="Ej: AM.0100 o Husillo"
                        name="cod_Producto"
                        value={itemActual.cod_Producto}
                        list="piezas-lista"
                        className="border-1 border-gray-400 p-2 rounded"
                        disabled
                    />
                </div>

                {/* Unidad */}
                <div className='flex flex-col gap-1 col-span-full md:col-span-1'>
                    <Label>Unidad</Label>
                    <Select
                        name="unidad"
                        value={itemActual.unidad}
                        // This function is not defined in the provided code, but the select is disabled anyway.
                        // onValueChange={(e) => handleSelectChange(e, "unidad")} 
                        disabled
                    >
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

                {/* Cantidad */}
                <div className='flex flex-col gap-1 col-span-full md:col-span-2 lg:col-span-1'>
                    <Label>Cantidad</Label>
                    <Input
                        type="number"
                        name="cantidad"
                        value={itemActual.cantidad || ""}
                        className="border-1 border-gray-400"
                        disabled
                    />
                </div>

                {/* Valor Unitario */}
                <div className='flex flex-col gap-1 col-span-full md:col-span-2 lg:col-span-1'>
                    <Label>Valor Unitario</Label>
                    <Input
                        type="number"
                        name="monto_Valor_Unitario"
                        value={itemActual.monto_Valor_Unitario || ""}
                        step="0.01"
                        className="border-1 border-gray-400"
                        list="piezas-lista"
                        disabled
                    />
                </div>

                {/* Descripción */}
                <div className='flex flex-col gap-1 col-span-full md:col-span-2'>
                    <Label>Primera Descripción</Label>
                    <Textarea
                        type="text"
                        name="descripcion"
                        value={itemActual.descripcion}
                        disabled
                        className="border-1 border-gray-400 p-2 resize-none rounded-xl h-40"
                    />
                </div>

                {/* Descripción */}
                <div className='flex flex-col gap-1 col-span-full md:col-span-2'>
                    <Label>Corrección</Label>
                    <Textarea
                        type="text"
                        name="descripcion"
                        value={textoCorregido}
                        onChange={handleInputChange}
                        className="border-1 border-gray-400 p-2 resize-none rounded-xl h-40"
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
                    disabled={isSaveDisabled}
                    onClick={handleSave}
                    form="form-producto" className={"cursor-pointer bg-blue-600 hover:bg-blue-800 w-full md:w-auto"}>
                    Guardar
                </Button>
            </div>
        </div>
    )
}

export default ItemCambioDescipcion
