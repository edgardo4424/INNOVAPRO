import { useGuiaTransporte } from "@/modules/facturacion/context/GuiaTransporteContext";
import ModalVisualizarGuiaPrivada from "./components/modal/ModalVisualizarGuiaPrivada";
import ChoferPrivadoForm from "./forms/ChoferPrivadoForm";
import DatosDeClienteForm from "./forms/DatosDeClienteForm";
import DatosGuiaEnvioForm from "./forms/DatosGuiaEnvioForm";
import DetalleForm from "./forms/DetalleForm";
import InfDocumentoForm from "./forms/InfDocumentoForm";
import TransportistaPublicoForm from "./forms/TransportistaPublicoForm";


const GuiaRemisionForm = () => {

    const { tipoGuia } = useGuiaTransporte();


    const render = () => {
        if (tipoGuia == "transporte-publico") {
            return <TransportistaPublicoForm />;
        } else if (tipoGuia == "transporte-privado") {
            return <></>;
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

                <div
                    onSubmit={(e) => { e.preventDefault(); }}
                    className=" shadow-xl border bg-white border-gray-400  rounded-3xl  p-4  transition-all duration-300 mb-6"
                >
                    {/* Sección de Documento Principal */}
                    <InfDocumentoForm />


                    {/* Sección de Datos del Cliente */}
                    <DatosDeClienteForm />

                    {/* Seccion de Datos Guia de Envío */}
                    <DatosGuiaEnvioForm />

                    {/* Seccion de Chofer Privado */}
                    <ChoferPrivadoForm />;
                    {/* //?Renderizado dinámico segun el tipo de guia que seleccione */}
                    {
                        render()
                    }

                    {/* Sección de Detalle de Productos */}
                    <DetalleForm />

                    {/* Botón de Enviar */}
                    <div className="flex justify-end">
                        <ModalVisualizarGuiaPrivada />
                    </div>

                </div>

            </div>
        </div>
    );
};

export default GuiaRemisionForm;