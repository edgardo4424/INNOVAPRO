import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import GestionUsuarios from "../components/GestionUsuarios";

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

        {/* 🔥 Si la ruta no existe, redirigir siempre a `/login` */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      </BrowserRouter>
  );
}