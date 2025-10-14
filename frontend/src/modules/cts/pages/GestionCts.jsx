import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CalcularCts from "./CalculoCts";
import HistoricoCts from "./HistoricoCts";

const GestionCts = () => {
   return (
      <div className="min-h-full px-6 flex-1 flex flex-col items-center">
         <div className="w-full  max-w-7xl my-5 flex flex-col items-start space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 ">
               Gestión de CTS
            </h2>
            <h3 className="text-xl md:text-xl font-bold text-gray-800 !m-0">
               Cálculo y administración de Compensación por Tiempo de Servicios
            </h3>
         </div>

            <Tabs defaultValue="calcular" className="w-full">
               <TabsList className="">
                  <TabsTrigger value="calcular">Calcular CTS</TabsTrigger>
                  <TabsTrigger value="historico">Histórico</TabsTrigger>
               </TabsList>

               <TabsContent value="calcular" className=" rounded-lg shadow-sm">
                  <CalcularCts />
               </TabsContent>

               <TabsContent value="historico" className=" rounded-lg shadow-sm">
                  <HistoricoCts />
               </TabsContent>
            </Tabs>

      </div>
   );
};

export default GestionCts;
