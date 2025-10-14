import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
   AlertCircle,
   Briefcase,
   Calendar,
   Clock,
   Moon,
   Sun,
   Users,
} from "lucide-react";
import { formatearFecha } from "../libs/formatearFecha";

const AsistenciaHeader = ({
   trabajadores,
   estadisticas,
   fechaSeleccionada,
   setFechaSeleccionada,
   title="",
}) => {
   return (
      <Card>
         <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
               <Users className="h-6 w-6" />
               Control de Asistencia "{title}"
               <p>{formatearFecha(fechaSeleccionada)}</p>
            </CardTitle>
         </CardHeader>
         <CardContent>
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                     <Calendar className="h-4 w-4" />
                     <Label htmlFor="fecha">Fecha:</Label>
                     <Input
                        id="fecha"
                        type="date"
                        value={fechaSeleccionada}
                        onChange={(e) => setFechaSeleccionada(e.target.value)}
                        className="w-auto"
                        
                     />
                  </div>
               </div>

               <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  <Badge variant="outline" className="flex items-center gap-1">
                     <Sun className="h-3 w-3 text-yellow-600" />
                     Presentes: {estadisticas.presentes || 0}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                     <Moon className="h-3 w-3 text-blue-600" />
                     Ausentes: {estadisticas.ausentes || 0}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                     <AlertCircle className="h-3 w-3 text-yellow-600" />
                     Tardanzas: {estadisticas.tardanzas || 0}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                     <AlertCircle className="h-3 w-3 text-yellow-600" />
                     Sin registrar: {estadisticas.no_registrado || 0}
                  </Badge>
                  

                  <Badge variant="outline" className="flex items-center gap-1">
                     <Briefcase className="h-3 w-3 text-green-600" />
                     Total: {trabajadores.length}
                  </Badge>
               </div>
            </div>
         </CardContent>
      </Card>
   );
};
export default AsistenciaHeader;
