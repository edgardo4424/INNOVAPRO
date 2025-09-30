import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CalculoPlanillaMensual from "./CalculoPlanillaMensual";
import HistoricoPlanillaMensual from "./HistoricoPlanillaMensual";
import ExportacionPlame from "./ExportacionPlame";

const GestionPlanillaMensual = () => {
   return (
      <div className="min-h-full px-6 flex-1 flex flex-col items-center">
         <div className="w-full my-5 md:mt-5 flex flex-col items-center md:flex-row md:justify-between gap-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 self-start">
               Gestión de Planilla Mensual
            </h2>
         </div>

         <Tabs defaultValue="calcular" className="w-full">
            <TabsList className="">
               <TabsTrigger value="calcular">
                  Calcular Planilla Mensual
               </TabsTrigger>
               <TabsTrigger value="historico">Histórico</TabsTrigger>
               <TabsTrigger value="plame">Buscar Plame</TabsTrigger>
            </TabsList>

            <TabsContent value="calcular" className=" rounded-lg shadow-sm">
               <CalculoPlanillaMensual />
            </TabsContent>
            <TabsContent value="historico" className=" rounded-lg shadow-sm">
               <HistoricoPlanillaMensual />
            </TabsContent>
            <TabsContent value="plame" className=" rounded-lg shadow-sm">
               <ExportacionPlame />
            </TabsContent>
         </Tabs>
      </div>
   );
};

export default GestionPlanillaMensual;
