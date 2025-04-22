import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { FaBars, FaSignOutAlt, FaCog, FaBell, FaExclamationCircle, FaExclamationTriangle, FaInfoCircle, FaClipboardList  } from "react-icons/fa";
import GestionUsuarios from "../components/usuarios/GestionUsuarios";
import GestionEmpresas from "../components/filiales/GestionEmpresas";
import GestionClientes from "../modules/clientes/pages/GestionClientes"; 
import CotizacionForm from "../components/cotizaciones/CotizacionForm";
import GestionContactos from "../components/clientes/GestionContactos"; 
import GestionProductosServicios from "../components/productos/GestionProductosServicios";
import GestionObras from "../components/clientes/GestionObras";
import CentroAtencion from "../components/tareas/CentroAtencion";
import RegistrarTarea from "../components/tareas/RegistrarTarea";
import Notificaciones from "../components/tareas/Notificaciones";
import api from "../services/api";

import "../styles/global.css";
import "../styles/dashboard.css";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [moduloActivo, setModuloActivo] = useState(null);
  const [tareasPendientes, setTareasPendientes] = useState([]);
  const [notificacionesAbiertas, setNotificacionesAbiertas] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const location = useLocation();
  

  if (!user) return <p className="error">Error: Usuario no autenticado.</p>;

  // Si venimos desde una notificación, abrimos automáticamente el Centro de Atención
  useEffect(() => {
    if (location.state?.modulo) {
      setModuloActivo(location.state.modulo);
    }
  }, [location]);

  useEffect(() => {
    if (user.rol === "Oficina Técnica") {
      async function fetchTareasPendientes() {
        try {
          const res = await api.get("/tareas");
          const pendientes = res.data.filter(t => t.estado === "Pendiente");
          setTareasPendientes(pendientes);
        } catch (error) {
          console.error("❌ Error al obtener tareas pendientes:", error);
        }
      }

      fetchTareasPendientes();
      const interval = setInterval(fetchTareasPendientes, 30000);
      return () => clearInterval(interval);
    }
  }, [user.rol]);

  // 🔹 Cerrar notificaciones si se hace click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setNotificacionesAbiertas(false);
      }
    }

    if (notificacionesAbiertas) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notificacionesAbiertas]);

  const modulesByRole = {
    Gerencia: [
      "Gestión de Usuarios", 
      "Gestión de Filiales de Innova", 
      "Gestión de Clientes", 
      "Gestión de Contactos", 
      "Gestión de Productos y Servicios", 
      "Gestión de Obras", 
      "Cotizaciones",
      "Centro de Atención",
      "Registrar Tarea",
    ],
    Ventas: [
      "Gestión de Clientes", 
      "Gestión de Contactos", 
      "Gestión de Obras", 
      "Cotizaciones", 
      "Registrar Tarea",
      "Centro de Atención"
    ],
    'Oficina Técnica': [
      "Centro de Atención"
    ],
    Almacén: [
      "Inventario", 
      "Entradas", 
      "Salidas"
    ],
    Administración: [
      "Gestión de Usuarios", 
      "Finanzas", 
      "Permisos"
    ],
    Clientes: [
      "Mis Pedidos", 
      "Facturas", 
      "Soporte"
    ],
  };

  const modules = modulesByRole[user.rol] || [];


  const avanzarModulo = () => {
    const indiceActual = modules.indexOf(moduloActivo);
    if (indiceActual < modules.length - 1) {
      setModuloActivo(modules[indiceActual + 1]); // Avanzar al siguiente módulo
    }
  };
  
  return (
    <div className={`dashboard-container ${sidebarOpen ? "expanded" : ""}`}>
      
      <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <FaBars />
      </button>

      <aside className={`dashboard-sidebar ${sidebarOpen ? "expanded" : ""}`}>
        {sidebarOpen && (
          <nav className="dashboard-menu">
            {modules.map((module) => (
              <button key={module} className="menu-item" onClick={() => setModuloActivo(module)}>
                {module}
              </button>
            ))}
            <button className="menu-item" onClick={() => setModuloActivo(null)}>
              Volver al inicio
            </button>
          </nav>
        )}
      </aside>

      <main className={`dashboard-main ${sidebarOpen ? "compressed" : ""}`}>
        
        <header className="dashboard-header">
          <div className="header-left">
          <img src="/images/logo_blanco.png" alt="Logo Innova" className="dashboard-logo" />
          <div className="welcome-message">Bienvenido, {user?.nombre} 👋</div>
          </div>

          <div className="header-right">
          <Notificaciones />
          {/* 🔔 Notificaciones (solo Oficina Técnica) */}
          {user.rol === "Oficina Técnica" && (
            <div className="notification-container">
              <FaClipboardList  className="header-icon" onClick={() => setNotificacionesAbiertas(!notificacionesAbiertas)} />
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

        <section className="dashboard-content">
            
            {!moduloActivo ? (
                <div className="dashboard-widgets">
                    {modules.map((module) => (
                        <button key={module} className="widget" onClick={() => setModuloActivo(module)}>
                            {module}
                        </button>
                    ))}
                </div>
            ) : (
                <>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                      {/* Botón para volver al inicio */}
                      <button className="back-button" onClick={() => setModuloActivo(null)}>
                        ⬅ Volver al inicio
                      </button>

                      {/* Botón para avanzar al siguiente módulo */}
                      {moduloActivo && modules.indexOf(moduloActivo) < modules.length - 1 && (
                        <button className="next-button" onClick={avanzarModulo} style={{ marginLeft: "10px" }}>
                          Siguiente módulo ➡
                        </button>
                      )}
                    </div>
                    {/* Renderizado de los módulos */}
                    {moduloActivo === "Gestión de Usuarios" && <GestionUsuarios />}
                    {moduloActivo === "Gestión de Filiales de Innova" && <GestionEmpresas />}
                    {moduloActivo === "Gestión de Clientes" && <GestionClientes />}
                    {moduloActivo === "Gestión de Contactos" && <GestionContactos />}
                    {moduloActivo === "Gestión de Productos y Servicios" && (
                      <div className="contenedor-mantenimiento">
                        {/* Contenido con blur */}
                        <div className="modulo-en-mantenimiento">
                          <GestionProductosServicios />
                        </div>

                        {/* Overlay sin blur para que el mensaje sea legible */}
                        <div className="overlay-mantenimiento">
                          <p>⚠️ Módulo bajo mantenimiento ⚠️</p>
                        </div>
                      </div>
                    )}
                    {moduloActivo === "Gestión de Obras" && <GestionObras />}
                    {moduloActivo === "Cotizaciones" && (
                      <div className="contenedor-mantenimiento">
                        {/* Contenido con blur */}
                        <div className="modulo-en-mantenimiento">
                          <CotizacionForm />
                        </div>

                        {/* Overlay sin blur para que el mensaje sea legible */}
                        <div className="overlay-mantenimiento">
                          <p>⚠️ Módulo bajo mantenimiento ⚠️</p>
                        </div>
                      </div>
                    )}
                    {moduloActivo === "Centro de Atención" && <CentroAtencion />}
                    {moduloActivo === "Registrar Tarea" && <RegistrarTarea />}
                </>
            )}
        </section>
      </main>
    </div>
  );
}