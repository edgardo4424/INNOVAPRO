import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
   Tooltip,
   TooltipContent,
   TooltipProvider,
   TooltipTrigger,
} from "@/components/ui/tooltip";
import {
   AlertTriangle,
   CheckCircle,
   Clock,
   TrendingDown,
   TrendingUp,
   XCircle,
} from "lucide-react";

const getStockLevel = (stock) => {
   if (stock <= 0) return "out";
   if (stock <= 100) return "low";
   if (stock <= 200) return "medium";
   return "high";
};

const getStockColor = (level) => {
   switch (level) {
      case "out":
         return "bg-red-100 text-red-800";
      case "low":
         return "bg-orange-200/60 text-orange-800";
      case "medium":
         return "bg-yellow-100 text-yellow-800";
      case "high":
         return "bg-green-100 text-green-800";
      default:
         return "bg-gray-100 text-gray-800";
   }
};

const getStockIcon = (level) => {
   switch (level) {
      case "out":
         return <AlertTriangle className="h-3 w-3" />;
      case "low":
         return <TrendingDown className="h-3 w-3" />;
      case "medium":
         return <TrendingUp className="h-3 w-3" />;
      case "high":
         return <CheckCircle className="h-3 w-3" />;
      default:
         return <Package className="h-3 w-3" />;
   }
};
const StockCellRenderer = (params) => {
   const stock = params.value;
   const level = getStockLevel(stock);
   const colorClass = getStockColor(level);
   const icon = getStockIcon(level);

   return (
      <div className="flex items-center gap-2 py-1">
         <Badge
            variant="secondary"
            className={`${colorClass} flex items-center gap-1`}
         >
            {icon}
            {stock}
         </Badge>
      </div>
   );
};

const QuotedPartsCellRenderer = (params) => {
   const quoted = params.value || 0;
   const stock = params.data.stock_disponible || 0;

   // Calcular el porcentaje y determinar el estado
   const percentage = stock > 0 ? Math.min((quoted / stock) * 100, 100) : 0;
   const isOverStock = quoted > stock && stock > 0;
   const isOutOfStock = stock === 0 && quoted > 0;
   const isAvailable = quoted <= stock && stock > 0;

   // Determinar colores y estados
   const getProgressColor = () => {
      if (isOutOfStock) return "bg-red-500";
      if (isOverStock) return "bg-orange-500";
      if (percentage > 80) return "bg-yellow-500";
      return "bg-green-500";
   };

   const getStatusIcon = () => {
      if (isOutOfStock) return <XCircle className="w-3 h-3 text-red-500" />;
      if (isOverStock)
         return <AlertTriangle className="w-3 h-3 text-orange-500" />;
      if (isAvailable)
         return <CheckCircle className="w-3 h-3 text-green-500" />;
      return null;
   };

   const getStatusBadge = () => {
      if (isOutOfStock)
         return (
            <Badge variant="destructive" className="text-xs px-1 py-0">
               Sin Stock
            </Badge>
         );
      if (isOverStock)
         return (
            <Badge
               variant="secondary"
               className="text-xs px-1 py-0 bg-orange-100 text-orange-800"
            >
               Excede Stock
            </Badge>
         );
      return null;
   };

   return (
      <div className="flex items-center gap-2 py-1">
         <div className="flex items-center gap-1">
            <span
               className={`font-medium ${
                  isOverStock
                     ? "text-orange-600"
                     : isOutOfStock
                     ? "text-red-600"
                     : "text-gray-900"
               }`}
            >
               {quoted}
            </span>
            {getStatusIcon()}
         </div>

         {quoted > 0 && (
            <TooltipProvider>
               <Tooltip>
                  <TooltipTrigger>
                     <div className="flex items-center gap-2">
                        <div className="w-16 relative">
                           <Progress value={percentage} className="h-2" />
                           <div
                              className={`absolute top-0 left-0 h-2 rounded-full transition-all ${getProgressColor()}`}
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                           />
                        </div>
                        {/* {getStatusBadge()} */}
                     </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                     <div className="space-y-1">
                        <p className="font-medium">
                           {quoted} de {stock} disponibles
                        </p>
                        <p className="text-sm">
                           {isOutOfStock && "⚠️ Sin stock disponible"}
                           {isOverStock &&
                              `⚠️ Excede por ${quoted - stock} unidades`}
                           {isAvailable &&
                              `✅ ${percentage.toFixed(1)}% del stock`}
                        </p>
                        {isOverStock && (
                           <p className="text-xs text-orange-600">
                              Revisar disponibilidad con almacen
                           </p>
                        )}
                     </div>
                  </TooltipContent>
               </Tooltip>
            </TooltipProvider>
         )}
      </div>
   );
};

export { StockCellRenderer, QuotedPartsCellRenderer };
