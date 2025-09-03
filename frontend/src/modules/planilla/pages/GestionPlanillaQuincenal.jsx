import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import CalculoPlanillaQuincenal from "./CalculoPlanillaQuincenal";
import HistoricoPlanillaQuincenal from "./HistoricoPlanillaQuincenal";


const GestionPlanillaQuincenal = () => {
   return (
      <div className="min-h-full px-6 flex-1 flex flex-col items-center">
         <div className="w-full  max-w-7xl my-5 flex flex-col items-start space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 ">
               Gestión de Planilla Quincenal
            </h2>
            
         </div>

            <Tabs defaultValue="calcular" className="w-full">
               <TabsList className="">
                  <TabsTrigger value="calcular">Calcular Planilla Quincenal</TabsTrigger>
                  <TabsTrigger value="historico">Histórico</TabsTrigger>
               </TabsList>

               <TabsContent value="calcular" className=" rounded-lg shadow-sm">
                  <CalculoPlanillaQuincenal />
               </TabsContent>

               <TabsContent value="historico" className=" rounded-lg shadow-sm">
                  <HistoricoPlanillaQuincenal />
               </TabsContent>
            </Tabs>

      </div>
   );
};

export default GestionPlanillaQuincenal;
