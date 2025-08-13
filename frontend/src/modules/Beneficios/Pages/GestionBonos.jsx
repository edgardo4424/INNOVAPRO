import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const GestionBonos = () => {
   return (
      <div className="min-h-screen bg-gray-50 p-6">
         <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
               <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                     Gestión de Bonos al trabajador
                  </h1>
                  <p className="text-gray-600 mt-1">
                     Administra los bonos de tus trabajadores
                  </p>
               </div>
               <Button>
                  Nuevo bono <PlusCircle />
               </Button>
            </div>
         </div>
      </div>
   );
};
export default GestionBonos;
