import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import api from "../shared/services/api";
import { loginService } from "@/modules/auth/services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("⚠️ No hay token almacenado. Usuario no autenticado.");
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/auth/verify-session", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.valid) {
          const storedUser = JSON.parse(localStorage.getItem("user"));
          setUser(storedUser);
          console.log("✅ Sesión válida, usuario:", storedUser);
        } else {
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

    verifySession();
  }, []);

  // 🔹 Iniciar sesión con validación de reCAPTCHA
  const login = async (email, password, recaptchaToken, navigate) => {
    const data = await loginService(email, password, recaptchaToken);
  
    if (data?.error) {
      alert(`❌ ${data.mensaje}`);
      return false;
    }
  
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
  

  // 🔹 Cerrar sesión y redirigir correctamente
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    setLoading(false);
  
    const LOGIN_URL = process.env.NODE_ENV === "production" ? "/#/login" : "/login";
    window.location.replace(LOGIN_URL); // siempre redirige por seguridad
  };  

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {loading ? <h2 style={{ textAlign: "center" }}>Cargando...</h2> : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}