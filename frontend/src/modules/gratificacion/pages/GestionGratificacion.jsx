import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import Filtro from "../components/Filtro";
import ListaGratificacion from "../components/ListaGratificacion";
import gratificacionService from "../services/gratificacionService";
import { viFiltro, viGratificacion } from "../utils/valorInicial";

const GestionGratificacion = () => {
    // ?? loading
    const [loading, setLoading] = useState(false);
    // ?? Data
    const [gratificacion, setGratificacion] = useState(viGratificacion);
    const [filtroGratificacion, setFiltroGratificacion] = useState(viGratificacion);//* Data Filtrada

    // ?? Filtro para la peticion
    const [filtro, setFiltro] = useState(viFiltro);

    // ?? Filtro para la tabla
    const [filtroTrabajador, setFiltroTrabajador] = useState("");

    const fetchGratificacion = async () => {
        try {
            setLoading(true);
            const res = await gratificacionService.obtenerGratificaciones(filtro);
            setGratificacion(res)
            setFiltroGratificacion(res);
        } catch (error) {
        }
        finally {
            setLoading(false);
        }
    };

    const Buscar = () => {
        fetchGratificacion();
    };

    useEffect(() => {

    }, []);


    return (
        <div className="min-h-full flex-1  flex flex-col items-center">
            <div className="w-full px-4 max-w-7xl py-6 flex justify-between">
                <div className="flex flex-col w-full">
                    <h2 className=" text-2xl md:text-3xl font-bold text-gray-800 !text-start">
                        Gestión de Gratificaciones
                    </h2>
                    <Filtro filtro={filtro} setFiltro={setFiltro} Buscar={Buscar} />
                </div>
            </div>
            {loading ? (
                <div className="w-full px-20  max-w-8xl min-h-[50vh] flex items-center">
                    <div className="w-full flex flex-col items-center justify-center">
                        <LoaderCircle className="text-gray-800 size-30 animate-spin" />
                        <h2 className="text-gray-800 text-2xl">Cargando...</h2>
                    </div>
                </div>
            ) : (
                gratificacion ? (
                    <div className="w-full px-7 ">
                        <ListaGratificacion gratificacion={filtroGratificacion} />
                        {/* <ListaGratificacion TipoGratificacion="Honorarios" gratificacion={Gratificacion.honorarios} /> */}
                    </div>
                ) : (
                    <div className="w-full px-20  max-w-8xl min-h-[50vh] flex items-center">
                        <div className="w-full flex flex-col items-center justify-center">
                            <h2 className="text-gray-800 text-2xl">No hay trabajadores</h2>
                        </div>
                    </div>
                )
            )}
        </div>
    );
};

export default GestionGratificacion;

