"use client";

import { useGridFilter } from "ag-grid-react";
import { useCallback } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
   AlertTriangle,
   TrendingDown,
   TrendingUp,
   CheckCircle,
} from "lucide-react";

const getStockLevel = (stock) => {
   const value = Number(stock) || 0;
   let level;
   if (value <= 0) level = "out";
   else if (value <= 100) level = "low";
   else if (value <= 200) level = "medium";
   else level = "high";
   
   return level;
};

export default function StockLevelFilter({ model, onModelChange, getValue }) {
   

   const levels = [
      {
         value: "out",
         label: "Sin stock",
         icon: AlertTriangle,
         color: "bg-red-100 text-red-800 border-red-200",
         iconColor: "text-red-600",
      },
      {
         value: "low",
         label: "Bajo",
         icon: TrendingDown,
         color: "bg-orange-100 text-orange-800 border-orange-200",
         iconColor: "text-orange-600",
      },
      {
         value: "medium",
         label: "Moderado",
         icon: TrendingUp,
         color: "bg-yellow-100 text-yellow-800 border-yellow-200",
         iconColor: "text-yellow-600",
      },
      {
         value: "high",
         label: "Alto",
         icon: CheckCircle,
         color: "bg-green-100 text-green-800 border-green-200",
         iconColor: "text-green-600",
      },
   ];

   const handleChange = useCallback(
      (checked, value) => {
         

         let newModel;
         if (checked) {
            newModel = model ? [...model, value] : [value];
         } else {
            newModel = model ? model.filter((item) => item !== value) : [];
         }

         
         onModelChange(newModel.length > 0 ? newModel : null);
      },
      [model, onModelChange]
   );

   const doesFilterPass = useCallback(
      ({ data, node }) => {
         const stock = getValue(node);
         const level = getStockLevel(stock);
         
         // Si model es null/undefined, pasan todos
         const result = !model || model.includes(level);
         
         return result;
      },
      [model, getValue]
   );

   useGridFilter({ doesFilterPass });

   const selectedCount = model ? model.length : 0;

   return (
      <div className="p-4 min-w-[200px] bg-white border border-gray-200 rounded-lg shadow-sm">
         <div className="flex items-center gap-2 mb-3">
            <h3 className="text-sm font-semibold text-gray-900 !mt-0">
               Nivel de Stock
            </h3>
            {selectedCount > 0 && (
               <Badge className="   h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white">
                  {selectedCount}
               </Badge>
            )}
         </div>

         <div className="space-y-3">
            {levels.map((level) => {
               const Icon = level.icon;
               const isChecked = model ? model.includes(level.value) : false;

               return (
                  <div
                     key={level.value}
                     className="flex items-center space-x-3"
                  >
                     <Checkbox
                        id={`stock-${level.value}`}
                        checked={isChecked}
                        onCheckedChange={(checked) =>
                           handleChange(checked, level.value)
                        }
                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                     />
                     <Label
                        htmlFor={`stock-${level.value}`}
                        className="flex items-center space-x-2 cursor-pointer flex-1"
                     >
                        <Icon className={`w-4 h-4 ${level.iconColor}`} />
                        <span className="text-sm font-medium text-gray-700">
                           {level.label}
                        </span>
                     </Label>
                  </div>
               );
            })}
         </div>

         {selectedCount === 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
               <p className="text-xs text-gray-500 text-center">
                  Todos los niveles incluidos
               </p>
            </div>
         )}
      </div>
   );
}
