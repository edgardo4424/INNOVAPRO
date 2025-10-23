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
  FileText,
  Hand,
  MapPin,
  RotateCcw,
  Unlock,
  User,
  Warehouse,
  Wrench,
  X,
} from "lucide-react";
import { Fragment, useEffect, useRef, useState } from "react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "react-toastify";
import { DetallesEspecificos } from "./DetallesEspecificos";
import DespieceOT from "./despiece-ot/DespieceOT";
import ImportadorDespiece from "./despiece-ot/ImportadorDespiece";
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
}) {
  const [mostrarDespiece, setMostrarDespiece] = useState(false);
  const [respuestas, setRespuestas] = useState(null);
  const despieceRef = useRef(null);
  const [formData, setFormData] = useState({
    despiece: [],
    ResumenDespiece: {},
  });
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const puedeGenerarDespiece =
    (user?.rol === "Jefe de OT" || user?.rol === "OT") &&
    tarea?.estado === "En proceso" &&
    tarea?.tipoTarea === "Apoyo Técnico" &&
    tarea?.detalles?.apoyoTecnico?.includes("Despiece");

  // ✅ se ejecuta solo cuando cambia `tarea.respuestas`
  useEffect(() => {
    if (tarea?.respuestas) {
      try {
        const re = JSON.parse(tarea.respuestas);
        setRespuestas(re);
      } catch (error) {
        console.warn("Error al parsear respuestas:", error);
        setRespuestas([]);
      }
    } else {
      setRespuestas([]);
    }
  }, [tarea?.respuestas]);

  return (
    <div className="centro-modal">
      <article className="flex h-auto max-h-[90vh] w-full max-w-4xl flex-col rounded-lg bg-white p-0">
        <section className="relative rounded-t-lg bg-[#061a5b] bg-gradient-to-r p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-2xl font-bold">
              <FileText className="h-6 w-6" />
              Detalles de la Tarea{" "}
              {tarea?.tipoTarea ? `- ( ${tarea?.tipoTarea} )` : ""}
            </div>
          </div>
          <Button
            variant={"outline"}
            size={"icon"}
            onClick={onCerrar}
            className={
              "absolute top-1/2 right-2 -translate-y-1/2 text-neutral-700 sm:right-8"
            }
          >
            <X />
          </Button>
        </section>

        <div className="flex-1 space-y-6 overflow-y-auto rounded-b-lg bg-white p-6">
          {/* Información Principal */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="gap-0 border-l-4 border-l-[#061a5b]">
              <CardHeader className="">
                <CardTitle className="flex items-center gap-2 text-lg text-[#061a5b]">
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
                    {tarea?.cliente?.razon_social}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Obra:
                  </span>
                  <p className="font-semibold text-gray-900">
                    {tarea?.obra?.nombre}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="gap-0 border-l-4 border-l-green-500/80">
              <CardHeader className="">
                <CardTitle className="flex items-center gap-2 text-lg text-green-700/80">
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
                    {tarea?.ubicacion}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Comercial:
                  </span>
                  <p className="flex items-center gap-2 font-semibold text-gray-900">
                    <User className="h-4 w-4" />
                    {tarea?.usuario_solicitante?.nombre || "Desconocido"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Información de la Tarea */}
          <Card className="gap-2 border-l-4 border-l-orange-500/80">
            <CardHeader className="">
              <CardTitle className="flex items-center gap-2 text-lg text-orange-700/80">
                <Wrench className="h-5 w-5" />
                Información de la Tarea
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <span className="text-sm font-medium text-gray-600">
                    Tarea:
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-orange-100 text-orange-800/80"
                  >
                    {tarea?.tipoTarea}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium text-gray-600">
                    Fecha Creación:
                  </span>
                  <p className="flex items-center gap-2 font-semibold text-gray-900">
                    <Calendar className="h-4 w-4" />
                    {new Date(tarea?.fecha_creacion).toLocaleDateString(
                      "es-PE",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      },
                    )}
                  </p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium text-gray-600">
                    Hora:
                  </span>
                  <p className="flex items-center gap-2 font-semibold text-gray-900">
                    <Clock className="h-4 w-4" />
                    {new Date(tarea?.fecha_creacion).toLocaleTimeString(
                      "es-PE",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      },
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detalles Específicos */}
          <DetallesEspecificos
            detalles={{
              ...tarea?.detalles,
              atributos_valor_zonas: tarea?.atributos_valor_zonas,
            }}
            motivoDevolucion={tarea?.motivoDevolucion}
          />

          {respuestas && respuestas.length > 0 && (
            <div className="space-y-6">
              {respuestas.map((respuesta, index) => (
                <Fragment key={respuesta?.id || index}>
                  {index > 0 && <Separator className="my-6" />}

                  <div className="rounded-xl border border-yellow-300 bg-yellow-50 p-4 shadow-md transition-shadow hover:shadow-lg">
                    <div className="mb-3 flex flex-col gap-2 border-b border-yellow-200 pb-2">
                      <div className="flex items-center gap-2">
                        <ClipboardX className="h-5 w-5 flex-shrink-0 text-yellow-600" />{" "}
                        <span className="text-lg font-semibold text-yellow-800">
                          Motivo {respuesta?.motivo}
                        </span>
                      </div>

                      {/* Metadata (Usuario y Fecha) */}
                      <div className="flex space-x-4 text-sm text-yellow-700">
                        <span className="font-medium">Respondido por: </span>
                        <span className="font-semibold">
                          {respuesta?.user_name}
                        </span>
                        <span className="ml-4 font-medium">Fecha: </span>
                        <span className="font-semibold">
                          {new Intl.DateTimeFormat("es-PE", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          }).format(new Date(respuesta?.fecha)) || "-"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="rounded-lg border border-yellow-200 bg-yellow-100 p-3 font-mono text-sm leading-relaxed whitespace-pre-wrap text-yellow-900">
                        {respuesta?.mensaje}
                      </p>
                    </div>
                  </div>
                </Fragment>
              ))}
            </div>
          )}

          {/* Sección Despiece */}
          {mostrarDespiece ? (
            <>
              <div ref={despieceRef}>
                <ImportadorDespiece
                  tarea={tarea}
                  formData={formData}
                  setFormData={setFormData}
                />
                <DespieceOT
                  tarea={tarea}
                  formData={formData}
                  setFormData={setFormData}
                  onDespieceCreado={() => setMostrarDespiece(false)}
                />
              </div>
            </>
          ) : null}

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
                  <AlertDialogDescription>
                    Confirma que los datos son correctos antes de enviar el
                    despiece al sistema.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="mt-4 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setMostrarConfirmacion(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={async () => {
                      try {
                        const payload = {
                          idTarea: tarea?.id,
                          despiece: formData.despiece.map((p) => ({
                            pieza_id: p.pieza_id,
                            cantidad: p.cantidad,
                            peso_kg: p.peso_kg,
                            precio_venta_dolares: p.precio_venta_dolares,
                            precio_venta_soles: p.precio_venta_soles,
                            precio_alquiler_soles: p.precio_alquiler_soles,
                          })),
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
        <section className="grid flex-shrink-0 grid-cols-2 gap-3 rounded-b-lg border-t bg-gray-50 px-6 py-4 sm:grid-cols-3 md:grid-cols-5">
          {(user.rol === "Jefe de OT" || user.rol === "OT") && (
            <>
              {tarea?.estado === "Pendiente" && !tarea?.asignadoA && (
                <Button
                  variant="outline"
                  className="flex-1 cursor-pointer gap-2 border-gray-400 text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                  onClick={handleTomarTarea}
                >
                  <Hand className="h-4 w-4" />
                  Tomar
                </Button>
              )}

              {tarea?.asignadoA === user.id &&
                tarea?.estado === "En proceso" && (
                  <>
                    <Button
                      variant="outline"
                      className="flex-1 cursor-pointer gap-2 border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                      onClick={handleLiberarTarea}
                    >
                      <Unlock className="h-4 w-4" />
                      LIBERAR
                    </Button>

                    <Button
                      className="flex-1 cursor-pointer gap-2 bg-[#061a5b] text-white hover:bg-[#061a5b]/80"
                      onClick={handleFinalizarTarea}
                    >
                      <Check className="h-4 w-4" />
                      FINALIZAR
                    </Button>

                    <Button
                      className="flex-1 cursor-pointer gap-2 bg-[#065b16] text-white hover:bg-[#065b16]/80"
                      onClick={handleFinalizarTarea}
                    >
                      <Warehouse className="h-4 w-4" />
                      VALIDAR STOCK
                    </Button>

                    <Button
                      className="flex-1 cursor-pointer gap-2 bg-amber-500 text-white hover:bg-amber-500/80"
                      onClick={handleDevolverTarea}
                    >
                      <RotateCcw className="h-4 w-4" />
                      DEVOLVER
                    </Button>

                    <Button
                      variant="destructive"
                      className="flex-1 cursor-pointer gap-2 bg-red-500 text-white hover:bg-red-500/80"
                      onClick={handleCancelarTarea}
                    >
                      <X className="h-4 w-4" />
                      ANULAR
                    </Button>
                  </>
                )}
            </>
          )}

          {user.rol === "Técnico Comercial" &&
            tarea?.estado === "Devuelta" &&
            tarea?.usuario_solicitante?.id === user.id && (
              <Button
                onClick={handleCorregirTarea}
                className="flex-1 gap-2 bg-red-500 text-white hover:bg-red-500/80"
              >
                Corregir Tarea
              </Button>
            )}

          {puedeGenerarDespiece && (
            <Button
              onClick={() => {
                setMostrarDespiece(true);
                setTimeout(() => {
                  despieceRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }, 100);
              }}
              className="flex-1 gap-2 bg-red-500 text-white hover:bg-red-500/80"
            >
              Generar Despiece
            </Button>
          )}
        </section>
      </article>
    </div>
  );
}
