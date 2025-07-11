import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

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
               variant="destructive"
               className="bg-red-500 hover:bg-red-600"
            >
               <X className="w-3 h-3 mr-1" />
               Sin Registrar
            </Badge>
         )}
      </>
   );
};
export default BadgeEstadoAsistencia;
