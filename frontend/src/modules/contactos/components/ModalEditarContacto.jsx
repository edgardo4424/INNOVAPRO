import { useEffect, useState } from "react";
import ContactoForm from "../forms/ContactoForm";
import {
   AlertDialog,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

export default function ModalEditarContacto({
   contacto,
   clientes,
   obras,
   onSubmit,
}) {
   const [open, setOpen] = useState(false);

   const handleCancel = (e) => {
      e.preventDefault();
      setOpen(false);
   };

   const closeModal = () => {
      setOpen(false);
   };
   //  useEffect(() => {
   //     console.log(contacto,obras,clientes);
   //  }, [contacto,open]);
   return (
      <AlertDialog open={open} onOpenChange={setOpen}>
         <AlertDialogTrigger asChild>
            <Button
               variant={"outline"}
               size={"icon"}
               className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
            >
               <Edit className="w-4 h-4" />
            </Button>
         </AlertDialogTrigger>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>Crear contacto</AlertDialogTitle>
               <AlertDialogDescription>
                  Completa los datos correctamente para crear un contacto
               </AlertDialogDescription>
            </AlertDialogHeader>
            <ContactoForm
               clientes={clientes}
               closeModal={closeModal}
               obras={obras}
               handleCancel={handleCancel}
               onSubmit={onSubmit}
               data={{
                  ...contacto,
                  clientes_asociados:
                     contacto?.clientes_asociados?.map((c) =>
                        typeof c === "object" ? c.id : c
                     ) ?? [],
                  obras_asociadas:
                     contacto?.obras_asociadas?.map((o) =>
                        typeof o === "object" ? o.id : o
                     ) ?? [],
               }}
            />
         </AlertDialogContent>
      </AlertDialog>
   );
}
