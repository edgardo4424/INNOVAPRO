import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Briefcase, RefreshCw, Save } from "lucide-react";
import GastosModal from "./GastosModal";
import { useJornada } from "../hooks/useJornada";
import { useAsistencia } from "../hooks/useAsistencia";
import { useTiposTrabajo } from "../hooks/useTiposTrabajo";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { estadosAsistencia } from "./AsistenciaSimple";
import BadgeEstadoAsistencia from "./BadgeEstadoAsistencia";

const JornadaCard = ({
  trabajador,
  obtenerTrabajadores,
  fecha,
  asistenciasSincronizacion,
}) => {
  const {
    asistencia,
    actualizarAsistencia,
    actualizarJornada,
    agregarSegundaJornada,
    eliminarSegundaJornada,
    guardarAsistencia,
    inputsDeshabilitados,
    actualizarEstadoAsistencia,
  } = useAsistencia(
    trabajador,
    obtenerTrabajadores,
    fecha,
    asistenciasSincronizacion,
  );

  const {
    jornadaPrincipal,
    segundaJornada,
    tieneSegundaJornada,
    puedeAgregarSegundaJornada,
  } = useJornada(asistencia);

  const tiposTrabajo = useTiposTrabajo();
  return (
    <Card className={"gap-2 py-3"}>
      <CardHeader className={""}>
        <CardTitle className="flex items-center justify-start gap-8">
          <div>
            <h3 className="!mt-0 text-lg font-semibold">
              {trabajador.nombres} {trabajador.apellidos}
            </h3>
            <div>
              <p className="text-[9px] text-neutral-500">
                {trabajador.tipo_documento}: {trabajador.numero_documento}
              </p>
              <p className="text-xs text-neutral-500 lowercase">
                {trabajador.filial}
              </p>
            </div>
          </div>
          <div className="">
            <BadgeEstadoAsistencia trabajador={trabajador} />
          </div>
          <article className="flex space-x-8 text-gray-500">
            {asistencia.tarea_realizada_manana && (
              <section>
                Tarea de la mañana:{" "}
                <span className="text-xs">
                  {asistencia.tarea_realizada_manana}
                </span>
              </section>
            )}
            {asistencia.tarrea_realizada_tarde && (
              <section>
                Tarea de la tarde:{" "}
                <span className="text-xs">
                  {asistencia.tarrea_realizada_tarde}
                </span>
              </section>
            )}
          </article>
        </CardTitle>
      </CardHeader>
      <CardContent className={""}>
        <div className="grid grid-cols-1 gap-4">
          <Card className="border-l-4 border-l-[#1b274a] py-0">
            <CardContent className="pb-4">
              <div className="grid grid-cols-2 items-center gap-4 lg:grid-cols-6">
                {/* Estado */}
                <div>
                  <Label className="text-xs">Estado</Label>
                  <Select
                    value={asistencia.estado_asistencia}
                    onValueChange={(value) =>
                      actualizarAsistencia("estado_asistencia", value)
                    }
                  >
                    <SelectTrigger className="w-full truncate">
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      {estadosAsistencia.map((estado) => (
                        <SelectItem key={estado.value} value={estado.value}>
                          <div className="flex items-center gap-2">
                            <div
                              className={`h-3 w-3 rounded-full ${estado.color}`}
                            />
                            {estado.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Horas */}
                <section className="col-span-2 grid grid-cols-3 items-center gap-4">
                  <div>
                    <Label className="text-xs">Horas</Label>
                    <Input
                      type="number"
                      min="0"
                      max="12"
                      step="0.5"
                      value={asistencia.horas_trabajadas ?? ""}
                      onChange={(e) =>
                        actualizarAsistencia(
                          "horas_trabajadas",
                          Number.parseFloat(e.target.value),
                        )
                      }
                      disabled={inputsDeshabilitados}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Minutos</Label>
                    <Input
                      type="number"
                      value={asistencia.minutos_trabajados ?? ""}
                      onChange={(e) =>
                        actualizarAsistencia(
                          "minutos_trabajados",
                          Number.parseFloat(e.target.value),
                        )
                      }
                      placeholder="0"
                      disabled={inputsDeshabilitados}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Horas Extras</Label>
                    <Input
                      type="number"
                      min="0"
                      max="12"
                      step="0.5"
                      value={asistencia.horas_extras ?? ""}
                      onChange={(e) =>
                        actualizarAsistencia(
                          "horas_extras",
                          Number.parseFloat(e.target.value),
                        )
                      }
                      placeholder="0"
                      disabled={inputsDeshabilitados}
                      className="w-full"
                    />
                  </div>
                </section>

                {/* Turno */}
                <div>
                  <Label className="text-xs">Turno</Label>
                  <Select
                    value={jornadaPrincipal?.turno || "mañana"}
                    onValueChange={(value) => {
                      actualizarJornada(jornadaPrincipal.id, "turno", value);
                      // Si cambia a tarde, eliminar segunda jornada si existe
                      if (value === "tarde" && tieneSegundaJornada) {
                        eliminarSegundaJornada();
                      }
                    }}
                    disabled={inputsDeshabilitados}
                  >
                    <SelectTrigger className={"w-full"}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mañana">Mañana</SelectItem>
                      <SelectItem value="tarde">Tarde</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Lugar */}
                <div>
                  <Label className="text-xs">Lugar</Label>
                  <Input
                    placeholder="Ej: Almacén, Obra"
                    value={jornadaPrincipal?.lugar || ""}
                    onChange={(e) =>
                      actualizarJornada(
                        jornadaPrincipal.id,
                        "lugar",
                        e.target.value,
                      )
                    }
                    disabled={inputsDeshabilitados}
                  />
                </div>

                {/* Tipo de Trabajo */}
                <div>
                  <Label className="text-xs">Tipo de Trabajo</Label>
                  <Select
                    value={
                      jornadaPrincipal?.tipo_trabajo_id?.toString() ?? undefined
                    }
                    onValueChange={(value) =>
                      actualizarJornada(
                        jornadaPrincipal.id,
                        "tipo_trabajo_id",
                        Number.parseInt(value),
                      )
                    }
                    disabled={inputsDeshabilitados}
                  >
                    <SelectTrigger className="w-full truncate">
                      <SelectValue
                        placeholder="Seleccione un tipo de trabajo"
                        className="truncate"
                      />
                    </SelectTrigger>
                    <SelectContent align="end">
                      {tiposTrabajo.map((tipo) => (
                        <SelectItem key={tipo.id} value={tipo.id.toString()}>
                          {tipo.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Checkbox para Segunda Jornada - Solo aparece si primera jornada es "mañana" */}
              {puedeAgregarSegundaJornada && (
                <div className="my-4 flex min-h-[67px] flex-wrap items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={tieneSegundaJornada}
                      onChange={(e) => {
                        if (e.target.checked) {
                          agregarSegundaJornada();
                        } else {
                          eliminarSegundaJornada();
                        }
                      }}
                      className="rounded"
                      disabled={inputsDeshabilitados}
                    />
                    <Label className="text-sm font-medium">
                      Agregar Segunda Jornada (Turno Tarde)
                    </Label>
                  </div>

                  {tieneSegundaJornada && segundaJornada && (
                    <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
                      {/* Lugar Segunda Jornada */}
                      <div className="">
                        <Label className="text-xs">Lugar Segunda Jornada</Label>
                        <Input
                          placeholder="Ej: Planta B, Almacén"
                          value={segundaJornada.lugar}
                          onChange={(e) =>
                            actualizarJornada(
                              segundaJornada.id,
                              "lugar",
                              e.target.value,
                            )
                          }
                        />
                      </div>

                      {/* Tipo de Trabajo Segunda Jornada */}
                      <div className="">
                        <Label className="text-xs">
                          Tipo de Trabajo Segunda Jornada
                        </Label>
                        <Select
                          value={
                            segundaJornada?.tipo_trabajo_id?.toString() ??
                            undefined
                          }
                          onValueChange={(value) =>
                            actualizarJornada(
                              segundaJornada.id,
                              "tipo_trabajo_id",
                              Number.parseInt(value),
                            )
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccione un tipo de trabajo" />
                          </SelectTrigger>
                          <SelectContent>
                            {tiposTrabajo.map((tipo) => (
                              <SelectItem
                                key={tipo.id}
                                value={tipo.id.toString()}
                              >
                                {tipo.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Botones de Acción */}
              <div className="flex items-center justify-between border-t pt-4">
                <GastosModal
                  trabajador={trabajador}
                  asistencia={asistencia}
                  onUpdateGastos={(gastos) =>
                    actualizarAsistencia("gastos", gastos)
                  }
                  inputsDeshabilitados={inputsDeshabilitados}
                />
                {trabajador.asistencia ? (
                  <Button
                    size={"sm"}
                    variant="outline"
                    className="flex items-center gap-2 border-blue-500 bg-transparent text-blue-600 hover:bg-blue-50"
                    onClick={actualizarEstadoAsistencia}
                  >
                    <RefreshCw className="h-4 w-4" />
                    Actualizar
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                    onClick={guardarAsistencia}
                  >
                    <Save className="h-3 w-3" />
                    Guardar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default JornadaCard;
