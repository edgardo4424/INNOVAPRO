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

const FiltroBeneficios = ({ filtro, setFiltro, Buscar, periodos }) => {
   const [filiales, setFiliales] = useState([]);

   useEffect(() => {
      const ObtenerFiliales = async () => {
         try {
            const res = await gratificacionService.obtenerFiliales();
            setFiliales(res);
            setFiltro({ ...filtro, filial_id: res?.[0]?.id });
         } catch (error) {
            console.log(error);
         }
      };
      ObtenerFiliales();
   }, []);

   return (
      <div className=" pt-8 flex gap-x-5  bg-red-">
         <div className="flex flex-col items-center justify-between w-full gap-x-5 border-2 border-gray-300 p-4 rounded-2xl">
            <div className="flex items-between justify-start gap-x-2 w-full py-2">
               <div className="flex">
                  <Funnel />
                  <h2 className="font-bold">Filtro</h2>
               </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-7  w-full gap-4">
               {/* Select de año */}
               <div className="md:col-span-2">
                  <Select
                     name="anio"
                     value={filtro.anio}
                     onValueChange={(v) =>
                        setFiltro((p) => ({ ...p, anio: v }))
                     }
                  >
                     <SelectTrigger className="w-full border-1 border-gray-400">
                        <SelectValue placeholder="Selecciona el año" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="2025">2025</SelectItem>
                        <SelectItem value="2026">2026</SelectItem>
                        <SelectItem value="2027">2027</SelectItem>
                        <SelectItem value="2028">2028</SelectItem>
                        <SelectItem value="2029">2029</SelectItem>
                        <SelectItem value="2030">2030</SelectItem>
                     </SelectContent>
                  </Select>
               </div>

               {/* Select de semestre */}
               <div className="md:col-span-2">
                  <Select
                     name="periodo"
                     value={filtro.periodo}
                     onValueChange={(v) =>
                        setFiltro((p) => ({ ...p, periodo: v }))
                     }
                  >
                     <SelectTrigger className="w-full border-1 border-gray-400">
                        <SelectValue placeholder="Selecciona el periodo" />
                     </SelectTrigger>
                     <SelectContent>
                        {periodos.map((p,i) => (
                           <SelectItem key={i} value={p.value}>{p.label}</SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
               </div>

               {/* Select de filial */}
               <div className="md:col-span-2">
                  <Select
                     name="filial_id"
                     value={filtro.filial_id}
                     onValueChange={(v) =>
                        setFiltro((p) => ({ ...p, filial_id: v }))
                     }
                  >
                     <SelectTrigger className="w-full border-1 border-gray-400">
                        <SelectValue placeholder="Selecciona la Filial" />
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
               <div className="md:col-span-1">
                  <Button
                     onClick={Buscar}
                     className="px-2 cursor-pointer w-full bg-innova-blue hover:bg-innova-blue/90"
                  >
                     <Check className="size-4" /> Aplicar
                  </Button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default FiltroBeneficios;
