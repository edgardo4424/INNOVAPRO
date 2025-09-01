import FiltroBeneficios from "@/shared/components/FiltroBeneficios";
import { format } from "date-fns";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ListaCts from "../components/ListaCts";
import ctsService from "../service/ctsService";
import { Button } from "@/components/ui/button";
import { ModalCts } from "../components/ModalCts";

const CalculoCts = () => {
   const [isLoad, setIsLoad] = useState(false);

   const [cts, setCts] = useState([]);
   const periodo = format(new Date(), "MM-dd") < "05-17" ? "MAYO" : "NOVIEMBRE";
   const [filtro, setFiltro] = useState({
      anio: new Date().getFullYear() + "",
      periodo: periodo,
      filial_id: "",
   });

   const fetchCts = async () => {
      try {
         if (!filtro.filial_id) {
            toast.error("Seleccione una filial");
            return;
         }
         setIsLoad(false);
         const hoy = new Date().toISOString().slice(0, 10);
         const response = await ctsService.obtenerTrabajadores();
         const trabajadores = response.data.trabajadores.filter((t) => {
            let filial_id = 0;
            const contratoActual = t.contratos_laborales.find((c) => {
               return hoy >= c.fecha_inicio && hoy <= c.fecha_fin;
            });
            if (!contratoActual) return false;
            filial_id = contratoActual.filial_id;
            return filial_id == filtro.filial_id;
         });

         const cts_obtenidas = [];
         for (const t of trabajadores) {
            const payload = {
               anio: filtro.anio,
               filial_id: filtro.filial_id,
               periodo: filtro.periodo,
               trabajador_id: t.id,
            };
            const response_cts = await ctsService.obtenerCts(payload);
            response_cts.data.map((c) => cts_obtenidas.push(c));
         }
         console.log(cts_obtenidas);

         setCts(cts_obtenidas);
      } catch (error) {
         toast.error("Error al obtener el calculo de cts");
      } finally {
         setIsLoad(false);
      }
   };
   const periodos = [
      { value: "MAYO", label: "Mayo" },
      { value: "NOVIEMBRE", label: "Noviembre" },
   ];

   const guardarCts = async () => {
      try {
         const transformar_data = [...cts].map((c) => {
            let data = { ...c };
            data.contratos = data.ids_agrupacion
               ? data.ids_agrupacion
               : data.contrato_id;
            data.sueldo_base = data.sueldo_basico;
            data.asignacion_familiar = data.sueldo_asig_fam;
            data.promedio_horas_extras = data.prom_h_extras;
            data.promedio_bono_obra = data.prom_bono;
            data.remuneracion_computable = data.remuneracion_comp;
            data.meses_computables = data.meses_comp;
            data.dias_computables = data.dias_comp;
            // Eliminación de las claves originales
            delete data.ids_agrupacion;
            delete data.contrato_id;
            delete data.sueldo_basico;
            delete data.sueldo_asig_fam;
            delete data.prom_h_extras;
            delete data.prom_bono;
            delete data.remuneracion_comp;
            delete data.meses_comp;
            delete data.dias_comp;
            return data;
         });
         const payload = {
            periodo: filtro.periodo,
            anio: filtro.anio,
            filial_id: filtro.filial_id,
            array_cts: transformar_data,
         };
         console.log(payload);
         const response = await ctsService.generarCts(payload);
         console.log("Respuesta obtenida: ", response);
         toast.success("Registros guardados exitosamente");
      } catch (error) {
         console.log(error);
         if (error.response?.data?.mensaje) {
            toast.error(error.response?.data?.mensaje);
            return;
         }
         toast.error("Error Desconocido");
      }
   };
   return (
      <div className="min-h-full flex-1  flex flex-col items-center">
         <div className="w-full px-4 max-w-7xl py-6 flex justify-between">
            <div className="flex flex-col w-full">
               <FiltroBeneficios
                  filtro={filtro}
                  setFiltro={setFiltro}
                  Buscar={fetchCts}
                  periodos={periodos}
               />
            </div>
         </div>
         {isLoad ? (
            <div className="w-full px-20  max-w-8xl min-h-[50vh] flex items-center">
               <div className="w-full flex flex-col items-center justify-center">
                  <LoaderCircle className="text-gray-800 size-30 animate-spin" />
                  <h2 className="text-gray-800 text-2xl">Cargando...</h2>
               </div>
            </div>
         ) : cts ? (
            <div className="w-full px-7 flex flex-col ">
               <ListaCts cts={cts} />
               <div className="self-end">
                  <ModalCts guardarCts={guardarCts} />
               </div>
            </div>
         ) : (
            <div className="w-full px-20  max-w-8xl min-h-[50vh] flex items-center">
               <div className="w-full flex flex-col items-center justify-center">
                  <h2 className="text-gray-800 text-2xl">
                     No hay trabajadores
                  </h2>
               </div>
            </div>
         )}
      </div>
   );
};
export default CalculoCts;
