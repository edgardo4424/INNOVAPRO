import { AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
   Select as UISelect,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import Select from "react-select";
import React, { useEffect, useState } from "react";
import { obtenerClienteSchema } from "../schema/cliente.schema";
import { Button } from "@/components/ui/button";

export default function ClienteForm({
   cliente,
   contactos,
   obras,
   setCliente,
   errores,
   handleBuscarRUC,
   rucNoEncontrado,
   handleCancel,
   handleSubmit,
}) {
 
   const handleChange = (e) => {
      const { name, value } = e.target;
      setCliente((prev) => ({ ...prev, [name]: value }));
   };

   const getError = (campo) => errores?.[campo] || "";

   return (
      <>
         <div className="max-h-96 overflow-y-auto px-2">
            <form
               id="form-cliente"
               className="space-y-2"
               autoComplete="off"
               onSubmit={handleSubmit}
            >
               {/* Tipo de cliente */}
               <div className="flex flex-col gap-1">
                  <Label className="truncate">Tipo de Cliente:</Label>
                  <UISelect
                     name="tipo"
                     value={cliente.tipo}
                     onV
                     onValueChange={(value) =>
                        setCliente((prev) => ({ ...prev, tipo: value }))
                     }
                  >
                     <SelectTrigger className="flex-1 w-full">
                        <SelectValue placeholder="Seleccione" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="Persona Jurídica">
                           Persona Jurídica
                        </SelectItem>
                        <SelectItem value="Persona Natural">
                           Persona Natural
                        </SelectItem>
                     </SelectContent>
                  </UISelect>
               </div>

               {/* Razon Social / Nombre */}
               <div className="flex flex-col gap-1">
                  <Label className="truncate">
                     {cliente.tipo === "Persona Jurídica"
                        ? "Razón Social"
                        : "Nombre Completo"}
                  </Label>

                  <Input
                     name="razon_social"
                     type="text"
                     placeholder={
                        cliente.tipo === "Persona Jurídica"
                           ? "Razón Social"
                           : "Nombre Completo"
                     }
                     value={cliente.razon_social}
                     onChange={handleChange}
                  />
                  {getError("razon_social") && (
                     <p className="error-message">{getError("razon_social")}</p>
                  )}
               </div>

               {cliente.tipo === "Persona Jurídica" ? (
                  <>
                     {/* RUC */}
                     <div className="flex flex-col gap-1">
                        <Label>Ruc del cliente</Label>
                        <Input
                           name="ruc"
                           type="text"
                           placeholder="RUC"
                           value={cliente.ruc}
                           onChange={(e) =>
                              setCliente({ ...cliente, ruc: e.target.value })
                           }
                           onBlur={handleBuscarRUC}
                        />

                        <small className="form-text-info">
                           Ingresa el RUC y sal del campo para completar los
                           datos automáticamente desde SUNAT.
                        </small>

                        {rucNoEncontrado && (
                           <p className="error-message">
                              Este RUC no se encuentra en SUNAT. Por favor
                              complétalo manualmente.
                           </p>
                        )}
                     </div>

                     {/* Representante Legal */}
                     <div className="flex flex-col gap-1">
                        <Label>Representante Legal</Label>
                        <Input
                           name="representante_legal"
                           type="text"
                           placeholder="Ingrese el representante legal"
                           value={cliente.representante_legal}
                           onChange={handleChange}
                        />
                        {getError("representante_legal") && (
                           <p className="error-message">
                              {getError("representante_legal")}
                           </p>
                        )}
                     </div>
                     {/* Tipo de documento del representante */}

                     <div className="flex flex-col gap-1">
                        <Label>Tipo de Documento</Label>
                        <UISelect
                           name="tipo_documento"
                           value={cliente.tipo_documento ?? ""}
                           onValueChange={(value) =>
                              setCliente((prev) => ({
                                 ...prev,
                                 tipo_documento: value,
                              }))
                           }
                        >
                           <SelectTrigger className="flex-1 w-full">
                              <SelectValue placeholder="Seleccione el tipo de documento" />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectItem value="DNI">DNI</SelectItem>
                              <SelectItem value="CE">CE</SelectItem>
                              <SelectItem value></SelectItem>
                           </SelectContent>
                        </UISelect>
                     </div>

                     {/* Documento del representante */}
                     <div className="flex flex-col gap-1">
                        <Label>Documento del representante</Label>
                        <Input
                           name="dni_representante"
                           type="text"
                           placeholder="Documento del Representante"
                           value={cliente.dni_representante}
                           onChange={handleChange}
                        />
                        {getError("dni_representante") && (
                           <p className="error-message">
                              {getError("dni_representante")}
                           </p>
                        )}
                     </div>

                     {/* Dirección */}
                     <div className="flex flex-col gap-1">
                        <Label>Domicilio Fiscal</Label>
                        <Input
                           name="domicilio_fiscal"
                           type="text"
                           placeholder="Domicilio Fiscal"
                           value={cliente.domicilio_fiscal}
                           onChange={handleChange}
                        />
                        {getError("domicilio_fiscal") && (
                           <p className="error-message">
                              {getError("domicilio_fiscal")}
                           </p>
                        )}
                     </div>
                  </>
               ) : (
                  <>
                     {/* Tipo de documento */}
                     <div className="flex flex-col gap-1">
                        <Label>Tipo de Documento</Label>
                        <UISelect
                           name="tipo_documento"
                           value={cliente.tipo_documento ?? ""}
                           onValueChange={(value) =>
                              setCliente((prev) => ({
                                 ...prev,
                                 tipo_documento: value,
                              }))
                           }
                        >
                           <SelectTrigger className="flex-1 w-full">
                              <SelectValue placeholder="Seleccione el tipo de documento" />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectItem value="DNI">DNI</SelectItem>
                              <SelectItem value="CE">CE</SelectItem>
                              <SelectItem value></SelectItem>
                           </SelectContent>
                        </UISelect>
                     </div>

                     {/* Documento */}
                     <div className="flex flex-col gap-1">
                        <Label>Número de documento</Label>
                        <Input
                           name="dni"
                           type="text"
                           placeholder="Número de Documento"
                           value={cliente.dni}
                           onChange={handleChange}
                        />
                        {getError("dni") && (
                           <p className="error-message">{getError("dni")}</p>
                        )}{" "}
                     </div>
                  </>
               )}

               {/* Teléfono */}
               <div className="flex flex-col gap-1">
                  <Label>Télefono del cliente</Label>
                  <Input
                     name="telefono"
                     type="text"
                     placeholder="Teléfono"
                     value={cliente.telefono}
                     onChange={handleChange}
                  />
                  {getError("telefono") && (
                     <p className="error-message">{getError("telefono")}</p>
                  )}
               </div>

               {/* Correo */}
               <div className="flex flex-col gap-1">
                  <Label>Correo del cliente</Label>
                  <Input
                     name="email"
                     type="email"
                     placeholder="Correo Electrónico"
                     value={cliente.email}
                     onChange={handleChange}
                  />
                  {getError("email") && (
                     <p className="error-message">{getError("email")}</p>
                  )}
               </div>

               {/* Contactos asociados */}
               <div className="flex  flex-col gap-1 relative">
                  <Label>Contactos</Label>
           
                  <Select
  isMulti
  options={contactos.map((c) => ({
    value: c.id,
    label: c.razon_social || c.nombre,
  }))}
  value={contactos
    .filter((c) =>
      cliente.contactos_asociados?.some((asoc) => asoc.id === c.id)
    )
    .map((c) => ({
      value: c.id,
      label: c.nombre,
    }))}
  onChange={(selected) =>
    setCliente((prev) => ({
      ...prev,
      contactos_asociados: selected.map((s) => s.value), // array de IDs
    }))
  }
  placeholder="Selecciona contactos..."
  menuPlacement="top"
/>
               </div>

               {/* Obras asociadas */}
               <div className="flex flex-col gap-1 relative">
                  <Label>Obras</Label>
                  
                  <Select
                     isMulti
                     options={obras.map((o) => ({
                        value: o.id,
                        label: o.nombre,
                     }))}
                     value={obras
    .filter((c) =>
      cliente.obras_asociadas?.some((asoc) => asoc.id === c.id)
    )
    .map((c) => ({
      value: c.id,
      label: c.nombre,
    }))}
  onChange={(selected) =>
    setCliente((prev) => ({
      ...prev,
      obras_asociadas: selected.map((s) => s.value), // array de IDs
    }))
  }
                     placeholder="Selecciona obras..."
                     menuPlacement="top"
                  />
               </div>

               {/* Botones */}
            </form>
         </div>
         <AlertDialogFooter>
            <Button variant="outline" onClick={handleCancel}>
               Cancelar
            </Button>
            <Button className="bg-sky-950" type="submit" form="form-cliente">
               Guardar
            </Button>
         </AlertDialogFooter>
      </>
   );
}
