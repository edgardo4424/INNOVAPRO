import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";

const ContratosLaborales = ({formData, setFormData}) => {
   const handleInputChange = (index, field, value) => {
      setFormData((prev) => ({
         ...prev,
         contratos_laborales: prev.contratos_laborales.map((contrato, i) =>
            i === index ? { ...contrato, [field]: value } : contrato
         ),
      }));
   };

   return (
      <>
         <div className="flex items-center gap-2 text-lg font-semibold">
            <CalendarIcon className="h-5 w-5  text-[#1b274a]" />
            Información Contractual
         </div>
         {formData.contratos_laborales.map((c, i) => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" key={i}>
               <div className="space-y-2">
                  <Label htmlFor="fecha_inicio">Fecha de Inicio *</Label>
                  <Input
                     id="fecha_inicio"
                     type="date"
                     value={c.fecha_inicio}
                     onChange={(e) =>
                        handleInputChange(i, "fecha_inicio", e.target.value)
                     }
                  />
               </div>
               <div className="space-y-2">
                  <Label htmlFor="fecha_fin">Fecha de Fin *</Label>
                  <Input
                     id="fecha_fin"
                     type="date"
                     value={formData.fecha_fin}
                     onChange={(e) =>
                        handleInputChange(i, "fecha_fin", e.target.value)
                     }
                  />
               </div>
               <div className="space-y-2">
                  <Label htmlFor="sueldo">Sueldo *</Label>
                  <Input
                     id="sueldo"
                     type="number"
                     min="0"
                     step="0.1"
                     value={formData.sueldo}
                     onChange={(e) =>
                        handleInputChange(i, "sueldo", e.target.value)
                     }
                     placeholder="0.00"
                  />
               </div>
               <div className="space-y-2">
                  <Label htmlFor="regimen">Regimen *</Label>
                  <Select
                     value={formData.regimen}
                     onValueChange={(value) =>
                        handleInputChange(i, "regimen", value)
                     }
                  >
                     <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione el regimen" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="GENERAL">General</SelectItem>
                        <SelectItem value="MYPE">Mype</SelectItem>
                     </SelectContent>
                  </Select>
               </div>
            </div>
         ))}
      </>
   );
};
export default ContratosLaborales;
