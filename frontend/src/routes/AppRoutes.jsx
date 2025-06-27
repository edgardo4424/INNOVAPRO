import React, { Suspense, lazy } from "react";
import {
   BrowserRouter,
   HashRouter,
   Routes,
   Route,
   Navigate,
} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import RoleGuard from "./rol.guard";
import { WizardProvider } from "@/modules/cotizaciones/context/WizardCotizacionContext";
import LoaderInnova from "@/shared/components/LoaderInnova";

// Lazy load components
const Login = lazy(() => import("@/modules/auth/pages/Login"));
const GestionUsuarios = lazy(() =>
   import("@/modules/usuarios/pages/GestionUsuarios")
);
const GestionEmpresas = lazy(() =>
   import("@/modules/filiales/pages/GestionEmpresas")
);
const GestionClientes = lazy(() =>
   import("@/modules/clientes/pages/GestionClientes")
);
const GestionContactos = lazy(() =>
   import("@/modules/contactos/pages/GestionContactos")
);
const GestionObras = lazy(() => import("@/modules/obras/pages/GestionObras"));
const CentroAtencion = lazy(() =>
   import("@/modules/centroAtencion/pages/CentroAtencion")
);
const RegistrarTarea = lazy(() =>
   import("@/modules/tareas/pages/RegistrarTarea")
);

const DashboardHome = lazy(() =>
   import("@/modules/dashboard/pages/DashboardHome")
);
const DashboardLayout = lazy(() =>
   import("@/modules/dashboard/pages/DashboardLayout")
);

const RegistrarCotizacionWizard = lazy(() =>
   import("@/modules/cotizaciones/pages/RegistrarCotizacionWizard")
);
const GestionCotizaciones = lazy(() =>
   import("../modules/cotizaciones/pages/GestionCotizaciones")
);
const GestionStockPiezas = lazy(() =>
   import("../modules/stockPiezas/pages/GestionStockPiezas")
);

export default function AppRoutes() {
   const Router =
      process.env.NODE_ENV === "production" ? HashRouter : BrowserRouter;
   const LOGIN_PATH =
      process.env.NODE_ENV === "production" ? "/#/login" : "/login";

   return (
      <Router>
         {/* Suspense para mostrar fallback mientras carga */}
         <Suspense fallback={<LoaderInnova />}>
            <Routes>
               {/* Ruta pública */}
               <Route path="/login" element={<Login />} />
               {/* Rutas protegidas */}
               <Route path="/" element={<ProtectedRoute />}>
                  <Route element={<DashboardLayout />}>
                     <Route index element={<DashboardHome />} />
                     <Route element={<RoleGuard roles={["Gerencia"]} />}>
                        <Route
                           path="gestion-usuarios"
                           element={<GestionUsuarios />}
                        />
                     </Route>
                     <Route element={<RoleGuard roles={["Gerencia"]} />}>
                        <Route
                           path="gestion-empresas"
                           element={<GestionEmpresas />}
                        />
                     </Route>

                     <Route
                        element={<RoleGuard roles={["Gerencia", "Ventas"]} />}
                     >
                        <Route
                           path="gestion-clientes"
                           element={<GestionClientes />}
                        />
                     </Route>

                     <Route
                        element={<RoleGuard roles={["Gerencia", "Ventas"]} />}
                     >
                        <Route
                           path="gestion-contactos"
                           element={<GestionContactos />}
                        />
                     </Route>

                     <Route
                        element={<RoleGuard roles={["Gerencia", "Ventas"]} />}
                     >
                        <Route
                           path="gestion-obras"
                           element={<GestionObras />}
                        />
                     </Route>

                     <Route
                        element={
                           <RoleGuard
                              roles={["Gerencia", "Oficina Técnica", "Ventas"]}
                           />
                        }
                     >
                        <Route
                           path="centro-atencion"
                           element={<CentroAtencion />}
                        />
                     </Route>

                     <Route
                        element={<RoleGuard roles={["Gerencia", "Ventas"]} />}
                     >
                        <Route
                           path="registrar-tarea"
                           element={<RegistrarTarea />}
                        />
                     </Route>

                     <Route
                        element={<RoleGuard roles={["Gerencia", "Ventas"]} />}
                     >
                        <Route
                           path="cotizaciones"
                           element={<GestionCotizaciones />}
                        />
                     </Route>

                     <Route
                        element={<RoleGuard roles={["Gerencia", "Ventas"]} />}
                     >
                        <Route
                           path="cotizaciones/registrar"
                           element={
                              <WizardProvider>
                                 <RegistrarCotizacionWizard />
                              </WizardProvider>
                           }
                        />
                     </Route>
                     <Route
                        element={<RoleGuard roles={["Gerencia", "Ventas"]} />}
                     >
                        <Route
                           path="stock/piezas"
                           element={<GestionStockPiezas />}
                        />
                     </Route>
                  </Route>
               </Route>

               {/* Catch-all */}
               <Route path="*" element={<Navigate to={LOGIN_PATH} replace />} />
            </Routes>
         </Suspense>
      </Router>
   );
}
