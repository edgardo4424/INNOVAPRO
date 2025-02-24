import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import "./styles/global.css"; 
import "./styles/dashboard.css";
import "./styles/Login.module.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
  </React.StrictMode>
);