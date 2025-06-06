import { useNotificaciones } from "@/context/NotificacionesContext";
import { useState, useRef, useEffect } from "react";
import api from "../services/api";
import "@/styles/notificaciones.css";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

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

  function obtenerIconoPorTipo(tipo) {
    switch (tipo) {
      case "error":
        return "❌";
      case "info":
        return "ℹ️";
      case "tarea":
        return "📝";
      case "exito":
        return "✅";
      case "advertencia":
        return "⚠️";
      case "sistema":
        return "💻";
      case "cliente":
        return "🧑‍💼";
      case "admin":
        return "🛠️";
      default:
        return "🔔";
    }
  }

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
      <Button
        variant={"outline"}
        size={"icon"}
        className="rounded-full relative"
        onClick={() => setMostrarLista(!mostrarLista)}
      >
        <Bell />
        {notificaciones.length > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white">
            {notificaciones.length}
          </Badge>
        )}
      </Button>

      {/* 📩 Lista de notificaciones */}
      {mostrarLista && (
        <div ref={dropdownRef} className="notification-dropdown">
          <h4>Notificaciones</h4>
          <ul>
            {notificaciones.length === 0 ? (
              <li className="no-notifications">No tienes notificaciones nuevas</li>
            ) : (
              notificaciones.map((noti, index) => (
                <li
                  key={noti.id || `temp-${index}`}
                  className="notification-item"
                  onClick={() => {
                    if (noti.id) marcarComoLeida(noti.id);
                    else console.warn("❌ Notificación sin ID no puede marcarse como leída:", noti);
                  }}
                >
                  <span>
                    <strong>{obtenerIconoPorTipo(noti.tipo)}</strong>
                    {noti.mensaje || "Notificación sin mensaje"}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}