import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaSignOutAlt, FaCog, FaBell } from "react-icons/fa";
import GestionUsuarios from "../components/GestionUsuarios";
import GestionEmpresas from "../components/GestionEmpresas";
import GestionClientes from "../components/GestionClientes"; // 🔥 IMPORTAMOS EL NUEVO MÓDULO
import CotizacionForm from "../components/CotizacionForm";
import GestionContactos from "../components/GestionContactos"; // 🔥 IMPORTACIÓN FALTANTE
import GestionProductosServicios from "../components/GestionProductosServicios";
import GestionObras from "../components/GestionObras";

import "../styles/global.css";
import "../styles/dashboard.css";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [moduloActivo, setModuloActivo] = useState(null);
  const navigate = useNavigate();

  if (!user) return <p className="error">Error: Usuario no autenticado.</p>;

  const modulesByRole = {
    Gerencia: ["Gestión de Usuarios", "Gestión de Empresas", "Gestión de Clientes", "Gestión de Contactos", "Gestión de Productos y Servicios", "Gestión de Obras", "Cotizaciones"],
    Ventas: ["Gestión de Clientes", "Gestión de Contactos", "Gestión de Obras", "Cotizaciones"],
    OT: ["Proyectos", "Planos", "Materiales"],
    Almacén: ["Inventario", "Entradas", "Salidas"],
    Administración: ["Usuarios", "Finanzas", "Permisos"],
    Clientes: ["Mis Pedidos", "Facturas", "Soporte"],
};

  const modules = modulesByRole[user.rol] || [];

  return (
    <div className={`dashboard-container ${sidebarOpen ? "expanded" : ""}`}>
      
      {/* Botón para abrir/cerrar el menú */}
      <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <FaBars />
      </button>

      {/* MENÚ LATERAL */}
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

      {/* CONTENIDO PRINCIPAL */}
      <main className={`dashboard-main ${sidebarOpen ? "compressed" : ""}`}>
        <header className="dashboard-header">
          <div className="header-left">
            <img src="/images/logo_blanco.png" alt="Logo Innova" className="dashboard-logo" />
            <div className="welcome-message">Bienvenido, {user?.nombre} 👋</div>
          </div>
          <div className="header-right">
            <FaBell className="header-icon" />
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
                    <button className="back-button" onClick={() => setModuloActivo(null)}>
                        ⬅ Volver al inicio
                    </button>
                    {moduloActivo === "Gestión de Usuarios" && <GestionUsuarios />}
                    {moduloActivo === "Gestión de Empresas" && <GestionEmpresas />}
                    {moduloActivo === "Gestión de Clientes" && <GestionClientes />}
                    {moduloActivo === "Gestión de Contactos" && <GestionContactos />}
                    {moduloActivo === "Gestión de Productos y Servicios" && <GestionProductosServicios />}
                    {moduloActivo === "Gestión de Obras" && <GestionObras />}
                    {moduloActivo === "Cotizaciones" && <CotizacionForm />}
                </>
            )}
        </section>
      </main>
    </div>
  );
}