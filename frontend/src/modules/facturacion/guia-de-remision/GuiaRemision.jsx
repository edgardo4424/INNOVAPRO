import { useGuiaTransporte } from '@/context/Factura/GuiaTransporteContext';
import { Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GuiaMismaEmpresa from './components/guias/GuiaMismaEmpresa';
import GuiaPrivado from './components/guias/GuiaPrivado';
import GuiaPublico from './components/guias/GuiaPublico';
import { guiaMismaEmpresa, guiaMismaEmpresaValidar, guiaPrivada, guiaPrivadaValidar, guiaPublica, guiaPublicaValidar } from './utils/valoresIncialGuia';

const GuiaRemision = () => {

    const navigate = useNavigate();

    const { guiaTransporte, setGuiaTransporte, setGuiaTransporteValida, setTipoGuia } = useGuiaTransporte();

    const { tipoGuia } = useParams();

    const [loading, setLoading] = useState(true);


    const [showTooltip, setShowTooltip] = useState(false);

    const asignacionGuia = () => {

        if (tipoGuia == "transporte-privado") {
            setGuiaTransporte(guiaPrivada)
            setGuiaTransporteValida(guiaPrivadaValidar)
            setTipoGuia("PRIVADO");
            setLoading(false);
        } else if (tipoGuia == "transporte-publico") {
            setGuiaTransporte(guiaPublica)
            setGuiaTransporteValida(guiaPublicaValidar)
            setTipoGuia("PUBLICO");
            setLoading(false);
        } else if (tipoGuia == "traslado-misma-empresa") {
            setGuiaTransporte(guiaMismaEmpresa)
            setGuiaTransporteValida(guiaMismaEmpresaValidar)
            setTipoGuia("MISMA_EMPRESA");
            setLoading(false);
        } else {
            setGuiaTransporte(null);
            setGuiaTransporteValida(null);
            setTipoGuia(null);
            setLoading(false);
        }
    }

    useEffect(() => {
        setLoading(true);
        asignacionGuia()
    }, [tipoGuia])

    const getTituloGuia = (tipo) => {
        switch (tipo) {
            case 'transporte-privado':
                return 'Guía de Remisión - Transporte Privado';
            case 'transporte-publico':
                return 'Guía de Remisión - Transporte Público';
            case 'traslado-misma-empresa':
                return 'Guía de Remisión - Traslado Misma Empresa';
            default:
                return 'No se pudo obtener el nombre de la guía';
        }
    };

    const getTooltipContent = (tipo) => {
        switch (tipo) {
            case 'transporte-privado':
                return 'Aquí puedes generar la guía para el transporte de mercancías utilizando tu propia flota o vehículos.';
            case 'transporte-publico':
                return 'Esta sección te permite emitir guías de remisión cuando la mercancía es enviada a través de una empresa de transporte público.';
            case 'traslado-misma-empresa':
                return 'Utiliza esta opción para registrar el movimiento de bienes entre diferentes sucursales o almacenes de tu misma empresa.';
            default:
                return 'No se pudo obtener el contenido del tooltip';
        }
    };


    // Si la plantilla aún no se ha cargado (ej. tipo no válido o aún cargando)
    if (loading && guiaTransporte === null) {
        return (
            <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-100">
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                    <p className="ml-2 text-xl text-blue-500">Cargando guía...</p>
                </div>
                <p className="mt-2 text-lg text-gray-500">Esto puede tardar unos segundos.</p>
            </div>
        );
    }


    if (!loading && guiaTransporte === null) {
        return (
            <div className="min-h-screen w-full flex flex-col items-center  bg-gray-100">
                <div className='flex flex-col items-center bg-gray-400 border mt-8 border-gray-300 shadow-md rounded-lg p-4'>
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

    // Si llegamos aquí, guiaTransporte ya tiene la plantilla cargada
    const tituloPagina = getTituloGuia(tipoGuia);
    const tooltipText = getTooltipContent(tipoGuia);

    return (
        <div className="min-h-screen w-full flex flex-col items-center  md:px-8 py-6 bg-gray-100">
            <div className="w-full max-w-6xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl md:text-3xl font-bold text-blue-600">
                        {tituloPagina}
                    </h2>
                </div>

                <div className="flex items-center justify-between  p-3 flex-col">
                    <div className='flex items-center gap-3'>
                        <p className="text-gray-700 text-sm md:text-lg">
                            Estás generando una guía de remisión para:{' '}
                            <span className="font-semibold text-blue-700">
                                {tipoGuia.replace(/-/g, ' ').toUpperCase()}
                            </span>
                        </p>
                        <div
                            className="relative flex items-center group cursor-help "
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                        >
                            <Info className="text-blue-500 w-5 h-5" />
                            {showTooltip && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 p-3 bg-gray-800 text-white md:text-sm  text-xs rounded-md shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ">
                                    {tooltipText}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-800 rotate-45 transform origin-bottom-left -mb-1"></div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>



                {tipoGuia === 'transporte-privado' ? (
                    <GuiaPrivado />
                ) : tipoGuia === 'transporte-publico' ? (
                    <GuiaPublico />
                ) : (
                    <GuiaMismaEmpresa />
                )}

            </div>
        </div>
    );
};

export default GuiaRemision;