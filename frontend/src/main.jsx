import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./routes/AppRoutes";
import { NotificacionesProvider } from "./context/NotificacionesContext";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Importaciones temporales hasta que todos los módulos migren sus estilos
import "./styles/global.css"; 
import "./styles/dashboard.css";
import "./styles/Login.module.css";
import "./styles/centroAtencion.css";
import "./styles/cotizacionForm.css";
import "./styles/notificaciones.css";
import "./styles/registroTarea.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <AuthProvider>
        <NotificacionesProvider>
          <AppRoutes />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </NotificacionesProvider>
      </AuthProvider>
  </React.StrictMode>
)