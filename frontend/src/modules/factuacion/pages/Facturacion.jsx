import { useFacturacion } from "@/context/FacturacionContext";
import { useState } from "react";
import ModalVisualizarFactura from "../components/modal/ModalVisualizarFactura";
import Paginacion from "../components/Paginacion";
import DatosDelCliente from "../components/paso/DatosDelCliente";
import DatosDelComprobante from "../components/paso/DatosDelComprobante";
import FormaDePago from "../components/paso/FormaDePago";
import MontoyProductos from "../components/paso/MontoyProductos";

const Facturacion = () => {
    const [FormSelect, setFormSelect] = useState(1);
    const { facturarNuevoDocumento, validarPaso } = useFacturacion();

    const renderForm = () => {
        switch (FormSelect) {
            case 1:
                return <DatosDelComprobante />;
            case 2:
                return <DatosDelCliente />;
            case 3:
                return <MontoyProductos />;
            case 4:
                return <FormaDePago />;
            default:
                return <DatosDelComprobante />;
        }
    };

    const tabs = [
        { id: 1, label: "Datos del Comprobante" },
        { id: 2, label: "Datos del Cliente" },
        { id: 3, label: "Monto y Productos" },
        { id: 4, label: "Forma de Pago" },
    ];


    const handleTabClick = async (tabId) => {
        if (tabId === 2) {
            const esValido = await validarPaso("DatosDelComprobante");
            if (!esValido) return;
        }

        if (tabId === 3) {
            const esValido = await validarPaso("DatosDelCliente");
            if (!esValido) return;
        }

        if (tabId === 4) {
            const esValido = await validarPaso("DatosDelProducto");
            if (!esValido) return;
        }

        setFormSelect(tabId);
    };


    return (
        <div className="min-h-screen w-full flex flex-col items-center px-4 md:px-8 py-6">
            <div className="w-full max-w-7xl">
                <div className="flex items-center justify-between mb-6 ">
                    <h2 className="text-2xl md:text-3xl font-bold text-blue-600">
                        Emicion de Factura
                    </h2>
                </div>

                {/* Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4  mb-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabClick(tab.id)}
                            className={`py-3 px-2 text-sm sm:text-base font-semibold text-center  transition-all  ease-in-out border-b-4 cursor-pointer
                            ${FormSelect === tab.id
                                    ? "border-blue-600 text-blue-600 "
                                    : " text-gray-500"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Form content */}
                <div className="bg-white   p-4  transition-all duration-300 mb-6">
                    {renderForm()}
                </div>

                {/* Pagination */}
                <div className="mb-6">
                    <Paginacion FormSelect={FormSelect} setFormSelect={setFormSelect} />
                </div>

                {/* Facturar  */}
                <div className="flex justify-end">
                    <ModalVisualizarFactura />
                </div>
            </div>
        </div>
    );
};

export default Facturacion;
