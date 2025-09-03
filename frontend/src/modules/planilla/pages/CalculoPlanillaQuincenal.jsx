import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import Filtro from "../components/Filtro";
import TablePlanillaQuincenal from "../components/tipo-planilla/TablePlanillaQuincenal";
import TableRHQuincenal from "../components/tipo-rh/TableRHQuincenal";

import planillaQuincenalService from "../services/planillaQuincenalService";
import { viPlanillaQuincenal } from "../utils/valorInicial";

import { ModalCerrarPlanillaQuincenal } from "../components/ModalCerrarPlanillaQuincenal";

const CalculoPlanillaQuincenal = () => {
  const [filiales, setFiliales] = useState([]);

  // ?? loading
  const [loading, setLoading] = useState(false);

  // ?? Estados Solo para los que son planilla
  const [planillaQuincenalTipoPlanilla, setPlanillaQuincenalTipoPlanilla] =
    useState(viPlanillaQuincenal.planilla);

     // ?? Estados Solo para los que son por honorarios
 
  const [planillaQuincenalTipoRh, setPlanillaQuincenalTipoRh] = useState(
    viPlanillaQuincenal.honorarios
  );

  // ?? Filtro para la peticion
  const [filtro, setFiltro] = useState({
    anio: new Date().getFullYear() + "",
    mes: new Date().toLocaleString("es-PE", { month: "2-digit" }),
    filial_id: "",
  });

  const buscarPlanillaQuincenal = async () => {
    try {
      setLoading(true);
      const fecha_anio_mes = `${filtro.anio}-${filtro.mes}`;
      
      const dataPOST = {
        fecha_anio_mes,
        filial_id: filtro.filial_id,
      }

      console.log('dataPOST', dataPOST);
      const res = await planillaQuincenalService.obtenerPlanillaQuincenal(dataPOST);
      console.log('res', res);
      setPlanillaQuincenalTipoPlanilla(res.planilla.trabajadores);
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

    console.log('planillaQuincenalTipoPlanilla', planillaQuincenalTipoPlanilla);
    if (planillaQuincenalTipoPlanilla) {
      return (
     
          <TablePlanillaQuincenal planillaQuincenalTipoPlanilla={planillaQuincenalTipoPlanilla} />
      
      );
    }
  }

  const renderTipoRh = () => {
    if (planillaQuincenalTipoRh) {
      return (
        
          <TableRHQuincenal planillaQuincenalTipoRh={planillaQuincenalTipoRh} />
     
      );
    }
  }

  return (
    <div className="min-h-full flex-1  flex flex-col items-center">
      <div className="w-full px-4 max-w-7xl py-6 flex justify-between">
        <div className="flex flex-col w-full">
          
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
          <div className="w-full px-7 ">
          {/* <pre className="whitespace-pre-wrap break-words bg-gray-100 p-4 rounded-lg text-xs">
            {JSON.stringify(datosCalculo, null, 2)}
          </pre> */}
          {renderTipoPlanilla()}
            {renderTipoRh()}
            {
              (planillaQuincenalTipoPlanilla.length > 0 || planillaQuincenalTipoRh.length > 0) && (
                <div className="flex justify-end pb-6">
                            <ModalCerrarPlanillaQuincenal filtro={filtro} planillaQuincenalTipoPlanilla={planillaQuincenalTipoPlanilla} planillaQuincenalTipoRh={planillaQuincenalTipoRh}/>
                          </div>
              )
            }
          </div>
      )}

      
    </div>
  );
};

export default CalculoPlanillaQuincenal;
