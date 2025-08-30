import { Button } from '@/components/ui/button';
import { useFacturaBoleta } from '@/modules/facturacion/context/FacturaBoletaContext';
import { RotateCcw } from 'lucide-react';
import { useState } from 'react';
import ModalPagos from '../modal/ModalPagos';
import TablaPagos from '../tabla/TablaPagos';


const FormaDePago = () => {
    const { factura, setFactura } = useFacturaBoleta();

    const [open, setOpen] = useState(false);

    return (
        <div className=" overflow-y-auto p-4 sm:p-6 lg:p-8 ">
            <h1 className='text-2xl font-bold'>Forma de Pago</h1>
            <div className='flex justify-between'>
                <ModalPagos open={open} setOpen={setOpen} />
            </div>
            <TablaPagos open={open} setOpen={setOpen} />
        </div>
    )
}

export default FormaDePago