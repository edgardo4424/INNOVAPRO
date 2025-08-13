// Este archivo es el punto de entrada en REACT: ReactDOM.createRoot()
// Se envuelve la app con los contextos globales y renderiza el componente principal <App/>
// Aquí se conectan los cables principales de la aplicación: autenticación, notificaciones, facturación y estilos globales

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { NotificacionesProvider } from "./context/NotificacionesContext";
import { AuthProvider } from "./context/AuthContext";
import AppProviderFacturacion from "./context/AppProviderFactura.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Importaciones temporales hasta que todos los módulos migren sus estilos
import "./styles/global.css";
import "./styles/dashboard.css";
import "./styles/centroAtencion.css";
import "./styles/cotizacionForm.css";
import "./styles/notificaciones.css";
import "./styles/registroTarea.css";

ReactDOM.createRoot(document.getElementById("root")).render(
   <React.StrictMode>
      {" "}
      {/* Modo Stric que nos ayuda en desarrollo a encontrar bugs */}
      <AuthProvider>
         {" "}
         {/* Se encarga de la sesión del usuario. */}
         <NotificacionesProvider>
            {" "}
            {/* Gestiona el sistema de notificaciones. */}
            <AppProviderFacturacion>
               {/* Provee datos específicos del módulo de facturación. */}
               <App />{" "}
               {/* Invocamos la APP principal que a su vez lanzará las rutas del sistema */}
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
            </AppProviderFacturacion>
         </NotificacionesProvider>
      </AuthProvider>
   </React.StrictMode>
);
