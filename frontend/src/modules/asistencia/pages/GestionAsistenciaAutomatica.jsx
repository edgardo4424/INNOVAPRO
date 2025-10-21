import { useCallback, useEffect, useMemo, useState } from "react";
import asistenciaService from "../services/asistenciaService";
import AsistenciaHeader from "../components/AsistenciaHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import JornadaCard from "../components/JornadaCard";
import BadgeEstadoAsistencia from "../components/BadgeEstadoAsistencia";
import { useParams, useSearchParams } from "react-router-dom";
import AsistenciaSimple from "../components/AsistenciaSimple";
import InputTest from "../components/InputTest";
import { toast } from "sonner";
import { FaSpinner } from "react-icons/fa";
import { Button } from "@/components/ui/button";

const GestionAsistenciaAutomatica = () => {

   const [fechaSeleccionada, setFechaSeleccionada] = useState(
      new Date().toISOString().split("T")[0]
   );
   const [trabajadores, setTrabajadores] = useState([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
   const [trabajadoresFiltrados,setTrabajadoresFiltrados]=useState([]);
   const [area_id,setAreaId]=useState(null);
   const [nombreArea,setNombreArea]=useState("")
   const [asistenciasSincronizacion,setAsistenciasSincronizacion]=useState(null);
   const [isLoadinSync,setIsLoadinSync]=useState(false)


   const obtenerTrabajadores = async () => {
      try {
         setLoading(true);
         const response = await asistenciaService.obtenerTrabajadoresPorArea(
            fechaSeleccionada
         );
         
         setTrabajadoresFiltrados([...response.data.datos.trabajadores] || [])
         setTrabajadores([...response.data.datos.trabajadores] || []);
         setAreaId(response.data.datos.area_id)
         setNombreArea(response.data.datos.area_nombre);
         setAsistenciasSincronizacion(null)
      } catch (err) {
         setError("Error al cargar los trabajadores.");
      } finally {
         setLoading(false);
      }
   };


   useEffect(() => {
      if (fechaSeleccionada) {
         obtenerTrabajadores();
      }
   }, [fechaSeleccionada]);

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
               case "teletrabajo":
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
         toast.error("Error: contacte con soporte TI")
      }
      finally{
         setIsLoadinSync(false)
      }
   }

  return (
    <div className="flex min-h-full flex-1 flex-col items-center p-8">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        {error && (
          <div className="text-center font-semibold text-red-500">{error}</div>
        )}

        <AsistenciaHeader
          trabajadores={trabajadores}
          estadisticas={estadisticas}
          fechaSeleccionada={fechaSeleccionada}
          setFechaSeleccionada={setFechaSeleccionada}
          title={nombreArea}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 space-y-2 space-x-8">
          <InputTest
            trabajadores={trabajadores}
            setTrabajadoresFiltrados={setTrabajadoresFiltrados}
          />
            {((area_id == 6 || area_id == 2)&&(trabajadores&&trabajadores.length>0))&&
               <Button 
                  onClick={sincronizacion} 
                  className=" bg-innova-blue hover:bg-innova-blue/90 w-auto"
                  disabled={isLoadinSync}
               >
                  {
                     isLoadinSync&&<FaSpinner className="animate-spin"/>
                  } 
                  Sincronizar con marcate
               </Button>
            }
        </div>
        {loading ? (
          <div className="py-6 text-center text-gray-500">
            Cargando trabajadores...
          </div>
        ) : (
          <div className="space-y-4">
            {trabajadoresFiltrados.length === 0 || !area_id ? (
              <div className="text-center text-gray-400">
                No hay trabajadores disponibles para esta área.
              </div>
            ) : area_id == 6 || area_id == 2 ? (
              trabajadoresFiltrados.map((trabajador) => (
                <JornadaCard
                  key={trabajador.id}
                  t={trabajador}
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

export default GestionAsistenciaAutomatica;
