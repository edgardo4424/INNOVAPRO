import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import Filtro from "../components/Filtro";
import TablePlanillaMensual from "../components/tipo-planilla/TablePlanillaMensual";
import TableRHMensual from "../components/tipo-rh/TableRHMensual";

import planillaMensualService from "../services/planillaMensualService";
import { viPlanillaMensual } from "../utils/valorInicial";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ExportExcel from "@/shared/components/exportarExcel";

const HistoricoPlanillaMensual = () => {
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

   // ?? Filtro para la peticion
   const [filtro, setFiltro] = useState({
      anio: new Date().getFullYear() + "",
      mes:new Date().toLocaleString("es-PE", { month: "2-digit" }),
      filial_id: "1",
   });

   const buscarPlanillaMensual = async () => {
      try {
         const dia_fin_mes = new Date(filtro.anio, filtro.mes, 0).getDate();
         setLoading(true);
         const anio_mes_dia = `${filtro.anio}-${filtro.mes}`;

         const dataPOST = {
            fecha_anio_mes: anio_mes_dia,
            filial_id: filtro.filial_id,
         };
         console.log("data enviada", dataPOST);
         const res =
            await planillaMensualService.obtenerHistoricoPlanillaMensual(
               dataPOST
            );
         let pl = [];
         let rh = [];
         for (const p of res) {            
            if (p.tipo_contrato == "HONORARIOS") {
               rh.push(p);
            }
            if (p.tipo_contrato == "PLANILLA") {
               pl.push(p);
            }
         }
         

         setPlanillaMensualTipoPlanilla(pl);
         setPlanillaMensualTipoRh(rh);
         if(pl.length<1&&rh.length<1){
            toast.info("Aun no se ha guardado la planilla en este mes.")
         }
         else{
            toast.success("Historico obtenido.")
         }
      } catch (error) {
        console.log(error);
        
        toast.error('Error al obtener el historico')
      } finally {
         setLoading(false);
      }
   };
   const [libroExcel,setLibroExcel]=useState(null)

   useEffect(() => {
      const obtenerFiliales = async () => {
         try {
            setLoading(true);
            const res = await planillaMensualService.obtenerFiliales();

            setFiliales(res);
            setFiltro({ ...filtro, filial_id: res?.[0]?.id });
         } catch (error) {
            //console.log(error);
            toast.error("Error al guardar la planilla");
         } finally {
            setLoading(false);
         }
      };
      obtenerFiliales();
   }, []);

   useEffect(()=>{
      if(planillaMensualTipoPlanilla.length>0){
         const hojas=[
            { nombre_libro: "Planilla", 
               datos: planillaMensualTipoPlanilla,
               columnas: [{ key: "asig_fam", label: "Asignación" }] ,
               excluir: ["id","trabajador_id","contrato_id"]},
            
         ]
         if(planillaMensualTipoRh.length>0){
            hojas.push({ nombre_libro: "Honorarios", datos: planillaMensualTipoRh ,excluir: ["id","trabajador_id"]})
         }
         setLibroExcel(hojas)
      }

   },[planillaMensualTipoPlanilla,planillaMensualTipoRh])

   const renderTipoPlanilla = () => {
      if (planillaMensualTipoPlanilla) {
         return (
            <div className="w-full px-7 ">
               <TablePlanillaMensual
                  planillaMensualTipoPlanilla={planillaMensualTipoPlanilla}
               />
            </div>
         );
      }
   };

   const renderTipoRh = () => {
      if (planillaMensualTipoRh) {
         return (
            <div className="w-full px-7 ">
               <TableRHMensual planillaMensualTipoRh={planillaMensualTipoRh} />
            </div>
         );
      }
   };

   return (
      <div className="min-h-full flex-1  flex flex-col items-center space-y-6">
         <div className="w-full px-7 flex justify-between">
               <Filtro
                  filiales={filiales}
                  filtro={filtro}
                  setFiltro={setFiltro}
                  Buscar={buscarPlanillaMensual}
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
            <>
               {renderTipoPlanilla()}
               {renderTipoRh()}
            </>
         )}
         
      </div>
   );
};

export default HistoricoPlanillaMensual;
