import {
   AlertDialog,
   AlertDialogTrigger,
   AlertDialogContent,
   AlertDialogHeader,
   AlertDialogFooter,
   AlertDialogTitle,
   AlertDialogDescription,
   AlertDialogCancel,
   AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import planillaMensualService from "../../services/planillaMensualService";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function ModalImportesTrabajador({
   importes = [],
   setImportes,
   filiales=[],
   filial_id,
}) {
   const [isOpen, setIsOpen] = useState(false);
   const [validacionImportes,setValidacionImportes]=useState(false)
   const handleInputChange = (index, field, value) => {
      setImportes((prev) =>
         prev.map((importe, i) =>
            i === index ? { ...importe, [field]: value } : importe
         )
      );
   };
   
   

   const fetchDataMantenimiento = async (id) => {
      try {
         const res = await planillaMensualService.obtenerDatosMantenimiento(id);
         for (const i of res.data) {
            if(i.valor<=0){
               setValidacionImportes(true)
            }
            else{
               setValidacionImportes(false)
            }
         }
         setImportes(res.data);
      } catch (error) {
         toast.error("Error al obtemer los importes del trabjador");
         console.log("El error fue ", error);
      }
   };
   useEffect(() => {
      if (filial_id) {
         fetchDataMantenimiento(filial_id);
      }
   }, [filial_id]);

   const handleSave =async (e) => {
      e.preventDefault();
      try {
         for (const imp of importes) {
            if(imp.valor<=0){
               throw new Error("Los valores ingresados son invalidos")
            }
         }
         for (const imp of importes) {
             await planillaMensualService.editDataMantenimiento(
               imp.id,
               imp
            );            
         }
        toast.success("Datos actualizados correctamente.")         
      } catch (error) {
        console.log(error);
        if (error.message) {
            toast.error(error.message);
            return;
        }
        toast.error("Error al actualizar los importes.")
      }
      finally{
         await fetchDataMantenimiento(filial_id)
        setIsOpen(false)
      }
   };

   

   return (
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger asChild>
             <Tooltip open={validacionImportes}>
               <TooltipTrigger asChild>
                 <Button variant="outline" onClick={()=>setIsOpen(true)}>Importes del Empleador</Button>
               </TooltipTrigger>
               <TooltipContent className=" text-white custom-tooltip-red bg-red-500"   >
                 Agregue los importes del Empleador
                 
               </TooltipContent>
             </Tooltip>
         </AlertDialogTrigger>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>Importes del empleador</AlertDialogTitle>
               <AlertDialogDescription>
                  Ingresa los importes correspondientes:
               </AlertDialogDescription>
            </AlertDialogHeader>

            <article className="grid grid-cols-2 gap-4">
               {importes?.length > 0 &&
                  importes.map((importe, i) => (
                     <div key={i}>
                        <Label htmlFor="seguroVida">{importe.nombre}</Label>
                        <Input
                           value={importe.valor}
                           onChange={(e) =>
                              handleInputChange(i, "valor", e.target.value)
                           }
                           placeholder="Ingrese el monto"
                        />
                     </div>
                  ))}
            </article>

            <AlertDialogFooter>
               <AlertDialogCancel onClick={() => setIsOpen(false)}>
                  Cancelar
               </AlertDialogCancel>
               <AlertDialogAction onClick={handleSave}>
                  Confirmar
               </AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   );
}
