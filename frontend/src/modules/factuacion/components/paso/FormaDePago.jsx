import { useFacturacion } from '@/context/FacturacionContext';
import ModalPagos from '../modal/ModalPagos';
import TablaPagos from '../tabla/TablaPagos';
const FormaDePago = () => {


    return (
        <div className="max-h-[80dvh] min-h-[40dvh] overflow-y-auto  p-2  ">
            <ModalPagos />
            <TablaPagos />

        </div>
    )
}

export default FormaDePago