import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import Filtro from "../components/Filtro";
import TableGratificacion from "../components/TableGratificacion";
import gratificacionService from "../services/gratificacionService";
import { viGratificacion } from "../utils/valorInicial";
import { format } from "date-fns";

const HistoricoGratificacion = () => {
  const [filiales, setFiliales] = useState([]);

  // ?? loading
  const [loading, setLoading] = useState(false);

  // ?? Data
  const [gratificacion, setGratificacion] = useState(viGratificacion);

  const periodo = format(new Date(), "MM-dd") < "07-17" ? "JULIO" : "DICIEMBRE";

  // ?? Filtro para la peticion
  const [filtro, setFiltro] = useState({
    anio: new Date().getFullYear() + "",
    periodo: periodo,
    filial_id: "1",
  });

  const buscarGratificacionCerrada = async () => {
    try {
      setLoading(true);
      const res = await gratificacionService.obtenerGratificacionesCerradas(filtro);
      setGratificacion(res);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const obtenerFiliales = async () => {
      try {
        const res = await gratificacionService.obtenerFiliales();
        console.log("res", res);
        setFiliales(res);
        setFiltro({ ...filtro, filial_id: res?.[0]?.id });
      } catch (error) {
        console.log(error);
      }
    };
    obtenerFiliales();
  }, []);

  return (
    <div className="min-h-full flex-1  flex flex-col items-center">
      <div className="w-full px-4 max-w-7xl py-6 flex justify-between">
        <div className="flex flex-col w-full">
          
          <Filtro
            filiales={filiales}
            filtro={filtro}
            setFiltro={setFiltro}
            Buscar={buscarGratificacionCerrada}
          />
        </div>
      </div>
      {loading ? (
        <div className="w-full px-20  max-w-8xl min-h-[50vh] flex items-center">
          <div className="w-full flex flex-col items-center justify-center">
            <LoaderCircle className="text-gray-800 size-30 animate-spin" />
            <h2 className="text-gray-800 text-2xl">Cargando...</h2>
          </div>
        </div>
      ) : gratificacion ? (
        <div className="w-full px-7 ">
          <TableGratificacion gratificacion={gratificacion} />
          
        </div>
      ) : (
        <div className="w-full px-20  max-w-8xl min-h-[50vh] flex items-center">
          <div className="w-full flex flex-col items-center justify-center">
            <h2 className="text-gray-800 text-2xl">No hay trabajadores</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoricoGratificacion;
