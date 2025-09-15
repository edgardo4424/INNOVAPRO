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
import {
   AlertDialog,
   AlertDialogContent,
   AlertDialogHeader,
   AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { dia_mes_anho } from "@/utils/formatos_de_fecha";
import { generarFechasDesdeRango } from "../utils/genrar_arreglo_fechas";
import clsx from "clsx";

export function VacationModal({ empleados, fetchEmployees }) {
   const [modalAbierto, setModalAbierto] = useState(false);
   const [formulario, setFormulario] = useState({
      empleadoSeleccionado: "",
      fechaInicio: null,
      fechaFin: null,
      diasTomados: "0",
      diasVendidos: "0",
      observaciones: "",
      rango_fechas: {
         from: "",
         to: "",
      },
   });
   const [arregloDias, setArregloDias] = useState([]);
   const [contadorTipos, setContadorTipos] = useState({
      vendida: 0,
      gozada: 0,
      sin_utilizar: 0,
      total:0
   });

   const empleado = useMemo(
      () => empleados.find((e) => e.id == formulario.empleadoSeleccionado),
      [formulario.empleadoSeleccionado, empleados]
   );

   const contratoVigente = useMemo(() => {
      const hoy = new Date().toISOString().split("T")[0];
      return empleado?.contratos_laborales?.find(
         (c) => c.fecha_inicio <= hoy && hoy <= c.fecha_fin
      );
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
         rango_fechas: {
            from: "",
            to: "",
         },
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
         asignacion_familiar: empleado?.asignacion_familiar || null,
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

   useEffect(() => {
      if (formulario.rango_fechas.from && formulario.rango_fechas.to) {
         const fechas = generarFechasDesdeRango(formulario.rango_fechas);
         setArregloDias(fechas);
         console.log("Arreglo de fechas en rango: ", fechas);
      }
   }, [formulario.rango_fechas]);

   const camtioTipoVacacion = (d) => {
      setArregloDias((prev) =>
         prev.map((dia) => {
            if (dia.fecha === d.fecha) {
               let datos = { ...dia };
               datos.clicks++;
               if (datos.clicks >= 3) {
                  datos.clicks = 0;
                  datos.tipo = "";
               } else {
                  if (datos.clicks == 1) {
                     console.log("entro al else 1");
                     datos.tipo = "gozada";
                     console.log(datos);
                  }
                  if (datos.clicks == 2) {
                     console.log("entro al else 2");
                     datos.tipo = "vendida";
                     console.log(datos);
                  }
               }
               return datos;
            } else {
               return dia;
            }
         })
      );
   };

   useEffect(() => {
      if (arregloDias?.length > 0) {
         const data = { vendida: 0, gozada: 0, sin_utilizar: 0,total:0 };
         for (const d of arregloDias) {
            if (d.tipo === "gozada") {
               data.gozada++;
            } else if (d.tipo === "vendida") {
               data.vendida++;
            } else {
               data.sin_utilizar++;
            }
         }
         data.total=arregloDias.length
         setContadorTipos(data);
      }
   }, [arregloDias]);
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
                  <AlertDialogTitle>
                     Nueva Solicitud de Vacaciones
                  </AlertDialogTitle>
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
                     <div className="">
                        <Label>Régimen actual</Label>
                        <Input
                           defaultValue={`${regimenVigente}`}
                           className="w-24  !outline-0 !border-0 shadow-0"
                        />
                     </div>
                  </div>
                  <div className="grid grid-cols-1 ">
                     <Label>Rango de fecha de las vacaciones</Label>
                     <Popover>
                        <PopoverTrigger asChild>
                           <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                           >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formulario.rango_fechas.from &&
                              formulario.rango_fechas.to ? (
                                 <>
                                    <span className="text-neutral-800 px-1 rounded">
                                       Del
                                    </span>
                                    <span className="text-neutral-600 px-1 rounded">
                                       {dia_mes_anho(
                                          formulario.rango_fechas.from
                                       )}
                                    </span>
                                    <span className="text-neutral-800 px-1 rounded">
                                       al
                                    </span>
                                    <span className="text-neutral-600 px-1 rounded">
                                       {dia_mes_anho(
                                          formulario.rango_fechas.to
                                       )}
                                    </span>
                                 </>
                              ) : formulario.rango_fechas.from ? (
                                 <>
                                    <span className="text-neutral-800 px-1 rounded">
                                       Inicio:
                                    </span>
                                    <span className="text-neutral-600 px-1 rounded">
                                       {dia_mes_anho(
                                          formulario.rango_fechas.from
                                       )}
                                    </span>
                                 </>
                              ) : (
                                 <span className="text-neutral-800 px-1 rounded">
                                    Selecciona un rango de fechas
                                 </span>
                              )}
                           </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                           <Calendar
                              mode="range"
                              selected={
                                 formulario.rango_fechas &&
                                 (formulario.rango_fechas.from ||
                                    formulario.rango_fechas.to)
                                    ? formulario.rango_fechas
                                    : undefined
                              }
                              defaultMonth={
                                 formulario.rango_fechas?.from || new Date()
                              }
                              onSelect={(range) => {
                                 // range puede ser undefined cuando se limpia la selección
                                 const normalizado = range ?? {
                                    from: undefined,
                                    to: undefined,
                                 };
                                 setFormulario((prev) => ({
                                    ...prev,
                                    rango_fechas: normalizado,
                                 }));
                              }}
                              className="rounded-lg border shadow-sm"
                           />
                        </PopoverContent>
                     </Popover>
                  </div>

                  {/* <div className="grid grid-cols-2 gap-4">
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
                  </div> */}

                  <article className="flex flex-col w-full space-y-3.5">
                     <Label className="text-sm">Selecione los dias a gozar y vender</Label>
                     <section className="grid grid-cols-4 gap-4 text-xs text-neutral-600 pt-1">
                        <div className="flex items-center gap-1">
                           <span className="w-4 h-4 rounded bg-innova-blue"></span>
                           <span>Gozada {contadorTipos.gozada}</span>
                        </div>
                        <div className="flex items-center gap-1">
                           <span className="w-4 h-4 rounded bg-green-700"></span>
                           <span>Vendida {contadorTipos.vendida}</span>
                        </div>
                        <div className="flex items-center gap-1">
                           <span className="w-4 h-4 rounded bg-neutral-100 border shadow-sm"></span>
                           <span>
                              Sin utilizar {contadorTipos.sin_utilizar}
                           </span>
                        </div>
                        <div className="flex items-center gap-1">
                           <span>
                              Total: {contadorTipos.total}
                           </span>
                        </div>
                     </section>
                     <section className="flex flex-wrap space-x-2.5 space-y-2 w-full">
                        {arregloDias.map((d, i) => (
                           <Button
                              size="icon"
                              className={clsx(
                                 "size-7 text-xs text-neutral-700 shadow-md bg-neutral-100",
                                 d.tipo === "gozada" &&
                                    "bg-innova-blue text-white hover:bg-innova-blue-hover hover:text-white",
                                 d.tipo === "vendida" &&
                                    "bg-green-700 text-white hover:bg-green-600 hover:text-white"
                              )}
                              variant={"ghost"}
                              key={i}
                              type="button"
                              onClick={() => camtioTipoVacacion(d)}
                           >
                              {d.fecha.slice(-2)}
                           </Button>
                        ))}
                     </section>
                  </article>

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
