import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import CalculoGratificacion from "./CalculoGratificacion";
import HistoricoGratificacion from "./HistoricoGratificacion";

const GestionGratificacion = () => {
   return (
      <div className="min-h-full px-6 flex-1 flex flex-col items-center">
         <div className="w-full  max-w-7xl my-5 flex flex-col items-start space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 ">
               Gestión de Gratificaciones
            </h2>
            
         </div>

            <Tabs defaultValue="calcular" className="w-full">
               <TabsList className="">
                  <TabsTrigger value="calcular">Calcular Gratificación</TabsTrigger>
                  <TabsTrigger value="historico">Histórico</TabsTrigger>
               </TabsList>

               <TabsContent value="calcular" className=" rounded-lg shadow-sm">
                  <CalculoGratificacion />
               </TabsContent>

               <TabsContent value="historico" className=" rounded-lg shadow-sm">
                  <HistoricoGratificacion />
               </TabsContent>
            </Tabs>

      </div>
   );
};

export default GestionGratificacion;
