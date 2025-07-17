import ModalPagos from '../modal/ModalPagos';
import TablaPagos from '../tabla/TablaPagos';


const FormaDePago = () => {


    return (
        <div className=" overflow-y-auto p-4 sm:p-6 lg:p-8 "

        >
            <h1 className='text-2xl font-bold'>Forma de Pago</h1>
            <ModalPagos />
            <TablaPagos />
        </div>
    )
}

export default FormaDePago