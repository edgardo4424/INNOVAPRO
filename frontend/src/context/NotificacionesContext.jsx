import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import api from "../shared/services/api";
import { useAuth } from "./AuthContext";
import socket from "../shared/services/socket"

const tiposValidos = ["error", "info", "tarea", "exito", "advertencia", "sistema", "cliente", "admin"];

const NotificacionesContext = createContext();

export const useNotificaciones = () => useContext(NotificacionesContext);

export const NotificacionesProvider = ({ children }) => {
    const { user } = useAuth(); // 🔥 Obtener usuario autenticado
    const [notificaciones, setNotificaciones] = useState([]);

    useEffect(() => {
        if (!user) return; // 🔥 Evita errores si el usuario aún no está autenticado

        async function fetchNotificaciones() {
            try {
                const res = await api.get("/notificaciones");
                console.log("📩 Notificaciones cargadas:", res.data.notificaciones);
                setNotificaciones(res.data.notificaciones);
            } catch (error) {
                console.error("❌ Error al obtener notificaciones:", error);
            }
        }

        fetchNotificaciones();

        const canal = `notificacion_usuario_${user.id}`;
        const canalLeida = `notificacion_leida_usuario_${user.id}`;

        // 🔥 Evento cuando llega una nueva notificación
        socket.on(canal, (data) => {

            // Validar estructura mínima
            if (!data?.id || !data?.mensaje || !data?.tipo) return;
            if (!tiposValidos.includes(data.tipo)) return;
        
            // Evitar duplicados
            setNotificaciones((prev) => {
                if (prev.some((n) => n.id === data.id)) return prev;
                return [data, ...prev];
              });
        });
        
        // 🔥 Evento cuando una notificación es marcada como leída
        socket.on(canalLeida, ({ id }) => {
            if (!id) return;
            setNotificaciones((prev) => prev.filter((noti) => noti.id !== id));
        });
  
        return () => {
            socket.off(canal);
            socket.off(canalLeida);
        };
    }, [user]);

    return (
        <NotificacionesContext.Provider value={{ notificaciones, setNotificaciones }}>
            {children}
        </NotificacionesContext.Provider>
    );
};