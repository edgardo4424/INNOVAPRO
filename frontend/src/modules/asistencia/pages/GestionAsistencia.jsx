import { useEffect, useMemo, useState } from "react";
import asistenciaService from "../services/asistenciaService";
import AsistenciaHeader from "../components/AsistenciaHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import JornadaCard from "../components/JornadaCard";
import BadgeEstadoAsistencia from "../components/BadgeEstadoAsistencia";
import { useParams, useSearchParams } from "react-router-dom";
import AsistenciaSimple from "../components/AsistenciaSimple";

const GestionAsistencia = () => {
   const { tipo } = useParams();
   const [searchParams] = useSearchParams();
   const area_id = searchParams.get("area_id");

   const [fechaSeleccionada, setFechaSeleccionada] = useState(
      new Date().toISOString().split("T")[0]
   );
   const [trabajadores, setTrabajadores] = useState([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);

   const obtenerTrabajadores = async () => {
      if (!area_id) {
         setError("Área no especificada en la URL");
         return;
      }
      try {
         setLoading(true);
         const response = await asistenciaService.obtenerTrabajadoresPorFilial(
            area_id,
            fechaSeleccionada
         );
         console.log(response.data.trabajadores);
         
         setTrabajadores([...response.data.trabajadores] || []);
      } catch (err) {
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
      if (fechaSeleccionada) {
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

            <AsistenciaHeader
               trabajadores={trabajadores}
               estadisticas={estadisticas}
               fechaSeleccionada={fechaSeleccionada}
               setFechaSeleccionada={setFechaSeleccionada}
               title={tipo}
            />
            {loading ? (
               <div className="text-center py-6 text-gray-500">
                  Cargando trabajadores...
               </div>
            ) : (
               <div className="space-y-4">
                  {trabajadores.length === 0 ? (
                     <div className="text-center text-gray-400">
                        No hay trabajadores disponibles para esta área.
                     </div>
                  ) : area_id == 6 || area_id == 2 ? (
                     trabajadores.map((trabajador) => (
                        <Card key={trabajador.id} className={"py-3 gap-2"}>
                           <CardHeader className={""}>
                              <CardTitle className="flex items-center justify-start gap-8 ">
                                 <div>
                                    <h3 className="text-lg font-semibold !mt-0">
                                       {trabajador.nombres}{" "}
                                       {trabajador.apellidos}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                       {trabajador.tipo_documento}:{" "}
                                       {trabajador.numero_documento}
                                    </p>
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
                     trabajadores.map((trabajador) => (
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
