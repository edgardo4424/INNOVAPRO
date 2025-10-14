"use client";

import { useState, useMemo } from "react";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
   format,
   startOfMonth,
   endOfMonth,
   eachDayOfInterval,
   isSameMonth,
   isToday,
   parseISO,
   isWithinInterval,
} from "date-fns";
import { es } from "date-fns/locale";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";

export function CalendarioVacaciones({ empleados }) {
   const [fechaActual, setFechaActual] = useState(new Date());

   const vacacionesDelMes = useMemo(() => {
      const inicioMes = startOfMonth(fechaActual);
      const finMes = endOfMonth(fechaActual);

      const vacaciones = [];

      empleados.forEach((empleado) => {
         empleado.vacaciones.forEach((vacacion) => {
            const fechaInicio = parseISO(vacacion.fecha_inicio);
            const fechaTermino = parseISO(vacacion.fecha_termino);

            if (
               isWithinInterval(inicioMes, {
                  start: fechaInicio,
                  end: fechaTermino,
               }) ||
               isWithinInterval(finMes, {
                  start: fechaInicio,
                  end: fechaTermino,
               }) ||
               isWithinInterval(fechaInicio, {
                  start: inicioMes,
                  end: finMes,
               })
            ) {
               const hoy = new Date();
               const activa = isWithinInterval(hoy, {
                  start: fechaInicio,
                  end: fechaTermino,
               });

               vacaciones.push({
                  vacacion,
                  empleado,
                  activa,
               });
            }
         });
      });

      return vacaciones;
   }, [empleados, fechaActual]);

   const proximasVacaciones = useMemo(() => {
      const hoy = new Date();
      const proximas = [];

      empleados.forEach((empleado) => {
         empleado.vacaciones.forEach((vacacion) => {
            const fechaInicio = parseISO(vacacion.fecha_inicio);
            if (fechaInicio >= hoy) {
               proximas.push({
                  vacacion,
                  empleado,
               });
            }
         });
      });

      return proximas
         .sort(
            (a, b) =>
               parseISO(a.vacacion.fecha_inicio).getTime() -
               parseISO(b.vacacion.fecha_inicio).getTime()
         )
         .slice(0, 5);
   }, [empleados]);

   const cambiarMes = (direccion) => {
      setFechaActual((prev) => {
         const nuevaFecha = new Date(prev);
         if (direccion === "prev") {
            nuevaFecha.setMonth(prev.getMonth() - 1);
         } else {
            nuevaFecha.setMonth(prev.getMonth() + 1);
         }
         return nuevaFecha;
      });
   };

   const diasCalendario = useMemo(() => {
      const inicioMes = startOfMonth(fechaActual);
      const finMes = endOfMonth(fechaActual);

      const inicioCalendario = new Date(inicioMes);
      inicioCalendario.setDate(inicioMes.getDate() - inicioMes.getDay());

      const finCalendario = new Date(finMes);
      finCalendario.setDate(finMes.getDate() + (6 - finMes.getDay()));

      return eachDayOfInterval({ start: inicioCalendario, end: finCalendario });
   }, [fechaActual]);

   const obtenerVacacionesDelDia = (fecha) => {
      return vacacionesDelMes.filter(({ vacacion }) => {
         const fechaInicio = parseISO(vacacion.fecha_inicio);
         const fechaTermino = parseISO(vacacion.fecha_termino);
         return isWithinInterval(fecha, {
            start: fechaInicio,
            end: fechaTermino,
         });
      });
   };

   const diasSemana = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];

   return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2">
            <Card>
               <CardHeader>
                  <div className="flex items-center justify-between">
                     <div>
                        <CardTitle>Calendario de Vacaciones</CardTitle>
                        <CardDescription>
                           Vista general de las vacaciones programadas
                        </CardDescription>
                     </div>
                     <div className="flex items-center space-x-2">
                        <Button
                           variant="outline"
                           size="sm"
                           onClick={() => cambiarMes("prev")}
                        >
                           <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="font-medium min-w-[120px] text-center">
                           {format(fechaActual, "MMMM yyyy", { locale: es })}
                        </span>
                        <Button
                           variant="outline"
                           size="sm"
                           onClick={() => cambiarMes("next")}
                        >
                           <ChevronRight className="h-4 w-4" />
                        </Button>
                     </div>
                  </div>
               </CardHeader>
               <CardContent>
                  <div className="grid grid-cols-7 gap-1 mb-4">
                     {diasSemana.map((dia) => (
                        <div
                           key={dia}
                           className="p-2 text-center text-sm font-medium text-gray-500"
                        >
                           {dia}
                        </div>
                     ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                     {diasCalendario.map((dia, index) => {
                        const vacacionesDia = obtenerVacacionesDelDia(dia);
                        const esMesActual = isSameMonth(dia, fechaActual);
                        const esHoy = isToday(dia);

                        return (
                           <div
                              key={index}
                              className={`
                                 min-h-[80px] p-2 border rounded-lg relative
                                 ${esMesActual ? "bg-white" : "bg-gray-50"}
                                 ${
                                    esHoy
                                       ? "ring-2 ring-blue-500 bg-gray-500"
                                       : ""
                                 }
                                 ${vacacionesDia.length > 0 ? "bg-blue-50" : ""}
                              `}
                           >
                              <div
                                 className={`text-sm ${
                                    esMesActual
                                       ? "text-gray-900"
                                       : "text-gray-400"
                                 }`}
                              >
                                 {format(dia, "d")}
                              </div>
                              {vacacionesDia.length > 0 && (
                                 <div className="mt-1 space-y-1">
                                    {vacacionesDia
                                       .slice(0, 1)
                                       .map(({ empleado, activa }, idx) => (
                                          <div
                                             key={idx}
                                             className={`text-xs p-1 rounded truncate ${
                                                activa
                                                   ? "bg-green-100 text-green-800"
                                                   : "bg-blue-100 text-blue-800"
                                             }`}
                                             title={`${empleado.nombres} ${empleado.apellidos}`}
                                          >
                                             {empleado.nombres}
                                          </div>
                                       ))}
                                    {vacacionesDia.length > 1 && (
                                       <Popover>
                                          <PopoverTrigger asChild>
                                             <Button
                                                variant="outline"
                                                size="xs"
                                                className="w-full text-xs"
                                             >
                                                +{vacacionesDia.length - 1} más
                                             </Button>
                                          </PopoverTrigger>
                                          <PopoverContent className="space-y-1 p-1 max-w-[150px]">
                                             {vacacionesDia
                                                .slice(1)
                                                .map(
                                                   (
                                                      { empleado, activa },
                                                      idx
                                                   ) => (
                                                      <div
                                                         key={idx}
                                                         className={`text-xs p-1 rounded truncate ${
                                                            activa
                                                               ? "bg-green-100 text-green-800"
                                                               : "bg-blue-100 text-blue-800"
                                                         }`}
                                                         title={`${empleado.nombres} ${empleado.apellidos}`}
                                                      >
                                                         {empleado.nombres}{" "}
                                                         {empleado.apellidos}
                                                      </div>
                                                   )
                                                )}
                                          </PopoverContent>
                                       </Popover>
                                    )}
                                 </div>
                              )}
                           </div>
                        );
                     })}
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Próximas Vacaciones */}
         <div>
            <Card>
               <CardHeader>
                  <CardTitle>Próximas Vacaciones</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  {proximasVacaciones.length > 0 ? (
                     proximasVacaciones.map(({ vacacion, empleado }) => (
                        <div
                           key={vacacion.id}
                           className="border-l-4 border-blue-500 pl-4 py-2"
                        >
                           <div className="font-medium text-sm">{`${empleado.nombres} ${empleado.apellidos}`}</div>
                           <div className="text-xs text-gray-500 mt-1">
                              {format(
                                 parseISO(vacacion.fecha_inicio),
                                 "dd/MM/yyyy",
                                 {
                                    locale: es,
                                 }
                              )}{" "}
                              -{" "}
                              {format(
                                 parseISO(vacacion.fecha_termino),
                                 "dd/MM/yyyy",
                                 {
                                    locale: es,
                                 }
                              )}
                           </div>
                        </div>
                     ))
                  ) : (
                     <p className="text-sm text-gray-500">
                        No hay próximas vacaciones programadas
                     </p>
                  )}
               </CardContent>
            </Card>
         </div>
      </div>
   );
}
