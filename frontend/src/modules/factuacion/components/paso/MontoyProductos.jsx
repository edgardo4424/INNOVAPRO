import { useFacturacion } from '@/context/FacturacionContext';
import { useState } from 'react';
import ModalProducto from '../modal/ModalProducto';
import TablaProductos from '../tabla/TablaProductos';

const MontoyProductos = () => {


    return (
        <div className='min-h-[40dvh] '>

            <ModalProducto />

            <TablaProductos />


        </div>)
}

export default MontoyProductos