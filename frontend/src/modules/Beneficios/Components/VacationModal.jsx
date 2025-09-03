import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import beneficiosService from "../services/beneficiosService";
import { toast } from "react-toastify";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export function VacationModal({ empleados, fetchEmployees }) {
   const [modalAbierto, setModalAbierto] = useState(false);
   const [formulario, setFormulario] = useState({
      empleadoSeleccionado: "",
      fechaInicio: null,
      fechaFin: null,
      diasTomados: "0",
      diasVendidos: "0",
      observaciones: "",
   });

   const empleado = useMemo(
      () => empleados.find((e) => e.id == formulario.empleadoSeleccionado),
      [formulario.empleadoSeleccionado, empleados]
   );

   const contratoVigente = useMemo(() => {
      const hoy = new Date();
      return empleado?.contratos_laborales?.find((c) => {
         const inicio = new Date(c.fecha_inicio);
         const fin = new Date(c.fecha_fin);
         return inicio <= hoy && hoy <= fin;
      });
   }, [empleado]);

   const regimenVigente = contratoVigente?.regimen || "";

   const vacacionesPrevias = empleado?.vacaciones || [];

   const manejarCambio = (campo) => (e) => {
      const valor = e?.target?.value ?? e;
      setFormulario((prev) => ({ ...prev, [campo]: valor }));
   };

   const reiniciarFormulario = () => {
      setFormulario({
         empleadoSeleccionado: "",
         fechaInicio: null,
         fechaFin: null,
         diasTomados: "0",
         diasVendidos: "0",
         observaciones: "",
      });
   };

   const cerrarModal = () => {
      setModalAbierto(false);
      reiniciarFormulario();
   };

   const manejarEnvio = async (e) => {
      e.preventDefault();

      if (!empleado || !formulario.fechaInicio || !formulario.fechaFin) {
         toast.error("Por favor completa todos los campos requeridos");
         return;
      }

      const tomados = parseInt(formulario.diasTomados) || 0;
      const vendidos = parseInt(formulario.diasVendidos) || 0;

      const datosVacaciones = {
         trabajador_id: Number(formulario.empleadoSeleccionado),
         fecha_inicio: format(formulario.fechaInicio, "yyyy-MM-dd"),
         fecha_termino: format(formulario.fechaFin, "yyyy-MM-dd"),
         dias_tomados: tomados,
         dias_vendidos: vendidos,
         observaciones: formulario.observaciones,
         dias_usados_tomados: vacacionesPrevias.reduce(
            (acc, v) => acc + v.dias_tomados,
            0
         ),
         dias_usados_vendidos: vacacionesPrevias.reduce(
            (acc, v) => acc + v.dias_vendidos,
            0
         ),
         contratos_laborales: empleado?.contratos_laborales || [],
         asignacion_familiar:empleado?.asignacion_familiar||null
      };

      try {
         console.log(datosVacaciones);
         
         await beneficiosService.crear(datosVacaciones);
         await fetchEmployees();
         toast.success("Las vacaciones fueron registradas con éxito.");
         cerrarModal();
      } catch (error) {
         console.log(error);
         
         const errores = error.response?.data?.mensaje || [
            "Error al registrar vacaciones",
         ];
         errores.forEach((e) => toast.error(e));
      }
   };

   return (
      <>
         <Button
            onClick={() => setModalAbierto(true)}
            className="bg-blue-600 hover:bg-blue-700"
         >
            <Plus className="w-4 h-4 mr-2" /> Nueva Solicitud
         </Button>

         <AlertDialog open={modalAbierto} onOpenChange={setModalAbierto}>
            <AlertDialogContent className="sm:max-w-[500px]">
               <AlertDialogHeader>
                  <AlertDialogTitle>Nueva Solicitud de Vacaciones</AlertDialogTitle>
                  <p className="text-sm text-muted-foreground">
                     Completa los datos para crear una nueva solicitud.
                  </p>
               </AlertDialogHeader>

               <form onSubmit={manejarEnvio} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <Label>Trabajador</Label>
                        <Select
                           value={formulario.empleadoSeleccionado}
                           onValueChange={manejarCambio("empleadoSeleccionado")}
                        >
                           <SelectTrigger>
                              <SelectValue placeholder="Selecciona un trabajador" />
                           </SelectTrigger>
                           <SelectContent>
                              {empleados.map((emp) => (
                                 <SelectItem
                                    key={emp.id}
                                    value={emp.id.toString()}
                                 >
                                    {`${emp.nombres} ${emp.apellidos}`}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                     </div>
                     <div>
                        <Label>Régimen vigente</Label>
                        <Input value={`${regimenVigente}`} disabled />
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     {["fechaInicio", "fechaFin"].map((campo) => (
                        <div key={campo} className="space-y-2">
                           <Label>
                              {campo === "fechaInicio"
                                 ? "Fecha de Inicio"
                                 : "Fecha de Término"}
                           </Label>
                           <Popover>
                              <PopoverTrigger asChild>
                                 <Button
                                    variant="outline"
                                    className="w-full justify-start text-left font-normal"
                                 >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {formulario[campo]
                                       ? format(
                                            formulario[campo],
                                            "dd/MM/yyyy",
                                            { locale: es }
                                         )
                                       : "Seleccionar fecha"}
                                 </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                 <Calendar
                                    mode="single"
                                    selected={formulario[campo]}
                                    onSelect={(date) =>
                                       manejarCambio(campo)({
                                          target: { value: date },
                                       })
                                    }
                                    initialFocus
                                 />
                              </PopoverContent>
                           </Popover>
                        </div>
                     ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <Label>Días Tomados</Label>
                        <Input
                           type="number"
                           min="0"
                           value={formulario.diasTomados}
                           onChange={manejarCambio("diasTomados")}
                        />
                     </div>
                     <div>
                        <Label>Días Vendidos</Label>
                        <Input
                           type="number"
                           min="0"
                           value={formulario.diasVendidos}
                           onChange={manejarCambio("diasVendidos")}
                        />
                     </div>
                  </div>

                  <div>
                     <Label>Observaciones</Label>
                     <Textarea
                        value={formulario.observaciones}
                        onChange={manejarCambio("observaciones")}
                        placeholder="Comentarios adicionales..."
                        rows={3}
                     />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                     <Button
                        type="button"
                        variant="outline"
                        onClick={cerrarModal}
                     >
                        Cancelar
                     </Button>
                     <Button
                        type="submit"
                        className="bg-gray-900 hover:bg-gray-800"
                     >
                        Crear Solicitud
                     </Button>
                  </div>
               </form>
            </AlertDialogContent>
         </AlertDialog>
      </>
   );
}
