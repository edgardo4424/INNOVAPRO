
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, AlertTriangle, CheckCircle, Eye } from "lucide-react";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function DetalleVacacionesModal({ datosEmpleado }) {
   const contratos = datosEmpleado.contratos_laborales || [];

   const fechaIngreso = (() => {
      if (contratos.length === 0) return null;
      const ordenados = [...contratos].sort(
         (a, b) => new Date(a.fecha_inicio) - new Date(b.fecha_inicio)
      );
      return ordenados[0].fecha_inicio;
   })();

   const contarDiasLaborables = (inicio, fin) => {
      let contador = 0;
      const actual = new Date(inicio);
      while (actual <= fin) {
         const dia = actual.getDay();
         if (dia !== 0 && dia !== 6) contador++; // lunes a viernes
         actual.setDate(actual.getDate() + 1);
      }
      return contador;
   };

   const contarDiasLaborablesDelMes = (anio, mes) => {
      let contador = 0;
      const fecha = new Date(anio, mes, 1);
      while (fecha.getMonth() === mes) {
         const dia = fecha.getDay();
         if (dia !== 0 && dia !== 6) contador++;
         fecha.setDate(fecha.getDate() + 1);
      }
      return contador;
   };

   const sumarMeses = (fecha, cantidad) => {
      const nuevaFecha = new Date(fecha);
      nuevaFecha.setMonth(nuevaFecha.getMonth() + cantidad);
      return nuevaFecha;
   };

   const calcularDiasGenerados = () => {
      const hoy = new Date();
      let totalVacaciones = 0;

      for (const contrato of contratos) {
         const inicio = new Date(contrato.fecha_inicio);
         const fin = new Date(contrato.fecha_fin);
         const fechaFin = fin > hoy ? hoy : fin;
         const meses = [];

         let actual = new Date(inicio.getFullYear(), inicio.getMonth(), 1);
         while (actual <= fechaFin) {
            meses.push(new Date(actual));
            actual = sumarMeses(actual, 1);
         }

         for (const inicioMes of meses) {
            const anio = inicioMes.getFullYear();
            const mes = inicioMes.getMonth();
            const finMes = new Date(anio, mes + 1, 0);
            const diasLaborablesTotales = contarDiasLaborablesDelMes(anio, mes);

            const inicioReal = inicioMes < inicio ? inicio : inicioMes;
            const finReal = finMes > fechaFin ? fechaFin : finMes;
            const diasTrabajados = contarDiasLaborables(inicioReal, finReal);

            const tasaVacaciones = contrato.regimen === "MYPE" ? 1.25 : 2.5;
            const proporcionVacaciones =
               (diasTrabajados / diasLaborablesTotales) * tasaVacaciones;

            totalVacaciones += proporcionVacaciones;
         }
      }

      return Math.floor(totalVacaciones);
   };

   const formatearFecha = (fecha) => {
      if (
         !fecha ||
         typeof fecha !== "string" ||
         !/^\d{4}-\d{2}-\d{2}$/.test(fecha)
      ) {
         return "Fecha inválida";
      }

      const [year, month, day] = fecha.split("-");
      const fechaLocal = new Date(Number(year), Number(month) - 1, Number(day));

      return fechaLocal.toLocaleDateString("es-PE", {
         day: "2-digit",
         month: "2-digit",
         year: "numeric",
      });
   };

   const calcularDiasTrabajados = (fechaInicio) => {
      const inicio = new Date(fechaInicio);
      const hoy = new Date();
      const diferenciaTiempo = Math.abs(hoy - inicio);
      return Math.ceil(diferenciaTiempo / (1000 * 60 * 60 * 24));
   };

   const calcularDuracionVacaciones = (fechaInicio, fechaFin) => {
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);
      return Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24)) + 1;
   };

   const diasTrabajados = fechaIngreso
      ? calcularDiasTrabajados(fechaIngreso)
      : 0;

   const diasTomados = datosEmpleado.vacaciones.reduce(
      (sum, v) => sum + v.dias_tomados,
      0
   );

   const diasVendidos = datosEmpleado.vacaciones.reduce(
      (sum, v) => sum + v.dias_vendidos,
      0
   );

   const diasGenerados = calcularDiasGenerados();
   const diasTotales = diasTomados + diasVendidos;
   const diasRestantes = diasGenerados - diasTotales;

   return (
      <AlertDialog>
         <AlertDialogTrigger asChild>
            <Button variant="outline" size="icon" className="text-xs">
               <Eye />
            </Button>
         </AlertDialogTrigger>
         <AlertDialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <AlertDialogHeader>
               <AlertDialogTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {datosEmpleado.nombres} {datosEmpleado.apellidos}
               </AlertDialogTitle>
               <AlertDialogDescription>
                  {datosEmpleado.cargo.nombre} (
                  {datosEmpleado.cargo.area.nombre}) -{" "}
                  {/* {datosEmpleado.empresa_proveedora.razon_social} */}
               </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="space-y-4">
               <Card>
                  <CardHeader className="pb-3">
                     <CardTitle className="text-lg flex items-center gap-2">
                        <Calendar className="h-4 w-4" /> Resumen de Vacaciones
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <p className="text-sm font-medium text-muted-foreground">
                              Fecha de Ingreso
                           </p>
                           <p className="font-medium">
                              {formatearFecha(fechaIngreso)}
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
                              {diasGenerados}
                           </div>
                           <p className="text-xs text-muted-foreground">
                              Días Generados
                           </p>
                        </div>
                        <div className="space-y-2">
                           <div className="text-2xl font-bold text-green-600">
                              {diasTomados}
                           </div>
                           <p className="text-xs text-muted-foreground">
                              Días Tomados
                           </p>
                        </div>
                        <div className="space-y-2">
                           <div className="text-2xl font-bold text-orange-600">
                              {diasVendidos}
                           </div>
                           <p className="text-xs text-muted-foreground">
                              Días Vendidos
                           </p>
                        </div>
                        <div className="space-y-2">
                           <div className="text-2xl font-bold text-purple-600">
                              {diasRestantes}
                           </div>
                           <p className="text-xs text-muted-foreground">
                              Días Disponibles
                           </p>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               <Card>
                  <CardHeader className="pb-3">
                     <CardTitle className="text-lg flex items-center gap-2">
                        <Clock className="h-4 w-4" /> Historial de Vacaciones
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
         </AlertDialogContent>
      </AlertDialog>
   );
}
