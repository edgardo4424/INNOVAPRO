import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CalculoPlanillaMensual from "./CalculoPlanillaMensual";
import HistoricoPlanillaMensual from "./HistoricoPlanillaMensual";
import ExportacionPlame from "./ExportacionPlame";
import { Button } from "@/components/ui/button";

const GestionPlanillaMensual = () => {
  return (
    <div className="max-h-[calc(100vh-80px)] overflow-y-auto flex flex-col items-center"> 
      <Tabs
        defaultValue="calcular"
        className="w-full flex flex-col items-center"
      >
        {/* Sticky Header */}
        <article className="w-full flex justify-center sticky top-0 z-50 bg-white shadow-md">
          <div className="grid grid-cols-2 w-full max-w-7xl pb-2 px-4">
            <section className="flex flex-col items-start space-y-2">
              <h2 className="text-2xl font-bold text-gray-800 md:text-3xl">
                Gestión de Planilla Mensual
              </h2>
              <TabsList>
                <TabsTrigger value="calcular">Calcular Planilla Mensual</TabsTrigger>
                <TabsTrigger value="historico">Histórico</TabsTrigger>
                <TabsTrigger value="plame">Buscar Plame</TabsTrigger>
              </TabsList>
            </section>
            <section className="flex justify-end items-center">
              {/* <Button>Guardar Planilla</Button> */}
            </section>
          </div>
        </article>

        {/* Contenido debajo del sticky */}
        <div className="w-full max-w-7xl mt-6 px-4 pb-20">
          <TabsContent value="calcular">
            <CalculoPlanillaMensual />
          </TabsContent>
          <TabsContent value="historico">
            <HistoricoPlanillaMensual />
          </TabsContent>
          <TabsContent value="plame">
            <ExportacionPlame />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default GestionPlanillaMensual;
