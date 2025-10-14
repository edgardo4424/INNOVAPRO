import React, { useState } from "react";
import ClienteForm from "../forms/ClienteForm";
import clientesService from "../services/clientesService";
import {
   validarClienteJuridico,
   validarClienteNatural,
} from "../validaciones/validarCliente";
import { toast } from "react-toastify";
import { buscarDatosPorRUC } from "../../sunat/services/sunatService";
import { useAuth } from "../../../context/AuthContext";
import { parsearError } from "../../../utils/parsearError";
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

export default function ModalEditarCliente({
   cliente,
   contactos,
   obras,
   actualizarCliente,
}) {
   const [clienteEditado, setClienteEditado] = useState({ ...cliente });
   const [errores, setErrores] = useState({});
   const [open, setOpen] = useState(false);

   const handleSubmit = async (e) => {
      e.preventDefault();
       
      const erroresValidados =
         clienteEditado.tipo === "Persona Jurídica"
            ? validarClienteJuridico(clienteEditado)
            : validarClienteNatural(clienteEditado);

      if (Object.keys(erroresValidados).length > 0) {
         setErrores(erroresValidados);
         toast.warning("Completa los campos correctamente");
         return;
      }

      try {
         const clienteLimpio = { ...clienteEditado };
         Object.keys(clienteLimpio).forEach((key) => {
            if (clienteLimpio[key] === "") clienteLimpio[key] = null;
         });

         const res = await clientesService.actualizar(
            clienteEditado.id,
            clienteLimpio
         );
         if (res.data && res.data.cliente) {
            actualizarCliente(res.data.cliente);
            toast.success("Cliente actualizado correctamente");
            // onClose();
            setOpen(false);
         } else {
            toast.error("Error al actualizar el cliente");
         }
      } catch (error) {
         console.error("❌ Error al actualizar cliente:", error);
         toast.error(parsearError(error));
      }
   };

   const handleCancel = (e) => {
      e.preventDefault();
      setOpen(false);
      // onClose();
   };

   return (
      <AlertDialog open={open} onOpenChange={setOpen}>
         <AlertDialogTrigger asChild>
            <Button
               variant={"outline"}
               size={"icon"}
               className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
            >
               <Edit className="h-4 w-4" />
            </Button>
         </AlertDialogTrigger>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>Editar Cliente</AlertDialogTitle>
               <AlertDialogDescription className="text-center">
                  Complete correctamente los datos para editar el cliente
               </AlertDialogDescription>
            </AlertDialogHeader>
            <ClienteForm
               cliente={clienteEditado}
               setCliente={setClienteEditado}
               errores={errores}
               contactos={contactos}
               obras={obras}
               setErrores={setErrores}
               handleCancel={handleCancel}
               handleSubmit={handleSubmit}
            />
         </AlertDialogContent>
      </AlertDialog>
   );
}
