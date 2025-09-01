import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import Filtro from "../components/Filtro";
import TablePlanillaMensual from "../components/tipo-planilla/TablePlanillaMensual";
import TableRHMensual from "../components/tipo-rh/TableRHMensual";

import planillaMensualService from "../services/planillaMensualService";
import { viPlanillaMensual } from "../utils/valorInicial";

const PlanillaMensual = () => {
  const [filiales, setFiliales] = useState([]);

  // ?? loading
  const [loading, setLoading] = useState(false);

  // ?? Estados Solo para los que son planilla
  const [planillaMensualTipoPlanilla, setPlanillaMensualTipoPlanilla] =
    useState(viPlanillaMensual.planilla);

     // ?? Estados Solo para los que son por honorarios
 
  const [planillaMensualTipoRh, setPlanillaMensualTipoRh] = useState(
    viPlanillaMensual.honorarios
  );

  const [datosCalculo, setDatosCalculo] = useState({})

  // ?? Filtro para la peticion
  const [filtro, setFiltro] = useState({
    anio: new Date().getFullYear() + "",
    mes: "01",
    filial_id: "1",
  });

  const buscarPlanillaMensual = async () => {
    try {
      const dia_fin_mes=new Date(filtro.anio, filtro.mes, 0).getDate()
      setLoading(true);
      const anio_mes_dia = `${filtro.anio}-${filtro.mes}-${dia_fin_mes}`;
      
      const dataPOST = {
        anio_mes_dia,
        filial_id: filtro.filial_id,
      }

      console.log('dataPOST', dataPOST);
      const res = await planillaMensualService.obtenerPlanillaMensual(dataPOST);
      console.log('res', res);
      setPlanillaMensualTipoPlanilla(res.payload.planilla.trabajadores);
      setPlanillaMensualTipoRh(res.payload.honorarios.trabajadores);
      setDatosCalculo(res.datosCalculo)
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const obtenerFiliales = async () => {
      try {
        const res = await planillaMensualService.obtenerFiliales();
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

    if (planillaMensualTipoPlanilla) {
      return (
        <div className="w-full px-7">
          <TablePlanillaMensual planillaMensualTipoPlanilla={planillaMensualTipoPlanilla} />
        </div>
      );
    }
  }

  const renderTipoRh = () => {
    if (planillaMensualTipoRh) {
      return (
        <div className="w-full px-7">
          <TableRHMensual planillaMensualTipoRh={planillaMensualTipoRh} />
        </div>
      );
    }
  }

  return (
    <div className="min-h-full flex-1  flex flex-col items-center">
      <div className="w-full px-4 max-w-7xl py-6 flex justify-between">
        <div className="flex flex-col w-full">
          <h2 className=" text-2xl md:text-3xl font-bold text-gray-800 !text-start">
            Planilla Mensual
          </h2>
          <Filtro
            filiales={filiales}
            filtro={filtro}
            setFiltro={setFiltro}
            Buscar={buscarPlanillaMensual}
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
          <>
          {/* <pre className="whitespace-pre-wrap break-words bg-gray-100 p-4 rounded-lg text-xs">
            {JSON.stringify(datosCalculo, null, 2)}
          </pre> */}
          {renderTipoPlanilla()}
            {renderTipoRh()}
          </>
      )}

      
    </div>
  );
};

export default PlanillaMensual;
