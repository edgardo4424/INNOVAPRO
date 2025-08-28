import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useState } from "react";
import FiltroHistorico from "../components/FiltroHistorico";
import { format } from "date-fns";
import ctsService from "../service/ctsService";
import TablaHistoricoCts from "../components/tablaHistoricoCts";

const HistoricoCts = () => {
   const [cts, setCts] = useState([]);
   const periodo = format(new Date(), "MM-dd") < "05-17" ? "MAYO" : "NOVIEMBRE";
   const [filtro, setFiltro] = useState({
      anio: new Date().getFullYear() + "",
      periodo: periodo,
      filial_id: "",
   });
   const fetchCts = async () => {
      try {
         // setIsLoad(false);
         const payload = {
            periodo: filtro.periodo,
            anio: filtro.anio,
            filial_id: filtro.filial_id,
         };
         const response = await ctsService.obtenerHistorico(payload);
         console.log("Ejcutando peticion........");
         console.log("respuesta de la peticion: ", response.data.cts);
         setCts(response.data.cts)
         //  setCts(cts_obtenidas);
      } catch (error) {
         toast.error("Error al obtener el calculo de cts");
         console.error(error);
      } finally {
         // setIsLoad(false);
      }
   };
   const periodos = [
      { value: "MAYO", label: "Mayo" },
      { value: "NOVIEMBRE", label: "Noviembre" },
   ];

   return (
      <div className="min-h-full flex-1  flex flex-col items-center">
         <div className="w-full px-4 max-w-7xl py-6 flex justify-between">
            <div className="flex flex-col w-full space-y-2">
               <FiltroHistorico
                  filtro={filtro}
                  setFiltro={setFiltro}
                  Buscar={fetchCts}
                  periodos={periodos}
               />
               <TablaHistoricoCts datos={cts}/>
            </div>
         </div>
      </div>
   );
};

export default HistoricoCts;
