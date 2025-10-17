import React, { useState } from "react";
import ClienteForm from "../forms/ClienteForm";
import clientesService from "../services/clientesService";
import {
   validarClienteJuridico,
   validarClienteNatural,
} from "../validaciones/validarCliente";
import { toast } from "react-toastify";
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
import { BadgePlus } from "lucide-react";

const initialForm = {
   tipo: "Persona Jurídica",
   tipo_documento: "DNI",
   razon_social: "",
   ruc: "",
   dni: "",
   telefono: "",
   email: "",
   domicilio_fiscal: "",
   representante_legal: "",
   dni_representante: "",
   cargo_representante: "",
   domicilio_representante: "",
};
export default function ModalAgregarCliente({ agregarCliente, obras, contactos }) {
   const { user } = useAuth();

   const [cliente, setCliente] = useState(initialForm);

   const [errores, setErrores] = useState({});

   const [open, setOpen] = useState(false);


   const handleSubmit = async (e) => {
      e.preventDefault();

      const clienteSeguro = { ...cliente };
      if (!clienteSeguro.tipo_documento) {
         clienteSeguro.tipo_documento = "DNI";
      }
      const erroresValidados =
         cliente.tipo === "Persona Jurídica"
            ? validarClienteJuridico(cliente)
            : validarClienteNatural(cliente);

      if (Object.keys(erroresValidados).length > 0) {
         setErrores(erroresValidados);
         toast.warning("Completa los campos correctamente");
         return;
      }

      try {
         const clienteLimpio = { ...cliente };
         Object.keys(clienteLimpio).forEach((key) => {
            if (clienteLimpio[key] === "") clienteLimpio[key] = null;
         });

         if (user && user.id) {
            clienteLimpio.creado_por = user.id;
         } else {
            console.error("Usuario no encontrado en AuthContext");
            toast.error(
               "Error de autenticación. Cierra sesión e ingresa de nuevo."
            );
            return;
         }
         const res = await clientesService.crear(clienteLimpio);
         if (res.data && res.data.cliente) {
            agregarCliente(res.data.cliente);
            toast.success("Cliente agregado correctamente");
            setOpen(false);
         } else {
            toast.error("Error al guardar el cliente");
         }
      } catch (error) {
         console.error("❌ Error al agregar cliente:", error);
         toast.error(parsearError(error));
      }
   };

   const handleCancel = (e) => {
      e.preventDefault();
      setOpen(false);
      setCliente(initialForm);
   };
   return (
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
                  Complete correctamente los datos para crear el cliente
               </AlertDialogDescription>
            </AlertDialogHeader>
            <ClienteForm
               cliente={cliente}
               contactos={contactos}
               obras={obras}
               setCliente={setCliente}
               errores={errores}
               handleCancel={handleCancel}
               handleSubmit={handleSubmit}
            />
         </AlertDialogContent>
      </AlertDialog>
   );
}
