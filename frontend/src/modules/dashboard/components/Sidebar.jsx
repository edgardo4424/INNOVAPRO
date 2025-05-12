import React from "react";
import { useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";

export default function Sidebar({ sidebarOpen, setSidebarOpen, modules = [] }) {
    const navigate = useNavigate();

  return (
    <>
      <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <FaBars />
      </button>

      <aside className={`dashboard-sidebar ${sidebarOpen ? "expanded" : ""}`}>
        {sidebarOpen && (
          <nav className="dashboard-menu">
            {modules.map((module) => (
              <button key={module.name} className="menu-item" onClick={() => navigate(module.path)}>
                {module.name}
              </button>
            ))}
            <button className="menu-item" onClick={() => navigate("/")}>
              Volver al inicio
            </button>
          </nav>
        )}
      </aside>
    </>
  );
}