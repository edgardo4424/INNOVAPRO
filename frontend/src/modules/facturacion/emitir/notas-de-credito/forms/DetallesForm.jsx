import { useState } from 'react';
import ModalProducto from '../components/modal/ModalProducto';
import TablaProductos from '../components/tabla/TablaProductos';

const DetallesForm = () => {
        const [open, setOpen] = useState(false);

    return (
        <div className='overflow-y-auto py-4 sm:px-6 lg:px-8'>
            <h1 className="text-2xl font-bold py-4">Productos</h1>

            <ModalProducto open={open} setOpen={setOpen} />

            <TablaProductos setOpen={setOpen} />
        </div>
    )
}

export default DetallesForm
