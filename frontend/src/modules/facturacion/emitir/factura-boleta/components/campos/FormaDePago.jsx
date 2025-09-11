import { useFacturaBoleta } from '@/modules/facturacion/context/FacturaBoletaContext';
import { Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import ModalPagos from '../modal/ModalPagos';
import TablaPagos from '../tabla/TablaPagos';


const FormaDePago = () => {
    const { factura, setFactura } = useFacturaBoleta();

    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (factura.forma_pago.length > 0 && factura.forma_pago[0].tipo == "Credito") {
            setFactura((prevFactura) => ({
                ...prevFactura,
                fecha_vencimiento: factura.forma_pago[0].fecha_Pago,
                dias_pagar: Math.ceil((new Date(factura.forma_pago[0].fecha_Pago).getTime() - new Date(factura.fecha_Emision).getTime()) / (1000 * 60 * 60 * 24)) + 1
            }))
        } else {
            setFactura((prevFactura) => ({
                ...prevFactura,
                fecha_vencimiento: null,
                dias_pagar: null
            }))
        }
    }, [factura.forma_pago]);


    return (
        <div className=" overflow-y-auto p-4 sm:p-6 lg:p-8 ">
            <div className='flex justify-between'>
                <h1 className='text-2xl font-bold'>Forma de Pago</h1>
                {factura.forma_pago.length > 0 && <button
                    variant="danger"
                    className="flex cursor-pointer items-center gap-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                    onClick={() => {
                        setFactura((prevFactura) => ({
                            ...prevFactura,
                            forma_pago: [],
                        }));
                    }}
                >
                    <Trash />
                    <span>Limpiar</span>
                </button>}
            </div>
            <div className='flex justify-between'>
                <ModalPagos open={open} setOpen={setOpen} />
            </div>
            <TablaPagos open={open} setOpen={setOpen} />
        </div>
    )
}

export default FormaDePago