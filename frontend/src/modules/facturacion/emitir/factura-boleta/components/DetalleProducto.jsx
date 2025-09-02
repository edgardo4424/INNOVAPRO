import ModalDetalleExtra from '@/modules/facturacion/components/modal/ModalDetallesExtra';
import { useFacturaBoleta } from '../../../context/FacturaBoletaContext';
import React, { useState } from 'react'

const DetalleProducto = () => {
    const { factura, setFactura, TotalProducto, detallesExtra } = useFacturaBoleta();
    const { detalle: listaProductos, tipo_Moneda } = factura;

    const [open, setOpen] = useState(false);

    let subTotalConIgv = factura.total_Impuestos + factura.monto_Oper_Gravadas;

    const handleObservacion = (e) => {
        setFactura((prevFactura) => ({
            ...prevFactura,
            observacion: e.target.value.toUpperCase(),
        }));
    }

    return (
        <div className='w-full flex'>
            <div className='flex flex-col items-start py-4 pr-6 w-7/12 '>
                <div className='w-full flex flex-col items-start'>
                    <h2 className='text-xl font-semibold '>Observacion:</h2>
                    <textarea
                        name=""
                        id=""
                        className="border border-gray-300 rounded-md p-2 w-full resize-none h-35"
                        placeholder="Ingrese observacion..."
                        onChange={handleObservacion}
                        value={factura.observacion}
                    ></textarea>
                </div>
                <div className='py-4 w-full'>
                    <div className='flex items-center gap-x-4 pb-4'>
                        <h2 className='text-xl font-semibold'>Detalles Extra:</h2>
                        <ModalDetalleExtra open={open} setOpen={setOpen} />
                    </div>
                    {
                        detallesExtra.length > 0 && (
                            <div className="grid border border-gray-400 dark:border-gray-700 rounded-md overflow-hidden w-full ">
                                {detallesExtra.map((detalle, index) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-2 px-3 py-1 text-sm even:bg-gray-50 even:dark:bg-gray-800"
                                    >
                                        <p className="font-semibold border-r-2 border-gray-400 dark:border-gray-600 pr-4">
                                            {detalle.detalle}
                                        </p>
                                        <p className="pl-4 text-right text-gray-600 dark:text-gray-400">
                                            {detalle.valor}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )
                    }
                </div>
            </div>
            <div className='w-5/12 p-6 '>

                {/* {listaProductos.length > 0 && TotalProducto > 0 && ( */}
                <div className="flex flex-col items-end gap-y-2 p-4 bg-gray-100 rounded-2xl"> {/* Contenedor principal para los totales */}
                    {/* Total */}
                    <div className="flex justify-between w-full max-w-sm py-1">
                        <span className="font-semibold">Total</span>
                        <span>{tipo_Moneda == "PEN" ? "S/." : "$"} {TotalProducto.toFixed(2)}</span>
                    </div>

                    {/* IGV */}
                    <div className="flex justify-between w-full max-w-sm py-1">
                        <span className="font-semibold">IGV</span>
                        <span>{tipo_Moneda == "PEN" ? "S/." : "$"} {factura.monto_Igv.toFixed(2)}</span>
                    </div>


                    {/* Sub Total + IGV */}
                    <div className="flex justify-between w-full max-w-sm py-1">
                        <span className="font-semibold">Sub Total + IGV</span>
                        <span>{tipo_Moneda == "PEN" ? "S/." : "$"} {subTotalConIgv.toFixed(2)}</span>
                    </div>

                    {/* Exonerados */}
                    <div className="flex justify-between w-full max-w-sm py-1">
                        <span className="font-semibold">Exonerados</span>
                        <span>{tipo_Moneda == "PEN" ? "S/." : "$"} {factura.monto_Oper_Exoneradas.toFixed(2)}</span>
                    </div>

                    {/* Sub Total */}
                    <div className="flex justify-between w-full max-w-sm py-1">
                        <span className="font-semibold">Sub Total</span>
                        <span>{tipo_Moneda == "PEN" ? "S/." : "$"} {factura.sub_Total.toFixed(2)}</span>
                    </div>


                    {/* Monto Importes Venta */}
                    <div className="flex justify-between w-full max-w-sm py-1">
                        <span className="font-semibold">Monto Importes Venta</span>
                        <span>{tipo_Moneda == "PEN" ? "S/." : "$"} {factura.monto_Imp_Venta.toFixed(2)}</span>
                    </div>
                </div>
                {/* )} */}
            </div>
        </div>
    )
}

export default DetalleProducto