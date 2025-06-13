import { AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import Select from "react-select";

export default function ContactoForm({
   data: contactoInicial = {},
   clientes,
   obras,
   onSubmit,
   handleCancel,
   closeModal,
}) {
   const [contacto, setContacto] = useState(contactoInicial);
   const [errores, setErrores] = useState({});

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

   const handleSubmit = () => {
      //  onSubmit()
   };

   return (
      <div className="max-h-96 overflow-y-auto p-2">
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
            </div>

            {/* Teléfono */}
            <div className="flex flex-col gap-1">
               <Label>Contácto</Label>
               <Input
                  type="text"
                  name="telefono"
                  placeholder="Teléfono"
                  value={contacto.telefono}
                  onChange={(e) => handleTelefonoChange(e.target.value)}
               />
            </div>

            {/* Cargo */}
            <Input
               type="text"
               name="cargo"
               placeholder="Cargo"
               value={contacto.cargo}
               onChange={(e) => handleSoloTexto(e.target.value, "cargo")}
            />

            {/* Clientes asociados */}
            <div className="form-group">
               <label>Clientes</label>
               <Select
                  isMulti
                  options={clientes.map((c) => ({
                     value: c.id,
                     label: c.razon_social || c.nombre,
                  }))}
                  value={clientes
                     .filter((c) => contacto.clientes_asociados?.includes(c.id))
                     .map((c) => ({
                        value: c.id,
                        label: c.razon_social || c.nombre,
                     }))}
                  onChange={(selected) =>
                     setContacto((prev) => ({
                        ...prev,
                        clientes_asociados: selected.map((s) => s.value),
                     }))
                  }
                  placeholder="Selecciona clientes..."
               />
            </div>

            {/* Obras asociadas */}
            <div className="form-group">
               <label>Obras</label>
               <Select
                  isMulti
                  options={obras.map((o) => ({
                     value: o.id,
                     label: o.nombre,
                  }))}
                  value={obras
                     .filter((o) => contacto.obras_asociadas?.includes(o.id))
                     .map((o) => ({ value: o.id, label: o.nombre }))}
                  onChange={(selected) =>
                     setContacto((prev) => ({
                        ...prev,
                        obras_asociadas: selected.map((s) => s.value),
                     }))
                  }
                  placeholder="Selecciona obras..."
               />
            </div>

            {/* Botones */}
         </form>
         <AlertDialogFooter>
            <Button variant={"outline"} onClick={handleCancel}>
               Cancelar
            </Button>
            <Button className="bg-sky-950" type="submit" form="form-contacto">
               Enviar
            </Button>
         </AlertDialogFooter>
      </div>
   );
}
