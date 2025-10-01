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
import { CalendarDays, CalendarIcon, Plus } from "lucide-react";
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
import { calcularDiasGenerados } from "../utils/calcularVacacionesGeneradas";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import ResumenVacacionesDialog from "./ModalResumenVacaciones";

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
    total: 0,
  });

  const empleado = useMemo(
    () => empleados.find((e) => e.id == formulario.empleadoSeleccionado),
    [formulario.empleadoSeleccionado, empleados],
  );

  const contratoVigente = useMemo(() => {
    const hoy = new Date().toISOString().split("T")[0];
    return empleado?.contratos_laborales?.find(
      (c) => c.fecha_inicio <= hoy && hoy <= c.fecha_fin,
    );
  }, [empleado]);

  const regimenVigente = contratoVigente?.regimen || "";
  const {
    dias_disponibles,
    dias_vender,
    dias_tomar,
    total_generado,
    total_tomado,
    total_vendido,
  } = useMemo(() => {
    if (empleado?.contratos_laborales && empleado?.vacaciones) {
      const diasTomados = empleado.vacaciones.reduce(
        (sum, v) => sum + (v.dias_tomados || 0),
        0,
      );
      const diasVendidos = empleado.vacaciones.reduce(
        (sum, v) => sum + (v.dias_vendidos || 0),
        0,
      );

      const { total_gozadas, total_vendibles, maximo_disponible } =
        calcularDiasGenerados(empleado.contratos_laborales);

      // el verdadero tope global
      //Mi maximo disponible---> maximo diponible menos dias tomados y dias ya vendidos y tomados
      const dias_disponibles = maximo_disponible - diasTomados - diasVendidos;
      //El maximo que tengo para tomar es los dias disponibles menos los los dias ya tomados
      const dias_tomar = dias_disponibles;
      //El maximo que tengo para vender es los dias disponibles menos los los dias ya vendidos
      const dias_vender = dias_disponibles / 2;

      return {
        dias_disponibles,
        dias_vender,
        dias_tomar,
        total_generado: maximo_disponible,
        total_tomado: diasTomados,
        total_vendido: diasVendidos,
      };
    }

    return {
      dias_disponibles: 0,
      dias_vender: 0,
      dias_tomar: 0,
      total_generado: 0,
      total_tomado: 0,
      total_vendido: 0,
    };
  }, [empleado]);

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

    if (
      !empleado ||
      !formulario.rango_fechas.from ||
      !formulario.rango_fechas.to
    ) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    const datosVacaciones = {
      trabajador_id: Number(formulario.empleadoSeleccionado),
      fecha_inicio: format(formulario.rango_fechas.from, "yyyy-MM-dd"),
      fecha_termino: format(formulario.rango_fechas.to, "yyyy-MM-dd"),
      observaciones: formulario.observaciones,
      vacacionesXasistencias: arregloDias || [],
    };

    try {
      await beneficiosService.crear(datosVacaciones);
      await fetchEmployees();
      toast.success("Las vacaciones fueron registradas con éxito.");
      cerrarModal();
    } catch (error) {
      if (error?.response?.data?.error) {
        toast.error(error.response.data.error);
        return;
      }
      const errores = error.response?.data?.mensaje || [
        "Error al registrar vacaciones",
      ];
      errores.forEach((e) => toast.error(e));
    }
  };

  useEffect(() => {
    if (formulario.rango_fechas.from && formulario.rango_fechas.to) {
      const fechas = generarFechasDesdeRango(formulario.rango_fechas);
      console.log(fechas.length);
      const total = total_tomado + total_vendido + fechas.length;
      if (total % 7 === 5) {
        toast.warning(
          "Debe agregar 2 días correspondientes al fin de semana para completar la semana de vacaciones.",
        );
      }

      if (total % 7 === 6) {
        toast.warning(
          "Debe agregar 1 día correspondiente al fin de semana para completar la semana de vacaciones.",
        );
      }

      setArregloDias(fechas);
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
              datos.tipo = "gozada";
            }
            if (datos.clicks == 2) {
              datos.tipo = "vendida";
            }
          }
          return datos;
        } else {
          return dia;
        }
      }),
    );
  };

  useEffect(() => {
    if (arregloDias?.length > 0) {
      const data = { vendida: 0, gozada: 0, sin_utilizar: 0, total: 0 };
      for (const d of arregloDias) {
        if (d.tipo === "gozada") {
          data.gozada++;
        } else if (d.tipo === "vendida") {
          data.vendida++;
        } else {
          data.sin_utilizar++;
        }
      }
      data.total = arregloDias.length;
      setContadorTipos(data);
    }
  }, [arregloDias]);
  return (
    <>
      <Button
        onClick={() => setModalAbierto(true)}
        className="bg-blue-600 hover:bg-blue-700"
      >
        <Plus className="mr-2 h-4 w-4" /> Nueva Solicitud
      </Button>

      <AlertDialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <AlertDialogContent className="sm:max-w-[500px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Nueva Solicitud de Vacaciones</AlertDialogTitle>
            <p className="text-muted-foreground text-sm">
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
                  <SelectTrigger className="w-full truncate">
                    <SelectValue placeholder="Selecciona un trabajador" />
                  </SelectTrigger>
                  <SelectContent>
                    {empleados.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id.toString()}>
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
                  className="shadow-0 w-24 !border-0 !outline-0"
                />
              </div>
            </div>
            <div className="grid grid-cols-1">
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
                        <span className="rounded px-1 text-neutral-800">
                          Del
                        </span>
                        <span className="rounded px-1 text-neutral-600">
                          {dia_mes_anho(formulario.rango_fechas.from)}
                        </span>
                        <span className="rounded px-1 text-neutral-800">
                          al
                        </span>
                        <span className="rounded px-1 text-neutral-600">
                          {dia_mes_anho(formulario.rango_fechas.to)}
                        </span>
                      </>
                    ) : formulario.rango_fechas.from ? (
                      <>
                        <span className="rounded px-1 text-neutral-800">
                          Inicio:
                        </span>
                        <span className="rounded px-1 text-neutral-600">
                          {dia_mes_anho(formulario.rango_fechas.from)}
                        </span>
                      </>
                    ) : (
                      <span className="rounded px-1 text-neutral-800">
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
                    defaultMonth={formulario.rango_fechas?.from || new Date()}
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

            <ResumenVacacionesDialog
              total_generado={total_generado}
              total_tomado={total_tomado}
              total_vendido={total_vendido}
              dias_disponibles={dias_disponibles}
              dias_tomar={dias_tomar}
              dias_vender={dias_vender}
            />

            <article className="flex w-full flex-col space-y-3.5">
              <Label className="text-sm">
                Selecione los dias a gozar y vender
              </Label>
              <section className="grid grid-cols-4 gap-4 pt-1 text-xs text-neutral-600">
                <div className="flex items-center gap-1">
                  <span className="bg-innova-blue h-4 w-4 rounded"></span>
                  <span>Gozada {contadorTipos.gozada}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-4 w-4 rounded bg-green-700"></span>
                  <span>Vendida {contadorTipos.vendida}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-4 w-4 rounded border bg-neutral-100 shadow-sm"></span>
                  <span>Sin utilizar {contadorTipos.sin_utilizar}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>Total: {contadorTipos.total}</span>
                </div>
              </section>
              <section className="flex w-full flex-wrap space-y-2 space-x-2.5">
                {arregloDias.map((d, i) => (
                  <Button
                    size="icon"
                    className={clsx(
                      "size-7 bg-neutral-100 text-xs text-neutral-700 shadow-md",
                      d.tipo === "gozada" &&
                        "bg-innova-blue hover:bg-innova-blue-hover text-white hover:text-white",
                      d.tipo === "vendida" &&
                        "bg-green-700 text-white hover:bg-green-600 hover:text-white",
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
              <Button type="button" variant="outline" onClick={cerrarModal}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-gray-900 hover:bg-gray-800">
                Crear Solicitud
              </Button>
            </div>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
