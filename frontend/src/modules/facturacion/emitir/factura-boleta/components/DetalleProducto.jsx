import { useFacturaBoleta } from '../../../context/FacturaBoletaContext';
import React from 'react'

const DetalleProducto = () => {
    const { factura, setFactura, TotalProducto } = useFacturaBoleta();
    const { detalle: listaProductos } = factura;


    let subTotalConIgv = factura.total_Impuestos + factura.monto_Oper_Gravadas;

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
                        <span className="font-semibold">Total</span>
                        <span>S/. {TotalProducto.toFixed(2)}</span>
                    </div>

                    {/* IGV */}
                    <div className="flex justify-between w-full max-w-sm py-1">
                        <span className="font-semibold">IGV</span>
                        <span>S/. {factura.monto_Igv.toFixed(2)}</span>
                    </div>


                    {/* Sub Total + IGV */}
                    <div className="flex justify-between w-full max-w-sm py-1">
                        <span className="font-semibold">Sub Total + IGV</span>
                        <span>S/. {subTotalConIgv.toFixed(2)}</span>
                    </div>

                    {/* Exonerados */}
                    <div className="flex justify-between w-full max-w-sm py-1">
                        <span className="font-semibold">Exonerados</span>
                        <span>S/. {factura.monto_Oper_Exoneradas.toFixed(2)}</span>
                    </div>

                    {/* Sub Total */}
                    <div className="flex justify-between w-full max-w-sm py-1">
                        <span className="font-semibold">Sub Total</span>
                        <span>S/. {factura.sub_Total.toFixed(2)}</span>
                    </div>


                    {/* Monto Importes Venta */}
                    <div className="flex justify-between w-full max-w-sm py-1">
                        <span className="font-semibold">Monto Importes Venta</span>
                        <span>S/. {factura.monto_Imp_Venta.toFixed(2)}</span>
                    </div>
                </div>
                {/* )} */}
            </div>
        </div>
    )
}

export default DetalleProducto