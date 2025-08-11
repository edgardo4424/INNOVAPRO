import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, User, Building2, Shield } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { trabajadorSchema } from "../schema/trabajador.schema";
import trabajadoresService from "../services/trabajadoresService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { mockCargos, mockFiliales } from "../mocks/mockFiliales_Cargos";
import ContratosLaborales from "../components/ContratosLaborales";

export default function TrabajadorForm() {
   const navigate = useNavigate();

   const [formData, setFormData] = useState({
      filial_id: "",
      nombres: "",
      apellidos: "",
      tipo_documento: "",
      numero_documento: "",
      asignacion_familiar: false,
      sistema_pension: "",
      quinta_categoria: false,
      cargo_id: "",
      contratos_laborales: [
         {
            id: Math.floor(Date.now() / 1000),
            fecha_inicio: "",
            fecha_fin: "",
            sueldo: "",
            regimen: "",
         },
      ],
   });

   const [filiales, setFiliales] = useState([]);
   const [errors, setErrors] = useState({});
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [cargos, setCargos] = useState([]);

   // Simulación de datos de filiales - en producción vendría de una API
   useEffect(() => {
      setFiliales(mockFiliales);

      setCargos(mockCargos);
   }, []);

   const handleInputChange = (field, value) => {
      setFormData((prev) => ({
         ...prev,
         [field]: value,
      }));

      // Limpiar error del campo cuando el usuario empiece a escribir
      if (errors[field]) {
         setErrors((prev) => ({
            ...prev,
            [field]: "",
         }));
      }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      try {
         await trabajadorSchema(false).validate(formData, {
            abortEarly: false,
         });
         setIsSubmitting(true);
         // Preparar datos para envío
         const dataToSubmit = {
            filial_id: Number.parseInt(formData.filial_id),
            nombres: formData.nombres.trim(),
            apellidos: formData.apellidos.trim(),
            tipo_documento: formData.tipo_documento,
            numero_documento: formData.numero_documento.trim(),
            asignacion_familiar: formData.asignacion_familiar,
            sistema_pension: formData.sistema_pension,
            quinta_categoria: formData.quinta_categoria,
            cargo_id: Number.parseInt(formData.cargo_id),
            contratos_laborales: formData.contratos_laborales,
            sueldo_base: formData.contratos_laborales.at(-1).sueldo,
         };
         console.log(dataToSubmit);

         const res = await trabajadoresService.crearTrabajador(dataToSubmit);
         console.log(res);

         // toast.success("Trabajador creado con exito!");
         // navigate("/tabla-trabajadores");
         // setIsSubmitting(false);
      } catch (error) {
         if (error.name === "ValidationError") {
            // Formatea los errores como un objeto plano: { campo: "mensaje de error" }
            const errors = error.inner.reduce((acc, curr) => {
               acc[curr.path] = curr.message;
               return acc;
            }, {});
            console.log(errors);

            setErrors(errors);
         }
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <div className=" mx-auto p-6">
         <Card className="shadow-none ">
            <CardHeader>
               <CardTitle className="flex items-center gap-2 text-[#1b274a]">
                  <User className="h-7 w-7 ]" />
                  <span className="text-3xl">Registro de Trabajador</span>
               </CardTitle>
               <CardDescription>
                  Complete los datos del nuevo trabajador. Los campos marcados
                  con * son obligatorios.
               </CardDescription>
            </CardHeader>
            <CardContent>
               <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Información de la Empresa */}
                  <div className="space-y-4">
                     <div className="flex items-center gap-2 text-lg font-semibold">
                        <Building2 className="h-5 w-5 text-[#1b274a]" />
                        Información de la Empresa
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <Label htmlFor="filial_id">Filial *</Label>
                           <Select
                              value={formData.filial_id}
                              onValueChange={(value) =>
                                 handleInputChange("filial_id", value)
                              }
                           >
                              <SelectTrigger>
                                 <SelectValue placeholder="Seleccione una filial" />
                              </SelectTrigger>
                              <SelectContent>
                                 {filiales.map((filial) => (
                                    <SelectItem
                                       key={filial.id}
                                       value={filial.id.toString()}
                                    >
                                       {filial.nombre}
                                    </SelectItem>
                                 ))}
                              </SelectContent>
                           </Select>
                           {errors.filial_id && (
                              <p className="text-sm text-red-500">
                                 {errors.filial_id}
                              </p>
                           )}
                        </div>
                        <div className="space-y-2">
                           <Label htmlFor="cargo_id">Cargo *</Label>
                           <Select
                              value={formData.cargo_id}
                              onValueChange={(value) =>
                                 handleInputChange("cargo_id", value)
                              }
                           >
                              <SelectTrigger>
                                 <SelectValue placeholder="Seleccione un cargo" />
                              </SelectTrigger>
                              <SelectContent>
                                 {cargos.map((cargo) => (
                                    <SelectItem
                                       key={cargo.id}
                                       value={cargo.id.toString()}
                                    >
                                       {cargo.nombre}
                                    </SelectItem>
                                 ))}
                              </SelectContent>
                           </Select>
                           {errors.cargo_id && (
                              <p className="text-sm text-red-500">
                                 {errors.cargo_id}
                              </p>
                           )}
                        </div>
                     </div>
                  </div>

                  {/* Información Personal */}
                  <div className="space-y-4">
                     <div className="flex items-center gap-2 text-lg font-semibold">
                        <User className="h-5 w-5 text-[#1b274a]" />
                        Información Personal
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <Label htmlFor="nombres">Nombres *</Label>
                           <Input
                              id="nombres"
                              value={formData.nombres}
                              onChange={(e) =>
                                 handleInputChange("nombres", e.target.value)
                              }
                              placeholder="Ingrese los nombres"
                           />
                           {errors.nombres && (
                              <p className="text-sm text-red-500">
                                 {errors.nombres}
                              </p>
                           )}
                        </div>

                        <div className="space-y-2">
                           <Label htmlFor="apellidos">Apellidos *</Label>
                           <Input
                              id="apellidos"
                              value={formData.apellidos}
                              onChange={(e) =>
                                 handleInputChange("apellidos", e.target.value)
                              }
                              placeholder="Ingrese los apellidos"
                           />
                           {errors.apellidos && (
                              <p className="text-sm text-red-500">
                                 {errors.apellidos}
                              </p>
                           )}
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <Label htmlFor="tipo_documento">
                              Tipo de Documento *
                           </Label>
                           <Select
                              value={formData.tipo_documento}
                              onValueChange={(value) =>
                                 handleInputChange("tipo_documento", value)
                              }
                           >
                              <SelectTrigger>
                                 <SelectValue placeholder="Seleccione tipo de documento" />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="DNI">DNI</SelectItem>
                                 <SelectItem value="CE">
                                    Carné de Extranjería
                                 </SelectItem>
                              </SelectContent>
                           </Select>
                           {errors.tipo_documento && (
                              <p className="text-sm text-red-500">
                                 {errors.tipo_documento}
                              </p>
                           )}
                        </div>

                        <div className="space-y-2">
                           <Label htmlFor="numero_documento">
                              Número de Documento *
                           </Label>
                           <Input
                              id="numero_documento"
                              value={formData.numero_documento}
                              onChange={(e) =>
                                 handleInputChange(
                                    "numero_documento",
                                    e.target.value
                                 )
                              }
                              placeholder="Ingrese el número de documento"
                           />
                           {errors.numero_documento && (
                              <p className="text-sm text-red-500">
                                 {errors.numero_documento}
                              </p>
                           )}
                        </div>
                     </div>
                  </div>

                  {/* Información Laboral */}
                  {/* <div className="space-y-4">
                     <div className="flex items-center gap-2 text-lg font-semibold">
                        <CalendarIcon className="h-5 w-5  text-[#1b274a]" />
                        Información Laboral
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <Label htmlFor="fecha_ingreso">
                              Fecha de Ingreso *
                           </Label>
                           <Input
                              id="fecha_ingreso"
                              type="date"
                              value={formData.fecha_ingreso}
                              onChange={(e) =>
                                 handleInputChange(
                                    "fecha_ingreso",
                                    e.target.value
                                 )
                              }
                           />
                           {errors.fecha_ingreso && (
                              <p className="text-sm text-red-500">
                                 {errors.fecha_ingreso}
                              </p>
                           )}
                        </div>

                        <div className="space-y-2">
                           <Label htmlFor="sueldo_base">Sueldo Base *</Label>
                           <Input
                              id="sueldo_base"
                              type="number"
                              min="0"
                              step="0.1"
                              value={formData.sueldo_base}
                              onChange={(e) =>
                                 handleInputChange(
                                    "sueldo_base",
                                    e.target.value
                                 )
                              }
                              placeholder="0.00"
                           />
                           {errors.sueldo_base && (
                              <p className="text-sm text-red-500">
                                 {errors.sueldo_base}
                              </p>
                           )}
                        </div>
                     </div>
                  </div> */}
                  <ContratosLaborales
                     formData={formData}
                     setFormData={setFormData}
                  />

                  {/* Beneficios y Sistema de Pensión */}
                  <div className="space-y-4">
                     <div className="flex items-center gap-2 text-lg font-semibold">
                        <Shield className="h-5 w-5  text-[#1b274a]" />
                        Beneficios y Sistema de Pensión
                     </div>

                     <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                           <Checkbox
                              id="asignacion_familiar"
                              checked={formData.asignacion_familiar}
                              className="data-[state=checked]:bg-[#1b274a] border-[#1b274a]/50 data-[state=checked]:border-[#1b274a]/80"
                              onCheckedChange={(checked) =>
                                 handleInputChange(
                                    "asignacion_familiar",
                                    checked
                                 )
                              }
                           />
                           <Label htmlFor="asignacion_familiar">
                              Asignación Familiar
                           </Label>
                        </div>

                        <div className="space-y-2">
                           <Label htmlFor="sistema_pension">
                              Sistema de Pensión *
                           </Label>
                           <Select
                              value={formData.sistema_pension}
                              onValueChange={(value) =>
                                 handleInputChange("sistema_pension", value)
                              }
                           >
                              <SelectTrigger>
                                 <SelectValue placeholder="Seleccione sistema de pensión" />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="AFP">AFP</SelectItem>
                                 <SelectItem value="ONP">ONP</SelectItem>
                              </SelectContent>
                           </Select>
                           {errors.sistema_pension && (
                              <p className="text-sm text-red-500">
                                 {errors.sistema_pension}
                              </p>
                           )}
                        </div>

                        <div className="flex items-center space-x-2">
                           <Checkbox
                              id="quinta_categoria"
                              checked={formData.quinta_categoria}
                              className="data-[state=checked]:bg-[#1b274a] border-[#1b274a]/50 data-[state=checked]:border-[#1b274a]/80"
                              onCheckedChange={(checked) =>
                                 handleInputChange("quinta_categoria", checked)
                              }
                           />
                           <Label htmlFor="quinta_categoria">
                              Quinta Categoría
                           </Label>
                        </div>
                     </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                     <Button
                        type="button"
                        variant="outline"
                        disabled={isSubmitting}
                     >
                        Cancelar
                     </Button>
                     <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting
                           ? "Registrando..."
                           : "Registrar Trabajador"}
                     </Button>
                  </div>
               </form>
            </CardContent>
         </Card>
      </div>
   );
}
