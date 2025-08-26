import FiltroBeneficios from "@/shared/components/FiltroBeneficios";
import { format } from "date-fns";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ListaCts from "../components/ListaCts";
import ctsService from "../service/ctsService";

const GestionCts = () => {
   const [isLoad, setIsLoad] = useState(false);

   const [cts, setCts] = useState([]);
   const periodo = format(new Date(), "MM-dd") < "05-17" ? "MAYO" : "NOVIEMBRE";
   const [filtro, setFiltro] = useState({
      anio: new Date().getFullYear() + "",
      periodo: periodo,
      filial_id: "1",
   });

   const fetchCts = async () => {
      console.log("ejeuta");

      try {
         setIsLoad(false);
         const response = await ctsService.obtenerTrabajadores();
         const cts_obtenidas = [];
         console.log("trabajadores",response.data);
         
         for (const t of response.data) {
            const payload = {
               anio: filtro.anio,
               filial_id: filtro.filial_id,
               periodo: filtro.periodo,
               trabajador_id: t.id,
            };
            console.log("Payload: ",payload);
            
            const response_cts = await ctsService.obtenerCts(payload);
            console.log(response_cts);
            
            response_cts.data.map((c)=>cts_obtenidas.push(c))   
         }
         console.log('cts obetenrida: ',cts_obtenidas);
         
         setCts(cts_obtenidas);
      } catch (error) {
         toast.error("Error al obtener el calculo de cts");
         console.error(error);
      } finally {
         setIsLoad(false);
      }
   };
   const periodos = [
      { value: "MAYO", label: "Mayo" },
      { value: "NOVIEMBRE", label: "Noviembre" },
   ];

   return (
      <div className="min-h-full flex-1  flex flex-col items-center">
         <div className="w-full px-4 max-w-7xl py-6 flex justify-between">
            <div className="flex flex-col w-full">
               <h2 className=" text-2xl md:text-3xl font-bold text-gray-800 !text-start">
                  Gestión de CTS
               </h2>
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
            <div className="w-full px-7 ">
               <ListaCts cts={cts} />
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
export default GestionCts;
