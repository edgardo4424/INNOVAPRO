import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotificaciones } from "@/context/NotificacionesContext";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

import {
   AlertCircle,
   AlertTriangle,
   Bell,
   CheckCircle,
   ClipboardList,
   Info,
   Monitor,
   Settings,
   User,
   X,
} from "lucide-react";
import api from "../services/api";

export default function Notificaciones () {
   const { notificaciones, setNotificaciones } = useNotificaciones();

   const unreadCount = notificaciones.filter((n) => !n.leida).length;

   function obtenerIconoPorTipo(tipo) {
      switch (tipo) {
         case "error":
            return <AlertCircle className="text-red-500 h-4 w-4" />;
         case "info":
            return <Info className="text-blue-500  h-4 w-4" />;
         case "tarea":
            return <ClipboardList className="text-yellow-500  h-4 w-4" />;
         case "exito":
            return <CheckCircle className="text-green-500  h-4 w-4" />;
         case "advertencia":
            return <AlertTriangle className="text-orange-500  h-4 w-4" />;
         case "sistema":
            return <Monitor className="text-gray-500  h-4 w-4" />;
         case "cliente":
            return <User className="text-indigo-500  h-4 w-4" />;
         case "admin":
            return <Settings className="text-purple-500  h-4 w-4" />;
         default:
            return <Bell className="text-gray-400  h-4 w-4" />;
      }
   }

   async function marcarComoLeida(id) {
      try {
         await api.put(`/notificaciones/${id}/leida`);
         setNotificaciones(
            notificaciones.map((n) => (n.id === id ? { ...n, leida: 1 } : n))
         );
      } catch (error) {
         console.error("❌ Error al marcar como leída:", error);
      }
   }

   const marcarTodasComoLeidas = async () => {
      for (const notificacion of notificaciones) {
         if (notificacion.leida == 0) {
            await api.put(`/notificaciones/${notificacion.id}/leida`);
            console.log(notificacion.mensaje);
            
         }
      }
       setNotificaciones(notificaciones.map((n) => ({ ...n, leida: 1 })));
   };

   const elimiarNotificacion = (id) => {
      console.log("Funcion para eliminar la notificaion");
      setNotificaciones(notificaciones.filter((n) => n.id != id));
   };

   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild>
            <Button
               variant={"outline"}
               size={"icon"}
               className="rounded-full relative"
            >
               <Bell />
               {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white">
                     {unreadCount}
                  </Badge>
               )}
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent
            align="end"
            className="max-h-[400px] overflow-y-auto p-0 w-96"
         >
            <div className="flex flex-row items-center justify-between p-3">
               <p className="text-sm font-medium">Notificaciones</p>
               {unreadCount > 0 && (
                  <Button
                     variant="ghost"
                     size="sm"
                     className="h-8 text-xs"
                     onClick={marcarTodasComoLeidas}
                  >
                     Marcar todas como leídas
                  </Button>
               )}
            </div>

            {notificaciones.length > 0 ? (
               <div className="divide-y ">
                  {notificaciones.map((notification) => (
                     <div
                        key={notification.id}
                        //si la notificacion esta definidad como no leida(false)
                        //entonces sera color bg-muted/30 que la define shadcn como un blanco pastel a solo el 30%
                        //cuando se hace hoverapsa a 50%
                        className={cn(
                           "flex items-start gap-3 p-3 transition-colors",
                           "hover:bg-gray-200/80 dark:hover:bg-white/10",
                           !notification.leida
                              ? "bg-gray-100 dark:bg-[#957f7f21]"
                              : "bg-white dark:bg-transparent"
                        )}
                     >
                        <div className="mt-1">
                           {obtenerIconoPorTipo(notification.tipo)}
                        </div>
                        <div className="flex-1 space-y-1">
                           <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">
                                 {notification.mensaje}
                              </p>
                              <Button
                                 variant="ghost"
                                 size="icon"
                                 className="h-6 w-6"
                                 onClick={() =>
                                    elimiarNotificacion(notification.id)
                                 }
                              >
                                 <X className="h-3 w-3" />
                                 <span className="sr-only">Cerrar</span>
                              </Button>
                           </div>
                           <div className="flex items-center justify-between">
                              <p className="text-xs text-muted-foreground">
                                 {formatDistanceToNow(notification.createdAt, {
                                    addSuffix: true,
                                    locale: es,
                                 })}
                              </p>
                              {!notification.leida && (
                                 <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 text-xs"
                                    onClick={() =>
                                       marcarComoLeida(notification.id)
                                    }
                                 >
                                    Marcar como leída
                                 </Button>
                              )}
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            ) : (
               <p className="py-6 text-center text-sm text-muted-foreground">
                  No tienes notificaciones
               </p>
            )}
         </DropdownMenuContent>
      </DropdownMenu>
   );
};
