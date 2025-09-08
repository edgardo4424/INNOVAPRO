
import { useEffect, useState } from "react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import CalculoGratificacion from "./CalculoGratificacion";
import HistoricoGratificacion from "./HistoricoGratificacion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MonitorCog } from "lucide-react";
import dataMantenimientoService from "@/modules/dataMantenimiento/services/dataMantenimientoService";

const GestionGratificacion = () => {

   const [dataMantenimiento, setDataMantenimiento] = useState(null)
   const [esCalculo, setEsCalculo] = useState(true)

   console.log('dataMantenimiento', dataMantenimiento);

   useEffect(() => {
      const getDataMantenimiento = async () => {

         if(esCalculo){
             const res = await dataMantenimientoService.getDataMantenimiento()

         const data_mant = {
            MONTO_FALTA_POR_DIA: res.data.find(item => item.codigo == 'valor_falta')?.valor,
            MONTO_NO_COMPUTABLE: res.data.find(item => item.codigo == 'valor_no_computable')?.valor,
            MONTO_POR_HORA_EXTRA: res.data.find(item => item.codigo == 'valor_hora_extra')?.valor,
            MONTO_ASIGNACION_FAMILIAR: res.data.find(item => item.codigo == 'valor_asignacion_familiar')?.valor,
            PORCENTAJE_BONIFICACION_ESSALUD: res.data.find(item => item.codigo == 'valor_bonificacion_essalud')?.valor,
            PORCENTAJE_DESCUENTO_5TA_CATEGORIA_NO_DOMICILIADO: res.data.find(item => item.codigo == 'valor_desc_quinta_categoria_no_domiciliado')?.valor

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
      <div className="w-full my-5 flex flex-col items-center md:flex-row md:justify-between gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 self-start">
          Gestión de Gratificaciones
        </h2>
        
          <Card className="w-[300px]">
            <CardHeader className="flex flex-wrap items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium uppercase text-center">
                Data mantenimiento
              </CardTitle>
              <MonitorCog className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               {
                  dataMantenimiento!=null && (
                     <>
                      <div className="text-xs flex justify-between"><span className="font-bold">Monto por falta (día):</span> {"S/. " + (dataMantenimiento?.MONTO_FALTA_POR_DIA)}</div>
              <div className="text-xs flex justify-between"><span className="font-bold">Monto no computable (día):</span> {"S/. " + (dataMantenimiento?.MONTO_NO_COMPUTABLE)}</div>
              <div className="text-xs flex justify-between"><span className="font-bold">Monto por hora extra:</span> {"S/. " + (dataMantenimiento?.MONTO_POR_HORA_EXTRA)}</div>
              <div className="text-xs flex justify-between"><span className="font-bold">Monto por asignación familiar:</span> {"S/. " + (dataMantenimiento?.MONTO_ASIGNACION_FAMILIAR)}</div>
              <div className="text-xs flex justify-between"><span className="font-bold">Bonificación ESSALUD (%):</span> {(dataMantenimiento?.PORCENTAJE_BONIFICACION_ESSALUD ?? 0) + " %"}</div>
              <div className="text-xs flex justify-between"><span className="font-bold">Retención no domiciliado (%):</span> {(dataMantenimiento?.PORCENTAJE_DESCUENTO_5TA_CATEGORIA_NO_DOMICILIADO ?? 0) + " %"}</div>
                 </> )
               }
             
            </CardContent>
          </Card>
       
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
