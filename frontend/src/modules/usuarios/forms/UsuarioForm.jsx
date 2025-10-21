import { useEffect, useState } from "react";
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
  trabajadores = [],
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
          {usuario?.nombre&&
          <span>
            <h2 className="text-xl text-neutral-700">{usuario.nombre}</h2>
          </span>
          }
          {esCrear && (
            <div className="form-group">
              <Label>Seleccione un trabajador</Label>
              <Select
                value={usuario.trabajador_id ?? ""}
                onValueChange={(value) => handleChange("trabajador_id", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione un trabajador" />
                </SelectTrigger>
                <SelectContent>
                  {trabajadores &&
                    trabajadores.map((t, i) => (
                      <SelectItem value={t.id.toString()} key={i}>
                        {t.nombres} {" "} {t.apellidos}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {errores.trabajador_id && (
                <p className="error-message">{errores.rol}</p>
              )}
            </div>
          )}
          <div className="form-group">
            <Label htmlFor="email">Correo *</Label>
            <Input
              id="email"
              type="email"
              value={usuario.email ?? ""}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            {errores.email && <p className="error-message">{errores.email}</p>}
          </div>

          {esCrear && (
            <div className="form-group">
              <Label htmlFor="password">Contraseña *</Label>
              <Input
                id="password"
                type="password"
                value={usuario.password ?? ""}
                onChange={(e) => handleChange("password", e.target.value)}
                autoComplete="new-password"
              />
              {errores.password && (
                <p className="error-message">{errores.password}</p>
              )}
            </div>
          )}
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
