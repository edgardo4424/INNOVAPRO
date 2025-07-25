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
import { useFacturacion } from '@/context/FacturacionContext';
import { useState } from 'react';
import ModalListaDeProductos from '../components/modal/ModalListaDeProductos';

const ProductoForm = ({ closeModal }) => {
    const { agregarProducto, productoActual, setProductoActual, validarCampos, productoValida } = useFacturacion();



    const handleInputChange = (e) => {
        const { name, value } = e.target;

        const cantidad = name === "cantidad" ? parseFloat(value) : parseFloat(productoActual.cantidad || 0);
        const valorUnitario = name === "monto_Valor_Unitario" ? parseFloat(value) : parseFloat(productoActual.monto_Valor_Unitario || 0);
        const tipAfeIgv = productoActual.tip_Afe_Igv || "10";

        let monto_Base_Igv = cantidad * valorUnitario;
        let igv = 0;
        let total_Impuestos = 0;
        let monto_Precio_Unitario = valorUnitario;
        let monto_Valor_Venta = valorUnitario * cantidad;

        if (tipAfeIgv === "10") {
            igv = +(monto_Base_Igv * 0.18).toFixed(2);
            total_Impuestos = igv;
            monto_Precio_Unitario = +(valorUnitario * 1.18).toFixed(2);
        }

        setProductoActual((prevValores) => ({
            ...prevValores,
            [name]: value,
            monto_Base_Igv,
            igv,
            total_Impuestos,
            monto_Precio_Unitario,
            monto_Valor_Venta,
            porcentaje_Igv: tipAfeIgv === "10" ? 18 : 0,
        }));
    };


    const handleSelectChange = (value, name) => {
        setProductoActual((prevValores) => ({
            ...prevValores,
            [name]: value,
        }));
    }


    const handleAgregar = async () => {
        const validar = await validarCampos("producto");
        if (validar === false) {
            return;
        }
        agregarProducto();

        setProductoActual({});
        closeModal();
    };


    return (
        <div className='max-h-[50dvh] min-h-[40dvh] overflow-y-auto  col-span-4 w-full'>
            <div className='w-full flex justify-end'>
                <ModalListaDeProductos />
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                }}

                className="w-full grid grid-cols-4 gap-x-2 gap-y-3 "
            >
                {/* Código de Producto */}
                <div className="flex flex-col gap-1 col-span-2 relative">
                    <Label>Código de Producto</Label>
                    <input
                        type="text"
                        placeholder="Ej: AM.0100 o Husillo"
                        name="cod_Producto"
                        value={productoActual.cod_Producto || ''}
                        onChange={handleInputChange}
                        list="piezas-lista"
                        className="border-1 border-gray-400 p-2 rounded"
                    />
                    <span
                        className={`text-red-500  text-sm ${productoValida.cod_Producto ? "block" : "hidden"
                            }`}
                    >
                        Debes ingresar el codigo del producto
                    </span>
                </div>

                {/* Unidad */}
                <div className='flex flex-col gap-1 col-span-2'>
                    <Label>Unidad</Label>
                    <Select
                        name="unidad"
                        value={productoActual.unidad}
                        onValueChange={(e) => handleSelectChange(e, "unidad")}
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
                    <span
                        className={`text-red-500  text-sm ${productoValida.unidad ? "block" : "hidden"
                            }`}
                    >
                        Debes ingresar la unidad del producto.
                    </span>
                </div>

                {/* Cantidad */}
                <div className='flex flex-col gap-1 col-span-1'>
                    <Label>Cantidad</Label>
                    <Input
                        type="number"
                        name="cantidad"
                        value={productoActual.cantidad}
                        onChange={handleInputChange}
                        className="border-1 border-gray-400"
                    />
                    <span
                        className={`text-red-500  text-sm ${productoValida.cantidad ? "block" : "hidden"
                            }`}
                    >
                        Debes ingresar la cantidad del producto
                    </span>
                </div>

                {/* Descripción */}
                <div className='flex flex-col gap-1 col-span-2'>
                    <Label>Descripción</Label>
                    <Input
                        type="text"
                        name="descripcion"
                        value={productoActual.descripcion}
                        onChange={handleInputChange}
                        className="border-1 border-gray-400"
                    />
                    <span
                        className={`text-red-500  text-sm ${productoValida.descripcion ? "block" : "hidden"
                            }`}
                    >
                        Debes ingresar la descripción del producto
                    </span>
                </div>

                {/* Valor Unitario */}
                <div className='flex flex-col gap-1 col-span-1'>
                    <Label>Valor Unitario</Label>
                    <Input
                        type="number"
                        name="monto_Valor_Unitario"
                        value={productoActual.monto_Valor_Unitario}
                        step="0.01"
                        onChange={handleInputChange}
                        className="border-1 border-gray-400"
                        list="piezas-lista"

                    />
                    <span
                        className={`text-red-500  text-sm ${productoValida.descripcion ? "block" : "hidden"
                            }`}
                    >
                        Debes ingresar el valor unitario
                    </span>
                </div>

                {/* Porcentaje IGV */}
                <div className='flex flex-col gap-1 col-span-1'>
                    <Label>% IGV</Label>
                    <Input
                        type="number"
                        name="porcentaje_Igv"
                        value={productoActual.porcentaje_Igv}
                        step="0.01"
                        onChange={handleInputChange}
                        className="border-1 border-gray-400"
                        disabled
                    />
                </div>

                {/* IGV */}
                <div className='flex flex-col gap-1 col-span-1'>
                    <Label>IGV</Label>
                    <Input
                        type="number"
                        name="igv"
                        value={productoActual.igv}
                        step="0.01"
                        onChange={handleInputChange}
                        className="border-1 border-gray-400"
                        disabled
                    />
                </div>

                {/* Base IGV */}
                <div className='flex flex-col gap-1 col-span-1'>
                    <Label>Base IGV</Label>
                    <Input
                        type="number"
                        name="monto_Base_Igv"
                        value={productoActual.monto_Base_Igv}
                        step="0.01"
                        onChange={handleInputChange}
                        className="border-1 border-gray-400"
                        disabled
                    />
                </div>

                {/* Tipo Afectación IGV */}
                <div className='flex flex-col gap-1 col-span-1'>
                    <Label>Tipo Afe. IGV</Label>
                    <Select
                        value={productoActual.tip_Afe_Igv}
                        onValueChange={(e) => handleSelectChange(e, "tip_Afe_Igv")}
                    >
                        <SelectTrigger className="w-full border-1 border-gray-400">
                            <SelectValue placeholder="Tipo Afectación IGV" />
                        </SelectTrigger>
                        <SelectContent>
                            {/* Gravado */}
                            <SelectItem value="10">10 - Gravado - Operación Onerosa</SelectItem>
                            <SelectItem value="11">11 - Retiro por premio</SelectItem>
                            <SelectItem value="12">12 - Retiro por donación</SelectItem>
                            <SelectItem value="13">13 - Retiro</SelectItem>
                            <SelectItem value="14">14 - Retiro por publicidad</SelectItem>
                            <SelectItem value="15">15 - Bonificaciones</SelectItem>
                            <SelectItem value="16">16 - Entrega a trabajadores</SelectItem>
                            <SelectItem value="17">17 - IVAP</SelectItem>

                            {/* Exonerado */}
                            <SelectItem value="20">20 - Exonerado - Operación Onerosa</SelectItem>
                            <SelectItem value="21">21 - Transferencia Gratuita</SelectItem>

                            {/* Inafecto */}
                            <SelectItem value="30">30 - Inafecto - Operación Onerosa</SelectItem>
                            <SelectItem value="31">31 - Retiro por Bonificación</SelectItem>
                            <SelectItem value="32">32 - Retiro</SelectItem>
                            <SelectItem value="33">33 - Muestras Médicas</SelectItem>
                            <SelectItem value="34">34 - Convenio Colectivo</SelectItem>
                            <SelectItem value="35">35 - Retiro por premio</SelectItem>
                            <SelectItem value="36">36 - Retiro por publicidad</SelectItem>

                            {/* Exportación */}
                            <SelectItem value="40">40 - Exportación</SelectItem>
                        </SelectContent>
                    </Select>
                    <span
                        className={`text-red-500  text-sm ${productoValida.tip_Afe_Igv ? "block" : "hidden"
                            }`}
                    >
                        Selecciona un Tipo Afe. IGV
                    </span>
                </div>

                {/* Total Impuestos */}
                <div className='flex flex-col gap-1 col-span-1'>
                    <Label>Total Impuestos</Label>
                    <Input
                        type="number"
                        name="total_Impuestos"
                        value={productoActual.total_Impuestos}
                        step="0.01"
                        onChange={handleInputChange}
                        className="border-1 border-gray-400"
                        disabled
                    />
                </div>

                {/* Precio Unitario */}
                <div className='flex flex-col gap-1 col-span-1'>
                    <Label>Precio Unitario</Label>
                    <Input
                        type="number"
                        name="monto_Precio_Unitario"
                        value={productoActual.monto_Precio_Unitario}
                        step="0.01"
                        onChange={handleInputChange}
                        className="border-1 border-gray-400"
                        disabled
                    />
                </div>

                {/* Valor de Venta */}
                <div className='flex flex-col gap-1 col-span-1'>
                    <Label>Valor de Venta</Label>
                    <Input
                        type="number"
                        name="monto_Valor_Venta"
                        value={productoActual.monto_Valor_Venta}
                        step="0.01"
                        onChange={handleInputChange}
                        className="border-1 border-gray-400"
                        disabled
                    />
                </div>

                {/* Factor ICBPER */}
                <div className='flex flex-col gap-1 col-span-1'>
                    <Label>Factor ICBPER</Label>
                    <Input
                        type="number"
                        name="factor_Icbper"
                        value={productoActual.factor_Icbper}
                        step="0.01"
                        onChange={handleInputChange}
                        className="border-1 border-gray-400"
                        disabled
                    />
                </div>
            </form>
            {/* 🔘 Botones de acción */}
            <div className="flex justify-end gap-3 border-t pt-4">
                <Button variant="outline" onClick={closeModal} className={"hover:bg-red-50 hover:text-red-600 border-2 border-gray-400"}>
                    Cancelar
                </Button>
                <Button
                    onClick={handleAgregar}
                    form="form-producto" className={"bg-blue-600 hover:bg-blue-800"}>
                    Guardar
                </Button>
            </div>
        </div>
    );
};

export default ProductoForm;
