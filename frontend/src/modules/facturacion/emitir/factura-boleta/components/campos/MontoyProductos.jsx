import { useState } from "react";
import ModalProducto from '../modal/ModalProducto';
import TablaProductos from '../tabla/TablaProductos';

const MontoyProductos = () => {

    const [open, setOpen] = useState(false);


    return (
        <div className='overflow-y-auto p-4 sm:p-6 lg:pt-8 lg:px-8'>
            <h1 className="text-2xl font-bold py-4">Productos</h1>

            <ModalProducto open={open} setOpen={setOpen} />

            <TablaProductos setOpen={setOpen} />


        </div>)
}

export default MontoyProductos