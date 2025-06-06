import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

function RoleGuard({ roles }) {
   const { user } = useAuth();
   const isAuthorized = roles.includes(user.rol);
   console.log(isAuthorized);
   
   return isAuthorized ? <Outlet /> : <Navigate replace to="/" />;
}
export default RoleGuard;
