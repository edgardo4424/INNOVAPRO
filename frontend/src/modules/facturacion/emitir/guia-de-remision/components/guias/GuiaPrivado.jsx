import { Eye } from "lucide-react";
import ChoferPrivadoForm from "../../forms/ChoferPrivadoForm";
import DatosDeClienteForm from "../../forms/DatosDeClienteForm";
import DatosDeEmpresaForm from "../../forms/DatosDeEmpresaForm";
import DatosGuiaEnvioPrivadoForm from "../../forms/DatosGuiaEnvioPrivadoForm";
import DetalleProductoForm from "../../forms/DetalleProductoForm";
import InfDocumentoForm from "../../forms/InfDocumentoForm";
import ModalVisualizarGuiaPrivada from "../modal/ModalVisualizarGuiaPrivada";

const GuiaPrivado = () => {

    return (
        <div className="container max-w-6xl mx-auto ">
            <form
                onSubmit={(e) => {e.preventDefault();}}
                className=" shadow-xl border border-gray-400 bg-white  rounded-3xl  p-10  transition-all duration-300 mb-6"
            >
                {/* Sección de Documento Principal */}
                <InfDocumentoForm />

                {/* Sección de Datos de la Empresa */}
                <DatosDeEmpresaForm />

                {/* Sección de Datos del Cliente */}
                <DatosDeClienteForm />

                {/* Sección de Guía de Envío */}
                <DatosGuiaEnvioPrivadoForm />

                {/* Sección de Estado y Otros */}
                {/* <EstadoYOtrosDatosForm /> */}

                {/* Sección de Transportista */}
                <ChoferPrivadoForm />

                {/* Sección de Detalle de Productos */}
                <DetalleProductoForm />

                {/* Botón de Enviar */}
                <div className="flex justify-between">
                    <div className="flex gap-x-3">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-blue-700 text-white font-medium rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 cursor-pointer"
                        >
                            Guardar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-red-700 text-white font-medium rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 cursor-pointer"
                        >
                            Cancelar
                        </button>
                    </div>
                    <ModalVisualizarGuiaPrivada />
                </div>
            </form>
        </div>
    );
};

export default GuiaPrivado;
