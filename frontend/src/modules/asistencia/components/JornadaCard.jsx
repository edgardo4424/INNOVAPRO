import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

const JornadaCard = ({ trabajador, obtenerTrabajadores, fecha,asistenciasSincronizacion }) => {
   const {
      asistencia,
      actualizarAsistencia,
      actualizarJornada,
      agregarSegundaJornada,
      eliminarSegundaJornada,
      guardarAsistencia,
      inputsDeshabilitados,
      actualizarEstadoAsistencia,
      
   } = useAsistencia(trabajador, obtenerTrabajadores, fecha,asistenciasSincronizacion);

   const {
      jornadaPrincipal,
      segundaJornada,
      tieneSegundaJornada,
      puedeAgregarSegundaJornada,
   } = useJornada(asistencia);

   const tiposTrabajo = useTiposTrabajo();
   return (
      <Card className="border-l-4 border-l-[#1b274a] py-0">
         <CardContent className=" pb-4">
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 items-center ">
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
                                    className={`w-3 h-3 rounded-full ${estado.color}`}
                                 />
                                 {estado.label}
                              </div>
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
               </div>

               {/* Horas */}
               <div>
                  <Label className="text-xs">Horas</Label>
                  <Input
                     type="number"
                     min="0"
                     max="12"
                     step="0.5"
                     value={asistencia.horas_trabajadas || 0}
                     onChange={(e) =>
                        actualizarAsistencia(
                           "horas_trabajadas",
                           Number.parseFloat(e.target.value) || 0
                        )
                     }
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
                     value={asistencia.horas_extras || 0}
                     onChange={(e) =>
                        actualizarAsistencia(
                           "horas_extras",
                           Number.parseFloat(e.target.value) || 0
                        )
                     }
                     disabled={inputsDeshabilitados}
                     className="w-full"
                  />
               </div>

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
                           e.target.value
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
                        jornadaPrincipal?.tipo_trabajo_id?.toString() ??
                        undefined
                     }
                     onValueChange={(value) =>
                        actualizarJornada(
                           jornadaPrincipal.id,
                           "tipo_trabajo_id",
                           Number.parseInt(value)
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
               <div className="my-4 flex flex-wrap space-x-4  items-center min-h-[67px]">
                  <div className="flex items-center space-x-2 ">
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
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
                        {/* Lugar Segunda Jornada */}
                        <div className="">
                           <Label className="text-xs">
                              Lugar Segunda Jornada
                           </Label>
                           <Input
                              placeholder="Ej: Planta B, Almacén"
                              value={segundaJornada.lugar}
                              onChange={(e) =>
                                 actualizarJornada(
                                    segundaJornada.id,
                                    "lugar",
                                    e.target.value
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
                                    Number.parseInt(value)
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
            <div className="flex justify-between items-center pt-4 border-t">
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
                     className="flex items-center gap-2 border-blue-500 text-blue-600 hover:bg-blue-50 bg-transparent"
                     onClick={actualizarEstadoAsistencia}
                  >
                     <RefreshCw className="w-4 h-4" />
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
   );
};

export default JornadaCard;
