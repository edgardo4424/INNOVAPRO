import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import Filtro from "../components/Filtro";

import planillaMensualService from "../services/planillaMensualService";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ExportacionPlame = () => {
   const [filiales, setFiliales] = useState([]);

   // ?? loading
   const [loading, setLoading] = useState(false);

   
   // ?? Filtro para la peticion
   const [filtro, setFiltro] = useState({
      anio: new Date().getFullYear() + "",
      mes:new Date().toLocaleString("es-PE", { month: "2-digit" }),
      filial_id: "1",
   });


   useEffect(() => {
      const obtenerFiliales = async () => {
         try {
            setLoading(true);
            const res = await planillaMensualService.obtenerFiliales();

            setFiliales(res);
            setFiltro({ ...filtro, filial_id: res?.[0]?.id });
         } catch (error) {
            toast.error("No se pudieron obtener las filiales");
         } finally {
            setLoading(false);
         }
      };
      obtenerFiliales();
   }, []);

const exportarPlame = async () => {
  try {
    const anio_mes_dia = `${filtro.anio}-${filtro.mes}`;
    const payload = {
      fecha_anio_mes: anio_mes_dia,
      filial_id: filtro.filial_id,
    };
    const response = await planillaMensualService.exportarPlame(payload);
    // 1. Leer nombre de archivo del header
    const disposition = response.headers['content-disposition'] || response.headers.get?.('content-disposition');    
    let filename = 'archivo.zip';
    if (disposition && disposition.includes('filename=')) {
      const match = disposition.match(/filename="?([^"]+)"?/);
      if (match && match[1]) {
        filename = match[1];
      }
    }

    // 2. Crear enlace invisible y simular clic
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url); // limpieza

  } catch (error) {
    console.error('❌ Error al exportar PLAME:', error);
    alert('No se pudo descargar el archivo.');
  }
};

const buscarPlame=async()=>{
   console.log("Buscando plame");
   
}

   return (
      <div className="min-h-full flex-1  flex flex-col items-center space-y-6">
         <div className="w-full px-7 flex justify-between">
               <Filtro
                  filiales={filiales}
                  filtro={filtro}
                  setFiltro={setFiltro}
                  Buscar={buscarPlame}
                  nombre_button="Buscar Plame"
                  hidden={true}
               />
         </div>

         

         {loading ? (
            <div className="w-full px-20  max-w-8xl min-h-[50vh] flex items-center">
               <div className="w-full flex flex-col items-center justify-center">
                  <LoaderCircle className="text-gray-800 size-30 animate-spin" />
                  <h2 className="text-gray-800 text-2xl">Cargando...</h2>
               </div>
            </div>
         ) : (
            <article>
                  <Button onClick={()=>exportarPlame()}>Exportar Plame</Button>
            </article>
         )}
         
      </div>
   );
};

export default ExportacionPlame;
