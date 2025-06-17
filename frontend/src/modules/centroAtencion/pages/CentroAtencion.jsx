import useCentroAtencion from "../hooks/useCentroAtencion";
import TablaTareas from "../components/TablaTareas";
import DetalleTarea from "../components/DetalleTarea";
import DatePicker from "react-datepicker";
import ModuloNavegacion from "@/shared/components/ModuloNavegacion";
import "react-datepicker/dist/react-datepicker.css";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Search, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const statusConfig = {
   Todas: {
      label: "Todas",
      color: "bg-gray-500",
   },
   Pendiente: {
      label: "Pendiente",
      color: "bg-yellow-500",
   },
   "En proceso": {
      label: "En proceso",
      color: "bg-blue-500",
   },
   Finalizada: {
      label: "Finalizada",
      color: "bg-green-500",
   },
   Cancelada: {
      label: "Cancelada",
      color: "bg-red-500",
   },
   Devuelta: {
      label: "Devuelta",
      color: "bg-orange-500",
   },
};

export default function CentroAtencion() {
   const {
      tareasFiltradas,
      paginaActual,
      totalPaginas,
      cambiarPagina,
      filtroEstado,
      cambiarFiltro,
      busqueda,
      setBusqueda,
      fechaFiltroInicio,
      setFechaFiltroInicio,
      fechaFiltroFin,
      setFechaFiltroFin,
      ordenarTareas,
      columnaOrdenada,
      orden,
      tareaSeleccionada,
      handleSeleccionarTarea,
      handleCerrarDetalle,
      user,
      acciones,
   } = useCentroAtencion();

   const hasActiveFilters =
      fechaFiltroInicio ||
      fechaFiltroFin ||
      filtroEstado !== "Todas" ||
      busqueda;

   const clearFilters = () => {
      setFechaFiltroInicio(undefined);
      setFechaFiltroFin(undefined);
      cambiarFiltro("Todas");
      setBusqueda("");
   };

   return (
      <div className="container min-h-full pb-16">
         <ModuloNavegacion />

         <div className="w-full max-w-7xl mx-auto px-4">
            <Card className="border-0  shadow-none  bg-white p-0 my-8">
               <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between mb-4">
                     <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                           placeholder="Buscar tarea, cliente o proyecto..."
                           value={busqueda}
                           onChange={(e) => setBusqueda(e.target.value)}
                           className="pl-10 border-gray-200 focus:border-[#073c64] focus:ring-[#073c64] h-10"
                        />
                     </div>
                     <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700 whitespace-nowrap hidden sm:block">
                           Rango de fechas:
                        </span>
                        <Popover>
                           <PopoverTrigger asChild>
                              <Button
                                 variant="outline"
                                 className={cn(
                                    "w-[280px] justify-start text-left font-normal border-gray-200 focus:ring-[#073c64] focus:border-[#073c64] h-10",
                                    !fechaFiltroInicio &&
                                       !fechaFiltroFin &&
                                       "text-muted-foreground"
                                 )}
                              >
                                 <CalendarIcon className="mr-2 h-4 w-4" />
                                 {fechaFiltroInicio ? (
                                    fechaFiltroFin ? (
                                       <>
                                          {format(
                                             fechaFiltroInicio,
                                             "dd/MM/yyyy",
                                             { locale: es }
                                          )}{" "}
                                          -{" "}
                                          {format(
                                             fechaFiltroFin,
                                             "dd/MM/yyyy",
                                             { locale: es }
                                          )}
                                       </>
                                    ) : (
                                       format(fechaFiltroInicio, "dd/MM/yyyy", {
                                          locale: es,
                                       })
                                    )
                                 ) : (
                                    <span>Seleccionar rango de fechas</span>
                                 )}
                              </Button>
                           </PopoverTrigger>
                           <PopoverContent className="w-auto p-0" align="end">
                              <Calendar
                                 initialFocus
                                 mode="range"
                                 defaultMonth={fechaFiltroInicio}
                                 selected={{
                                    from: fechaFiltroInicio,
                                    to: fechaFiltroFin,
                                 }}
                                 onSelect={(range) => {
                                    setFechaFiltroInicio(range?.from);
                                    setFechaFiltroFin(range?.to);
                                 }}
                                 numberOfMonths={1}
                                 locale={es}
                                 captionLayout="dropdown"
                              />
                           </PopoverContent>
                        </Popover>
                     </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 ">
                     <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700">
                           Estado:
                        </span>
                        <Select
                           value={filtroEstado}
                           onValueChange={(value) => cambiarFiltro(value)}
                        >
                           <SelectTrigger className="w-[160px] border-gray-200 focus:ring-[#073c64] focus:border-[#073c64] h-10">
                              <SelectValue placeholder="Seleccionar estado" />
                           </SelectTrigger>
                           <SelectContent>
                              {Object.entries(statusConfig).map(
                                 ([key, config]) => (
                                    <SelectItem key={key} value={key}>
                                       <div className="flex items-center gap-2">
                                          <span
                                             className={`w-2 h-2 rounded-full ${config.color}`}
                                          ></span>
                                          {config.label}
                                       </div>
                                    </SelectItem>
                                 )
                              )}
                           </SelectContent>
                        </Select>
                     </div>
                     {hasActiveFilters && (
                        <Button
                           variant="outline"
                           size="sm"
                           onClick={clearFilters}
                           className="text-gray-600 hover:text-gray-800 border-gray-200 h-10"
                        >
                           <X className="h-4 w-4 mr-1" />
                           Limpiar filtros
                        </Button>
                     )}
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Tabla de tareas */}
         <TablaTareas
            tareas={tareasFiltradas}
            ordenarTareas={ordenarTareas}
            columnaOrdenada={columnaOrdenada}
            orden={orden}
            onSeleccionarTarea={handleSeleccionarTarea}
         />

         {/* Modal de detalle */}
         {tareaSeleccionada && (
            <DetalleTarea
               tarea={tareaSeleccionada}
               onCerrar={handleCerrarDetalle}
               user={user}
               {...acciones}
            />
         )}

         {/* Paginación */}
         {totalPaginas > 1 && (
            <div className="pagination">
               {[...Array(totalPaginas)].map((_, index) => (
                  <button
                     key={index}
                     className={`page-button ${
                        paginaActual === index + 1 ? "active" : ""
                     }`}
                     onClick={() => cambiarPagina(index + 1)}
                  >
                     {index + 1}
                  </button>
               ))}
            </div>
         )}
      </div>
   );
}
