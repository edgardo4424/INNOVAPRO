import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import api from "../services/api";
import { useAuth } from "./AuthContext";
import socket from "../services/socket";

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
                console.log("📩 Notificaciones cargadas:", res.data);
                setNotificaciones(res.data.filter(noti => !noti.leida));
            } catch (error) {
                console.error("❌ Error al obtener notificaciones:", error);
            }
        }

        fetchNotificaciones();

        const canal = `notificacion_${user.id}`;
        const canalLeida = `notificacion_leida_${user.id}`;

        console.log("📡 Subscrito a canal:", canal);
        console.log("🔌 Estado del socket:", socket.connected);

        // 🔥 Evento cuando llega una nueva notificación
        socket.on(canal, (data) => {
            console.log("📩 Nueva notificación recibida:", data);
        
            // Validar estructura mínima
            if (!data?.id || !data?.mensaje || !data?.tipo) {
            console.warn("⚠️ Notificación malformada ignorada:", data);
            return;
            }
        
            // Aceptar solo tipos conocidos
            const tiposValidos = [
                "error", 
                "info", 
                "tarea", 
                "exito", 
                "advertencia",
                "sistema",
                "cliente",
                "admin",
            ];
            if (!tiposValidos.includes(data.tipo)) {
            console.warn("⚠️ Tipo de notificación no reconocida:", data.tipo);
            return;
            }
        
            // Evitar duplicados
            setNotificaciones((prev) => {
            const yaExiste = prev.some((n) => n.id === data.id);
            if (yaExiste) return prev;
            return [data, ...prev];
            });
        });
        
        // 🔥 Evento cuando una notificación es marcada como leída
        socket.on(canalLeida, ({ id }) => {
            if (!id) return;
            console.log("✅ Notificación marcada como leída:", id);
            setNotificaciones((prev) =>
            prev.filter((noti) => noti.id !== id)
            );
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