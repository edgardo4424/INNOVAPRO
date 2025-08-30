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
import ModalListaDeProductos from '@/modules/facturacion/components/modal/ModalListaDeProductos';
import { useGuiaTransporte } from '@/modules/facturacion/context/GuiaTransporteContext';
import { useState } from 'react';
import { detalleInicial } from '../utils/valoresIncialGuia';

const DetalleProductoForm = ({ closeModal }) => {
    const { productoActual, setProductoActual, guiaTransporte, setGuiaTransporte } = useGuiaTransporte();

    const { unidad, cantidad, cod_Producto, descripcion } = productoActual

    const [activeButton, setActiveButton] = useState(false);

    const handleSelectChange = (value, name) => {
        setProductoActual((prevValores) => ({
            ...prevValores,
            [name]: value,
        }));
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name == "cantidad") {
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

            setProductoActual({
                ...productoActual,
                [name]: valorNumerico,
            });
        }
        setProductoActual({
            ...productoActual,
            [name]: typeof value === 'string' ? value.toUpperCase() : value,
        });
    };

    const handleAgregar = async () => {
        if (productoActual.index !== null) {
            setGuiaTransporte((prevGuiaTransporte) => ({
                ...prevGuiaTransporte,
                detalle: prevGuiaTransporte.detalle.map((item, index) => {
                    if (index === productoActual.index) {
                        return {
                            ...item,
                            unidad: unidad,
                            cantidad: cantidad,
                            cod_Producto: cod_Producto,
                            descripcion: descripcion
                        };
                    }
                    return item;
                })
            }));
            setProductoActual(detalleInicial);
            closeModal();
        } else {
            setGuiaTransporte((prevGuiaTransporte) => ({
                ...prevGuiaTransporte,
                detalle: [...prevGuiaTransporte.detalle,
                {
                    unidad: unidad,
                    cantidad: cantidad,
                    cod_Producto: cod_Producto,
                    descripcion: descripcion
                }
                ]
            }));
            setProductoActual(detalleInicial);
            closeModal();
        }

    }

    const handleCancelar = () => {
        setProductoActual(detalleInicial);
        closeModal();
    }

    const handleEliminar = () => {
        setGuiaTransporte((prevGuiaTransporte) => ({
            ...prevGuiaTransporte,
            detalle: prevGuiaTransporte.detalle.filter((item, index) => index !== productoActual.index)
        }))
        closeModal();
    }



    return (
        <div className=" overflow-y-auto  col-span-4 w-full">
            <div className='w-full flex justify-end'>
                <ModalListaDeProductos
                    itemActual={productoActual}
                    setItemActual={setProductoActual}
                    formulario={null}
                    tipo="guia"
                />
            </div>
            <form
                action=""
                className="w-full  grid grid-cols-1 md:grid-cols-3 gap-x-2 gap-y-3 py-8 "
            >
                {/* Unidad */}
                <div className="flex flex-col gap-1  md:col-span-1">
                    <Label>Unidad de Medida</Label>
                    <Select
                        name="unidad"
                        onValueChange={(e) => {
                            handleSelectChange(e, "unidad");
                        }}
                        value={unidad || ""}
                    >
                        <SelectTrigger className="w-full border-1 border-gray-400">
                            <SelectValue placeholder="Selecciona una unidad" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="KGM">KGM - Kilogramos </SelectItem>
                            {/* <SelectItem value="TNE">TNE - Toneladas </SelectItem> */}
                            {/* <SelectItem value="GRM">GRM - Gramos </SelectItem> */}
                            {/* <SelectItem value="LBR">LBR - Libras </SelectItem> */}
                            {/* <SelectItem value="ONZ">ONZ - Onzas </SelectItem> */}
                        </SelectContent>
                    </Select>
                    {/* {
                        pagoValida.tipo && (
                            <span className="text-red-500 text-sm">
                                Debes seleccionar un metodo de pago
                            </span>
                        )
                    } */}
                </div>


                {/* Cantidad */}
                <div className="flex flex-col gap-1 md:col-span-1">
                    <Label>Cantidad</Label>
                    <Input
                        type="number"
                        name="cantidad"
                        placeholder="cantidad"
                        className={"border-1 border-gray-400"}
                        onwheel={(e) => e.target.blur()}
                        value={cantidad || ""}
                        onChange={handleInputChange}
                    />
                    {/* {
                        pagoValida.monto && (
                            <span className="text-red-500 text-sm">
                                Debes ingresar un monto
                            </span>
                        )
                    } */}
                </div>

                {/* Cod. Producto */}
                <div className="flex flex-col gap-1 md:col-span-1">
                    <Label>Cod. Del Producto</Label>
                    <Input
                        type="text"
                        name="cod_Producto"
                        placeholder="codigo del producto"
                        className={"border-1 border-gray-400"}
                        onwheel={(e) => e.target.blur()}
                        value={cod_Producto || ""}
                        onChange={handleInputChange}
                    />
                    {/* {
                        pagoValida.monto && (
                            <span className="text-red-500 text-sm">
                                Debes ingresar un monto
                            </span>
                        )
                    } */}
                </div>

                {/* Descripcion */}
                <div className="flex flex-col gap-1 col-span-1 md:col-span-3">
                    <Label>Descripción</Label>
                    <textarea
                        type="text"
                        name="descripcion"
                        value={descripcion}
                        onChange={handleInputChange}
                        className="border-1 border-gray-400  p-2 resize-none rounded-xl h-40"
                    />
                </div>
            </form>
            {/* 🔘 Botones de acción */}
            <div className="flex justify-end gap-3 border-t pt-4 mt-4 flex-wrap"> {/* Added flex-wrap for smaller screens */}
                {
                    productoActual?.index !== null &&
                    <Button variant="outline" onClick={handleEliminar} className={"cursor-pointer hover:bg-red-600 bg-red-400 hover:text-white text-white border-2 w-full md:w-auto"}> {/* Full width on small, auto on medium+ */}
                        Eliminar
                    </Button>
                }
                <Button variant="outline"
                    onClick={handleCancelar}
                    className={"cursor-pointer hover:bg-red-50 hover:text-red-600 border-2 w-full md:w-auto"}> {/* Full width on small, auto on medium+ */}
                    Cancelar
                </Button>
                <Button
                    disabled={activeButton}
                    onClick={handleAgregar}
                    form="form-producto" className={"cursor-pointer bg-blue-600 hover:bg-blue-800 w-full md:w-auto"}> {/* Full width on small, auto on medium+ */}
                    Guardar
                </Button>
            </div>

        </div>
    )
}

export default DetalleProductoForm
