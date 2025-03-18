import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const NotificacionesContext = createContext();

export const useNotificaciones = () => useContext(NotificacionesContext);

export const NotificacionesProvider = ({ children }) => {
    const { user } = useAuth(); // 🔥 Obtener usuario autenticado
    const [notificaciones, setNotificaciones] = useState([]);

    useEffect(() => {
        if (!user) return; // 🔥 Evita errores si el usuario aún no está autenticado

        const socket = io(api.defaults.baseURL.replace("/api", "")); // 🔥 Conectar a WebSockets

        async function fetchNotificaciones() {
            try {
                const res = await api.get("/notificaciones");
                console.log("📩 Notificaciones cargadas:", res.data);
                // 🔥 FILTRAMOS SOLO LAS NO LEÍDAS
                setNotificaciones(res.data.filter(noti => !noti.leida));
            } catch (error) {
                console.error("❌ Error al obtener notificaciones:", error);
            }
        }

        fetchNotificaciones();

        // 🔥 Evento cuando llega una nueva notificación
        socket.on(`notificacion_${user.id}`, (data) => {
            console.log("📩 Nueva notificación recibida:", data);
            setNotificaciones((prev) => [...prev, data]); // 🔥 Agregar nueva notificación
        });

        // 🔥 Evento cuando una notificación es marcada como leída
        socket.on(`notificacion_leida_${user.id}`, ({ id }) => {
            console.log("✅ Notificación marcada como leída:", id);
            setNotificaciones((prev) =>
                prev.filter((noti) => noti.id !== id) // 🔥 Eliminar la notificación leída
            );
        });

        return () => socket.disconnect();
    }, [user]);

    return (
        <NotificacionesContext.Provider value={{ notificaciones, setNotificaciones }}>
            {children}
        </NotificacionesContext.Provider>
    );
};