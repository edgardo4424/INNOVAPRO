import { AlertDialogFooter } from "@/components/ui/alert-dialog";
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
import React, { useState } from "react";
import { obtenerEmpresaSchema } from "../schema/empresa.schema";

export default function EmpresaForm({
   data: empresaInicial = {},
   onSubmit,
   closeModal,
   handleCancel,
}) {
   const [empresa, setEmpresa] = useState(empresaInicial);
   const [errores, setErrores] = useState({});
   const schema = obtenerEmpresaSchema();

   const handleChange = (campo, valor) => {
      setEmpresa((prev) => ({ ...prev, [campo]: valor }));
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const datosValidados = await schema.validate(empresa, {
            abortEarly: false,
         });
         setErrores({});
         
         onSubmit(datosValidados)
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
               id="form-empresa"
               className="space-y-4"
               autoComplete="off"
               onSubmit={handleSubmit}
            >
               {/* Razón Social */}
               <article className="">
                  <Label className="text-neutral-800">Razón Social *</Label>
                  <Input
                     type="text"
                     value={empresa.razon_social || ""}
                     onChange={(e) =>
                        handleChange("razon_social", e.target.value)
                     }
                  />
                  {errores.razon_social && (
                     <p className="error-message">{errores.razon_social}</p>
                  )}
               </article>

               {/* RUC */}
               <article className="">
                  <Label className="text-neutral-800">RUC *</Label>
                  <Input
                     type="text"
                     value={empresa.ruc || ""}
                     maxLength={11}
                     onChange={(e) =>
                        handleChange(
                           "ruc",
                           e.target.value.replace(/[^0-9]/g, "")
                        )
                     }
                  />
                  {errores.ruc && (
                     <p className="error-message">{errores.ruc}</p>
                  )}
               </article>

               {/* Dirección */}
               <article className="">
                  <Label className="text-neutral-800">Dirección Fiscal *</Label>
                  <Input
                     type="text"
                     value={empresa.direccion || ""}
                     onChange={(e) => handleChange("direccion", e.target.value)}
                  />
                  {errores.direccion && (
                     <p className="error-message">{errores.direccion}</p>
                  )}
               </article>

               {/* Dirección */}
               <article className="">
                  <Label className="text-neutral-800">Dirección de Almacén *</Label>
                  <Input
                     type="text"
                     value={empresa.direccion_almacen || ""}
                     onChange={(e) => handleChange("direccion_almacen", e.target.value)}
                  />
                  {errores.direccion_almacen && (
                     <p className="error-message">{errores.direccion_almacen}</p>
                  )}
               </article>

               {/* Representante Legal */}
               <article className="">
                  <Label className="text-neutral-800">
                     Representante Legal *
                  </Label>
                  <Input
                     type="text"
                     value={empresa.representante_legal || ""}
                     onChange={(e) =>
                        handleChange("representante_legal", e.target.value)
                     }
                  />
                  {errores.representante_legal && (
                     <p className="error-message">
                        {errores.representante_legal}
                     </p>
                  )}
               </article>

               {/* Tipo Documento */}
               <article className=""></article>

               {/* DNI del Representante */}
               <article className=" flex flex-col md:flex-row gap-2 justify-between">
                  <section className="flex-1 ">
                     <Label className="text-neutral-800">
                        Tipo de Documento *
                     </Label>
                     <Select
                        value={empresa.tipo_documento ?? ""}
                        onValueChange={(value) =>
                           handleChange("tipo_documento", value)
                        }
                     >
                        <SelectTrigger className="w-full">
                           <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="DNI">DNI</SelectItem>
                           <SelectItem value="CE">CE</SelectItem>
                           <SelectItem value="Pasaporte">Pasaporte</SelectItem>
                        </SelectContent>
                     </Select>
                     {errores.tipo_documento && (
                        <p className="error-message">
                           {errores.tipo_documento}
                        </p>
                     )}
                  </section>
                  <section className="flex-1 ">
                     <Label className="text-neutral-800">
                        Número de documento *
                     </Label>
                     <Input
                        type="text"
                        value={empresa.dni_representante || ""}
                        maxLength={12}
                        onChange={(e) =>
                           handleChange("dni_representante", e.target.value)
                        }
                     />
                     {errores.dni_representante && (
                        <p className="error-message">
                           {errores.dni_representante}
                        </p>
                     )}
                  </section>
               </article>

               {/* Cargo del Representante */}
               <article className="">
                  <Label className="text-neutral-800">
                     Cargo del Representante *
                  </Label>
                  <Input
                     type="text"
                     value={empresa.cargo_representante || ""}
                     onChange={(e) =>
                        handleChange("cargo_representante", e.target.value)
                     }
                  />
                  {errores.cargo_representante && (
                     <p className="error-message">
                        {errores.cargo_representante}
                     </p>
                  )}
               </article>

               {/* Teléfono Representante */}
               <article className="flex flex-col md:flex-row justify-between gap-2">
                  <section className="flex-1">
                     <Label className="text-neutral-800">
                        Teléfono del Representante
                     </Label>
                     <Input
                        type="text"
                        maxLength={9}
                        value={empresa.telefono_representante || ""}
                        onChange={(e) =>
                           handleChange(
                              "telefono_representante",
                              e.target.value.replace(/[^0-9]/g, "")
                           )
                        }
                     />
                     {errores.telefono_representante && (
                        <p className="error-message">
                           {errores.telefono_representante}
                        </p>
                     )}
                  </section>
                  <section className="flex-1">
                     <Label className="text-neutral-800">
                        Teléfono de la Oficina
                     </Label>
                     <Input
                        type="text"
                        maxLength={9}
                        value={empresa.telefono_oficina || ""}
                        onChange={(e) =>
                           handleChange(
                              "telefono_oficina",
                              e.target.value.replace(/[^0-9]/g, "")
                           )
                        }
                     />
                     {errores.telefono_oficina && (
                        <p className="error-message">
                           {errores.telefono_oficina}
                        </p>
                     )}
                  </section>
               </article>
            </form>
         </div>

         <AlertDialogFooter>
            <Button variant="outline" onClick={handleCancel}>
               Cancelar
            </Button>
            <Button className="bg-sky-950" type="submit" form="form-empresa">
               Guardar
            </Button>
         </AlertDialogFooter>
      </>
   );
}
