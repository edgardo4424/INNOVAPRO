import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";

const ContratosLaborales = ({ formData, setFormData, errors }) => {
   const handleInputChange = (index, field, value) => {
      setFormData((prev) => ({
         ...prev,
         contratos_laborales: prev.contratos_laborales.map((contrato, i) =>
            i === index ? { ...contrato, [field]: value } : contrato
         ),
      }));
   };

   const handleAddContrato = () => {
      const nuevo = {
         id: Math.floor(Date.now() / 1000),
         fecha_inicio: "",
         fecha_fin: "",
         sueldo: "",
         regimen: "",
         tipo_contrato: "",
      };
      setFormData((prev) => ({
         ...prev,
         contratos_laborales: [...prev.contratos_laborales, nuevo],
      }));
   };

   const handleRemoveContrato = (index) => {
      setFormData((prev) => ({
         ...prev,
         contratos_laborales: prev.contratos_laborales.filter(
            (_, i) => i !== index
         ),
      }));
   };

   const canRemove = formData.contratos_laborales.length > 1;
   console.log(errors);

   return (
      <>
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-lg font-semibold">
               <CalendarIcon className="h-5 w-5 text-[#1b274a]" />
               Información Contractual
            </div>

            <Button
               type="button"
               onClick={handleAddContrato}
               className="gap-2 bg-innova-blue hover:bg-innova-blue"
            >
               <Plus className="h-4 w-4" />
               Agregar contrato
            </Button>
         </div>

         <div className="mt-4 space-y-5">
            {formData.contratos_laborales.map((c, i) => (
               <div
                  key={c.id ?? i}
                  className="rounded-lg border border-muted p-4 md:p-5"
               >
                  <div className="mb-4 flex items-center justify-between">
                     <p className="text-sm font-medium text-muted-foreground">
                        Contrato #{i + 1}
                     </p>
                     <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => handleRemoveContrato(i)}
                        disabled={!canRemove}
                        className="disabled:opacity-60"
                        title={
                           canRemove
                              ? "Eliminar contrato"
                              : "Debe existir al menos un contrato"
                        }
                     >
                        <Trash2 className="h-4 w-4" />
                     </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor={`fecha_inicio_${i}`}>
                           Fecha de Inicio *
                        </Label>
                        <Input
                           id={`fecha_inicio_${i}`}
                           type="date"
                           value={c.fecha_inicio}
                           onChange={(e) =>
                              handleInputChange(
                                 i,
                                 "fecha_inicio",
                                 e.target.value
                              )
                           }
                        />
                        {errors[`contratos_laborales[${i}].fecha_inicio`] && (
                           <p className="text-xs text-red-500">
                              {errors[`contratos_laborales[${i}].fecha_inicio`]}
                           </p>
                        )}
                     </div>

                     <div className="space-y-2">
                        <Label htmlFor={`fecha_fin_${i}`}>Fecha de Fin *</Label>
                        <Input
                           id={`fecha_fin_${i}`}
                           type="date"
                           value={c.fecha_fin}
                           onChange={(e) =>
                              handleInputChange(i, "fecha_fin", e.target.value)
                           }
                        />
                        {errors[`contratos_laborales[${i}].fecha_fin`] && (
                           <p className="text-xs text-red-500">
                              {errors[`contratos_laborales[${i}].fecha_fin`]}
                           </p>
                        )}
                     </div>

                     <div className="space-y-2">
                        <Label htmlFor={`sueldo_${i}`}>Sueldo *</Label>
                        <Input
                           id={`sueldo_${i}`}
                           type="number"
                           min="0"
                           step="0.01"
                           value={c.sueldo}
                           onChange={(e) =>
                              handleInputChange(i, "sueldo", e.target.value)
                           }
                           placeholder="0.00"
                        />
                        {errors[`contratos_laborales[${i}].sueldo`] && (
                           <p className="text-xs text-red-500">
                              {errors[`contratos_laborales[${i}].sueldo`]}
                           </p>
                        )}
                     </div>

                     <div className="space-y-2">
                        <Label htmlFor={`regimen_${i}`}>Régimen *</Label>
                        <Select
                           value={c.regimen}
                           onValueChange={(value) =>
                              handleInputChange(i, "regimen", value)
                           }
                        >
                           <SelectTrigger
                              id={`regimen_${i}`}
                              className="w-full"
                           >
                              <SelectValue placeholder="Seleccione el régimen" />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectItem value="GENERAL">General</SelectItem>
                              <SelectItem value="MYPE">Mype</SelectItem>
                           </SelectContent>
                        </Select>
                        {errors[`contratos_laborales[${i}].regimen`] && (
                           <p className="text-xs text-red-500">
                              {errors[`contratos_laborales[${i}].regimen`]}
                           </p>
                        )}
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor={`tipo_contrato_${i}`}>Tipo de contrato *</Label>
                        <Select
                           value={c.tipo_contrato}
                           onValueChange={(value) =>
                              handleInputChange(i, "tipo_contrato", value)
                           }
                        >
                           <SelectTrigger
                              id={`tipo_contrato_${i}`}
                              className="w-full"
                           >
                              <SelectValue placeholder="Seleccione el tipo de contrato" />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectItem value="PLANILLA">Planilla</SelectItem>
                              <SelectItem value="HONORARIOS">Recibo por honorarios</SelectItem>
                           </SelectContent>
                        </Select>
                        {errors[`contratos_laborales[${i}].tipo_contrato`] && (
                           <p className="text-xs text-red-500">
                              {errors[`contratos_laborales[${i}].tipo_contrato`]}
                           </p>
                        )}
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </>
   );
};

export default ContratosLaborales;
