import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import Filtro from "../components/Filtro";

import planillaQuincenalService from "../services/planillaQuincenalService";

import { viPlanillaQuincenal } from "../utils/valorInicial";
import TablePlanillaQuincenal from "../components/tipo-planilla/TablePlanillaQuincenal";
import TableRHQuincenal from "../components/tipo-rh/TableRHQuincenal";
import ExportExcel from "@/shared/components/exportarExcel";

const HistoricoPlanillaQuincenal = ({setEsCalculo, setDataMantenimiento}) => {
  
  setEsCalculo(false)

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

   //!Estado para el excel
   const [libroExcel,setLibroExcel]=useState(null)


  const buscarPlanillaQuincenalCerrada = async () => {
    try {
       setEsCalculo(false)
      setLoading(true);
      const fecha_anio_mes = `${filtro.anio}-${filtro.mes}`;
      
      const dataPOST = {
        fecha_anio_mes,
        filial_id: filtro.filial_id,
      }
      const res = await planillaQuincenalService.obtenerPlanillaQuincenalCerradas(dataPOST);
      
   let dataMantenimientoDetalle = res.data_mantenimiento_detalle;

      try {
  if (typeof dataMantenimientoDetalle === "string" && dataMantenimientoDetalle.trim() !== "") {
    dataMantenimientoDetalle = JSON.parse(dataMantenimientoDetalle);
  }
} catch (e) {
  console.error("Error al parsear data_mantenimiento_detalle:", e);
  dataMantenimientoDetalle = {};
}
   
      setDataMantenimiento(dataMantenimientoDetalle || {});
      setPlanillaQuincenalTipoPlanilla(res.planilla.trabajadores);
      setPlanillaQuincenalTipoRh(res.honorarios.trabajadores);
    } catch (error) {
    /*   console.log('error', error); */
    } finally {
      setLoading(false);
    }
  };

  const renderTipoPlanilla = () => {

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


  useEffect(() => {
    const obtenerFiliales = async () => {
      try {
        const res = await planillaQuincenalService.obtenerFiliales();
        
        setFiliales(res);
        setFiltro({ ...filtro, filial_id: res?.[0]?.id });
      } catch (error) {
        //console.log(error);
      }
    };
    obtenerFiliales();
  }, []);

  useEffect(()=>{

      let hojas=[]
      
      if(planillaQuincenalTipoPlanilla.length>0){
          hojas.push(
            { 
              nombre_libro: "Planilla Quincenal", 
               datos: planillaQuincenalTipoPlanilla,
               columnas: [{ key: "asig_fam", label: "Asignación" }],
               excluir: ["id","trabajador_id","contrato_id", "registro_planilla_quincenal_detalle"]
            })
      }
      
      if(planillaQuincenalTipoRh.length>0){
            hojas.push({ nombre_libro: "Honorarios", datos: planillaQuincenalTipoRh ,excluir: ["id","trabajador_id", "contrato_id","registro_planilla_quincenal_detalle"]})
      }
      
      setLibroExcel(hojas)

   },[planillaQuincenalTipoPlanilla,planillaQuincenalTipoRh])

  return (
    <div className="min-h-full flex-1  flex flex-col items-center space-y-6">
      
        <div className="w-full px-7 flex justify-between">
          
          <Filtro
            filiales={filiales}
            filtro={filtro}
            setFiltro={setFiltro}
            Buscar={buscarPlanillaQuincenalCerrada}
          />
        </div>
    
        {libroExcel&&<ExportExcel nombreArchivo={`Planilla_mensual_${filtro.mes||"x"}.xlsx`} hojas={libroExcel}/>}
         

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
                
                </div>
            )}
      
    </div>
  );
};

export default HistoricoPlanillaQuincenal;
