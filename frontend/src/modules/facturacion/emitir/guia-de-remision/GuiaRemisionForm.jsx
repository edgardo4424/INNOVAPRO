import { useGuiaTransporte } from "@/modules/facturacion/context/GuiaTransporteContext";
import GuiaMismaEmpresa from "./components/guias/GuiaMismaEmpresa";
import GuiaPrivado from "./components/guias/GuiaPrivado";
import GuiaPublico from "./components/guias/GuiaPublico";
import ModalVisualizarGuiaPrivada from "./components/modal/ModalVisualizarGuiaPrivada";
import DatosDeClienteForm from "./forms/DatosDeClienteForm";
import DatosDeEmpresaForm from "./forms/DatosDeEmpresaForm";
import DetalleForm from "./forms/DetalleForm";
import InfDocumentoForm from "./forms/InfDocumentoForm";

const GuiaRemisionForm = () => {

    const { tipoGuia } = useGuiaTransporte();


    const render = () => {
        if (tipoGuia == "transporte-privado") {
            return <GuiaPrivado />;
        } else if (tipoGuia == "transporte-publico") {
            return <GuiaPublico />;
        } else if (tipoGuia == "traslado-misma-empresa") {
            return <GuiaMismaEmpresa />;
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center  md:px-8 py-6 bg-gray-100">
            <div className="w-full max-w-6xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl md:text-2xl font-bold ">
                        Guia de Remision
                    </h2>
                </div>

                <form
                    onSubmit={(e) => { e.preventDefault(); }}
                    className=" shadow-xl border bg-white border-gray-400  rounded-3xl  p-4  transition-all duration-300 mb-6"
                    >
                    {/* Sección de Documento Principal */}
                    <InfDocumentoForm />


                    {/* Sección de Datos del Cliente */}
                    <DatosDeClienteForm />

                    {/* //?Renderizado dinámico segun el tipo de guia que seleccione */}
                    {
                        render()
                    }

                    {/* Sección de Detalle de Productos */}
                    <DetalleForm />

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
        </div>
    );
};

export default GuiaRemisionForm;