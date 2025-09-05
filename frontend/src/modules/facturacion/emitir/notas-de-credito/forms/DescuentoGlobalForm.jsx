import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNota } from '@/modules/facturacion/context/NotaContext';
import { useEffect, useState } from 'react';
import { valorIncialDescuentoGlobal } from '../utils/valoresInicialNota';
import { Button } from '@/components/ui/button';

const DescuentoGlobalForm = ({ closeModal }) => {
    const { notaCreditoDebito, setNotaCreditoDebito, documentoAAfectar } = useNota();

    const [descuentoGlobalForm, setDescuentoGlobalForm] = useState(valorIncialDescuentoGlobal);


    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Mantén el string para permitir borrar / escribir "0." etc.
        let validatedValue = value;

        // Límite estricto para el valor unitario
        const limite = Number(documentoAAfectar?.valor_Venta ?? 0);

        if (name === "monto_Valor_Unitario") {
            // Permite vacío (borrar el campo)
            if (value === "") {
                validatedValue = "";
            } else {
                const next = Number(value);
                // Si no es número, negativo, o NO es estrictamente menor al límite, NO actualizamos estado
                if (isNaN(next) || next < 0 || next >= limite) {
                    return; // <- bloquea tecleo/paste que iguale o supere el límite (incluye "un decimal más")
                }
                validatedValue = next;
            }
        } else if (name === "cantidad") {
            const next = Number(value);
            if (isNaN(next) || next < 0) return; // ignora entradas inválidas
            validatedValue = next;
        }

        // Valores actuales (si el cambio fue en otro campo, usa lo que ya está en el form)
        const cantidadNum =
            name === "cantidad"
                ? Number(validatedValue) || 0
                : Number(descuentoGlobalForm.cantidad) || 0;

        const valorUnitarioNum =
            name === "monto_Valor_Unitario"
                ? Number(validatedValue) || 0
                : Number(descuentoGlobalForm.monto_Valor_Unitario) || 0;

        const tipAfeIgv = descuentoGlobalForm.tip_Afe_Igv || "10";

        let monto_Base_Igv = valorUnitarioNum;
        let igv = 0;
        let total_Impuestos = 0;
        let monto_Precio_Unitario = valorUnitarioNum;
        let monto_Valor_Venta = cantidadNum * valorUnitarioNum;

        if (["10"].includes(tipAfeIgv)) {
            igv = +(monto_Base_Igv * 0.18).toFixed(2);
            total_Impuestos = igv;
            monto_Precio_Unitario = +(valorUnitarioNum * 1.18).toFixed(2);
        }

        setDescuentoGlobalForm((prev) => ({
            ...prev,
            [name]: typeof validatedValue === "string" ? validatedValue.toUpperCase?.() ?? validatedValue : validatedValue,
            monto_Base_Igv: +monto_Base_Igv.toFixed(2),
            igv,
            total_Impuestos,
            monto_Precio_Unitario,
            monto_Valor_Venta: +monto_Valor_Venta.toFixed(2),
            porcentaje_Igv:
                ["10", "11", "12", "13", "14", "15", "16", "17"].includes(tipAfeIgv) ? 18 : 0,
        }));
    };

    const handleCancel = () => {
        setDescuentoGlobalForm(valorIncialDescuentoGlobal);
        closeModal();
    }

    const handleSave = () => {
        setNotaCreditoDebito((prev) => ({
            ...prev,
            detalle: [
                descuentoGlobalForm
            ],
        }));
        closeModal();
    }

    useEffect(() => {
        console.log("descuentoGlobalForm", descuentoGlobalForm)
    }, [descuentoGlobalForm]);

    return (
        <div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                }}
                // Default to 1 column on small screens, 2 on medium, 4 on large
                className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-2 gap-y-3"
            >

                {/* Valor Unitario */}
                <div className='flex flex-col gap-1 col-span-full md:col-span-2 lg:col-span-1'>
                    <Label>Valor Unitario</Label>
                    <Input
                        type="number"
                        name="monto_Valor_Unitario"
                        value={descuentoGlobalForm.monto_Valor_Unitario ?? ""} // mantiene controlado
                        step="0.01"
                        inputMode="decimal"
                        className="border-1 border-gray-400"
                        onChange={handleInputChange}
                    />

                    {documentoAAfectar.valor_Venta > 0 &&
                        <span className='text-xs font-semibold text-gray-500'>Valor Venta Limite: {documentoAAfectar.valor_Venta}</span>
                    }
                </div>

                {/* Porcentaje IGV */}
                <div className='flex flex-col gap-1 col-span-full md:col-span-1 lg:col-span-1'>
                    <Label>% IGV</Label>
                    <Input
                        type="number"
                        name="porcentaje_Igv"
                        value={descuentoGlobalForm.igv}
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
                        value={descuentoGlobalForm.monto_Precio_Unitario}
                        step="0.01"
                        className="border-1 border-gray-400"
                        disabled
                    />
                    {documentoAAfectar.monto_Imp_Venta > 0 &&
                        <span className='text-xs font-semibold text-gray-500'>Monto Limite: {documentoAAfectar.monto_Imp_Venta}</span>
                    }
                </div>

                {/* Descripción */}
                <div className='flex flex-col gap-1 col-span-full md:col-span-1'>
                    <Label>Primera Descripción</Label>
                    <Input
                        type="text"
                        name="descripcion"
                        value={descuentoGlobalForm.descripcion}
                        disabled
                        className="border-1 border-gray-400"
                    />
                </div>
                <Button variant="outline"
                    onClick={handleCancel}
                    className={"cursor-pointer hover:bg-red-50 hover:text-red-600 border-2 w-full md:w-auto"}>
                    Cancelar
                </Button>
                <Button
                    onClick={handleSave}
                    form="form-producto" className={"cursor-pointer bg-blue-600 hover:bg-blue-800 w-full md:w-auto"}>
                    Guardar
                </Button>
            </form>
        </div>
    )
}

export default DescuentoGlobalForm
