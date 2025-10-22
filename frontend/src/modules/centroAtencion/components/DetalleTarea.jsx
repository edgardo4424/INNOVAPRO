import React, { useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
   Building2,
   Calendar,
   Check,
   ClipboardX,
   Clock,
   Edit,
   FileText,
   Hand,
   MapPin,
   RotateCcw,
   Unlock,
   User,
   Wrench,
   X,
} from "lucide-react";

import { DetallesEspecificos } from "./DetallesEspecificos";
import ImportadorDespiece from "./despiece-ot/ImportadorDespiece";
import DespieceOT from "./despiece-ot/DespieceOT";
import DespieceAdicional from "./despiece-ot/DespieceAdicional";
import ResumenDespiece from "@/modules/cotizaciones/components/pasos/paso-confirmacion/ResumenDespiece";
import { toast } from "react-toastify";
import { crearDespieceOT } from "../services/centroAtencionService";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";


export default function DetalleTarea({
   tarea,
   onCerrar,
   user,
   handleTomarTarea,
   handleLiberarTarea,
   handleFinalizarTarea,
   handleDevolverTarea,
   handleCancelarTarea,
   handleCorregirTarea,
}) 
{
   const [mostrarDespiece, setMostrarDespiece] = useState(false);
   const despieceRef = useRef(null);
   const [formData, setFormData] = useState({
      despiece: [],
      ResumenDespiece: {}
   })
   const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);


   const puedeGenerarDespiece =
    (user?.rol === "Jefe de OT"|| user?.rol === "OT" ) &&
    tarea.estado === "En proceso" &&
    tarea.tipoTarea === "Apoyo Técnico" &&
    tarea.detalles?.apoyoTecnico?.includes("Despiece");

   return (
      <div className="centro-modal">
         <article className="max-w-4xl w-full max-h-[90vh] h-auto flex flex-col p-0  bg-white rounded-lg ">
            <section className="bg-gradient-to-r bg-[#061a5b] text-white p-6 rounded-t-lg relative">
               <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold flex items-center gap-2">
                     <FileText className="h-6 w-6" />
                     Detalles de la Tarea
                  </div>
               </div>
               <Button
                  variant={"outline"}
                  size={"icon"}
                  onClick={onCerrar}
                  className={
                     "absolute top-1/2 -translate-y-1/2 right-2 sm:right-8  text-neutral-700"
                  }
               >
                  <X />
               </Button>
            </section>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white rounded-b-lg">
               {/* Información Principal */}
               <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border-l-4 border-l-[#061a5b] gap-0">
                     <CardHeader className="">
                        <CardTitle className="text-lg flex items-center gap-2 text-[#061a5b]">
                           <Building2 className="h-5 w-5" />
                           Información del Cliente
                        </CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-3">
                        <div>
                           <span className="text-sm font-medium text-gray-600">
                              Cliente:
                           </span>
                           <p className="font-semibold text-gray-900">
                              {tarea.cliente?.razon_social}
                           </p>
                        </div>
                        <div>
                           <span className="text-sm font-medium text-gray-600">
                              Obra:
                           </span>
                           <p className="font-semibold text-gray-900">
                              {tarea.obra?.nombre}
                           </p>
                        </div>
                     </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-green-500/80 gap-0">
                     <CardHeader className="">
                        <CardTitle className="text-lg flex items-center gap-2 text-green-700/80">
                           <MapPin className="h-5 w-5" />
                           Ubicación y Contacto
                        </CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-3">
                        <div>
                           <span className="text-sm font-medium text-gray-600">
                              Ubicación:
                           </span>
                           <p className="font-semibold text-gray-900">
                              {tarea.ubicacion}
                           </p>
                        </div>
                        <div>
                           <span className="text-sm font-medium text-gray-600">
                              Comercial:
                           </span>
                           <p className="font-semibold text-gray-900 flex items-center gap-2">
                              <User className="h-4 w-4" />
                              {tarea.usuario_solicitante?.nombre ||
                                 "Desconocido"}
                           </p>
                        </div>
                     </CardContent>
                  </Card>
               </div>

               {/* Información de la Tarea */}
               <Card className="border-l-4 border-l-orange-500/80 gap-2">
                  <CardHeader className="">
                     <CardTitle className="text-lg flex items-center gap-2 text-orange-700/80">
                        <Wrench className="h-5 w-5" />
                        Información de la Tarea
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                           <span className="text-sm font-medium text-gray-600">
                              Tarea:
                           </span>
                           <Badge
                              variant="secondary"
                              className="bg-orange-100 text-orange-800/80"
                           >
                              {tarea.tipoTarea}
                           </Badge>
                        </div>
                        <div className="space-y-2">
                           <span className="text-sm font-medium text-gray-600">
                              Fecha Creación:
                           </span>
                           <p className="font-semibold text-gray-900 flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {new Date(
                                 tarea.fecha_creacion
                              ).toLocaleDateString("es-PE", {
                                 day: "2-digit",
                                 month: "long",
                                 year: "numeric",
                              })}
                           </p>
                        </div>
                        <div className="space-y-2">
                           <span className="text-sm font-medium text-gray-600">
                              Hora:
                           </span>
                           <p className="font-semibold text-gray-900 flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {new Date(
                                 tarea.fecha_creacion
                              ).toLocaleTimeString("es-PE", {
                                 hour: "2-digit",
                                 minute: "2-digit",
                                 hour12: true,
                              })}
                           </p>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               {/* Detalles Específicos */}
               <DetallesEspecificos
                  detalles={{
                     ...tarea.detalles,
                     atributos_valor_zonas: tarea.atributos_valor_zonas
                  }}
                  motivoDevolucion={tarea.motivoDevolucion}
               />
               {tarea.motivoDevolucion && (
                  <>
                     <Separator className="my-6" />
                     <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                           <ClipboardX className="h-4 w-4 text-yellow-600" />
                           <span className="font-medium text-yellow-800">
                              Motivo de Devolución:
                           </span>
                        </div>
                        <p className="text-yellow-900 font-mono text-sm bg-yellow-100 p-2 rounded">
                           {tarea.motivoDevolucion}
                        </p>
                     </div>
                  </>
               )}
               {tarea.correccionComercial && (
                  <>
                     <Separator className="my-6" />
                     <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                           <Edit className="h-4 w-4 text-yellow-600" />
                           <span className="font-medium text-yellow-800">
                              Corrección de comercial
                           </span>
                        </div>
                        <p className="text-yellow-900 font-mono text-sm bg-yellow-100 p-2 rounded">
                           {tarea.correccionComercial}
                        </p>
                     </div>
                  </>
               )}

                {/* Sección Despiece */}
               {mostrarDespiece && (
               <>
               <div ref={despieceRef}>
                  <ImportadorDespiece tarea={tarea} formData={formData} setFormData={setFormData} />
                  <DespieceOT tarea={tarea} formData={formData} setFormData={setFormData} onDespieceCreado={() => setMostrarDespiece(false)}/>
               </div>
               </>
               )}

               {formData.despiece.length > 0 && (
                  <div className="mt-4 flex justify-end">
                     <Button
                        className="bg-green-600 text-white"
                        onClick={() => setMostrarConfirmacion(true)}
                     >
                        Guardar Despiece
                     </Button>
                  </div>
                  )}

               {mostrarConfirmacion && (
               <AlertDialog open={true} onOpenChange={setMostrarConfirmacion}>
                  <AlertDialogContent>
                     <AlertDialogHeader>
                     <AlertDialogTitle>¿Guardar despiece?</AlertDialogTitle>
                     <AlertDialogDescription>Confirma que los datos son correctos antes de enviar el despiece al sistema.</AlertDialogDescription>
                     </AlertDialogHeader>
                     <div className="flex justify-end gap-2 mt-4">
                     <Button variant="outline" onClick={() => setMostrarConfirmacion(false)}>
                        Cancelar
                     </Button>
                     <Button
                        onClick={async () => {
                           try {
                              console.log("Guardando despiece:", formData.despiece);
                           const payload = {
                              idTarea: tarea.id,
                              despiece: formData.despiece.map(p => ({
                                 pieza_id: p.pieza_id,
                                 item: p.item,
                                 cantidad: p.cantidad,
                                 peso_kg: p.peso_kg,
                                 precio_venta_dolares: p.precio_venta_dolares,
                                 precio_venta_soles: p.precio_venta_soles,
                                 precio_alquiler_soles: p.precio_alquiler_soles,
                              }))
                           };
                           const response = await crearDespieceOT(payload);
                           toast.success("Despiece guardado correctamente");
                           setMostrarConfirmacion(false);
                           setFormData({ despiece: [], resumenDespiece: {} });
                           setMostrarDespiece(false);
                           } catch (error) {
                           console.error("Error al guardar despiece:", error);
                           toast.error("Error al guardar el despiece");
                           }
                        }}
                        className="bg-green-600 text-white"
                     >
                        Confirmar y guardar
                     </Button>
                     </div>
                  </AlertDialogContent>
               </AlertDialog>
               )}

            </div>
            
            {/* Footer - Acciones */}
            <section className="px-6 py-4 bg-gray-50 border-t grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 rounded-b-lg flex-shrink-0">
               {(user.rol === "Jefe de OT"||user.rol === "OT")  && (
                  <>
                     {tarea.estado === "Pendiente" && !tarea.asignadoA && (
                        <Button
                           variant="outline"
                           className="flex-1 gap-2 border-gray-400 text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                           onClick={handleTomarTarea}
                        >
                           <Hand className="h-4 w-4" />
                           Tomar
                        </Button>
                     )}

                     {tarea.asignadoA === user.id &&
                        tarea.estado === "En proceso" && (
                           <>
                              <Button
                                 variant="outline"
                                 className="flex-1 gap-2 border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                                 onClick={handleLiberarTarea}
                              >
                                 <Unlock className="h-4 w-4" />
                                 LIBERAR
                              </Button>

                              <Button
                                 className="flex-1 gap-2 bg-[#061a5b] hover:bg-[#061a5b]/80 text-white"
                                 onClick={handleFinalizarTarea}
                              >
                                 <Check className="h-4 w-4" />
                                 FINALIZAR
                              </Button>

                              <Button
                                 className="flex-1 gap-2 bg-amber-500 hover:bg-amber-500/80 text-white "
                                 onClick={handleDevolverTarea}
                              >
                                 <RotateCcw className="h-4 w-4" />
                                 DEVOLVER
                              </Button>

                              <Button
                                 variant="destructive"
                                 className="flex-1 gap-2 bg-red-500 hover:bg-red-500/80 text-white"
                                 onClick={handleCancelarTarea}
                              >
                                 <X className="h-4 w-4" />
                                 ANULAR
                              </Button>
                           </>
                        )}
                  </>
               )}

               {user.rol === "Ventas" &&
                  tarea.estado === "Devuelta" &&
                  tarea.usuario_solicitante?.id === user.id && (
                     <Button
                        onClick={handleCorregirTarea}
                        className="flex-1 gap-2 bg-red-500 hover:bg-red-500/80 text-white"
                     >
                        Corregir Tarea
                     </Button>
                  )}
               
               {puedeGenerarDespiece && (
                  <Button 
                     onClick={() => {
                        setMostrarDespiece(true)
                        setTimeout(() => {
                           despieceRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }, 100);
                     }}
                     className="flex-1 gap-2 bg-red-500 hover:bg-red-500/80 text-white"
                  >
                     Generar Despiece
                  </Button>
                  )}

            </section>
         </article>
      </div>
   );
}
