import { AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { obtenerContactoSchema } from "../schema/contacto.schema";
import { toast } from "react-toastify";

export default function ContactoForm({
   data: contactoInicial = {},
   onSubmit,
   handleCancel,
   closeModal,
}) {
   const [contacto, setContacto] = useState(contactoInicial);
   const [errores, setErrores] = useState({});
   const schema = obtenerContactoSchema();
   const handleChange = (e) => {
      const { name, value } = e.target;
      setContacto((prev) => ({ ...prev, [name]: value }));
   };

   const handleTelefonoChange = (value) => {
      const limpio = value.replace(/[^0-9]/g, "").slice(0, 9);
      setContacto((prev) => ({ ...prev, telefono: limpio }));
   };

   const handleSoloTexto = (value, campo) => {
      const limpio = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ. ]/g, "");
      setContacto((prev) => ({ ...prev, [campo]: limpio }));
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const datosValidados = await schema.validate(contacto, {
            abortEarly: false,
         });
         setErrores({});

         onSubmit(datosValidados);
         closeModal();
      } catch (err) {
         const nuevosErrores = {};
         err.inner.forEach((e) => {
            nuevosErrores[e.path] = e.message;
         });

         setErrores(nuevosErrores);
         toast.error("Faltan campos obligatorios");
      }
   };

   return (
      <>
         <div className="max-h-96 overflow-y-auto p-2 ">
            <form
               id="form-contacto"
               onSubmit={handleSubmit}
               className="gestion-form-global"
               autoComplete="off"
            >
               {/* Nombre */}
               <div className="flex flex-col gap-1">
                  <Label>Nombre del contacto</Label>
                  <Input
                     type="text"
                     name="nombre"
                     placeholder="Nombre"
                     value={contacto.nombre}
                     onChange={(e) => handleSoloTexto(e.target.value, "nombre")}
                  />
                  {errores.nombre && (
                     <p className="error-message">{errores.nombre}</p>
                  )}
               </div>

               {/* Correo */}
               <div className="flex flex-col ap-1">
                  <Label>Correo Electrónico</Label>
                  <Input
                     type="email"
                     name="email"
                     placeholder="Correo"
                     value={contacto.email}
                     onChange={handleChange}
                  />
                  {errores.email && (
                     <p className="error-message">{errores.email}</p>
                  )}
               </div>

               {/* Teléfono */}
               <div className="flex flex-col gap-1">
                  <Label>Teléfono</Label>
                  <Input
                     type="text"
                     name="telefono"
                     placeholder="Teléfono"
                     value={contacto.telefono}
                     onChange={(e) => handleTelefonoChange(e.target.value)}
                  />
                  {errores.telefono && (
                     <p className="error-message">{errores.telefono}</p>
                  )}
               </div>

               {/* Cargo */}
               <div className="flex flex-col gap-1">
                  <Label>Cargo</Label>
                  <Input
                     type="text"
                     name="cargo"
                     placeholder="Cargo"
                     value={contacto.cargo}
                     onChange={(e) => handleSoloTexto(e.target.value, "cargo")}
                  />
                  {errores.cargo && (
                     <p className="error-message">{errores.cargo}</p>
                  )}
               </div>

               {/* Botones */}
            </form>
         </div>
         <AlertDialogFooter>
            <Button variant={"outline"} onClick={handleCancel}>
               Cancelar
            </Button>
            <Button className="bg-sky-950" type="submit" form="form-contacto">
               Enviar
            </Button>
         </AlertDialogFooter>
      </>
   );
}
