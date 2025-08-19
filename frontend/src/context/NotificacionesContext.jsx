// Este archivo se encarga de escuchar las notificaciones en tiempo real para el usuario autenticado.
// Funciona con WebSockets (Socket.IO) y actualiza el estado notificaciones globalmente.

import { createContext, useContext, useEffect, useState } from "react";
import api from "../shared/services/api";
import { useAuth } from "./AuthContext";
import socket, {
   conectarSocket,
   desconectarSocket,
} from "@/shared/services/socket";
("../shared/services/socket");
import { tiposValidos } from "../config"; // Importamos los tipos de notificaciones válidos

const NotificacionesContext = createContext();

export const useNotificaciones = () => useContext(NotificacionesContext);

export const NotificacionesProvider = ({ children }) => {
   const { user } = useAuth(); // Obtener usuario autenticado
   const [notificaciones, setNotificaciones] = useState([]);

   useEffect(() => {
      if (!user) {
         // Si no hay usuario, cerramos cualquier conexión existente
         desconectarSocket();
         return;
      }
      try {
         conectarSocket();
      } catch (error) {
         console.warn("⚠️ No se pudo conectar al backend de sockets");
      }

      // Apenas se monta el componente, obtenemos las notificaciones del usuario

      async function fetchNotificaciones() {
         try {
            const res = await api.get("/notificaciones");
            setNotificaciones(res.data.notificaciones);
         } catch (error) {
            console.error("❌ Error al obtener notificaciones:", error);
         }
      }

      fetchNotificaciones();

      // Nos suscribimos a tres canales:
      const canal = `notificacion_usuario_${user.id}`; // Nuevas notificaciones
      const canalLeida = `notificacion_leida_usuario_${user.id}`; // Notificaciones leídas
      const canalTelegram = `notificacion_telegram_usuario_${user.id}`; // Notificaciones de Telegram

      // Evento cuando llega una nueva notificación
      socket.on(canal, (data) => {
         // Validar estructura mínima
         if (!data?.id || !data?.mensaje || !data?.tipo) return;
         if (!tiposValidos.includes(data.tipo)) return;

         // Si la notificación cumple la estructura, verificamos que no exista
         // Si no existe la guardamos en el estado
         setNotificaciones((prev) => {
            if (prev.some((notificacion) => notificacion.id === data.id))
               return prev;
            return [data, ...prev];
         });
      });

      // Evento cuando una notificación es marcada como leída
      socket.on(canalLeida, ({ id }) => {
         // Si tratamos de "leer" una notificación inexistente
         if (!id) return; // No hacemos nada
         // Cuando marcas una notificación como leída, simplemente la sacamos del array del estado
         setNotificaciones((prev) =>
            prev.filter((notificacion) => notificacion.id !== id)
         ); //
      });

      // Canal para recibir las notificaciones de Telegram
      socket.on(canalTelegram, (data) => {
         console.log("data", data); // Por ahora solo mostramos por consola lo que se emite por este canal
      });

      // Apagamos los canales cuando el usuario cambia
      return () => {
         socket.off(canal);
         socket.off(canalLeida);
         socket.off(canalTelegram);
         desconectarSocket();
      };
   }, [user]);

   return (
      <NotificacionesContext.Provider
         value={{ notificaciones, setNotificaciones }}
      >
         {children}
      </NotificacionesContext.Provider>
   );
};
