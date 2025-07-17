import { useFacturaBoleta } from "@/context/Factura/FacturaBoletaContext";
import { useState } from "react";
import ModalVisualizarFactura from "./components/modal/ModalVisualizarFactura";
import DatosDelCliente from "./components/paso/DatosDelCliente";
import DatosDelComprobante from "./components/paso/DatosDelComprobante";
import FormaDePago from "./components/paso/FormaDePago";
import MontoyProductos from "./components/paso/MontoyProductos";

const FacturaBoleta = () => {
    const [FormSelect, setFormSelect] = useState(1);
    const { validarPaso } = useFacturaBoleta();

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
                        Generar Factura / Boleta
                    </h2>
                </div>


                {/* Form content */}
                <div className=" shadow-xl border border-gray-200 rounded-3xl  p-4  transition-all duration-300 mb-6">
                    {/* {renderForm()} */}
                    <DatosDelComprobante />
                    <DatosDelCliente />
                    <MontoyProductos />
                    <FormaDePago />




                    {/* Facturar  */}
                    <div className="flex justify-between">
                        <div className="flex gap-x-8">
                            <button className="py-3 px-4 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 cursor-pointer ">
                                Guardar
                            </button>
                            <button className="py-3 px-4 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 cursor-pointer ">
                                Cancelar
                            </button>
                        </div>
                        <ModalVisualizarFactura />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacturaBoleta;
