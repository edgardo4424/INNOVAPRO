"use client";

import { useState, useEffect } from "react";
import {
   AlertDialog,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
   CheckCircle,
   Circle,
   Bot,
   MessageCircle,
   Send,
   Loader2,
   AlertCircle,
   ExternalLink,
   BotMessageSquare,
   Clipboard,
   X,
   Zap,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/context/AuthContext";
import socket from "../services/socket";
import { QRCodeCanvas } from "qrcode.react";
import api from "../services/api";

export default function TelegramValidator() {
   const { user } = useAuth();

   const [isOpen, setIsOpen] = useState(true);

   //  EN QUE PÁSO SE ENCUENTRA EL PROCESO
   const [currentStep, setCurrentStep] = useState(1);

   //CUANDO ALGO SE ESTA CARGANDO
   const [isLoading, setIsLoading] = useState(false);

   const [success, setSuccess] = useState("");
   const [chatId, setChatId] = useState(null);
   const [enviado, setEnviado] = useState(false);
   const tipo = "produccion";
   const produccion = "innovaproBot";
   const developer = "innovaproDevBot";
   const telegramBotUrl = `https://t.me/${
      tipo === "produccion" ? produccion : developer
   }?start=${user.id}`;
   // notificacion_telegram_usuario_${usuarioId}
   // Es para la barra de progreso
   const steps = [
      {
         id: 1,
         title: "Instalar Telegram",
         description:
            "Asegúrate de tener Telegram instalado e iniciado sesión en tu dispositivo.",
         completed: currentStep > 1,
      },
      {
         id: 2,
         title: "Acceder al Bot",
         description: "Haz clic en el enlace para acceder al bot con tu ID",
         completed: chatId,
      },
      {
         id: 3,
         title: "Probar Notificaciones",
         description: "Envía un mensaje de prueba",
         completed: enviado,
      },
   ];

   const handleTestMessage = async () => {
      try {
         setIsLoading(true);
         await api.get(`/notificaciones/telegram/${chatId}`);
         setEnviado(true);
         setSuccess("¡Mensaje de prueba enviado exitosamente!");
      } catch (error) {
         console.error(error.message);
      } finally {
         setIsLoading(false);
      }
   };

   const cerrarModal = () => {
      setCurrentStep(1);
      setSuccess("");
      setIsOpen(false);
      if (chatId) {
         window.location.reload();
      }
   };
   useEffect(() => {
      if (!user) return;
      const canal = `notificacion_telegram_usuario_${user.id}`;
      socket.on(canal, (data) => {

         if (!data.succes) return;

         setChatId(data.succes);
         setCurrentStep(3);
         const storedUser = JSON.parse(localStorage.getItem("user"));
         storedUser.id_chat = data.succes;
         localStorage.setItem("user", JSON.stringify(storedUser));
      });
      return () => {
         socket.off(canal);
      };
   }, [user]);

   const copiarEnlace = async () => {
      await navigator.clipboard.writeText(telegramBotUrl);
   };
   const abrirEnlace = () => {
      window.open(telegramBotUrl, "_blank");
   };
   return (
      <AlertDialog
         open={isOpen}
         onOpenChange={setIsOpen}
         className="bg-amber-200 w-full "
      >
         <AlertDialogTrigger asChild>
            <div className="relative">
               <Button
                  className="relative bg-[#1b274a] hover:bg-[#1b274a]/90 text-white font-bold px-6 py-3 rounded-lg shadow-lg shadow-cyan-500/50  hover:shadow-cyan-400/70 transition-all duration-300 "
                  style={{
                     boxShadow:
                        "0 0 20px rgba(27, 39, 74, 0.5), inset 0 0 20px rgba(27, 39, 74, 0.1)",
                  }}
               >
                  <BotMessageSquare className="w-5 h-5 md:mr-2" />
                   <p className="hidden md:block">Vincular a Telegram</p>
                  <Zap className="w-4 h-4 ml-2 text-yellow-300 hidden md:block" />
               </Button>
               <div className="absolute -top-1 -right-1 flex">
                  <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
               </div>
            </div>
         </AlertDialogTrigger>
         <AlertDialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <AlertDialogHeader className="relative">
               <AlertDialogTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Configurar Notificaciones de Telegram
               </AlertDialogTitle>
               <AlertDialogDescription>
                  Conecta tu cuenta de Telegram al ERP para recibir alertas y
                  mensajes automáticos.
               </AlertDialogDescription>
               <Button
                  className="absolute -top-4 -right-4 md:-top-2 md:-right-1"
                  variant={"outline"}
                  size={"icon"}
                  onClick={cerrarModal}
               >
                  <X />
               </Button>
            </AlertDialogHeader>

            <div className="space-y-6">
               {/* Progress Steps */}
               <div className="space-y-3">
                  {steps.map((step) => (
                     <div key={step.id} className="flex items-center gap-3">
                        <div className="flex items-center justify-center">
                           {step.completed ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                           ) : currentStep === step.id ? (
                              <Circle className="h-5 w-5 text-blue-500 fill-blue-100" />
                           ) : (
                              <Circle className="h-5 w-5 text-gray-300" />
                           )}
                        </div>
                        <div className="flex-1">
                           <div className="flex items-center gap-2">
                              <span
                                 className={`font-medium ${
                                    step.completed
                                       ? "text-green-700"
                                       : currentStep === step.id
                                       ? "text-blue-700"
                                       : "text-gray-500"
                                 }`}
                              >
                                 Paso {step.id}: {step.title}
                              </span>
                              {step.completed && (
                                 <Badge variant="secondary">Completado</Badge>
                              )}
                              {currentStep === step.id && (
                                 <Badge variant="default">Actual</Badge>
                              )}
                           </div>
                        </div>
                     </div>
                  ))}
               </div>

               {/* Step Content */}
               <Card>
                  <CardHeader>
                     <CardTitle className="text-lg flex justify-between">
                        {currentStep === 1 && "Paso 1: Instalar telegram"}
                        {currentStep === 2 && "Paso 2: Acceder al Bot"}
                        {currentStep === 2 && (
                           <Badge variant="outline">
                              <Loader2 className="animate-spin text-blue-700" />
                              <p className="text-sm text-gray-600">
                                 Detectando registro...
                              </p>
                           </Badge>
                        )}
                        {currentStep === 3 && "Paso 3: Probar Notificaciones"}
                     </CardTitle>
                     <CardDescription>
                        {currentStep === 1 &&
                           "Primero asegúrate de tener Telegram instalado y abierto"}
                        {currentStep === 2 &&
                           "Accede al bot copiando o abriendo el enlace, o escaneando el QR"}
                     </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     {currentStep === 1 && (
                        <div className="space-y-4">
                           <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                              <p className="text-sm text-blue-800">
                                 <strong>Instrucciones:</strong>
                              </p>
                              <ol className="list-decimal list-inside text-sm text-blue-700 mt-2 space-y-1">
                                 <li>
                                    Instala Telegram en tu dispositivo si aún no
                                    lo tienes.
                                 </li>
                                 <li>
                                    Inicia sesión con tu cuenta de Telegram.
                                 </li>
                                 <li>
                                    Una vez hecho esto, continúa con el
                                    siguiente paso.
                                 </li>
                              </ol>
                           </div>
                           <Button
                              onClick={() => setCurrentStep(2)}
                              className="w-full bg-[#1b274a] hover:bg-[#1b274a]/90"
                           >
                              Ya tengo Telegram instalado
                           </Button>
                        </div>
                     )}

                     {currentStep === 2 && (
                        <div className="space-y-4">
                           <div className="p-4 bg-green-50 rounded-lg border border-green-200 ">
                              <div className="bg-white p-3 rounded border border-green-300 font-mono text-sm break-all relative">
                                 {telegramBotUrl}

                                 <div className="absolute top-1/2 -translate-y-1/2  right-2 flex gap-2">
                                    <Button
                                       variant={"outline"}
                                       size={"icon"}
                                       onClick={copiarEnlace}
                                    >
                                       <Clipboard />
                                    </Button>
                                    <Button
                                       variant={"outline"}
                                       size={"icon"}
                                       onClick={abrirEnlace}
                                    >
                                       <ExternalLink />
                                    </Button>
                                 </div>
                              </div>
                           </div>

                           <div className="flex justify-center">
                              <QRCodeCanvas
                                 value={telegramBotUrl}
                                 size={200}
                                 className="outline rounded-xl p-2"
                              />
                           </div>

                           <div className="flex gap-2">
                              <Button
                                 variant="outline"
                                 onClick={() => setCurrentStep(1)}
                                 className={"flex-1"}
                              >
                                 Anterior
                              </Button>
                              <Button className="flex-1  bg-[#1b274a] hover:bg-[#1b274a]">
                                 <Loader2 className="animate-spin " />
                                 <p className="text-sm ">
                                    Detectando registro...
                                 </p>
                              </Button>
                           </div>
                        </div>
                     )}

                     {currentStep === 3 && (
                        <div className="space-y-4">
                           <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                              <p className="text-sm text-green-800">
                                 <strong>¡Configuración completada!</strong>
                              </p>
                              <p className="text-sm text-green-700 mt-1">
                                 Has sido registrado exitosamente. Ahora puedes
                                 probar el envío de notificaciones.
                              </p>
                           </div>

                           {success && (
                              <Alert className="text-green-700">
                                 <CheckCircle className="h-4 w-4" />
                                 <AlertDescription>{success}</AlertDescription>
                              </Alert>
                           )}

                           <div className="flex gap-2">
                              <Button
                                 variant="outline"
                                 onClick={cerrarModal}
                                 className={"flex-1 outline"}
                              >
                                 Cerrar
                              </Button>
                              {!enviado && (
                                 <Button
                                    onClick={handleTestMessage}
                                    disabled={isLoading}
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                 >
                                    {isLoading ? (
                                       <>
                                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                          Enviando...
                                       </>
                                    ) : (
                                       <>
                                          <Send className="h-4 w-4 mr-2" />
                                          Enviar Mensaje de Prueba
                                       </>
                                    )}
                                 </Button>
                              )}
                           </div>
                        </div>
                     )}
                  </CardContent>
               </Card>
            </div>
         </AlertDialogContent>
      </AlertDialog>
   );
}
