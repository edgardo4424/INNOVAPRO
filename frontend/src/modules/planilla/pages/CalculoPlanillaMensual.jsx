import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import Filtro from "../components/Filtro";
import TablePlanillaMensual from "../components/tipo-planilla/TablePlanillaMensual";
import TableRHMensual from "../components/tipo-rh/TableRHMensual";

import planillaMensualService from "../services/planillaMensualService";
import { viPlanillaMensual } from "../utils/valorInicial";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ModalCerrarPlanilla } from "../components/tipo-planilla/ModalCerrarPlanilla";
import { calculo_aportes_trabajador } from "../hooks/calculo_aportes_trabajador";

const CalculoPlanillaMensual = () => {
   const [filiales, setFiliales] = useState([]);
   // ?? loading
   const [loading, setLoading] = useState(false);

   // ?? Estados Solo para los que son planilla
   const [planillaMensualTipoPlanilla, setPlanillaMensualTipoPlanilla] =
      useState(viPlanillaMensual.planilla);

   const [datosTotalesPlanilla, setDatosTotalesPlanilla] = useState({
      sumatoria_sueldo_basico: 0,
      sumatoria_sueldo_mensual: 0,
      sumatoria_sueldo_bruto: 0,
      sumatoria_sueldo_neto: 0,
      sumatoria_saldo_por_pagar: 0,
      sumatoria_essalud: 0,
      sumatoria_vida_ley: 0,
      sumatoria_sctr_salud: 0,
      sumatoria_sctr_pension: 0,
   });

   // ?? Estados Solo para los que son por honorarios

   const [planillaMensualTipoRh, setPlanillaMensualTipoRh] = useState(
      viPlanillaMensual.honorarios
   );


   // ?? Filtro para la peticion
   const [filtro, setFiltro] = useState({
      anio: new Date().getFullYear() + "",
      mes: new Date().toLocaleString("es-PE", { month: "2-digit" }),
      filial_id: "1",
   });

   const buscarPlanillaMensual = async (importesObtenidos=null) => {
      try {         
         setLoading(true);
         const dia_fin_mes = new Date(filtro.anio, filtro.mes, 0).getDate();
         const anio_mes_dia = `${filtro.anio}-${filtro.mes}-${dia_fin_mes}`;
         const payload = {
            anio_mes_dia,
            filial_id: filtro.filial_id,
         };
         const res = await planillaMensualService.obtenerPlanillaMensual(
            payload
         );         
         
         setPlanillaMensualTipoPlanilla(res.payload.planilla.trabajadores);
         setDatosTotalesPlanilla(res.payload.planilla.datos_totales)
         setPlanillaMensualTipoRh(res.payload.honorarios.trabajadores);
      } catch (error) {
         if(error?.response?.data?.error){
            toast.error(error.response.data.error);
            return;
         }
         setPlanillaMensualTipoPlanilla(viPlanillaMensual.planilla);
         setDatosTotalesPlanilla({
           sumatoria_sueldo_basico: 0,
           sumatoria_sueldo_mensual: 0,
           sumatoria_sueldo_bruto: 0,
           sumatoria_sueldo_neto: 0,
           sumatoria_saldo_por_pagar: 0,
           sumatoria_essalud: 0,
           sumatoria_vida_ley: 0,
           sumatoria_sctr_salud: 0,
           sumatoria_sctr_pension: 0,
         }
         )
         setPlanillaMensualTipoRh(viPlanillaMensual.honorarios);
         toast.error('Ocurrio un error al obtener la planilla.')
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      const obtenerFiliales = async () => {
         try {
            setLoading(true);
            const res = await planillaMensualService.obtenerFiliales();

            setFiliales(res);
            setFiltro({ ...filtro, filial_id: res?.[0]?.id });
         } catch (error) {
            toast.error("No se pudieron obtener las filiales");
         } finally {
            setLoading(false);
         }
      };
      obtenerFiliales();
   }, []);


   const renderTipoPlanilla = () => {
      if (planillaMensualTipoPlanilla) {
         return (
            <div className="w-full ">
               <TablePlanillaMensual
                  planillaMensualTipoPlanilla={planillaMensualTipoPlanilla}
                  filial_id={filtro.filial_id}
                  filiales={filiales}
                  datosTotalesPlanilla={datosTotalesPlanilla}
               />
            </div>
         );
      }
   };

   const renderTipoRh = () => {
      if (planillaMensualTipoRh) {
         return (
            <div className="w-full ">
               <TableRHMensual planillaMensualTipoRh={planillaMensualTipoRh} />
            </div>
         );
      }
   };

   const handleChangeGuardarPlanilla = async () => {
      try {
         const dia_fin_mes = new Date(filtro.anio, filtro.mes, 0).getDate();

         const payload = {
            fecha: `${filtro.anio}-${filtro.mes}-${dia_fin_mes}`,
            filial_id: filtro.filial_id,
            array_trabajadores: planillaMensualTipoPlanilla.concat(
               planillaMensualTipoRh
            ),
         };
         setLoading(true);
         const response =
            await planillaMensualService.generarCierreRegistroPlanillaMensual(
               payload
            );
         toast.success("Planilla guardada con éxito.");
      } catch (error) {
         
         if (error.response?.data?.mensaje) {
            toast.error(error.response?.data?.mensaje);
            return;
         }
         toast.error("Error Desconocido");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="min-h-full flex-1  flex flex-col items-center space-y-6">
            <div className="w-full  flex justify-between">
               <Filtro
                  filiales={filiales}
                  filtro={filtro}
                  setFiltro={setFiltro}
                  Buscar={buscarPlanillaMensual}
               />
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
               {renderTipoPlanilla()}
               {renderTipoRh()}
            </>
         )}

         {/* <Button onClick={handleChangeGuardarPlanilla}>Guardar Planilla</Button> */}
         <ModalCerrarPlanilla guardarPlanilla={handleChangeGuardarPlanilla} />
      </div>
   );
};

export default CalculoPlanillaMensual;
