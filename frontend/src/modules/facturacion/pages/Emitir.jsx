import { useState } from "react";
import { Link } from "react-router-dom";

const Emitir = () => {
    const [activeTab, setActiveTab] = useState("facturaBoleta");


    const renderContent = () => {
        switch (activeTab) {
            case "facturaBoleta":
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Generar Factura / Boleta de venta */}
                        <Link
                            to="factura-boleta"
                            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-300 border border-gray-200"
                        >
                            <h3 className="text-xl font-semibold text-blue-700 mb-2">
                                Generar Factura / Boleta
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Crea y emite nuevas facturas o boletas de venta de forma rápida y sencilla.
                            </p>
                        </Link>

                    </div>
                );
            case "notaCreditoDebito":
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Enviar Nota */}
                        <Link
                            to="nota-credito-debito"
                            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-300 border border-gray-200"
                        >
                            <h3 className="text-xl font-semibold text-blue-700 mb-2">
                                Generar Nota
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Crea y envía notas de crédito o débito para ajustar tus comprobantes.
                            </p>
                        </Link>

                    </div>
                );
            case "guiaRemision":
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Transporte privado */}
                        <Link
                            to="guia/transporte-privado"
                            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-300 border border-gray-200"
                        >
                            <h3 className="text-xl font-semibold text-blue-700 mb-2">
                                Transporte Privado
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Emite guías de remisión para traslados con tu propio transporte.
                            </p>
                        </Link>

                        {/* Transporte público */}
                        <Link
                            to="guia/transporte-publico"
                            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-300 border border-gray-200"
                        >
                            <h3 className="text-xl font-semibold text-blue-700 mb-2">
                                Transporte Público
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Genera guías de remisión para envíos a través de transportistas públicos.
                            </p>
                        </Link>

                        {/* Traslado misma empresa */}
                        <Link
                            to="guia/traslado-misma-empresa"
                            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-300 border border-gray-200"
                        >
                            <h3 className="text-xl font-semibold text-blue-700 mb-2">
                                Traslado Misma Empresa
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Utiliza esta opción para movimientos de bienes entre tus propias sucursales.
                            </p>
                        </Link>


                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center px-4 md:px-8 py-6 ">
            <div className="w-full max-w-7xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-3xl font-extrabold md:text-2xl">
                        Módulo de Facturación Electrónica
                    </h2>
                </div>

                {/* Tab Navigation */}
                <div className="border-b border-gray-300 mb-8">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab("facturaBoleta")}
                            className={`${activeTab === "facturaBoleta"
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                } whitespace-nowrap cursor-pointer py-4 px-1 border-b-2 font-medium text-lg focus:outline-none`}
                        >
                            Factura y Boleta
                        </button>
                        <button
                            onClick={() => setActiveTab("notaCreditoDebito")}
                            className={`${activeTab === "notaCreditoDebito"
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                } whitespace-nowrap cursor-pointer py-4 px-1 border-b-2 font-medium text-lg focus:outline-none`}
                        >
                            Notas de Crédito/Débito
                        </button>
                        <button
                            onClick={() => setActiveTab("guiaRemision")}
                            className={`${activeTab === "guiaRemision"
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                } whitespace-nowrap cursor-pointer py-4 px-1 border-b-2 font-medium text-lg focus:outline-none`}
                        >
                            Guías de Remisión
                        </button>
                    </nav>
                </div>

                {/* Content based on active tab */}
                {renderContent()}



            </div>
        </div>
    );
};

export default Emitir;