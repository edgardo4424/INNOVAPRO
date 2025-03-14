import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./routes/AppRoutes";
import { NotificacionesProvider } from "./context/NotificacionesContext";
import { AuthProvider } from "./context/AuthContext";
import "./styles/global.css"; 
import "./styles/dashboard.css";
import "./styles/Login.module.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
      <AuthProvider>
        <NotificacionesProvider>
          <AppRoutes />
        </NotificacionesProvider>
      </AuthProvider>
  </React.StrictMode>
);