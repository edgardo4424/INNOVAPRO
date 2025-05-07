import { BrowserRouter, HashRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "../App";
import Login from "../pages/Login";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import GestionUsuarios from "../modules/usuarios/pages/GestionUsuarios";
import GestionEmpresas from "../modules/filiales/pages/GestionEmpresas";
import GestionClientes from "../modules/clientes/pages/GestionClientes";
import GestionContactos from "../modules/contactos/pages/GestionContactos";
import GestionProductosServicios from "../components/productos/GestionProductosServicios";
import GestionObras from "../modules/obras/pages/GestionObras";
import CentroAtencion from "../components/tareas/CentroAtencion";
import RegistrarTarea from "../modules/tareas/pages/RegistrarTarea";

import DashboardHome from "../modules/dashboard/pages/DashboardHome";
import DashboardLayout from "../modules/dashboard/pages/DashboardLayout";

export default function AppRoutes() {
  const Router = process.env.NODE_ENV === "production" ? HashRouter : BrowserRouter;
  const LOGIN_PATH = process.env.NODE_ENV === "production" ? "/#/login" : "/login";
  const DASHBOARD_PATH = process.env.NODE_ENV === "production" ? "/#/dashboard" : "/dashboard";

  return (
    <Router>
      <Routes>

        {/* Ruta pública */}
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas */}
        <Route path="/" element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="gestion-usuarios" element={<GestionUsuarios />} />
            <Route path="gestion-empresas" element={<GestionEmpresas />} />
            <Route path="gestion-clientes" element={<GestionClientes />} />
            <Route path="gestion-contactos" element={<GestionContactos />} />
            <Route path="gestion-productos-servicios" element={<GestionProductosServicios />} />
            <Route path="gestion-obras" element={<GestionObras />} />
            <Route path="centro-atencion" element={<CentroAtencion />} />
            <Route path="registrar-tarea" element={<RegistrarTarea />} />
          </Route>
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to={LOGIN_PATH} replace />} />

      </Routes>
    </Router>
  );
  }