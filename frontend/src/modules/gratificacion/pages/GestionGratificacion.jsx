
import { useEffect, useState } from "react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import CalculoGratificacion from "./CalculoGratificacion";
import HistoricoGratificacion from "./HistoricoGratificacion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MonitorCog } from "lucide-react";
import dataMantenimientoService from "@/modules/dataMantenimiento/services/dataMantenimientoService";

import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

const GestionGratificacion = () => {

   const [dataMantenimiento, setDataMantenimiento] = useState(null)
   const [esCalculo, setEsCalculo] = useState(true)

   console.log('dataMantenimiento', dataMantenimiento);

   useEffect(() => {
      const getDataMantenimiento = async () => {

         if(esCalculo){
             const res = await dataMantenimientoService.getDataMantenimiento()

         const data_mant = {
            valor_falta: res.data.find(item => item.codigo == 'valor_falta')?.valor,
            valor_no_computable: res.data.find(item => item.codigo == 'valor_no_computable')?.valor,
            valor_hora_extra: res.data.find(item => item.codigo == 'valor_hora_extra')?.valor,
            valor_asignacion_familiar: res.data.find(item => item.codigo == 'valor_asignacion_familiar')?.valor,
            valor_bonificacion_essalud: res.data.find(item => item.codigo == 'valor_bonificacion_essalud')?.valor,
            valor_desc_quinta_categoria_no_domiciliado: res.data.find(item => item.codigo == 'valor_desc_quinta_categoria_no_domiciliado')?.valor

         }
         setDataMantenimiento(data_mant)
         }else{
            setDataMantenimiento(null)
         }
        
      }
      getDataMantenimiento()
   }, [esCalculo])
   
    useEffect(() => {
    
    const obtenerFiliales = async () => {
      try {
        const res = await gratificacionService.obtenerFiliales();
        console.log("res", res);
        setFiliales(res);
        setFiltro({ ...filtro, filial_id: res?.[0]?.id });
      } catch (error) {
        console.log(error);
      }
    };
    obtenerFiliales();
  }, []);


  return (
    <div className="min-h-full px-6 flex-1 flex flex-col items-center">
      <div className="w-full my-5 md:mt-5 flex flex-col items-center md:flex-row md:justify-between gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 self-start">
          Gestión de Gratificaciones
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
              <div className="text-xs flex justify-between"><span className="font-bold">Monto por falta (día):</span> {"S/. " + (dataMantenimiento?.valor_falta ? (+dataMantenimiento.valor_falta).toFixed(2) : "")}</div>
              <div className="text-xs flex justify-between"><span className="font-bold">Monto no computable (día):</span> {"S/. " + (dataMantenimiento?.valor_no_computable ? (+dataMantenimiento.valor_no_computable).toFixed(2) : "")}</div>
              <div className="text-xs flex justify-between"><span className="font-bold">Monto por hora extra:</span> {"S/. " + (dataMantenimiento?.valor_hora_extra ? (+dataMantenimiento.valor_hora_extra).toFixed(2) : "")}</div>
              <div className="text-xs flex justify-between"><span className="font-bold">Monto por asignación familiar:</span> {"S/. " + (dataMantenimiento?.valor_asignacion_familiar ? (+dataMantenimiento.valor_asignacion_familiar).toFixed(2) : "")}</div>
              <div className="text-xs flex justify-between"><span className="font-bold">Bonificación ESSALUD (%):</span> {dataMantenimiento?.valor_bonificacion_essalud ? (+dataMantenimiento.valor_bonificacion_essalud).toFixed(2) + " %" : " %"}</div>
              <div className="text-xs flex justify-between"><span className="font-bold">Retención no domiciliado (%):</span> {dataMantenimiento?.valor_desc_quinta_categoria_no_domiciliado ? (+dataMantenimiento.valor_desc_quinta_categoria_no_domiciliado).toFixed(2) + " %" : " %"}</div>
                 </div> 
            </CardContent>
          </Card>
       
         </DropdownMenuContent>
      </DropdownMenu>
        
      </div>

      <Tabs defaultValue="calcular" className="w-full">
        <TabsList className="">
          <TabsTrigger value="calcular">Calcular Gratificación</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="calcular" className=" rounded-lg shadow-sm">
          <CalculoGratificacion setDataMantenimiento={setDataMantenimiento} setEsCalculo={setEsCalculo}/>
        </TabsContent>

        <TabsContent value="historico" className=" rounded-lg shadow-sm">
          <HistoricoGratificacion setDataMantenimiento={setDataMantenimiento} setEsCalculo={setEsCalculo}/>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GestionGratificacion;
