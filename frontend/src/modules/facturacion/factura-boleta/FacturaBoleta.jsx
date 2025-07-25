import { useFacturaBoleta } from "@/context/Factura/FacturaBoletaContext";
import ModalVisualizarFactura from "./components/modal/ModalVisualizarFactura";
import DatosDelCliente from "./components/paso/DatosDelCliente";
import DatosDelComprobante from "./components/paso/DatosDelComprobante";
import FormaDePago from "./components/paso/FormaDePago";
import MontoyProductos from "./components/paso/MontoyProductos";

const FacturaBoleta = () => {
    const { registrarBaseDatos } = useFacturaBoleta();

    const handleRegister = () => {
        registrarBaseDatos();
    };
    return (
        <div className="min-h-screen w-full flex flex-col items-center px-4 md:px-8 py-6">
            <div className="w-full max-w-6xl">
                <div className="flex items-center justify-between mb-6 ">
                    <h2 className="text-2xl md:text-3xl font-bold text-blue-600">
                        Generar Factura / Boleta
                    </h2>
                </div>


                {/* Form content */}
                <div className=" shadow-xl border border-gray-400  rounded-3xl  p-4  transition-all duration-300 mb-6">
                    {/* Form */}
                    {/* Datos del comprobante */}
                    <DatosDelComprobante />
                    {/* Datos del cliente */}
                    <DatosDelCliente />
                    {/* Montos y productos */}
                    <MontoyProductos />
                    {/* Forma de pago */}
                    <FormaDePago />

                    {/* Facturar  */}
                    <div className="flex justify-between">
                        <div className="flex gap-x-8">
                            <button
                                onClick={handleRegister}
                                className="py-3 px-4 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 cursor-pointer ">
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
