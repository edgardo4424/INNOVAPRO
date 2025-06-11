import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function UsuarioForm({
   modo = "crear",
   usuario,
   setUsuario,
   onSubmit,
   onCancel,
   errores = {},
}) {
   const esCrear = modo === "crear";

   return (
      <form
         onSubmit={onSubmit}
         className="gestion-form-global"
         autoComplete="off"
      >
         <div className="form-group">
            <Label>Nombre *</Label>
            <Input
               type="text"
               value={usuario.nombre}
               onChange={(e) =>
                  setUsuario((prev) => ({ ...prev, nombre: e.target.value }))
               }
               required
            />
            {errores.nombre && (
               <p className="error-message">{errores.nombre}</p>
            )}
         </div>

         <div className="form-group">
            <Label>Teléfono Celular *</Label>
            <Input
               type="text"
               value={usuario.telefono}
               onChange={(e) =>
                  setUsuario((prev) => ({ ...prev, telefono: e.target.value }))
               }
               required
            />
            {errores.telefono && (
               <p className="error-message">{errores.telefono}</p>
            )}
         </div>

         <div className="form-group">
            <Label>Correo *</Label>
            <Input
               type="email"
               value={usuario.email}
               onChange={(e) =>
                  setUsuario((prev) => ({ ...prev, email: e.target.value }))
               }
               required
               autoComplete="off"
            />
            {errores.email && <p className="error-message">{errores.email}</p>}
         </div>

         {esCrear && (
            <div className="form-group">
               <Label>Contraseña *</Label>
               <Input
                  type="password"
                  value={usuario.password}
                  onChange={(e) =>
                     setUsuario((prev) => ({
                        ...prev,
                        password: e.target.value,
                     }))
                  }
                  required
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
               value={usuario.rol}
               onValueChange={(value) =>
                  setUsuario((prev) => ({ ...prev, rol: value }))
               }
               required
            >
               <SelectTrigger>
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
                  <SelectItem value="Administración">Administración</SelectItem>
               </SelectContent>
            </Select>

            {errores.rol && <p className="error-message">{errores.rol}</p>}
         </div>

         <div className="w-full flex justify-between">
            <Button variant={"outline"} className="" type="button" onClick={onCancel}>
               Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
         </div>
      </form>
   );
}
