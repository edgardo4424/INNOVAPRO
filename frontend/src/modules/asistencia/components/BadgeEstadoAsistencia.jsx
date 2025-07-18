import { Badge } from "@/components/ui/badge";
import { Check, Clock, X } from "lucide-react";

const BadgeEstadoAsistencia = ({ trabajador }) => {
   return (
      <>
         {trabajador.asistencia ? (
            <Badge
               variant="default"
               className="bg-green-500 hover:bg-green-600 text-white"
            >
               <Check className="w-3 h-3 mr-1" />
               Asistencia Registrada
            </Badge>
         ) : (
            <Badge
               variant="outline"
               className="flex items-center gap-2 px-3 py-1 border-gray-500 text-gray-600"
            >
               <Clock className="w-3 h-3" />
               Sin Marcar
            </Badge>
         )}
      </>
   );
};
export default BadgeEstadoAsistencia;
