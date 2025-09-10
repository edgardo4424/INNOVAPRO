import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import CalculoPlanillaQuincenal from "./CalculoPlanillaQuincenal";
import HistoricoPlanillaQuincenal from "./HistoricoPlanillaQuincenal";

import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MonitorCog } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dataMantenimientoService from "@/modules/dataMantenimiento/services/dataMantenimientoService";

const GestionPlanillaQuincenal = () => {

    const [dataMantenimiento, setDataMantenimiento] = useState(null)
      const [esCalculo, setEsCalculo] = useState(true)
   
      useEffect(() => {
         const getDataMantenimiento = async () => {
   
            if(esCalculo){
                const res = await dataMantenimientoService.getDataMantenimiento()
   
            const data_mant = {
               valor_asignacion_familiar: res.data.find(item => item.codigo == 'valor_asignacion_familiar')?.valor,
               
               valor_onp: res.data.find(item => item.codigo == 'valor_onp')?.valor,
               valor_afp: res.data.find(item => item.codigo == 'valor_afp')?.valor,
               valor_seguro: res.data.find(item => item.codigo == 'valor_seguro')?.valor,
               valor_comision_afp_prima: res.data.find(item => item.codigo == 'valor_comision_afp_prima')?.valor,
               valor_comision_afp_habitat: res.data.find(item => item.codigo == 'valor_comision_afp_habitat')?.valor,
               valor_comision_afp_integra: res.data.find(item => item.codigo == 'valor_comision_afp_integra')?.valor,
               valor_comision_afp_profuturo: res.data.find(item => item.codigo == 'valor_comision_afp_profuturo')?.valor,
             
   
            }
            setDataMantenimiento(data_mant)
            }else{
               setDataMantenimiento(null)
            }
           
         }
         getDataMantenimiento()
      }, [esCalculo])
      

   return (
      <div className="min-h-full px-6 flex-1 flex flex-col items-center">
         <div className="w-full my-5 md:mt-5 flex flex-col items-center md:flex-row md:justify-between gap-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 self-start">
               Gestión de Planilla Quincenal
            </h2>

            
      <DropdownMenu>
         <DropdownMenuTrigger className="flex items-center gap-1" asChild>
            <Button
               variant={"outline"}
               size={"icon"}
               className="uppercase rounded-full"
            >
               <MonitorCog className="h-4 w-4 text-muted-foreground" />
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="end"  className="w-[300px] p-0 bg-gray-50">
            <Card className="border-0 shadow-none py-3 bg-transparent">
            <CardHeader className="flex flex-wrap items-center justify-between space-y-0">
              <CardTitle className="text-sm font-bold uppercase text-center text-innova-blue">
                Data mantenimiento
              </CardTitle>
              <MonitorCog className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="aspect-auto">
              <div className="text-xs flex justify-between"><span className="font-bold">Monto por asignación familiar:</span> {"S/. " + (dataMantenimiento?.valor_asignacion_familiar ? (+dataMantenimiento.valor_asignacion_familiar).toFixed(2) : "")}</div>
             <div className="text-xs flex justify-between"><span className="font-bold">ONP (%):</span> {dataMantenimiento?.valor_onp ? (+dataMantenimiento.valor_onp).toFixed(2) + " %" : " %"}</div>
             <div className="text-xs flex justify-between"><span className="font-bold">AFP (%):</span> {dataMantenimiento?.valor_afp ? (+dataMantenimiento.valor_afp).toFixed(2) + " %" : " %"}</div>
             <div className="text-xs flex justify-between"><span className="font-bold">Seguro (%):</span> {dataMantenimiento?.valor_seguro ? (+dataMantenimiento.valor_seguro).toFixed(2) + " %" : " %"}</div>
             <div className="text-xs flex justify-between"><span className="font-bold">AFP PRIMA (%):</span> {dataMantenimiento?.valor_comision_afp_prima ? (+dataMantenimiento.valor_comision_afp_prima).toFixed(2) + " %" : " %"}</div>
             <div className="text-xs flex justify-between"><span className="font-bold">AFP HABITAT (%):</span> {dataMantenimiento?.valor_comision_afp_habitat ? (+dataMantenimiento.valor_comision_afp_habitat).toFixed(2) + " %" : " %"}</div>
             <div className="text-xs flex justify-between"><span className="font-bold">AFP INTEGRA (%):</span> {dataMantenimiento?.valor_comision_afp_integra ? (+dataMantenimiento.valor_comision_afp_integra).toFixed(2) + " %" : " %"}</div>
             <div className="text-xs flex justify-between"><span className="font-bold">AFP PROFUTURO (%):</span> {dataMantenimiento?.valor_comision_afp_profuturo ? (+dataMantenimiento.valor_comision_afp_profuturo).toFixed(2) + " %" : " %"}</div>

                 </div> 
            </CardContent>
          </Card>
       
         </DropdownMenuContent>
      </DropdownMenu>
        
            
         </div>

            <Tabs defaultValue="calcular" className="w-full">
               <TabsList className="">
                  <TabsTrigger value="calcular">Calcular Planilla Quincenal</TabsTrigger>
                  <TabsTrigger value="historico">Histórico</TabsTrigger>
               </TabsList>

               <TabsContent value="calcular" className=" rounded-lg shadow-sm">
                  <CalculoPlanillaQuincenal setDataMantenimiento={setDataMantenimiento} setEsCalculo={setEsCalculo} />
               </TabsContent>

               <TabsContent value="historico" className=" rounded-lg shadow-sm">
                  <HistoricoPlanillaQuincenal setDataMantenimiento={setDataMantenimiento} setEsCalculo={setEsCalculo}/>
               </TabsContent>
            </Tabs>

      </div>
   );
};

export default GestionPlanillaQuincenal;
