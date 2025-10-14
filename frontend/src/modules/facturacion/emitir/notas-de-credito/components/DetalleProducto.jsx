import React from 'react'

const DetalleProducto = () => {
    return (
        <div className='flex py-4 sm:px-6 lg:px-8'>
            <div className='w-7/12'></div>
            <div className='w-5/12 p-6 '>
                <div className="flex flex-col items-end gap-y-2 p-4 bg-gray-100 rounded-2xl"> {/* Contenedor principal para los totales */}
                    {/* Total */}
                    <div className="flex justify-between w-full max-w-sm py-1">
                        <span className="font-semibold">Total</span>
                        <span>S/. {330.0}</span>
                    </div>

                    {/* IGV */}
                    <div className="flex justify-between w-full max-w-sm py-1">
                        <span className="font-semibold">IGV</span>
                        <span>S/. {0.0}</span>
                    </div>


                    {/* Sub Total + IGV */}
                    <div className="flex justify-between w-full max-w-sm py-1">
                        <span className="font-semibold">Sub Total + IGV</span>
                        <span>S/. {330.0}</span>
                    </div>

                    {/* Exonerados */}
                    <div className="flex justify-between w-full max-w-sm py-1">
                        <span className="font-semibold">Exonerados</span>
                        <span>S/. {330.0}</span>
                    </div>

                    {/* Sub Total */}
                    <div className="flex justify-between w-full max-w-sm py-1">
                        <span className="font-semibold">Sub Total</span>
                        <span>S/. {330.0}</span>
                    </div>


                    {/* Monto Importes Venta */}
                    <div className="flex justify-between w-full max-w-sm py-1">
                        <span className="font-semibold">Monto Importes Venta</span>
                        <span>S/. {330.0}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DetalleProducto
