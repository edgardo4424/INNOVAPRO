// Este archivo se encarga de manejar el login, verificar si la sesión es válida, cerrar sesión
// y compartir esa información en toda la app. Sin ésto, no podríamos proteger las rutas, saber qué rol tiene el usuario
// ni mostrar información sensible de cada usuario.

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import api from "../shared/services/api";
import { loginService } from "@/modules/auth/services/authService";
import LoaderInnova from "@/shared/components/LoaderInnova";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => { // Verificamos si hay token guardado
      const token = localStorage.getItem("token");

      // Si no lo hay significa que la sesión no es válida
      if (!token) {
        console.warn("⚠️ No hay token almacenado. Usuario no autenticado.");
        setLoading(false);
        return;
      }

      // Si existe verificamos con el backend si realmente es válido
      try {
        const res = await api.get("/auth/verify-session", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Si es válido, guardamos el usuario en el estado local "user"
        if (res.data.valid) {
          const storedUser = JSON.parse(localStorage.getItem("user"));
          setUser(storedUser);
        } else { // Si no es válido, cerramos sesión automáticamente
          console.warn("⚠️ Sesión inválida. Cerrando sesión...");
          logout(); 
        }
      } catch (error) {
        console.error("❌ Error verificando sesión:", error.response?.data || error.message);
        logout();  
      } finally {
        setLoading(false);
      }
    };

    verifySession(); // Llamamos a la función para verificar la sesión al cargar el contexto
  }, []);

  // Método para inicio de sesión con recaptcha integrado
  const login = async (email, password, recaptchaToken, navigate) => {
    
    const data = await loginService(email, password, recaptchaToken); 
  
    if (data?.error) {
      alert(`❌ ${data.mensaje}`);
      return false;
    }
    // Si la respuesta es correcta, guardamos el token y el usuario en localStorage 
    // y el establecemos el token en el header de Axios para futuras peticiones.
    if (data && data.token && data.usuario) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.usuario));
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`; 
      setUser(data.usuario); 
      if (navigate) navigate("/", { replace: true });
      return true;
    }
  
    alert("❌ Error desconocido al iniciar sesión.");
    return false;
  };  
  

  // Cerrar sesión, limpiar el localStorage, el header de axios y redirigimos al login
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    setLoading(false);
  
    const LOGIN_URL = process.env.NODE_ENV === "production" ? "/#/login" : "/login";
    window.location.href = LOGIN_URL; // Redirigir al login
  };  

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {loading ? <LoaderInnova/> : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}