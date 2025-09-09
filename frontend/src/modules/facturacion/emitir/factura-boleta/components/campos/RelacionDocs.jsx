import { useState } from 'react';
import ModalDocumentos from '../modal/ModalDocumentos';
import TablaDocumentos from '../tabla/TablaDocumentos';
import { useFacturaBoleta } from '@/modules/facturacion/context/FacturaBoletaContext';

const RelacionDocs = () => {

    const { factura } = useFacturaBoleta();

    const [open, setOpen] = useState(false);

    if (factura.tipo_Doc == "03") return null;
    return (
        <div className="overflow-y-auto p-4 sm:p-6 lg:px-8 lg:py-4">
            <div className="flex justify-between items-center  py-3">
                <h1 className="text-2xl font-bold py-3  text-gray-800">
                    Documentos Relacionados
                </h1>
                <div className='flex justify-between'>
                    <ModalDocumentos open={open} setOpen={setOpen} />
                </div>
            </div>
            <TablaDocumentos open={open} setOpen={setOpen} />
        </div>
    )
}

export default RelacionDocs
