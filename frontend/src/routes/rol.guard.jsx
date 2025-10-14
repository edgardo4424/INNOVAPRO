// Este componente filtra las rutas internas según el rol del usuario. 
// Funciona como un candado que solo se abre si tienes el permiso adecuado (ej: Gerencia, Ventas, Oficina Técnica).

import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

function RoleGuard({ roles }) {
   const { user } = useAuth(); 
   const isAuthorized = roles.includes(user.rol); // Verifica si el rol del usuario está en la lista de roles permitidos
   // Si tiene permiso, permite el paso con <Outlet />. Si no, redirige a la ruta raíz (/).
   return isAuthorized ? <Outlet /> : <Navigate to="/" replace/>;
}

export default RoleGuard;