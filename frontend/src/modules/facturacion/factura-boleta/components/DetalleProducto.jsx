import { useFacturaBoleta } from '@/context/Factura/FacturaBoletaContext';
import React from 'react'

const DetalleProducto = () => {
    const { factura, setFactura, TotalProducto } = useFacturaBoleta();
    const { detalle: listaProductos } = factura;

    const handleObservacion = (e) => {
        setFactura((prevFactura) => ({
            ...prevFactura,
            observaciones: e.target.value.toUpperCase(),
        }));
    }

    return (
        <div className='w-full flex'>
            <div className='flex flex-col items-start py-2 pr-6 w-7/12'>
                <h2 className='text-xl font-semibold'>Observaciones:</h2>
                <textarea
                    name=""
                    id=""
                    className="border border-gray-300 rounded-md p-2 w-full resize-none h-35"
                    placeholder="Ingrese observaciones..."
                    onChange={handleObservacion}
                    value={factura.observaciones}
                ></textarea>
            </div>
            <div className='w-5/12 p-6 '>

                {/* {listaProductos.length > 0 && TotalProducto > 0 && ( */}
                    <div className="flex flex-col items-end gap-y-2 p-4 bg-gray-100 rounded-2xl"> {/* Contenedor principal para los totales */}
                        {/* Total */}
                        <div className="flex justify-between w-full max-w-sm py-1">
                            <span className="font-semibold">TOTAL</span>
                            <span>S/. {TotalProducto}</span>
                        </div>

                        {/* IGV */}
                        <div className="flex justify-between w-full max-w-sm py-1">
                            <span className="font-semibold">IGV</span>
                            <span>S/. {factura.monto_Igv}</span>
                        </div>

                        {/* Sub Total + IGV */}
                        <div className="flex justify-between w-full max-w-sm py-1">
                            <span className="font-semibold">Sub Total + IGV</span>
                            <span>S/. {factura.sub_Total}</span>
                        </div>
                    </div>
                {/* )} */}
            </div>
        </div>
    )
}

export default DetalleProducto