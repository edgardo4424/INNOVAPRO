import { useNotificaciones } from "../context/NotificacionesContext";
import { useState, useRef, useEffect } from "react";
import api from "../services/api";
import "../styles/notificaciones.css";

export default function Notificaciones() {
    const { notificaciones, setNotificaciones } = useNotificaciones();
    const [mostrarLista, setMostrarLista] = useState(false);
    const dropdownRef = useRef(null);

    // 🔥 Cerrar notificaciones si se hace clic fuera del panel
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setMostrarLista(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    async function marcarComoLeida(id) {
        try {
            await api.put(`/notificaciones/${id}/leida`);
            setNotificaciones((prev) => prev.filter((noti) => noti.id !== id));
        } catch (error) {
            console.error("❌ Error al marcar como leída:", error);
        }
    }

    return (
        <div className="notification-container">
            {/* 🔥 Icono de notificaciones */}
            <div className="notification-icon" onClick={() => setMostrarLista(!mostrarLista)}>
                🔔
                {notificaciones.length > 0 && (
                    <span className="notification-badge">{notificaciones.length}</span>
                )}
            </div>

            {/* 📩 Lista de notificaciones */}
            {mostrarLista && (
                <div ref={dropdownRef} className="notification-dropdown">
                    <h4>Notificaciones</h4>
                    <ul>
                        {notificaciones.length === 0 ? (
                            <li className="no-notifications">No tienes notificaciones nuevas</li>
                        ) : (
                            notificaciones.map((noti) => (
                                <li key={noti.id} className="notification-item" onClick={() => marcarComoLeida(noti.id)}>
                                    <span>{noti.mensaje}</span>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}