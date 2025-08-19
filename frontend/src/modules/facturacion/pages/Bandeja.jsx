import React from 'react'
import { useNavigate } from 'react-router-dom';

const Bandeja = () => {

    const navigate = useNavigate();

    const navegarAOtrasRutas = (ruta) => {
        navigate(ruta);
    };


    return (
        <div className="min-h-screen  max-w-7xl mx-auto flex flex-col w-full items-center px-4 md:px-8 py-6 ">

            <div className="flex items-center justify-between mb-3">
                <h2 className="text-3xl font-extrabold md:text-2xl">
                    ¿Que documento deseas listar?
                </h2>
            </div>

            <div className='h-full my-20'>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
                    <div
                        className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-300 border border-gray-200"
                        onClick={() => navegarAOtrasRutas("/facturacion/bandeja/factura-boleta")}
                    >
                        <h3 className="text-xl font-semibold text-blue-700 mb-2">
                            Factura Electrónica y Boleta de Venta Electrónica
                        </h3>
                        <p className="text-gray-600 text-sm">
                            Documentos emitidos por la empresa
                        </p>
                    </div>
                    <div
                        className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-300 border border-gray-200"
                        onClick={() => navegarAOtrasRutas("/facturacion/bandeja/nota-credito-debito")}
                    >
                        <h3 className="text-xl font-semibold text-blue-700 mb-2">
                            Nota de Crédito y Nota de Débito
                        </h3>
                        <p className="text-gray-600 text-sm">
                            Documentos que se emiten para rectificar o anular un comprobante
                        </p>
                    </div>
                    <div
                        className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-300 border border-gray-200"
                        onClick={() => navegarAOtrasRutas("/facturacion/generar/guia-de-remision")}
                    >
                        <h3 className="text-xl font-semibold text-blue-700 mb-2">
                            Guía de Remisión
                        </h3>
                        <p className="text-gray-600 text-sm">
                            Documento que se emite para transportar bienes o mercaderías
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Bandeja

