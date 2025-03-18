import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import api from "../services/api"; // 🔥 Usamos el API dinámico

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
        const res = await api.get("/verify-session", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.valid) {
          const storedUser = JSON.parse(localStorage.getItem("user"));
          setUser(storedUser);
          console.log("✅ Sesión válida, usuario:", storedUser);
        } else {
          console.warn("⚠️ Sesión inválida. Cerrando sesión...");
          logout(null); // 🔥 Llamamos logout sin `navigate`
        }
      } catch (error) {
        console.error("❌ Error verificando sesión:", error.response?.data || error.message);
        logout(null); // 🔥 Llamamos logout sin `navigate`
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  // 🔹 Iniciar sesión con validación de reCAPTCHA
  const login = async (email, password, recaptchaToken, navigate) => {
    try {
      const res = await api.post("/login", { email, password, recaptchaToken });

      console.log("🟢 Login exitoso:", res.data);
      const { token, usuario } = res.data;

      if (!token || !usuario) {
        console.error("❌ Error: Token o usuario inválidos.");
        logout(navigate);
        return false;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(usuario));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(usuario);
      if (navigate) navigate("/dashboard", { replace: true }); // 🔥 Solo navega si `navigate` está disponible
      return true;
    } catch (error) {
      console.error("❌ Error en login:", error.response?.data || error.message);
      return false;
    }
  };

  // 🔹 Cerrar sesión y redirigir correctamente
  const logout = (navigate) => {
    console.log("🚪 Cerrando sesión...");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);

    const LOGIN_URL = process.env.NODE_ENV === "production" ? "/#/login" : "/login";

    setTimeout(() => {
      if (navigate) {
        navigate(LOGIN_URL, { replace: true });  // 🔥 Usa React Router correctamente solo si está disponible
      } else {
        window.location.replace(LOGIN_URL);  // 🔥 Alternativa segura
      }
    }, 100);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading ? children : <h2>Cargando...</h2>}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}