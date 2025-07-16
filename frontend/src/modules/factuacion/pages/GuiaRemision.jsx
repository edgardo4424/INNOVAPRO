import { Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getGuiaRemisionTemplate } from '../utils/guiaRemisionTemplates'; // Asegúrate de que la ruta sea correcta
import PrivadoForm from '../guia-de-remision/forms/PrivadoForm';
import PublicoForm from '../guia-de-remision/forms/PublicoForm';

// Asumo que tendrás un estado y su setter para los datos de la guía
// Si usas un contexto, podrías importar useFacturacion y desestructurar { guiaTransporte, setGuiaTransporte }
// Por ahora, usaremos useState localmente para el ejemplo.

const GuiaRemision = () => {
    // 1. Obtener el parámetro 'tipoGuia' de la URL
    const { tipoGuia } = useParams();

    // 2. Estado local para almacenar los datos de la guía
    // Inicializamos con null o un objeto vacío hasta que se cargue la plantilla
    const [guiaTransporte, setGuiaTransporte] = useState(null);

    // Estado para controlar la visibilidad del tooltip
    const [showTooltip, setShowTooltip] = useState(false);

    // --- Funciones para títulos y tooltips (sin cambios, para contexto) ---
    const getTituloGuia = (tipo) => {
        switch (tipo) {
            case 'transporte-privado':
                return 'Guía de Remisión - Transporte Privado';
            case 'transporte-publico':
                return 'Guía de Remisión - Transporte Público';
            case 'traslado-misma-empresa':
                return 'Guía de Remisión - Traslado Misma Empresa';
            default:
                return 'Guía de Remisión';
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
                return 'Genera la guía de remisión correspondiente al tipo de traslado seleccionado.';
        }
    };

    // 3. Usar useEffect para cargar la plantilla cuando el componente se monte
    // o cuando 'tipoGuia' cambie.
    useEffect(() => {
        const template = getGuiaRemisionTemplate(tipoGuia);
        if (template) {
            setGuiaTransporte(template); // ¡Aquí se pasa la plantilla al estado!
            console.log("Plantilla de guía cargada:", template);
        } else {
            console.error(`Error: Tipo de guía '${tipoGuia}' no reconocido.`);
            setGuiaTransporte(null); // O maneja este error de otra manera, ej. redirigir
        }
    }, [tipoGuia]); // Asegúrate de que este efecto se ejecute cuando tipoGuia cambie

    // Si la plantilla aún no se ha cargado (ej. tipo no válido o aún cargando)
    if (guiaTransporte === null) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
                <p className="text-xl text-red-500">Cargando guía o tipo no válido...</p>
            </div>
        );
    }

    // Si llegamos aquí, guiaTransporte ya tiene la plantilla cargada
    const tituloPagina = getTituloGuia(tipoGuia);
    const tooltipText = getTooltipContent(tipoGuia);

    return (
        <div className="min-h-screen w-full flex flex-col items-center  md:px-8 py-6 bg-gray-100">
            <div className="w-full max-w-7xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl md:text-3xl font-bold text-blue-600">
                        {tituloPagina}
                    </h2>
                </div>

                <div className="bg-white md:p-6 rounded-lg shadow-md relative">
                    <div className="flex items-center justify-between mb-4 p-6 md:p-0">
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

                    {/* Aquí iría tu formulario real */}
                    <p className="md:mt-4 text-gray-500 text-xs md:text-sm px-6">
                        A continuación, puedes rellenar los datos para este tipo de guía de remisión:
                    </p>
                    <div className="bg-gray-50 border border-gray-200 py-2 text-sm md:p-8 rounded-md mt-6 text-center text-gray-400">
                        <p className='py-2 md:p-0'>Los campos del formulario para **{tipoGuia.replace(/-/g, ' ').toLowerCase()}** irán aquí.</p>

                        {/* <PrivadoForm /> */}
                        <PublicoForm />
                    </div>


                </div>
            </div>
        </div>
    );
};

export default GuiaRemision;