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
import factilizaService from "@/modules/facturacion/service/FactilizaService";
import { Search } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

export default function ClienteForm({
  cliente,
  setCliente,
  errores,
  rucNoEncontrado,
  handleCancel,
  handleSubmit,
}) {
  const [loadingBoton, setLoadingBoton] = useState(false);
  const [loadingBotonRuc, setLoadingBotonRuc] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente((prev) => ({ ...prev, [name]: value }));
  };

  const getError = (campo) => errores?.[campo] || "";

  const handleBuscar = async (value, tipo) => {
    if (!value || isNaN(Number(value))) {
      toast.error("Debes ingresar un número de documento válido.");
      return;
    }

    try {
      let codigo_doc;
      if (tipo === "DNI") {
        codigo_doc = "1";
        setLoadingBoton(true);
      } else if (tipo === "RUC") {
        codigo_doc = "6";
        setLoadingBotonRuc(true);
      } else {
        codigo_doc = "4";
        setLoadingBoton(true);
      }
      const promise = factilizaService.metodoOpcional(codigo_doc, value);

      toast.promise(promise, {
        pending: "Buscando información del cliente...",
        success: "Información encontrada ✅",
      });

      const { data, status, success } = await promise;

      if (status === 200 && success) {
        // aquí mapeas los datos que devuelve tu API
        let razonSocial;
        let direccion;
        if (tipo === "RUC") {
          razonSocial = data?.nombre_o_razon_social || "";
          direccion = data?.direccion || data?.direccion_completa;
        } else if (tipo === "DNI") {
          razonSocial = `${data?.nombres || ""} ${data?.apellido_paterno || ""} ${data?.apellido_materno || ""}`;
        } else {
          razonSocial = `${data?.nombres || ""} ${data?.apellido_paterno || ""} ${data?.apellido_materno || ""}`;
        }

        setCliente((prev) => ({
          ...prev,
          ...(tipo === "RUC"
            ? {
                ruc: value,
                razon_social: razonSocial,
                domicilio_fiscal: direccion,
              }
            : {
                representante_legal: razonSocial,
              }),
        }));
      } else {
        toast.error("No se encontró información del cliente.");
      }
    } catch (error) {
      toast.error("Hubo un error al buscar la información.");
    } finally {
      setLoadingBoton(false);
      setLoadingBotonRuc(false);
    }
  };

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
            <Select
              name="tipo"
              value={cliente.tipo}
              onV
              onValueChange={(value) =>
                setCliente((prev) => ({ ...prev, tipo: value }))
              }
            >
              <SelectTrigger className="w-full flex-1">
                <SelectValue placeholder="Seleccione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Persona Jurídica">
                  Persona Jurídica
                </SelectItem>
                <SelectItem value="Persona Natural">Persona Natural</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {cliente.tipo === "Persona Jurídica" ? (
            <>
              {/* RUC */}
              <div className="flex flex-col gap-1">
                <Label>Ruc del cliente</Label>
                <div className="flex gap-x-4">
                  <Input
                    name="ruc"
                    type="text"
                    placeholder="RUC"
                    value={cliente.ruc}
                    onChange={(e) =>
                      setCliente({ ...cliente, ruc: e.target.value })
                    }
                    inputMode="numeric"
                    maxLength={11}
                    pattern="[0-9]{1,11}"
                  />
                  <button
                    type="button"
                    onClick={(e) => handleBuscar(cliente.ruc, "RUC")}
                    disabled={loadingBotonRuc}
                    className="bg-innova-blue hover:bg-innova-blue rounded-md p-2 text-white transition-colors duration-200 hover:scale-105" // Estilos de botón mejorados
                  >
                    <Search className="h-5 w-5" />
                  </button>
                </div>

                <small className="form-text-info">
                  Ingresa el RUC y sal del campo para completar los datos
                  automáticamente desde SUNAT.
                </small>

                {rucNoEncontrado && (
                  <p className="error-message">
                    Este RUC no se encuentra en SUNAT. Por favor complétalo
                    manualmente.
                  </p>
                )}
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

              {/* Tipo de documento del representante */}

              <div className="flex flex-col gap-1">
                <Label>Tipo de Documento</Label>
                <Select
                  name="tipo_documento"
                  value={cliente.tipo_documento ?? ""}
                  onValueChange={(value) =>
                    setCliente((prev) => ({
                      ...prev,
                      tipo_documento: value,
                    }))
                  }
                >
                  <SelectTrigger className="w-full flex-1">
                    <SelectValue placeholder="Seleccione el tipo de documento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DNI">DNI</SelectItem>
                    <SelectItem value="CE">CE</SelectItem>
                    <SelectItem value></SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Documento del representante */}
              <div className="flex flex-col gap-1">
                <Label>Documento del representante</Label>
                {/* //? consultar representante legan */}
                <div className="flex gap-x-4">
                  <Input
                    name="dni_representante"
                    type="text"
                    placeholder="Documento del Representante"
                    value={cliente.dni_representante}
                    onChange={(e) => setCliente((prev) => ({ ...prev, dni_representante: e.target.value.trim() }))}
                  />
                  <button
                    type="button"
                    disabled={loadingBoton}
                    onClick={(e) =>
                      handleBuscar(
                        cliente.dni_representante,
                        cliente.tipo_documento,
                      )
                    }
                    className="bg-innova-blue hover:bg-innova-blue rounded-md p-2 text-white transition-colors duration-200 hover:scale-105" // Estilos de botón mejorados
                  >
                    <Search className="h-5 w-5" />
                  </button>
                </div>
                {getError("dni_representante") && (
                  <p className="error-message">
                    {getError("dni_representante")}
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
                <Select
                  name="tipo_documento"
                  value={cliente.tipo_documento ?? ""}
                  onValueChange={(value) =>
                    setCliente((prev) => ({
                      ...prev,
                      tipo_documento: value,
                    }))
                  }
                >
                  <SelectTrigger className="w-full flex-1">
                    <SelectValue placeholder="Seleccione el tipo de documento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DNI">DNI</SelectItem>
                    <SelectItem value="CE">CE</SelectItem>
                    <SelectItem value></SelectItem>
                  </SelectContent>
                </Select>
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
