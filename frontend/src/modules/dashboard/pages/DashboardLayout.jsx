import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { Sidebar, Header } from "../components";

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return <p className="error">Error: Usuario no autenticado.</p>;

  return (
    <div className={`dashboard-container ${sidebarOpen ? "expanded" : ""}`}>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className={`dashboard-main ${sidebarOpen ? "compressed" : ""}`}>
        <Header user={user} logout={logout} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <section className="dashboard-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}