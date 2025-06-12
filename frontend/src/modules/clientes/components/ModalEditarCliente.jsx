import React, { useState } from "react";
import ClienteForm from "../forms/ClienteForm";
import clientesService from "../services/clientesService";
import {
   validarClienteJuridico,
   validarClienteNatural,
} from "../validaciones/validarCliente";
import { toast } from "react-toastify";
import { parsearError } from "../../../utils/parsearError";

import {
   AlertDialog,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { BadgePlus } from "lucide-react";

export default function ModalEditarCliente({
   cliente,
   onClose,
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
            onClose();
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
      onClose();
   };

   return (
      // <div className="centro-modal">
      //   <div className="modal-content">
      //     <h3>Editar Cliente</h3>
      //     <ClienteForm
      //       cliente={clienteEditado}
      //       setCliente={setClienteEditado}
      //       errores={errores}
      //       setErrores={setErrores}
      //       onCancel={onClose}
      //       onSubmit={handleSubmit}
      //     />
      //   </div>
      // </div>
      <AlertDialog open={open} onOpenChange={setOpen}>
         <AlertDialogTrigger asChild>
            <Button className="btn-agregar">
               <BadgePlus />
               <span className="hidden md:block">Agregar Cliente</span>
            </Button>
         </AlertDialogTrigger>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>Crear Cliente</AlertDialogTitle>
               <AlertDialogDescription className="text-center">
                  Complete correctamente los datos para crar el cliente
               </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="max-h-96 overflow-y-auto px-2">
               <ClienteForm
                  cliente={clienteEditado}
                  setCliente={setClienteEditado}
                  errores={errores}
                  setErrores={setErrores}
               />
            </div>
            <AlertDialogFooter>
               <Button variant="outline" onClick={handleCancel}>
                  Cancelar
               </Button>
               <Button className="bg-sky-950" onClick={handleSubmit}>
                  Guardar
               </Button>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   );
}
