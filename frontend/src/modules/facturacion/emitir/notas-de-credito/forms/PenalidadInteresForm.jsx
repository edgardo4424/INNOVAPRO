
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNota } from "@/modules/facturacion/context/NotaContext";
import { useEffect, useState } from 'react';
import { valorInicialProducto } from "../utils/valoresInicialNota";

const PenalidadInteresForm = ({ closeModal }) => {
    const { notaCreditoDebito, setNotaCreditoDebito, documentoAAfectar } = useNota();

    const [penalidadInteres, setPenalidadInteres] = useState(valorInicialProducto);

    const handleInputChange = (e) => {
        const { value } = e.target;
        const numericValue = Number.parseFloat(value || 0);

        // Esta línea es exonerada (20). Base exonerada = valor de venta.
        const valorLinea = Number.isFinite(numericValue) ? numericValue : 0;

        setPenalidadInteres((prev) => ({
            ...prev,
            monto_Valor_Unitario: valorLinea,      // valor sin IGV (en exoneradas coincide con precio)
            monto_Base_Igv: valorLinea,            // ¡IMPORTANTE! Base exonerada = valor de la línea
            monto_Valor_Venta: valorLinea,         // cantidad (1) * valor unitario
            monto_Precio_Unitario: valorLinea,     // precio con impuestos (igual en exoneradas)
            tip_Afe_Igv: "20",                     // exonerado - operación onerosa
            porcentaje_Igv: 0,
            igv: 0,
            total_Impuestos: 0,
        }));
    };


    const handleCancel = () => {
        setPenalidadInteres(valorInicialProducto);
        closeModal();
    }

    const handleSave = () => {
        const item = {
            ...penalidadInteres,
            cantidad: 1,
            unidad: "NIU",
            descripcion: notaCreditoDebito.motivo_Cod === "01" ? "INTERES" : "PENALIDAD",
            tip_Afe_Igv: "20",
            porcentaje_Igv: 0,
            igv: 0,
            total_Impuestos: 0,
            // Por seguridad, normaliza números
            monto_Valor_Unitario: Number(penalidadInteres.monto_Valor_Unitario || 0),
            monto_Valor_Venta: Number(penalidadInteres.monto_Valor_Venta || 0),
            monto_Base_Igv: Number(penalidadInteres.monto_Base_Igv || 0),
            monto_Precio_Unitario: Number(penalidadInteres.monto_Precio_Unitario || 0),
        };

        setNotaCreditoDebito((prev) => ({
            ...prev,
            detalle: [item],
        }));
        closeModal();
    };



    useEffect(() => {
        if (notaCreditoDebito.motivo_Cod == "01") {
            setPenalidadInteres({
                ...penalidadInteres,
                cantidad: 1,
                descripcion: "INTERES",
                unidad: "NIU"
            })
        } else {
            setPenalidadInteres({
                ...penalidadInteres,
                cantidad: 1,
                descripcion: "PENALIDAD",
                unidad: "NIU"
            })
        }
    }, [notaCreditoDebito.motivo_Cod])

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
                <div className='flex flex-col gap-1 col-span-full md:col-span-2 lg:col-span-2'>
                    <Label>Valor Unitario</Label>
                    <Input
                        type="number"
                        name="monto_Valor_Unitario"
                        value={penalidadInteres.monto_Valor_Unitario || ""} // mantiene controlado
                        step="0.01"
                        inputMode="decimal"
                        className="border-1 border-gray-400"
                        onChange={handleInputChange}
                    />

                </div>


                {/* Descripción */}
                <div className='flex flex-col gap-1 col-span-full md:col-span-2'>
                    <Label>Primera Descripción</Label>
                    <Input
                        type="text"
                        name="descripcion"
                        value={penalidadInteres.descripcion}
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

export default PenalidadInteresForm
