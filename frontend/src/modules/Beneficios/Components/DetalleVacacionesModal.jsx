import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, AlertTriangle, CheckCircle, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function DetalleVacacionesModal({ datosEmpleado }) {
   const calcularDiasTrabajados = (fechaIngreso) => {
      const inicio = new Date(fechaIngreso);
      const hoy = new Date();
      const diferenciaTiempo = Math.abs(hoy.getTime() - inicio.getTime());
      const diferenciaDias = Math.ceil(
         diferenciaTiempo / (1000 * 60 * 60 * 24)
      );
      return diferenciaDias;
   };

   const calcularDiasVacacionesDisponibles = (fechaIngreso, regimen) => {
      const diasTrabajados = calcularDiasTrabajados(fechaIngreso);
      const añosTrabajados = Math.floor(diasTrabajados / 365);

      let diasPorAño = 0;

      if (regimen?.toLowerCase() == "general") {
         diasPorAño = 30;
      } else if (regimen?.toLowerCase() == "mype") {
         diasPorAño = 15;
      } else {
         diasPorAño = 0; // Por si viene mal el dato
      }

      return añosTrabajados * diasPorAño;
   };

   const diasTrabajados = calcularDiasTrabajados(datosEmpleado.fecha_ingreso);
   const diasVacacionesDisponibles = calcularDiasVacacionesDisponibles(
      datosEmpleado.fecha_ingreso,
      datosEmpleado.regimen
   );
   const diasVacacionesTomados = datosEmpleado.vacaciones.reduce(
      (total, vacacion) => total + vacacion.dias_tomados,
      0
   );
   const diasVacacionesVendidos = datosEmpleado.vacaciones.reduce(
      (total, vacacion) => total + vacacion.dias_vendidos,
      0
   );
   const diasVacacionesUtilizados =
      diasVacacionesTomados + diasVacacionesVendidos;

   const diasVacacionesRestantes =
      diasVacacionesDisponibles - diasVacacionesUtilizados;

   const formatearFecha = (fecha) => {
      return new Date(fecha).toLocaleDateString("es-PE", {
         day: "2-digit",
         month: "2-digit",
         year: "numeric",
      });
   };

   const calcularDuracionVacaciones = (fechaInicio, fechaTermino) => {
      const inicio = new Date(fechaInicio);
      const termino = new Date(fechaTermino);
      const diferencia =
         Math.ceil(
            (termino.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)
         ) + 1;
      return diferencia;
   };

   return (
      <Dialog>
         <DialogTrigger asChild>
            <Button variant="outline" size="icon" className="text-xs">
               <Eye />
            </Button>
         </DialogTrigger>
         <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
               <DialogTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {datosEmpleado.nombres} {datosEmpleado.apellidos}
               </DialogTitle>
               <DialogDescription>
                  {datosEmpleado.cargo.nombre} (
                  {datosEmpleado.cargo.area.nombre}) -{" "}
                  {datosEmpleado.empresa_proveedora.razon_social}
               </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
               {/* Resumen de Vacaciones */}
               <Card>
                  <CardHeader className="pb-3">
                     <CardTitle className="text-lg flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Resumen de Vacaciones
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <p className="text-sm font-medium text-muted-foreground">
                              Fecha de Ingreso
                           </p>
                           <p className="font-medium">
                              {formatearFecha(datosEmpleado.fecha_ingreso)}
                           </p>
                        </div>
                        <div>
                           <p className="text-sm font-medium text-muted-foreground">
                              Días Trabajados
                           </p>
                           <p className="font-medium">{diasTrabajados} días</p>
                        </div>
                     </div>

                     <Separator />

                     <div className="grid grid-cols-4 gap-4 text-center">
                        <div className="space-y-2">
                           <div className="text-2xl font-bold text-blue-600">
                              {diasVacacionesDisponibles}
                           </div>
                           <p className="text-xs text-muted-foreground">
                              Días Generados
                           </p>
                        </div>
                        <div className="space-y-2">
                           <div className="text-2xl font-bold text-green-600">
                              {diasVacacionesTomados}
                           </div>
                           <p className="text-xs text-muted-foreground">
                              Días Tomados
                           </p>
                        </div>
                        <div className="space-y-2">
                           <div className="text-2xl font-bold text-orange-600">
                              {diasVacacionesVendidos}
                           </div>
                           <p className="text-xs text-muted-foreground">
                              Días Vendidos
                           </p>
                        </div>
                        <div className="space-y-2">
                           <div className="text-2xl font-bold text-purple-600">
                              {diasVacacionesRestantes}
                           </div>
                           <p className="text-xs text-muted-foreground">
                              Días Restantes
                           </p>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               {/* Historial de Vacaciones */}
               <Card>
                  <CardHeader className="pb-3">
                     <CardTitle className="text-lg flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Historial de Vacaciones
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     {datosEmpleado.vacaciones.length > 0 ? (
                        <div className="space-y-3">
                           {datosEmpleado.vacaciones.map((vacacion, index) => (
                              <div
                                 key={vacacion.id}
                                 className="border rounded-lg p-4 space-y-3"
                              >
                                 <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                       <CheckCircle className="h-4 w-4 text-green-600" />
                                       <span className="font-medium">
                                          Período #{index + 1}
                                       </span>
                                    </div>
                                    <Badge variant="outline">
                                       {calcularDuracionVacaciones(
                                          vacacion.fecha_inicio,
                                          vacacion.fecha_termino
                                       )}{" "}
                                       días calendario
                                    </Badge>
                                 </div>

                                 <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                       <p className="text-muted-foreground">
                                          Fecha de Inicio
                                       </p>
                                       <p className="font-medium">
                                          {formatearFecha(
                                             vacacion.fecha_inicio
                                          )}
                                       </p>
                                    </div>
                                    <div>
                                       <p className="text-muted-foreground">
                                          Fecha de Término
                                       </p>
                                       <p className="font-medium">
                                          {formatearFecha(
                                             vacacion.fecha_termino
                                          )}
                                       </p>
                                    </div>
                                    <div>
                                       <p className="text-muted-foreground">
                                          Días Tomados
                                       </p>
                                       <p className="font-medium text-green-600">
                                          {vacacion.dias_tomados} días
                                       </p>
                                    </div>
                                    <div>
                                       <p className="text-muted-foreground">
                                          Días Vendidos
                                       </p>
                                       <p className="font-medium text-orange-600">
                                          {vacacion.dias_vendidos} días
                                       </p>
                                    </div>
                                 </div>

                                 {vacacion.observaciones && (
                                    <div>
                                       <p className="text-sm text-muted-foreground">
                                          Observaciones
                                       </p>
                                       <p className="text-sm bg-gray-50 p-2 rounded">
                                          {vacacion.observaciones}
                                       </p>
                                    </div>
                                 )}
                              </div>
                           ))}
                        </div>
                     ) : (
                        <div className="flex items-center gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                           <AlertTriangle className="h-4 w-4 text-yellow-600" />
                           <p className="text-sm text-yellow-800">
                              Este empleado no ha registrado vacaciones aún.
                           </p>
                        </div>
                     )}
                  </CardContent>
               </Card>
            </div>
         </DialogContent>
      </Dialog>
   );
}
