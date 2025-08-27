import { CreditCard, Receipt, Truck } from "lucide-react";
import { Link } from "react-router-dom";

const Bandeja = () => {

    return (
        <div className="min-h-screen  max-w-7xl mx-auto flex flex-col w-full items-center px-4 md:px-8 py-6 ">

            <div className="flex flex-col max-w-3xl items-center justify-between my-3">
                <h2 className="text-2xl font-extrabold md:text-3xl">
                    ¿Que documento deseas listar?
                </h2>
                <p className="mt-2 text-lg text-gray-600 text-center">
                    Selecciona el tipo de documento que necesitas gestionar. Nuestro sistema te permitirá crear, editar y administrar todos tus documentos fiscales de manera eficiente.
                </p>
            </div>

            <div className='h-full my-12'>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 ">
                    <Link
                        to="factura-boleta?page=1&limit=10"
                        className="bg-white flex flex-col justify-between rounded-lg shadow-md p-4 cursor-pointer hover:shadow-xl hover:scale-102 transition-all duration-300 border border-gray-200"
                    >
                        <div className="flex justify-between items-start py-1">
                            <div className="bg-green-500 p-3 rounded-md text-white">
                                <Receipt />
                            </div>
                            <div>
                                <span className="py-1 px-2 text-sm border-2 border-gray-400 shadow-sm rounded-md">Activo</span>
                                <h2 className="mt-2 text-xl text-green-600 font-bold" style={{ color: "#34C759" }} >124</h2>
                            </div>
                        </div>
                        <div className="flex flex-col justify-between h-full">
                            <h2 style={{ textAlign: "left" }} className="text-xl font-bold w-full justify-start">
                                Factura y Boleta de Venta Electrónica
                            </h2>
                            <h3 className="text-md text-gray-600">
                                En este listado podrás ver todas tus facturas electrónicas y boletas de venta electrónicas emitidas, pudiendo filtrar por fecha de emisión, serie, número, tipo de documento, entre otros.
                            </h3>
                        </div>
                    </Link>
                    <Link
                        to="nota-credito-debito?page=1&limit=10"
                        className="bg-white flex flex-col justify-between rounded-lg shadow-md p-4 cursor-pointer hover:shadow-xl hover:scale-102 transition-all duration-300 border border-gray-200"
                    >
                        <div className="flex justify-between items-start py-1">
                        <div className="bg-amber-500 p-3 rounded-md text-white">
                        <CreditCard />
                            </div>
                            <div>
                                <span className="py-1 px-2 text-sm border-2 border-gray-400 shadow-sm rounded-md">Activo</span>
                                <h2 className="mt-2 text-xl text-green-600 font-bold" style={{ color: "#34C759" }} >124</h2>
                            </div>
                        </div>
                        <div className="flex flex-col justify-between h-full">
                            <h2 style={{ textAlign: "left" }} className="text-xl font-bold w-full justify-start">
                                Nota de Crédito y Nota de Débito Electrónica
                            </h2>
                            <h3 className="text-md text-gray-600">
                                En este listado podrás ver todas tus notas de crédito y débito emitidas, pudiendo filtrar por fecha de emisión, serie, número, tipo de documento, entre otros.
                            </h3>
                        </div>
                    </Link>
                    <Link
                        to="guia-remision?page=1&limit=10"
                        className="bg-white flex flex-col justify-between rounded-lg shadow-md p-4 cursor-pointer hover:shadow-xl hover:scale-102 transition-all duration-300 border border-gray-200"
                    >
                        <div className="flex justify-between items-start py-1">
                        <div className="bg-blue-500 p-3 rounded-md text-white">
                        <Truck />
                            </div>
                            <div>
                                <span className="py-1 px-2 text-sm border-2 border-gray-400 shadow-sm rounded-md">Activo</span>
                                <h2 className="mt-2 text-xl text-green-600 font-bold" style={{ color: "#34C759" }} >124</h2>
                            </div>
                        </div>
                        <div className="flex flex-col justify-between h-full">
                            <h2 style={{ textAlign: "left" }} className="text-xl font-bold w-full justify-start">
                                Guía de Remisión Electrónica
                            </h2>
                            <h3 className="text-md text-gray-600">
                                En este listado podrás ver todas tus guías de remisión electrónicas emitidas, pudiendo filtrar por fecha de emisión, serie, número, tipo de documento, entre otros.
                            </h3>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Bandeja

