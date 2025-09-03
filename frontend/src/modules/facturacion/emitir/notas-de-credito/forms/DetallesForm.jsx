import { useState } from 'react';
import ModalProducto from '../components/modal/ModalProducto';
import TablaProductos from '../components/tabla/TablaProductos';

const DetallesForm = () => {
    const [open, setOpen] = useState(false);

    const closeModal = () => {
        setOpen(false);
    }
    return (
        <div className='overflow-y-auto py-4 sm:px-6 lg:px-8'>
            <div className='flex justify-between items-end'>
                <h1 className="text-2xl font-bold py-2">Detalles</h1>
                <ModalProducto open={open} setOpen={setOpen} closeModal={closeModal} />
            </div>
            <TablaProductos setOpen={setOpen} />
        </div>
    )
}

export default DetallesForm
