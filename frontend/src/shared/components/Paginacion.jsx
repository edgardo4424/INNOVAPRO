import { Button } from "@/components/ui/button";
import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectLabel,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Paginacion({
   paginaActual,
   totalPaginas,
   onPaginarAnterior,
   onPaginarSiguiente,
   usuariosPorPagina,
   setUsuariosPorPagina,
   setPaginaActual
}) {

     const handleChange=(e)=>{
      console.log(e)
      setPaginaActual(1)
      setUsuariosPorPagina(Number(e))
    }
   return (

 

      <div className="w-full max-w-7xl flex flex-col md:flex-row items-end  justify-between md:items-center px-8 mt-2 mb-16 gap-4 text-neutral-600">
         <div className="flex items-center gap-2">
            <p>Filas por página:</p>
            <Select
               value={String(usuariosPorPagina)}
               onValueChange={(e) =>handleChange(e) }
            >
               <SelectTrigger className="w-20">
                  <SelectValue />
               </SelectTrigger>
               <SelectContent>
                  <SelectGroup>
                     <SelectItem value="5">5</SelectItem>
                     <SelectItem value="10">10</SelectItem>
                     <SelectItem value="15">15</SelectItem>
                     <SelectItem value="20">20</SelectItem>
                     <SelectItem value="25">25</SelectItem>
                  </SelectGroup>
               </SelectContent>
            </Select>
         </div>

         <div className="flex items-center gap-2">
            <span>
               {paginaActual} de {totalPaginas}
            </span>
            <Button
               size="icon"
               variant="outline"
               disabled={paginaActual === 1}
               onClick={onPaginarAnterior}
            >
               <ChevronLeft />
            </Button>

            <Button
               size="icon"
               variant="outline"
               disabled={paginaActual === totalPaginas}
               onClick={onPaginarSiguiente}
            >
               <ChevronRight />
            </Button>
         </div>
      </div>
   );
}
