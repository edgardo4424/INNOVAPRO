import { Construction, Clock, Wrench, AlertTriangle } from "lucide-react";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PlanillaEnConstruccion() {
   return (
      <div className="min-h-screen bg-slate-50">
         {/* Contenido principal */}
         <div className="p-6">
            <div className="max-w-4xl mx-auto">
               <Card className="border-2 border-dashed border-yellow-300 bg-yellow-50/50">
                  <CardHeader className="text-center pb-4">
                     <div className="mx-auto mb-4 p-3 bg-yellow-100 rounded-full w-fit">
                        <Wrench className="h-12 w-12 text-yellow-600" />
                     </div>
                     <CardTitle className="text-2xl text-slate-800 mb-2">
                        Módulo en Construcción
                     </CardTitle>
                     <CardDescription className="text-lg text-slate-600">
                        El módulo de Planilla está siendo desarrollado
                        actualmente
                     </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6">
                     <div className="grid md:grid-cols-2 gap-6">
                        <Card className="bg-white">
                           <CardHeader className="pb-3">
                              <div className="flex items-center space-x-2">
                                 <Clock className="h-5 w-5 text-blue-600" />
                                 <CardTitle className="text-lg">
                                    Estado del Desarrollo
                                 </CardTitle>
                              </div>
                           </CardHeader>
                           <CardContent className="space-y-3">
                              <div className="flex justify-between items-center">
                                 <span className="text-sm text-slate-600">
                                    Análisis de Requerimientos
                                 </span>
                                 <Badge className="bg-green-100 text-green-800">
                                    Completado
                                 </Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                 <span className="text-sm text-slate-600">
                                    Diseño de Base de Datos
                                 </span>
                                 <Badge className="bg-yellow-100 text-yellow-800">
                                    En Progreso
                                 </Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                 <span className="text-sm text-slate-600">
                                    Desarrollo Frontend
                                 </span>
                                 <Badge className="bg-gray-100 text-gray-800">
                                    Pendiente
                                 </Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                 <span className="text-sm text-slate-600">
                                    Integración con Asistencias
                                 </span>
                                 <Badge className="bg-gray-100 text-gray-800">
                                    Pendiente
                                 </Badge>
                              </div>
                           </CardContent>
                        </Card>

                        <Card className="bg-white">
                           <CardHeader className="pb-3">
                              <div className="flex items-center space-x-2">
                                 <AlertTriangle className="h-5 w-5 text-orange-600" />
                                 <CardTitle className="text-lg">
                                    Funcionalidades Planificadas
                                 </CardTitle>
                              </div>
                           </CardHeader>
                           <CardContent className="space-y-2">
                              <div className="flex items-center space-x-2">
                                 <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                 <span className="text-sm text-slate-600">
                                    Generación de planillas de pago
                                 </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                 <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                 <span className="text-sm text-slate-600">
                                    Cálculo automático de horas trabajadas
                                 </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                 <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                 <span className="text-sm text-slate-600">
                                    Gestión de descuentos y bonificaciones
                                 </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                 <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                 <span className="text-sm text-slate-600">
                                    Reportes de nómina
                                 </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                 <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                 <span className="text-sm text-slate-600">
                                    Integración con sistema de asistencias
                                 </span>
                              </div>
                           </CardContent>
                        </Card>
                     </div>

                     <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                           <div className="p-1 bg-blue-100 rounded-full">
                              <AlertTriangle className="h-4 w-4 text-blue-600" />
                           </div>
                           <div>
                              <h4 className="font-medium text-blue-900 mb-1">
                                 Información Importante
                              </h4>
                              <p className="text-sm text-blue-700">
                                 Este módulo se integrará directamente con el
                                 sistema de asistencias actual, permitiendo el
                                 cálculo automático de planillas basado en los
                                 registros de entrada y salida.
                              </p>
                           </div>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </div>
         </div>
      </div>
   );
}
