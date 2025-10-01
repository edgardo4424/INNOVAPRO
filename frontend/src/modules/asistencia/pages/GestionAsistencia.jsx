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
   const [nombreArea,setNombreArea]=useState("")

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

   return (
      <div className="min-h-full flex-1 flex flex-col items-center p-8">
         <div className="max-w-7xl mx-auto space-y-6 w-full">
            {error && (
               <div className="text-red-500 text-center font-semibold">
                  {error}
               </div>
            )}
            <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 ">
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
                  Cargando trabajadores...
               </div>
            ) : (
               <div className="space-y-4">
                  {(trabajadoresFiltrados.length === 0 || !area_id) ? (
                     <div className="text-center text-gray-400">
                        No hay trabajadores disponibles para esta área.
                     </div>
                  ) : area_id == 6 || area_id == 2 ? (
                     trabajadoresFiltrados.map((trabajador) => (
                        <Card key={trabajador.id} className={"py-3 gap-2"}>
                           <CardHeader className={""}>
                              <CardTitle className="flex items-center justify-start gap-8 ">
                                 <div>
                                    <h3 className="text-lg font-semibold !mt-0">
                                       {trabajador.nombres}{" "}
                                       {trabajador.apellidos}
                                    </h3>
                                    <div>
                                       <p className="text-[9px] text-neutral-500">
                                          {trabajador.tipo_documento}:{" "}
                                          {trabajador.numero_documento}
                                       </p>
                                       <p className="text-xs lowercase text-neutral-500">
                                          {trabajador.filial}
                                       </p>
                                    </div>
                                 </div>
                                 <div className="">
                                    <BadgeEstadoAsistencia
                                       trabajador={trabajador}
                                    />
                                 </div>
                              </CardTitle>
                           </CardHeader>
                           <CardContent className={""}>
                              <div className="grid grid-cols-1 gap-4">
                                 <JornadaCard
                                    trabajador={trabajador}
                                    obtenerTrabajadores={obtenerTrabajadores}
                                    fecha={fechaSeleccionada}
                                 />
                              </div>
                           </CardContent>
                        </Card>
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
