import { useCallback, useEffect, useMemo, useState } from "react";
import asistenciaService from "../services/asistenciaService";
import AsistenciaHeader from "../components/AsistenciaHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import JornadaCard from "../components/JornadaCard";
import BadgeEstadoAsistencia from "../components/BadgeEstadoAsistencia";
import { useParams, useSearchParams } from "react-router-dom";
import AsistenciaSimple from "../components/AsistenciaSimple";
import InputTest from "../components/InputTest";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FaSpinner } from "react-icons/fa";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { FolderOpenIcon } from "lucide-react";

const GestionAsistencia = () => {
   const [searchParams] = useSearchParams();
   // const area_id = searchParams.get("area_id");

   const [fechaSeleccionada, setFechaSeleccionada] = useState(
      new Date().toISOString().split("T")[0]
   );
   const [trabajadores, setTrabajadores] = useState([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
   const [trabajadoresFiltrados,setTrabajadoresFiltrados]=useState([]);
   const [areas,setAreas]=useState([]);
   const [area_id,setAreaId]=useState(undefined);
   const [nombreArea,setNombreArea]=useState("");
   const [asistenciasSincronizacion,setAsistenciasSincronizacion]=useState(null);
   const [isLoadinSync,setIsLoadinSync]=useState(false)

   const obtenerAreas=async()=>{
      try {
         setLoading(true);
         const areasResponse=await asistenciaService.getAreas();
         setAreas(areasResponse.data.areas)      
      } catch (error) {
         setError("Error al cargar las areas laborales.");
      }finally{
         setLoading(true)
      }
   }
   useEffect(()=>{
      obtenerAreas();
   },[])
   const obtenerTrabajadores = async () => {
      try {
         setLoading(true);
         const response = await asistenciaService.obtenerTrabajadoresPorFilial(
            area_id,
            fechaSeleccionada
         );
        
         
         setTrabajadoresFiltrados([...response.data.datos.trabajadores] || [])
         setTrabajadores([...response.data.datos.trabajadores] || []);
         setNombreArea(response.data.datos.area_nombre??"-")
      } catch (err) {
         console.log(err);
         setError("Error al cargar los trabajadores.");
      } finally {
         setLoading(false);
      }
   };
   useEffect(() => {
      const hoy = new Date().toISOString().split("T")[0];
      setFechaSeleccionada(hoy);
   }, [area_id]);

   useEffect(() => {
      if (fechaSeleccionada&&area_id) {
         setError("")
         obtenerTrabajadores();
      }
   }, [fechaSeleccionada, area_id]);

   const estadisticas = useMemo(() => {
      const stats = {
         presentes: 0,
         ausentes: 0,
         tardanzas: 0,
         no_registrado: 0,
         total: trabajadores.length,
      };

      trabajadores.forEach((trabajador) => {
         if (trabajador.asistencia) {
            switch (trabajador.asistencia.estado_asistencia) {
               case "presente":
                  stats.presentes++;
                  break;
               case "falto":
               case "permiso":
               case "falta-justificada":
               case "vacaciones":
               case "licencia":
                  stats.ausentes++;
                  break;
               case "tardanza":
                  stats.tardanzas++;
                  break;
            }
         } else {
            stats.no_registrado++; // Si no tiene asistencia
         }
      });

      return stats;
   }, [trabajadores]);
   const sincronizacion=async()=>{
      setIsLoadinSync(true)
      try {
      setAsistenciasSincronizacion(null)
      let lista_dni=[];
      for (const t of trabajadores) {
            lista_dni.push(t.numero_documento);
      }
         const payload={
         fecha:fechaSeleccionada,
         lista_dni
      }
       const response=  await asistenciaService.sincronizarAsistencia(payload);
       if(response.data.datos.length>0){
         setAsistenciasSincronizacion(response.data.datos);      
         toast.success("Asistencias de marcate obtenidas correctamente.")
       }
       else{
          toast.info("No hay asistencias registradas en marcate para esta área")
       }
      } catch (error) {
         console.log("Error en el front: ",error);
         
      }
      finally{
         setIsLoadinSync(false)
      }
   }

   return (
      <div className="min-h-full flex-1 flex flex-col items-center p-8">
         <div className="max-w-7xl mx-auto space-y-6 w-full">
            {error && (
               <div className="text-red-500 text-center font-semibold">
                  {error}
               </div>
            )}
            <section className=" grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
               <Select onValueChange={(e)=>setAreaId(e)} disabled={areas.length<1}  value={area_id}>
                   <SelectTrigger className="w-full truncate">
                      <SelectValue placeholder="Seleccione un área laboral"  className="text-md"/>
                   </SelectTrigger>
                   <SelectContent>
                      {areas.map((a,index)=>(
                         <SelectItem value={a.id.toString()} key={index}>{a.nombre}</SelectItem>
                      ))}
                   </SelectContent>
            </Select>
            {(trabajadores&&trabajadores.length>0)&&
               <Button 
                  onClick={sincronizacion} 
                  className=" bg-innova-blue hover:bg-innova-blue/90"
                  disabled={isLoadinSync}
               >
                  {
                     isLoadinSync&&<FaSpinner className="animate-spin"/>
                  } 
                  Sincronizar
               </Button>
            }
            </section>
            <AsistenciaHeader
               trabajadores={trabajadores}
               estadisticas={estadisticas}
               fechaSeleccionada={fechaSeleccionada}
               setFechaSeleccionada={setFechaSeleccionada}
               title={nombreArea}
            />
            <div className="grid grid-cols-1 md:grid-cols-3">
               <InputTest trabajadores={trabajadores} setTrabajadoresFiltrados={setTrabajadoresFiltrados}/> 
            </div>
            {loading ? (
               <div className="text-center py-6 text-gray-500">
                     {area_id?"Cargando trabajadores...":    
                     <Empty className="border bg-muted/30 min-h-[400px]">
                       <EmptyHeader>
                         <EmptyMedia variant="icon">
                           <FolderOpenIcon className="size-6" />
                         </EmptyMedia>
                         <EmptyTitle className="text-2xl">Seleccione un área laboral</EmptyTitle>
                         <EmptyDescription className="text-base">
                           Para ver el control de asistencia, primero debe seleccionar un área laboral del menú desplegable superior.
                         </EmptyDescription>
                       </EmptyHeader>
                     </Empty>}
               </div>
            ) : (
               <div className="space-y-4">
                  {(trabajadoresFiltrados.length === 0 || !area_id) ? (
                     <div className="text-center text-gray-400">
                        No hay trabajadores disponibles para esta área.
                     </div>
                  ) : area_id == 6 || area_id == 2 ? (
                     trabajadoresFiltrados.map((trabajador) => (
                          <JornadaCard
                             key={trabajador.id}
                             trabajador={trabajador}
                             obtenerTrabajadores={obtenerTrabajadores}
                             fecha={fechaSeleccionada}
                             asistenciasSincronizacion={asistenciasSincronizacion}
                          />
                     ))
                  ) : (
                     trabajadoresFiltrados.map((trabajador) => (
                        <AsistenciaSimple
                           key={trabajador.id}
                           trabajador={trabajador}
                           fecha={fechaSeleccionada}
                           obtenerTrabajadores={obtenerTrabajadores}
                        />
                     ))
                  )}
               </div>
            )}
         </div>
      </div>
   );
};

export default GestionAsistencia;
