import { Button } from '@/components/ui/button';
import { useFacturaBoleta } from '@/modules/facturacion/context/FacturaBoletaContext';
import { RotateCcw } from 'lucide-react';
import ModalPagos from '../modal/ModalPagos';
import TablaPagos from '../tabla/TablaPagos';


const FormaDePago = () => {
    const { factura, setFactura } = useFacturaBoleta();

    const handleReiniciarPagos = () => {
        setFactura((prevFactura) => ({
            ...prevFactura,
            forma_pago: []
        }))
    }

    return (
        <div className=" overflow-y-auto p-4 sm:p-6 lg:p-8 ">
            <h1 className='text-2xl font-bold'>Forma de Pago</h1>
            <div className='flex justify-between'>
                <ModalPagos />
                <div className="flex justify-end mt-4">
                    <Button onClick={handleReiniciarPagos}
                        className={'bg-red-500 hover:bg-red-600'}
                        disabled={factura.forma_pago.length === 0}>
                        <RotateCcw />
                        Reiniciar Pagos
                    </Button>
                </div>
            </div>
            <TablaPagos />
        </div>
    )
}

export default FormaDePago