import { Button } from "@/components/ui/button";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import gratificacionService from "@/modules/gratificacion/services/gratificacionService";
import { Check, Funnel, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

const FiltroBeneficios = ({ filtro, setFiltro, Buscar }) => {
   const [filiales, setFiliales] = useState([]);

   useEffect(() => {
      const ObtenerFiliales = async () => {
         try {
            const res = await gratificacionService.obtenerFiliales();
            setFiliales(res);
         } catch (error) {
            console.log(error);
         }
      };
      ObtenerFiliales();
   }, []);

   return (
      <div className="flex flex-col items-start w-full rounded-xl  p-4  space-y-2 shadow-md bg-neutral-50 ">
         <div className="flex">
            <Funnel />
            <h2 className="font-bold">Filtro</h2>
         </div>
         <div className="grid grid-cols-1 w-full space-y-2 md:grid-cols-7 space-x-4">
            <div className="col-span-1  md:col-span-2">
               <Select
                  name="filial_id"
                  value={filtro.filial_id}
                  onValueChange={(v) =>
                     setFiltro((p) => ({ ...p, filial_id: v }))
                  }
               >
                  <SelectTrigger className="w-full border-1 border-gray-400">
                     <SelectValue placeholder="Selecciona la empresa" />
                  </SelectTrigger>
                  <SelectContent>
                     {filiales.map((filial) => (
                        <SelectItem key={filial.id} value={filial.id}>
                           {filial.razon_social}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            </div>
            <div className="col-span-1 md:col-span-2 text-sm text-gray-600 bg-white px-3 py-2 rounded border relative">
               <span className="text-xs absolute -top-2 left-2 text-neutral-500 bg-white">Periodo</span>
               {filtro.periodo} {filtro.anio}
            </div>
            <div className="col-span-1">
               <Button
                  onClick={Buscar}
                  className="px-2 cursor-pointer w-full bg-innova-blue hover:bg-innova-blue/90"
               >
                  <Check className="size-4" /> Aplicar
               </Button>
            </div>
         </div>
      </div>
   );
};

export default FiltroBeneficios;
