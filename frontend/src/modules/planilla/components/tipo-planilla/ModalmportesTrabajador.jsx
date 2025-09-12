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

export default function ModalImportesTrabajador({
   importes = [],
   setImportes,
   filiales,
   filial_id,
}) {
   const [isOpen, setIsOpen] = useState(false);
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
         let data_m_update = [];
         for (const imp of importes) {
            const res = await planillaMensualService.editDataMantenimiento(
               imp.id,
               imp
            );
            data_m_update.push(res.data.data_mantenimiento)
         }
        setImportes(data_m_update);
        toast.success("Datos actualizados correctamente.")         
      } catch (error) {
        console.log(error);
        
        toast.error("Error al actualizar los importes.")
      }
      finally{
        setIsOpen(false)
      }
   };

   return (
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
         <AlertDialogTrigger asChild>
            <Button>Agregar Importes</Button>
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
                     <div>
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
