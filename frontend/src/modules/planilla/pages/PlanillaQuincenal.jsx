import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import Filtro from "../components/Filtro";
import TablePlanillaQuincenal from "../components/tipo-planilla/TablePlanillaQuincenal";
import TableRHQuincenal from "../components/tipo-rh/TableRHQuincenal";

import planillaQuincenalService from "../services/planillaQuincenalService";
import { viPlanillaQuincenal } from "../utils/valorInicial";

const PlanillaQuincenal = () => {
  const [filiales, setFiliales] = useState([]);

  // ?? loading
  const [loading, setLoading] = useState(false);

  // ?? Estados Solo para los que son planilla
  const [planillaQuincenalTipoPlanilla, setPlanillaQuincenaltipoPlanilla] =
    useState(viPlanillaQuincenal.planilla);

     // ?? Estados Solo para los que son por honorarios
 
  const [planillaQuincenalTipoRh, setPlanillaQuincenalTipoRh] = useState(
    viPlanillaQuincenal.honorarios
  );

  // ?? Filtro para la peticion
  const [filtro, setFiltro] = useState({
    anio: new Date().getFullYear() + "",
    mes: "01",
    filial_id: "1",
  });

  const buscarPlanillaQuincenal = async () => {
    try {
      setLoading(true);
      const fecha_anio_mes = `${filtro.anio}-${filtro.mes}`;
      
      const dataPOST = {
        fecha_anio_mes,
        filial_id: filtro.filial_id,
      }
      const res = await planillaQuincenalService.obtenerPlanillaQuincenal(dataPOST);
      console.log('res', res);
      setPlanillaQuincenaltipoPlanilla(res.planilla.trabajadores);
      setPlanillaQuincenalTipoRh(res.honorarios.trabajadores);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const obtenerFiliales = async () => {
      try {
        const res = await planillaQuincenalService.obtenerFiliales();
        console.log("res", res);
        setFiliales(res);
        setFiltro({ ...filtro, filial_id: res?.[0]?.id });
      } catch (error) {
        console.log(error);
      }
    };
    obtenerFiliales();
  }, []);

  const renderTipoPlanilla = () => {

    if (planillaQuincenalTipoPlanilla) {
      return (
        <div className="w-full px-7">
          <TablePlanillaQuincenal planillaQuincenalTipoPlanilla={planillaQuincenalTipoPlanilla} />
        </div>
      );
    }
  }

  const renderTipoRh = () => {
    if (planillaQuincenalTipoRh) {
      return (
        <div className="w-full px-7">
          <TableRHQuincenal planillaQuincenalTipoRh={planillaQuincenalTipoRh} />
        </div>
      );
    }
  }

  return (
    <div className="min-h-full flex-1  flex flex-col items-center">
      <div className="w-full px-4 max-w-7xl py-6 flex justify-between">
        <div className="flex flex-col w-full">
          <h2 className=" text-2xl md:text-3xl font-bold text-gray-800 !text-start">
            Planilla Quincenal
          </h2>
          <Filtro
            filiales={filiales}
            filtro={filtro}
            setFiltro={setFiltro}
            Buscar={buscarPlanillaQuincenal}
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
      ) : (
          <>{renderTipoPlanilla()}
            {renderTipoRh()}
          </>
      )}

      
    </div>
  );
};

export default PlanillaQuincenal;
