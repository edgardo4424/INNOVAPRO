"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import trabajadoresService from "../services/trabajadoresService";

const ContratosLaborales = ({
  formData,
  setFormData,
  errors,
  filiales,
  isEditMode,
}) => {

  // Estados para confirmar sueldo
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [prevSueldo, setPrevSueldo] = useState("");
  const [tempSueldo, setTempSueldo] = useState("");
  const [listaCargosSunat, setListaCargosSunat] = useState([]);

  const handleInputChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      contratos_laborales: prev.contratos_laborales.map((contrato, i) =>
        i === index ? { ...contrato, [field]: value } : contrato,
      ),
    }));
  };

  const handleAddContrato = () => {
    const nuevo = {
      id: Math.floor(Date.now() / 1000),
      fecha_inicio: "",
      fecha_fin: "",
      sueldo: "",
      regimen: "",
      tipo_contrato: "",
      filial_id: "",
      banco: "",
      numero_cuenta: "",
      id_cargo_sunat: "",
      es_indefinido: false,
      numero_cuenta_cts:"",
    };
    setFormData((prev) => ({
      ...prev,
      contratos_laborales: [...prev.contratos_laborales, nuevo],
    }));
  };


  const handleRemoveContrato = (index) => {
    setFormData((prev) => ({
      ...prev,
      contratos_laborales: prev.contratos_laborales.filter(
        (_, i) => i !== index,
      ),
    }));
  };

  // Captura el sueldo previo al empezar a editar
  const handleSueldoFocus = (index, value) => {
    setEditIndex(index);
    setPrevSueldo(value ?? "");
  };

  // Al salir del input, si cambió y no está vacío, pregunta confirmación
  const handleSueldoBlur = (index, value) => {
    const normalizedNew = value?.toString() ?? "";
    const normalizedPrev = prevSueldo?.toString() ?? "";

    // No abrir si no cambió o si está vacío
    if (!normalizedNew || normalizedNew === normalizedPrev) return;

    setEditIndex(index);
    setTempSueldo(normalizedNew);
    setConfirmOpen(true);
  };

  const confirmSueldo = () => {
    // Por si acaso, asegura que quede el valor confirmado
    if (editIndex !== null) {
      handleInputChange(editIndex, "sueldo", tempSueldo);
    }
    setConfirmOpen(false);
    setEditIndex(null);
  };

  const cancelSueldo = () => {
    // Revertir al valor previo
    if (editIndex !== null) {
      handleInputChange(editIndex, "sueldo", prevSueldo);
    }
    setConfirmOpen(false);
    setEditIndex(null);
  };

  const obtenerCargosSunat = async (cargo_innova_id) => {
    try {
      const respuesta =
        await trabajadoresService.getCargosSunat(cargo_innova_id);

      setListaCargosSunat(respuesta.data);
      setFormData((prev) => ({
  ...prev,
  contratos_laborales: prev.contratos_laborales.map((contrato) => {
    // Si ya tiene id_cargo_sunat, no lo sobrescribas
    if (isEditMode && contrato.id_cargo_sunat) {
      return contrato;
    }
    return {
      ...contrato,
      id_cargo_sunat: respuesta.data.length > 0 ? respuesta.data[0].id : "",
      cargo_sunat_nombre: respuesta.data.length > 0 ? respuesta.data[0].nombre : "",
    };
  }),
}));
    } catch (error) {
      setListaCargosSunat([]);
    }
  };

  useEffect(() => {
      obtenerCargosSunat(formData.cargo_id);
  }, [formData.cargo_id]);

  const canRemove = formData.contratos_laborales.length > 1;

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <CalendarIcon className="h-5 w-5 text-[#1b274a]" />
          Información Contractual
        </div>
      </div>

      <div className="mt-4 space-y-5">
        {formData.contratos_laborales.map((c, i) => 
         {
            return ( <div
            key={c.id ?? i}
            className="border-muted rounded-lg border p-4 md:p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex gap-6">
                <div className="text-muted-foreground text-sm font-medium">
                  Contrato #{i + 1}
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`es_indefinido_${i}`}
                    checked={c.es_indefinido}
                    className="border-[#1b274a]/50 data-[state=checked]:border-[#1b274a]/80 data-[state=checked]:bg-[#1b274a]"
                    onCheckedChange={(checked) => {
                      handleInputChange(i, "es_indefinido", !!checked);
                      handleInputChange(
                        i,
                        "fecha_fin",
                        !!checked ? "" : c.fecha_fin,
                      );
                     
                      handleInputChange(i, "tipo_contrato", !!checked ? "PLANILLA" : "");
                    }}
                  />

                  <Label htmlFor="es_indefinido">Contrato indefinido</Label>
                </div>
              </div>

              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => handleRemoveContrato(i)}
                disabled={!canRemove}
                className="disabled:opacity-60"
                title={
                  canRemove
                    ? "Eliminar contrato"
                    : "Debe existir al menos un contrato"
                }
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Fecha de inicio */}
              <div className="space-y-2">
                <Label htmlFor={`fecha_inicio_${i}`}>Fecha de Inicio *</Label>
                <Input
                  id={`fecha_inicio_${i}`}
                  type="date"
                  value={c.fecha_inicio}
                  onChange={(e) =>
                    handleInputChange(i, "fecha_inicio", e.target.value)
                  }
                />
                {errors?.[`contratos_laborales[${i}].fecha_inicio`] && (
                  <p className="text-xs text-red-500">
                    {errors[`contratos_laborales[${i}].fecha_inicio`]}
                  </p>
                )}
              </div>

              {/* Fecha de fin */}
              <div className="space-y-2">
                <Label htmlFor={`fecha_fin_${i}`}>Fecha de Fin *</Label>
                <Input
                  id={`fecha_fin_${i}`}
                  type="date"
                  value={c.fecha_fin}
                  onChange={(e) =>
                    handleInputChange(i, "fecha_fin", e.target.value)
                  }
                  disabled={c.es_indefinido}
                />
                {errors?.[`contratos_laborales[${i}].fecha_fin`] && (
                  <p className="text-xs text-red-500">
                    {errors[`contratos_laborales[${i}].fecha_fin`]}
                  </p>
                )}
              </div>

              {/* Sueldo */}
              <div className="space-y-2">
                <Label htmlFor={`sueldo_${i}`}>Sueldo *</Label>
                <Input
                  id={`sueldo_${i}`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={c.sueldo}
                  onFocus={(e) => handleSueldoFocus(i, e.target.value)}
                  onChange={(e) =>
                    handleInputChange(i, "sueldo", e.target.value)
                  }
                  onBlur={(e) => handleSueldoBlur(i, e.target.value)}
                  placeholder="0.00"
                />
                {errors?.[`contratos_laborales[${i}].sueldo`] && (
                  <p className="text-xs text-red-500">
                    {errors[`contratos_laborales[${i}].sueldo`]}
                  </p>
                )}
              </div>

              {/* Régimen */}
              <div className="space-y-2">
                <Label htmlFor={`regimen_${i}`}>Régimen *</Label>
                <Select
                  value={c.regimen}
                  onValueChange={(value) =>
                    handleInputChange(i, "regimen", value)
                  }
                >
                  <SelectTrigger id={`regimen_${i}`} className="w-full">
                    <SelectValue placeholder="Seleccione el régimen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GENERAL">General</SelectItem>
                    <SelectItem value="MYPE">Mype</SelectItem>
                  </SelectContent>
                </Select>
                {errors?.[`contratos_laborales[${i}].regimen`] && (
                  <p className="text-xs text-red-500">
                    {errors[`contratos_laborales[${i}].regimen`]}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Empresa asociada *</Label>
                <Select
                  value={c.filial_id}
                  onValueChange={(value) =>
                    handleInputChange(i, "filial_id", value)
                  }
                >
                  <SelectTrigger className={"w-full"}>
                    <SelectValue placeholder="Seleccione una empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {filiales.map((filial) => (
                      <SelectItem key={filial.id} value={filial.id.toString()}>
                        {filial.razon_social}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors?.[`contratos_laborales[${i}].filial_id`] && (
                  <p className="text-xs text-red-500">
                    {errors[`contratos_laborales[${i}].filial_id`]}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Cargo en la SUNAT *</Label>
                <Select
                  value={c?.id_cargo_sunat || ""}
                  onValueChange={(value) =>
                    handleInputChange(i, "id_cargo_sunat", value)
                  }
                >
                  <SelectTrigger className={"w-full"}>
                    <SelectValue placeholder="Seleccione un cargo de la SUNAT" />
                  </SelectTrigger>
                  <SelectContent>
            {!isEditMode ? (
            listaCargosSunat.map((cargo_sunat) => (
               <SelectItem
               key={cargo_sunat.id}
               value={cargo_sunat?.id.toString()}
               >
               {cargo_sunat.nombre}
               </SelectItem>
            ))
         ) : String(c?.id).length === 10 ? (
            listaCargosSunat.map((cargo_sunat) => (
               <SelectItem
               key={cargo_sunat.id}
               value={cargo_sunat.id.toString()}
               >
               {cargo_sunat.nombre}
               </SelectItem>
            ))
         ) : (
            c?.id_cargo_sunat
         ? (
            <SelectItem value={c.id_cargo_sunat.toString()}>
               {c.cargo_sunat_nombre}
            </SelectItem>
         )
         : (
             listaCargosSunat.map((carg) => (
               <SelectItem
               key={carg.id}
               value={carg.id.toString()}
               >
               {carg.nombre}
               </SelectItem>
            ))
         )
         )}
         </SelectContent>
                </Select>
                {errors?.[`contratos_laborales[${i}].id_cargo_sunat`] && (
                  <p className="text-xs text-red-500">
                    {errors[`contratos_laborales[${i}].id_cargo_sunat`]}
                  </p>
                )}
              </div>

              {/* Tipo de contrato */}
              <div className="space-y-2">
                <Label htmlFor={`tipo_contrato_${i}`}>Tipo de contrato *</Label>
                <Select
                  value={c.tipo_contrato || ""}
                  onValueChange={(value) =>
                    handleInputChange(i, "tipo_contrato", value)
                  }
                >
                  <SelectTrigger id={`tipo_contrato_${i}`} className="w-full">
                    <SelectValue placeholder="Seleccione el tipo de contrato" />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      formData.contratos_laborales[i].es_indefinido ? (
                         <SelectItem value="PLANILLA">Planilla</SelectItem>
                      ) : (
                        <>
                        <SelectItem value="PLANILLA">Planilla</SelectItem>
                        <SelectItem value="HONORARIOS">
                          Recibo por honorarios
                        </SelectItem>
                        </>
                      )
                    }
                    
                  </SelectContent>
                </Select>
                {errors?.[`contratos_laborales[${i}].tipo_contrato`] && (
                  <p className="text-xs text-red-500">
                    {errors[`contratos_laborales[${i}].tipo_contrato`]}
                  </p>
                )}
              </div>

              {/* Banco */}
              <div className="space-y-2">
                <Label htmlFor={`banco_${i}`}>Banco</Label>
                <Input
                  id={`banco_${i}`}
                  type="text"
                  value={c.banco || ""}
                  onChange={(e) =>
                    handleInputChange(i, "banco", e.target.value)
                  }
                  placeholder="Nombre del banco"
                />
                {errors?.[`contratos_laborales[${i}].banco`] && (
                  <p className="text-xs text-red-500">
                    {errors[`contratos_laborales[${i}].banco`]}
                  </p>
                )}
              </div>

              {/* Número de cuenta */}
              <div className="space-y-2">
                <Label htmlFor={`numero_cuenta_${i}`}>Número de cuenta</Label>
                <Input
                  id={`numero_cuenta_${i}`}
                  type="text"
                  value={c.numero_cuenta || ""}
                  onChange={(e) =>
                    handleInputChange(i, "numero_cuenta", e.target.value)
                  }
                  placeholder="Ej. 1234567890"
                />
                {errors?.[`contratos_laborales[${i}].numero_cuenta`] && (
                  <p className="text-xs text-red-500">
                    {errors[`contratos_laborales[${i}].numero_cuenta`]}
                  </p>
                )}
              </div>
                     {/* Número de cuenta Cts */}
                     <div className="space-y-2">
                        <Label htmlFor={`numero_cuenta_cts_${i}`}>
                           Número de cuenta CTS
                        </Label>
                        <Input
                           id={`numero_cuenta_cts_${i}`}
                           type="text"
                           value={c.numero_cuenta_cts || ""}
                           onChange={(e) =>
                              handleInputChange(
                                 i,
                                 "numero_cuenta_cts",
                                 e.target.value
                              )
                           }
                           placeholder="Ej. 1234567890"
                        />
                        {errors?.[
                           `contratos_laborales[${i}].numero_cuenta_cts`
                        ] && (
                           <p className="text-xs text-red-500">
                              {
                                 errors[
                                    `contratos_laborales[${i}].numero_cuenta_cts`
                                 ]
                              }
                           </p>
                        )}
                     </div>          
            </div>
          </div>)
         }
        )}
      </div>
      <div className="flex items-center justify-end">
        <Button
          type="button"
          onClick={handleAddContrato}
          className="bg-innova-blue hover:bg-innova-blue gap-2"
        >
          <Plus className="h-4 w-4" />
          Nuevo contrato
        </Button>
      </div>

      {/* Diálogo de confirmación de sueldo */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar sueldo</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Está seguro de que el sueldo es <b>{tempSueldo}</b>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelSueldo}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmSueldo}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );

};

export default ContratosLaborales;
