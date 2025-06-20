import { useState } from "react";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { obtenerUsuarioSchema } from "../schema/user.schema";
import { AlertDialogFooter } from "@/components/ui/alert-dialog";

export default function UsuarioForm({
   modo = "crear",
   usuario: usuarioInicial = {},
   onSubmit,
   closeModal,
   handleCancel,
}) {
   const esCrear = modo === "crear";

   const [usuario, setUsuarioInterno] = useState(usuarioInicial);
   const [errores, setErrores] = useState({});

   const schema = obtenerUsuarioSchema(esCrear);

   const handleChange = (campo, valor) => {
      setUsuarioInterno((prev) => ({ ...prev, [campo]: valor }));
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const datosValidados = await schema.validate(usuario, {
            abortEarly: false,
         });
         setErrores({});
         console.log('usuario',usuario);
         
         onSubmit(datosValidados);
          closeModal(); 
      } catch (err) {
         const nuevosErrores = {};
         err.inner.forEach((e) => {
            nuevosErrores[e.path] = e.message;
         });
         setErrores(nuevosErrores);
      }
   };

   return (
      <>
         <div className="max-h-96 overflow-y-auto px-2">
            <form
               id="form-usuario"
               className="gestion-form-global"
               autoComplete="off"
               onSubmit={handleSubmit}
            >
               <div className="form-group">
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input
                     id="nombre"
                     type="text"
                     value={usuario.nombre ?? ""}
                     onChange={(e) => handleChange("nombre", e.target.value)}
                  />
                  {errores.nombre && (
                     <p className="error-message">{errores.nombre}</p>
                  )}
               </div>

               <div className="form-group">
                  <Label htmlFor="telefono">Teléfono Celular *</Label>
                  <Input
                     id="telefono"
                     type="text"
                     value={usuario.telefono ?? ""}
                     onChange={(e) => handleChange("telefono", e.target.value)}
                  />
                  {errores.telefono && (
                     <p className="error-message">{errores.telefono}</p>
                  )}
               </div>

               <div className="form-group">
                  <Label htmlFor="email">Correo *</Label>
                  <Input
                     id="email"
                     type="email"
                     value={usuario.email ?? ""}
                     onChange={(e) => handleChange("email", e.target.value)}
                  />
                  {errores.email && (
                     <p className="error-message">{errores.email}</p>
                  )}
               </div>

               {esCrear && (
                  <div className="form-group">
                     <Label htmlFor="password">Contraseña *</Label>
                     <Input
                        id="password"
                        type="password"
                        value={usuario.password ?? ""}
                        onChange={(e) =>
                           handleChange("password", e.target.value)
                        }
                        autoComplete="new-password"
                     />
                     {errores.password && (
                        <p className="error-message">{errores.password}</p>
                     )}
                  </div>
               )}

               <div className="form-group">
                  <Label>Rol *</Label>
                  <Select
                     value={usuario.rol ?? ""}
                     onValueChange={(value) => handleChange("rol", value)}
                  >
                     <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione un rol" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="Clientes">Clientes</SelectItem>
                        <SelectItem value="Gerencia">Gerencia</SelectItem>
                        <SelectItem value="Ventas">Ventas</SelectItem>
                        <SelectItem value="Oficina Técnica">
                           Oficina Técnica
                        </SelectItem>
                        <SelectItem value="Almacén">Almacén</SelectItem>
                        <SelectItem value="Administración">
                           Administración
                        </SelectItem>
                     </SelectContent>
                  </Select>
                  {errores.rol && (
                     <p className="error-message">{errores.rol}</p>
                  )}
               </div>
            </form>
         </div>
         <AlertDialogFooter>
            <Button variant="outline" onClick={handleCancel}>
               Cancelar
            </Button>
            <Button className="bg-sky-950" type="submit" form="form-usuario">
               {esCrear ? "Crear Usuario" : "Actualizar Usuario"}
            </Button>
         </AlertDialogFooter>
      </>
   );
}
