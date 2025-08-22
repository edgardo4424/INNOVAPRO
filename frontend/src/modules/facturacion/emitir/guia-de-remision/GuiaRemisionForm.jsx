import { useGuiaTransporte } from "@/context/Factura/GuiaTransporteContext";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GuiaMismaEmpresa from "./components/guias/GuiaMismaEmpresa";
import GuiaPrivado from "./components/guias/GuiaPrivado";
import GuiaPublico from "./components/guias/GuiaPublico";
import {
    guiaMismaEmpresa,
    guiaPrivada,
    guiaPublica
} from "./utils/valoresIncialGuia";

const GuiaRemisionForm = () => {
    const navigate = useNavigate();

    const {
        setGuiaTransporte,
        setTipoGuia,
        setGuiaTransporteValida,
    } = useGuiaTransporte();

    const { tipoGuia } = useParams();

    const [loading, setLoading] = useState(true);
    const [guiaCargada, setGuiaCargada] = useState(null);

    const asignacionGuia = () => {
        switch (tipoGuia) {
            case "transporte-privado":
                setGuiaCargada(<GuiaPrivado />);
                setGuiaTransporte(guiaPrivada);
                setTipoGuia("PRIVADO");
                break;
            case "transporte-publico":
                setGuiaCargada(<GuiaPublico />);
                setGuiaTransporte(guiaPublica);
                setTipoGuia("PUBLICO");
                break;
            case "traslado-misma-empresa":
                setGuiaCargada(<GuiaMismaEmpresa />);
                setGuiaTransporte(guiaMismaEmpresa);
                setTipoGuia("MISMA_EMPRESA");
                break;
            default:
                setGuiaCargada(null);
                setGuiaTransporte(null);
                setGuiaTransporteValida({});
                setTipoGuia(null);
                break;
        }
    };

    useEffect(() => {
        // Establecer el estado de carga al principio de la navegación
        setLoading(true);

        asignacionGuia();

        // Finalmente, establecer la carga a falso
        setLoading(false);

    }, [tipoGuia]);

    const getTituloGuia = (tipo) => {
        switch (tipo) {
            case "transporte-privado":
                return "Guía de Remisión - Transporte Privado";
            case "transporte-publico":
                return "Guía de Remisión - Transporte Público";
            case "traslado-misma-empresa":
                return "Guía de Remisión - Traslado Misma Empresa";
            default:
                return "No se pudo obtener el nombre de la guía";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-100">
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                    <p className="ml-2 text-xl text-blue-500">Cargando guía...</p>
                </div>
                <p className="mt-2 text-lg text-gray-500">
                    Esto puede tardar unos segundos.
                </p>
            </div>
        );
    }

    // Si la guía cargada es null, significa que el tipo no es válido.
    if (!loading && guiaCargada === null) {
        return (
            <div className="min-h-screen w-full flex flex-col items-center  bg-gray-100">
                <div className="flex flex-col items-center bg-gray-400 border mt-8 border-gray-300 shadow-md rounded-lg p-4">
                    <p className="text-2xl font-bold text-red-500 ">
                        Tipo de guía no válido. Intente nuevamente.
                    </p>
                    <button
                        className="mt-4 bg-zinc-600 hover:bg-zinc-800 cursor-pointer text-white font-bold py-2 px-6 rounded-lg"
                        onClick={() => navigate("/facturacion/generar")}
                    >
                        Seleccionar nuevamente
                    </button>
                </div>
            </div>
        );
    }

    const tituloPagina = getTituloGuia(tipoGuia);

    return (
        <div className="min-h-screen w-full flex flex-col items-center  md:px-8 py-6 bg-gray-100">
            <div className="w-full max-w-6xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl md:text-2xl font-bold ">
                        {tituloPagina}
                    </h2>
                </div>
                {guiaCargada}
            </div>
        </div>
    );
};

export default GuiaRemisionForm;