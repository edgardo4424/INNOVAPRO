import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
   AlertTriangle,
   CheckCircle,
   Clock,
   Info,
   Package,
   TrendingDown,
   TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const SummaryStats = () => {
   return (
      <>
         <Card className="my-6 flex-col lg:flex-row md:justify-between">
            <CardHeader className="flex-1">
               <CardTitle className="flex items-center gap-2 text-lg">
                  <Info className="h-5 w-5" />
                  Leyenda de Niveles de Stock
               </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center">
               <div className="flex flex-wrap justify-between gap-4">
                  <div className="flex items-center gap-2">
                     <Badge className="bg-red-100 text-red-800">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Sin Stock (0)
                     </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                     <Badge className="bg-orange-100 text-orange-800">
                        <TrendingDown className="h-3 w-3 mr-1" />
                        Stock Bajo (1-100)
                     </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                     <Badge className="bg-yellow-100 text-yellow-800">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Stock Moderado (101-200)
                     </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                     <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Stock Alto (200+)
                     </Badge>
                  </div>
               </div>
            </CardContent>
         </Card>
      </>
   );
};
export default SummaryStats;
