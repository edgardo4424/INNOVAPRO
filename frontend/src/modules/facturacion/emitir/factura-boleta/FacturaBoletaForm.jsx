import { useNavigate, useSearchParams } from "react-router-dom";
import { useFacturaBoleta } from "../../context/FacturaBoletaContext";
import facturaService from "../../service/FacturaService";
import { formatearBorrador } from "../../utils/formatearBorrador";
import DatosDeDetraccion from "./components/campos/DatosDeDetraccion";
import DatosDelCliente from "./components/campos/DatosDelCliente";
import DatosDelComprobante from "./components/campos/DatosDelComprobante";
import FormaDePago from "./components/campos/FormaDePago";
import MontoyProductos from "./components/campos/MontoyProductos";
import ModalVisualizarFactura from "./components/modal/ModalVisualizarFactura";
import { ValorInicialFactura } from "./utils/valoresInicial";
import DatosDeRetencion from "./components/campos/DatosDeRetencion";
import { toast } from "sonner";

const FacturaBoletaForm = () => {
    const { factura, setFactura, idBorrador, Limpiar } = useFacturaBoleta();
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const tipo = searchParams.get("tipo");
    const id = searchParams.get("id");

    const handleRegister = async () => {
        if (idBorrador) {
            toast.error("Estas tratando de registrar la factura como un borrardor, pero esta fue rellenada con un borrador previo")
            return
        }

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

    const handleCancelar = () => {
        Limpiar();
        // navigate("/facturacion/bandeja/factura-boleta?page=1&limit=10");
    };
    return (
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

            {/* Datos de retencion */}
            <DatosDeRetencion />

            {/* Datos de detraccion */}
            <DatosDeDetraccion />

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
                    <button
                        onClick={handleCancelar}
                        className="py-3 px-4 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 cursor-pointer ">
                        Cancelar
                    </button>
                </div>
                <ModalVisualizarFactura />
            </div>
        </div>

    );
};

export default FacturaBoletaForm;
