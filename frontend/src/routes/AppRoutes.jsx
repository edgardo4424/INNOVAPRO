import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import GestionUsuarios from "../components/GestionUsuarios";
import GestionEmpresas from "../components/GestionEmpresas";
import GestionClientes from "../components/GestionClientes";
import GestionContactos from "../components/GestionContactos"; // 🔥 IMPORTAMOS EL NUEVO MÓDULO
import GestionProductosServicios from "../components/GestionProductosServicios";
import GestionObras from "../components/GestionObras";

export default function AppRoutes() {
  return (
    <BrowserRouter>
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

        {/* 🔥 Si la ruta no existe, redirigir siempre a `/login` */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}