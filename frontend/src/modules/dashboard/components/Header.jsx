import React, { useRef } from "react";
import { FaClipboardList, FaExclamationCircle, FaExclamationTriangle, FaInfoCircle, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Notificaciones from "@/shared/components/Notificaciones";

async function enviarWhatsapp(numero = "51912921086") {
    try {
      const token = localStorage.getItem("token"); 
        console.log("siberia",token)
      const response = await fetch("https://erp.grupoinnova.pe/backend/api/whatsapp/probar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ numero })
      });
  
      const data = await response.json();
      console.log("Respuesta del servidor:", data);
    } catch (error) {
      console.error("Error al enviar WhatsApp:", error);
    }
  }
  
  
export default function Header({ user, logout, tareasPendientes = [], notificacionesAbiertas, setNotificacionesAbiertas }) {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <img src="/images/logo_blanco.png" alt="Logo Innova" className="dashboard-logo" />
        <div className="welcome-message">Bienvenido, {user?.nombre} 👋</div>
      </div>

      <div className="header-right">
        <button onClick={() => enviarWhatsapp()}>Prueba WhatsApp</button>
        <Notificaciones />

        {user.rol === "Oficina Técnica" && (
          <div className="notification-container">
            <FaClipboardList className="header-icon" onClick={() => setNotificacionesAbiertas(!notificacionesAbiertas)} />
            {tareasPendientes.length > 0 && <span className="notification-badge">{tareasPendientes.length}</span>}
          </div>
        )}

        {notificacionesAbiertas && user.rol === "Oficina Técnica" && (
          <div ref={dropdownRef} className={`notification-dropdown ${notificacionesAbiertas ? "show" : ""}`}>
            <h4>📌 Tareas Pendientes</h4>
            {tareasPendientes.length === 0 ? (
              <p className="no-notifications">No hay nuevas tareas pendientes.</p>
            ) : (
              <ul>
                {tareasPendientes.map((tarea) => {
                  let icono;
                  if (tarea.urgencia === "Prioridad") {
                    icono = <FaExclamationCircle className="notification-icon icon-prioridad" />;
                  } else if (tarea.urgencia === "Normal") {
                    icono = <FaExclamationTriangle className="notification-icon icon-normal" />;
                  } else {
                    icono = <FaInfoCircle className="notification-icon icon-baja" />;
                  }

                  return (
                    <li key={tarea.id} onClick={() => {
                      navigate("/dashboard", { state: { modulo: "Centro de Atención" } });
                      setNotificacionesAbiertas(false);
                    }}>
                      {icono} <strong>{tarea.tipoTarea}</strong> - {tarea.cliente?.razon_social}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

        <FaCog className="header-icon" />
        <button className="logout-button" onClick={() => {
          logout();
          navigate("/login", { replace: true });
        }}>
          <FaSignOutAlt />
        </button>
      </div>
    </header>
  );
}
