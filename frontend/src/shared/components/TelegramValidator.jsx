"use client";

import { useState, useEffect } from "react";
import {
   AlertDialog,
   AlertDialogContent,
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
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/context/AuthContext";
import socket from "../services/socket";

export default function TelegramValidator() {
   const { user } = useAuth();

   const [isOpen, setIsOpen] = useState(false);

   //  EN QUE PÁSO SE ENCUENTRA EL PROCESO
   const [currentStep, setCurrentStep] = useState(1);

   //CUANDO ALGO SE ESTA CARGANDO
   const [isLoading, setIsLoading] = useState(false);

   const [success, setSuccess] = useState("");
   const [enviado, setEnviado] = useState(false);
   const [isListening, setIsListening] = useState(false);
   const [chatId, setChatId] = useState(null);

   const telegramBotUrl = `https://t.me/innovaproBot?start=${user.id}`;
   // notificacion_telegram_usuario_${usuarioId}
   // Es para la barra de progreso
   const steps = [
      {
         id: 1,
         title: "Abrir Telegram",
         description: "Abre la aplicación de Telegram en tu dispositivo",
         completed: currentStep > 1,
      },
      {
         id: 2,
         title: "Acceder al Bot",
         description: "Haz clic en el enlace para acceder al bot con tu ID",
         completed: currentStep > 2,
      },
      {
         id: 3,
         title: "Confirmar Registro",
         description: "Espera la confirmación del registro automático",
         completed: enviado,
      },
      {
         id: 4,
         title: "Probar Notificaciones",
         description: "Envía un mensaje de prueba",
         completed: false,
      },
   ];

   const handleOpenTelegram = () => {
      // Abrir el enlace de Telegram
      window.open(telegramBotUrl, "_blank");
      setCurrentStep(3);
      setIsListening(true);
      setSuccess("Enlace abierto. Esperando confirmación del registro...");

      //sLE SUCES CUANDO SE ENTRE EL SOCKET Y EL SETCHAT ID CAMBIA A UNO VALIDO

      // Esto tmabien es cundo el socket entre
   };

   const handleTestMessage = async () => {
      setIsLoading(true);

      setSuccess("¡Mensaje de prueba enviado exitosamente!");

      //FINALY:
      setIsLoading(false);
   };

   const resetDialog = () => {
      setCurrentStep(1);
      setSuccess("");
      setEnviado(false);
      setIsListening(false);
   };
   useEffect(() => {
      if (!user) return;      
      const canal = `notificacion_telegram_usuario_${user.id}`;
      console.log('el acanal es ',canal);
      
      socket.on(canal, (data) => {
         console.log("data del socket", data);

         if (!data?.success) return;
         setChatId(data.success);
         setSuccess(
            "¡Registro completado exitosamente! Ahora puedes probar las notificaciones."
         );
         setEnviado(true);
      });
      return () => {
         socket.off(canal);
      };
   }, [user]);

   useEffect(() => {
      console.log(chatId);
   }, [chatId]);

   return (
      <AlertDialog
         open={isOpen}
         onOpenChange={setIsOpen}
         className="bg-amber-200 w-full "
      >
         <AlertDialogTrigger asChild>
            <Button
               variant="outline"
               className="gap-2 bg-transparent w-full my-1"
            >
               <Bot className="h-4 w-4" />
               Configurar las notificaciones por telegram
            </Button>
         </AlertDialogTrigger>
         <AlertDialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <AlertDialogHeader>
               <AlertDialogTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Configurar Notificaciones de Telegram
               </AlertDialogTitle>
            </AlertDialogHeader>

            <div className="space-y-6">
               {/* Progress Steps */}
               <div className="space-y-3 bg-amber-100/30">
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
                              {step.id === 3 && isListening && (
                                 <Badge
                                    variant="outline"
                                    className="animate-pulse"
                                 >
                                    Escuchando...
                                 </Badge>
                              )}
                           </div>
                           <p className="text-sm text-gray-600">
                              {step.description}
                           </p>
                        </div>
                     </div>
                  ))}
               </div>

               {/* Step Content */}
               <Card>
                  <CardHeader>
                     <CardTitle className="text-lg">
                        {currentStep === 1 && "Paso 1: Abrir Telegram"}
                        {currentStep === 2 && "Paso 2: Acceder al Bot"}
                        {currentStep === 3 && "Paso 3: Confirmar Registro"}
                        {currentStep === 4 && "Paso 4: Probar Notificaciones"}
                     </CardTitle>
                     <CardDescription>
                        {currentStep === 1 &&
                           "Primero asegúrate de tener Telegram instalado y abierto"}
                        {currentStep === 2 &&
                           "Usa el enlace personalizado con tu ID para acceder al bot"}
                        {currentStep === 3 &&
                           "El sistema detectará automáticamente tu registro"}
                        {currentStep === 4 &&
                           "Envía un mensaje de prueba para verificar la configuración"}
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
                                    Asegúrate de tener Telegram instalado en tu
                                    dispositivo
                                 </li>
                                 <li>Abre la aplicación de Telegram</li>
                                 <li>
                                    Una vez abierto, continúa al siguiente paso
                                 </li>
                              </ol>
                           </div>
                           <Button
                              onClick={() => setCurrentStep(2)}
                              className="w-full"
                           >
                              Ya tengo Telegram abierto
                           </Button>
                        </div>
                     )}

                     {currentStep === 2 && (
                        <div className="space-y-4">
                           <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                              <p className="text-sm text-green-800 mb-3">
                                 <strong>Tu enlace personalizado:</strong>
                              </p>
                              <div className="bg-white p-3 rounded border border-green-300 font-mono text-sm break-all">
                                 {telegramBotUrl}
                              </div>
                           </div>

                           <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                              <p className="text-sm text-yellow-800">
                                 <strong>¿Qué pasará?</strong>
                              </p>
                              <ul className="list-disc list-inside text-sm text-yellow-700 mt-2 space-y-1">
                                 <li>
                                    Se abrirá Telegram con el bot innovaproBot
                                 </li>
                                 <li>
                                    El bot te reconocerá automáticamente por tu
                                    ID
                                 </li>
                                 <li>
                                    Se iniciará la conversación automáticamente
                                 </li>
                              </ul>
                           </div>

                           <div className="flex gap-2">
                              <Button
                                 variant="outline"
                                 onClick={() => setCurrentStep(1)}
                              >
                                 Anterior
                              </Button>
                              <Button
                                 onClick={handleOpenTelegram}
                                 className="flex-1 gap-2"
                              >
                                 <ExternalLink className="h-4 w-4" />
                                 Abrir Bot de Telegram
                              </Button>
                           </div>
                        </div>
                     )}

                     {currentStep === 3 && (
                        <div className="space-y-4">
                           <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                              <p className="text-sm text-purple-800">
                                 <strong>Esperando confirmación...</strong>
                              </p>
                              <p className="text-sm text-purple-700 mt-1">
                                 {!chatId
                                    ? "El sistema está detectando tu registro automáticamente. Esto puede tomar unos segundos..."
                                    : "Registro completado exitosamente."}
                              </p>
                           </div>

                           {!chatId && (
                              <div className="flex items-center justify-center p-8">
                                 <div className="flex flex-col items-center gap-4">
                                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                                    <p className="text-sm text-gray-600">
                                       Detectando registro...
                                    </p>
                                 </div>
                              </div>
                           )}

                           {success && (
                              <Alert>
                                 <CheckCircle className="h-4 w-4" />
                                 <AlertDescription>{success}</AlertDescription>
                              </Alert>
                           )}
                        </div>
                     )}

                     {currentStep === 4 && (
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
                              <Alert>
                                 <CheckCircle className="h-4 w-4" />
                                 <AlertDescription>{success}</AlertDescription>
                              </Alert>
                           )}

                           <div className="flex gap-2">
                              <Button variant="outline" onClick={resetDialog}>
                                 Reconfigurar
                              </Button>
                              <Button
                                 onClick={handleTestMessage}
                                 disabled={isLoading}
                                 className="flex-1"
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
                           </div>
                        </div>
                     )}
                  </CardContent>
               </Card>

               <div className="flex justify-end">
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                     Cerrar
                  </Button>
               </div>
            </div>
         </AlertDialogContent>
      </AlertDialog>
   );
}
