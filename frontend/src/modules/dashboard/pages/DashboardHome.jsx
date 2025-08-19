import { Clock, BarChart3, Users, Shield, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import EstadisticasStock from "../components/EstadisticasStock";
import Typography from "@/components/ui/Typography";

  export default function DashboardHome() {
 
    return (
      //  <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-sky-50 to-teal-50 border-sky-200 shadow-lg">
      //   <CardContent className="p-8">
      //     <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
      //       <div className="flex-1 space-y-6">
      //         <Badge
      //           variant="secondary"
      //           className="bg-sky-100 text-sky-700 hover:bg-sky-100 px-3 py-1 text-sm font-medium"
      //         >
      //           <Clock className="w-4 h-4 mr-2" />
      //           Próximamente
      //         </Badge>

      //         <div className="space-y-3">
      //           <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
      //             Estadísticas Personalizadas
      //           </h2>
      //           <p className="text-lg text-gray-600 leading-relaxed">
      //             Las estadísticas se mostrarán de acuerdo a los roles y permisos asignados a cada usuario para una
      //             experiencia personalizada.
      //           </p>
      //         </div>

      //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
      //           <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-sky-100">
      //             <div className="flex items-start space-x-3">
      //               <div className="bg-sky-100 rounded-lg p-2">
      //                 <BarChart3 className="w-5 h-5 text-sky-600" />
      //               </div>
      //               <div>
      //                 <h3 className="font-semibold text-gray-900 mb-1">Métricas por Rol</h3>
      //                 <p className="text-sm text-gray-600">Visualiza solo las métricas relevantes a tu función</p>
      //               </div>
      //             </div>
      //           </div>

      //           <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-sky-100">
      //             <div className="flex items-start space-x-3">
      //               <div className="bg-sky-100 rounded-lg p-2">
      //                 <Shield className="w-5 h-5 text-sky-600" />
      //               </div>
      //               <div>
      //                 <h3 className="font-semibold text-gray-900 mb-1">Acceso Controlado</h3>
      //                 <p className="text-sm text-gray-600">Información segura basada en permisos</p>
      //               </div>
      //             </div>
      //           </div>

      //           <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-sky-100">
      //             <div className="flex items-start space-x-3">
      //               <div className="bg-sky-100 rounded-lg p-2">
      //                 <Users className="w-5 h-5 text-sky-600" />
      //               </div>
      //               <div>
      //                 <h3 className="font-semibold text-gray-900 mb-1">Multi-Usuario</h3>
      //                 <p className="text-sm text-gray-600">Diferentes vistas para diferentes roles</p>
      //               </div>
      //             </div>
      //           </div>

      //           <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-sky-100">
      //             <div className="flex items-start space-x-3">
      //               <div className="bg-sky-100 rounded-lg p-2">
      //                 <TrendingUp className="w-5 h-5 text-sky-600" />
      //               </div>
      //               <div>
      //                 <h3 className="font-semibold text-gray-900 mb-1">Análisis Dinámico</h3>
      //                 <p className="text-sm text-gray-600">Reportes adaptados a tu nivel de acceso</p>
      //               </div>
      //             </div>
      //           </div>
      //         </div>
      //       </div>

      //       <div className="flex-shrink-0 lg:w-80">
      //         <div className="relative">
      //           <div className="absolute inset-0 bg-sky-100/30 rounded-full blur-3xl"></div>

      //           <div className="relative space-y-4">
      //             <div className="bg-white rounded-lg p-4 shadow-sm border border-sky-100 transform rotate-2">
      //               <div className="flex items-end space-x-2 h-16">
      //                 <div className="bg-sky-200 w-4 h-8 rounded-t"></div>
      //                 <div className="bg-sky-400 w-4 h-12 rounded-t"></div>
      //                 <div className="bg-sky-600 w-4 h-16 rounded-t"></div>
      //                 <div className="bg-sky-500 w-4 h-10 rounded-t"></div>
      //               </div>
      //               <div className="mt-2 text-xs text-gray-500">Admin View</div>
      //             </div>

      //             <div className="bg-white rounded-lg p-4 shadow-sm border border-sky-100 transform -rotate-1 ml-8">
      //               <div className="w-12 h-12 rounded-full border-4 border-sky-200 border-t-sky-600 mx-auto"></div>
      //               <div className="mt-2 text-xs text-gray-500 text-center">User View</div>
      //             </div>

      //             <div className="bg-white rounded-lg p-4 shadow-sm border border-sky-100 transform rotate-1">
      //               <div className="flex items-center space-x-2">
      //                 <Users className="w-4 h-4 text-sky-600" />
      //                 <div className="flex-1 bg-sky-100 h-2 rounded-full">
      //                   <div className="bg-sky-600 h-2 rounded-full w-3/4"></div>
      //                 </div>
      //               </div>
      //               <div className="mt-2 text-xs text-gray-500">Manager View</div>
      //             </div>
      //           </div>
      //         </div>
      //       </div>
      //     </div>
      //   </CardContent>
      // </Card>

      <div className=" min-h-full flex-1  flex flex-col items-center p-4"> 
         <Typography.Title>Resumen del Stock de Piezas</Typography.Title>
        <EstadisticasStock/>
      </div>
    );
  }