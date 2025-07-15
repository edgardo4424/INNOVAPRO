"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Save, RefreshCw, FileText } from "lucide-react";
import asistenciaService from "../services/asistenciaService";

export const estadosAsistencia = [
   { value: "presente", label: "Presente", color: "bg-green-500" },
   { value: "falto", label: "Falto", color: "bg-red-500" },
   { value: "tardanza", label: "Tardanza", color: "bg-yellow-500" },
   { value: "permiso", label: "Permiso", color: "bg-blue-500" },
   { value: "licencia", label: "Licencia", color: "bg-purple-500" },
   { value: "vacaciones", label: "Vacaciones", color: "bg-indigo-500" },
   {
      value: "falta-justificada",
      label: "Falta Justificada",
      color: "bg-orange-500",
   },
];

export default function AsistenciaSimple({
   trabajador,
   fecha,
   obtenerTrabajadores,
}) {
   const [selectedEstado, setSelectedEstado] = useState(
      trabajador.asistencia?.estado_asistencia || ""
   );
   const [isLoading, setIsLoading] = useState(false);
   const [currentAttendance, setCurrentAttendance] = useState(
      trabajador.asistencia
   );

   const hasExistingAttendance = currentAttendance !== null;

   const guardarAsistencia = async () => {
      if (!selectedEstado) return;

      setIsLoading(true);

      try {
         const nuevaAsistencia = {
            id: Date.now(),
            trabajador_id: trabajador.id,
            fecha: fecha,
            estado_asistencia: selectedEstado,
         };
         await asistenciaService.crearAsistenciaSimple(nuevaAsistencia);
         await obtenerTrabajadores();
      } catch (error) {
         console.error("Error al guardar asistencia:", error);
      } finally {
         setIsLoading(false);
      }
   };

   const actualizarAsistencia = async () => {
      if (!selectedEstado || !currentAttendance) return;
      setIsLoading(true);
      try {
         const asistenciaActualizada = {
            ...currentAttendance,
            estado_asistencia: selectedEstado,
         };

         await asistenciaService.actualizarAsistenciaSimple(
            asistenciaActualizada
         );
         await obtenerTrabajadores();
      } catch (error) {
         console.error("Error al actualizar asistencia:", error);
      } finally {
         setIsLoading(false);
      }
   };

   const getEstadoInfo = (estado) => {
      return estadosAsistencia.find((e) => e.value === estado);
   };

   return (
      <Card className="transition-all hover:shadow-md border-l-3 border-l-blue-500 py-2 ">
         <CardContent className="">
            <div className="flex items-center justify-between ">
               {/* Información del trabajador */}
               <div className="flex items-center gap-4">
                  <div>
                     <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-base !mt-0">
                           {trabajador.nombres} {trabajador.apellidos}
                        </h3>
                        {hasExistingAttendance && (
                           <Badge className="bg-green-100 text-green-800 border-green-200 text-xs px-2 py-1">
                              Asistencia Registrada
                           </Badge>
                        )}
                     </div>
                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-3 w-3" />
                        <span>
                           {trabajador.tipo_documento}:{" "}
                           {trabajador.numero_documento}
                        </span>
                     </div>
                  </div>
               </div>

               {/* Controles de asistencia */}
               <div className="flex items-center gap-3">
                  {/* Selector de estado */}
                  <Select
                     value={selectedEstado}
                     onValueChange={setSelectedEstado}
                  >
                     <SelectTrigger className="w-48">
                        <SelectValue placeholder="Estado" />
                     </SelectTrigger>
                     <SelectContent>
                        {estadosAsistencia.map((estado) => (
                           <SelectItem key={estado.value} value={estado.value}>
                              <div className="flex items-center gap-2">
                                 <div
                                    className={`w-3 h-3 rounded-full ${estado.color}`}
                                 />
                                 {estado.label}
                              </div>
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>

                  {/* Botón de acción */}
                  {hasExistingAttendance ? (
                     <Button
                        onClick={actualizarAsistencia}
                        disabled={
                           !selectedEstado ||
                           isLoading ||
                           selectedEstado ===
                              currentAttendance?.estado_asistencia
                        }
                        variant="outline"
                        size="sm"
                        className="min-w-[100px] border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent"
                     >
                        {isLoading ? (
                           <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                           <RefreshCw className="h-4 w-4 mr-2" />
                        )}
                        Actualizar
                     </Button>
                  ) : (
                     <Button
                        onClick={guardarAsistencia}
                        disabled={!selectedEstado || isLoading}
                        size="sm"
                        className="min-w-[100px] bg-blue-600 hover:bg-blue-700"
                     >
                        {isLoading ? (
                           <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                           <Save className="h-4 w-4 mr-2" />
                        )}
                        Guardar
                     </Button>
                  )}
               </div>
            </div>
         </CardContent>
      </Card>
   );
}
