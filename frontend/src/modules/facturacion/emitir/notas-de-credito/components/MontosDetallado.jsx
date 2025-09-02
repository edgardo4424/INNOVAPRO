import { useNota } from '@/modules/facturacion/context/NotaContext';

const MontosDetallado = () => {
    const { notaCreditoDebito } = useNota();

    let subTotalConIgv = Number(notaCreditoDebito.total_Impuestos) + Number(notaCreditoDebito.monto_Oper_Gravadas);


    return (
        <div className='w-full flex justify-end'>
            <div className='w-5/12 p-6'>

                {/* {listaProductos.length > 0 && TotalProducto > 0 && ( */}
                <div className="flex flex-col items-end gap-y-2 p-4 bg-gray-100 rounded-2xl"> {/* Contenedor principal para los totales */}

                    {/* Monto Oper Gravadas */}
                    <div className="flex justify-between w-full max-w-sm py-1">
                        <span className="font-semibold">Monto Oper Gravadas</span>
                        <span>S/. {notaCreditoDebito.monto_Oper_Gravadas || 0}</span>
                    </div>

                    {/* IGV */}
                    <div className="flex justify-between w-full max-w-sm py-1">
                        <span className="font-semibold">IGV</span>
                        <span>S/. {notaCreditoDebito.monto_Igv || 0}</span>
                    </div>


                    {/* Sub Total + IGV */}
                    <div className="flex justify-between w-full max-w-sm py-1">
                        <span className="font-semibold">Sub Total + IGV</span>
                        <span>S/. {subTotalConIgv || 0}</span>
                    </div>

                    {/* Exonerados */}
                    <div className="flex justify-between w-full max-w-sm py-1">
                        <span className="font-semibold">Exonerados</span>
                        <span>S/. {notaCreditoDebito.monto_Oper_Exoneradas || 0}</span>
                    </div>

                    {/* Sub Total */}
                    <div className="flex justify-between w-full max-w-sm py-1">
                        <span className="font-semibold">Sub Total</span>
                        <span>S/. {notaCreditoDebito.sub_Total || 0}</span>
                    </div>


                    {/* Monto Importes Venta */}
                    <div className="flex justify-between w-full max-w-sm py-1">
                        <span className="font-semibold">Monto Importes Venta</span>
                        <span>S/. {notaCreditoDebito.monto_Imp_Venta || 0}</span>
                    </div>
                </div>
                {/* )} */}
            </div>
        </div>
    )
}

export default MontosDetallado