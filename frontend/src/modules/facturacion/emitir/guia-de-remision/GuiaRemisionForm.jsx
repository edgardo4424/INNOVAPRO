import { useGuiaTransporte } from "@/modules/facturacion/context/GuiaTransporteContext";
import { useEffect } from "react";
import GuiaMismaEmpresa from "./components/guias/GuiaMismaEmpresa";
import GuiaPrivado from "./components/guias/GuiaPrivado";
import GuiaPublico from "./components/guias/GuiaPublico";
import DatosDeClienteForm from "./forms/DatosDeClienteForm";
import DatosDeEmpresaForm from "./forms/DatosDeEmpresaForm";
import DetalleProductoForm from "./forms/DetalleProductoForm";
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

    useEffect(() => {
        console.log(tipoGuia);
    }, [tipoGuia]);

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
                    className=" shadow-xl border border-gray-400 bg-white  rounded-3xl  p-10  transition-all duration-300 mb-6"
                >
                    {/* Sección de Documento Principal */}
                    <InfDocumentoForm />

                    {/* Sección de Datos de la Empresa */}
                    <DatosDeEmpresaForm />

                    {/* Sección de Datos del Cliente */}
                    <DatosDeClienteForm />

                    {/* //?Renderizado dinámico segun el tipo de guia que seleccione */}
                    {
                        render()
                    }

                    {/* Sección de Detalle de Productos */}
                    <DetalleProductoForm />
                </form>

            </div>
        </div>
    );
};

export default GuiaRemisionForm;