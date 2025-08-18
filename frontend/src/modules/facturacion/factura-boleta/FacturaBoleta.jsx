import { useFacturaBoleta } from "@/context/Factura/FacturaBoletaContext";
import ModalVisualizarFactura from "./components/modal/ModalVisualizarFactura";
import DatosDelCliente from "./components/campos/DatosDelCliente";
import DatosDelComprobante from "./components/campos/DatosDelComprobante";
import FormaDePago from "./components/campos/FormaDePago";
import MontoyProductos from "./components/campos/MontoyProductos";
import DatosDeDetraccion from "./components/campos/DatosDeDetraccion";
import { useSearchParams } from "react-router-dom";
import { formatearBorrador } from "../utils/formatearBorrador";
import facturaService from "../service/FacturaService";
import { toast } from "react-toastify";
import { ValorInicialFactura } from "./utils/valoresInicial";

const FacturaBoleta = () => {
    const { factura, setFactura } = useFacturaBoleta();

    const [searchParams] = useSearchParams();
    const tipo = searchParams.get("tipo");
    const id = searchParams.get("id");

    const handleRegister = async () => {
        // *conseguir id usuario
        const user = localStorage.getItem("user");
        const userData = JSON.parse(user);

        console.log("formatear documento")
        let tipo_borrador = ""
        if (factura.tipo_Doc == "01") {
            tipo_borrador = "factura"
        }
        if (factura.tipo_Doc == "03") {
            tipo_borrador = "boleta"
        }
        const formateado = await formatearBorrador(tipo_borrador, factura, userData.id);

        try {
            const { message, status, success } = await facturaService.registrarBorrador(formateado);
            if (status == 201 && success) {
                toast.success(message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setFactura(ValorInicialFactura);
            }
            if (status == 400 && !success) {
                toast.error(message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }

        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="min-h-screen w-full flex flex-col items-center px-4 md:px-8 py-6 bg-gray-100">
            <div className="w-full max-w-6xl ">
                <div className="flex items-center justify-between mb-6 ">
                    <h2 className="text-2xl md:text-3xl font-bold text-blue-600">
                        Generar Factura / Boleta
                    </h2>
                </div>


                {/* Form content */}
                <div
                    className=" shadow-xl border bg-white border-gray-400  rounded-3xl  p-4  transition-all duration-300 mb-6"
                >
                    {/* Form */}
                    {/* Datos del comprobante */}
                    <DatosDelComprobante />
                    {/* Datos del cliente */}
                    <DatosDelCliente />
                    {/* Montos y productos */}
                    <MontoyProductos />
                    {/* Forma de pago */}
                    <FormaDePago />
                    {/* Datos de detraccion */}
                    <DatosDeDetraccion />

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
