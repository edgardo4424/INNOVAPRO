import { BrowserRouter, HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import GestionUsuarios from "../components/GestionUsuarios";
import GestionEmpresas from "../components/GestionEmpresas";
import GestionClientes from "../components/GestionClientes";
import GestionContactos from "../components/GestionContactos";
import GestionProductosServicios from "../components/GestionProductosServicios";
import GestionObras from "../components/GestionObras";
import CentroAtencion from "../components/CentroAtencion";
import RegistrarTarea from "../components/RegistrarTarea";

export default function AppRoutes() {
  const Router = process.env.NODE_ENV === "production" ? HashRouter : BrowserRouter;
  const LOGIN_PATH = process.env.NODE_ENV === "production" ? "/#/login" : "/login";
  const DASHBOARD_PATH = process.env.NODE_ENV === "production" ? "/#/dashboard" : "/dashboard";

  return (
    <Router>
      <Routes>
        {/* 🔥 Rutas públicas */}
        <Route path="/login" element={<Login />} />
        
        {/* 🔥 Redirección automática a /login si la ruta raíz (/) no tiene sesión */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 🔥 Rutas protegidas con validación */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="*"
          element={
            <Navigate to={LOGIN_PATH} replace />
          } 
        />
        <Route 
          path="/gestion-usuarios" 
          element={
            <ProtectedRoute>
              <GestionUsuarios />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/gestion-empresas" 
          element={
            <ProtectedRoute>
              <GestionEmpresas />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/gestion-clientes" 
          element={
            <ProtectedRoute>
              <GestionClientes />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/gestion-contactos" 
          element={
            <ProtectedRoute>
              <GestionContactos />
            </ProtectedRoute>
          } 
        />
        <Route path="/gestion-productos-servicios" 
        element={
          <ProtectedRoute>
            <GestionProductosServicios />
          </ProtectedRoute>
        } 
        />
        <Route path="/gestion-obras" 
        element={
          <ProtectedRoute>
            <GestionObras />
          </ProtectedRoute>
        } 
        />
        <Route path="/centro-atencion" 
        element={
          <ProtectedRoute>
            <CentroAtencion />
          </ProtectedRoute>
        } 
        />
        <Route path="/registrar-tarea" 
        element={
          <ProtectedRoute>
            <RegistrarTarea />
          </ProtectedRoute>} 
        />

        {/* 🔥 Si la ruta no existe, redirigir siempre a `/login` */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}