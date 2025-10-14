// Este componente bloquea todo el sistema a usuarios no autenticados. 
// Es el filtro maestro que determina si el usuario puede ingresar al sistema más allá del login. 

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/shared/components/Loader";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation(); 

  if (loading) return <Loader />; 
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si el usuario está autenticado, renderiza el contenido protegido
  // Outlet permite renderizar las rutas hijas dentro de este componente
  return <Outlet />;
}