// Este archivo es el sistema de rutas del frontend. 
// Controla toda la navegación interna del sistema: define rutas públicas y privadas, aplica protección por sesión, 
// restricciones por rol, y carga condicionalmente los módulos usando lazy loading.

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
import LoaderInnova from "@/shared/components/LoaderInnova";
import { WizardProvider } from "@/modules/cotizaciones/context/WizardCotizacionContext";
import GestionTrabajadores from "@/modules/trabajadores/pages/GestionTrabajadores";
import GestionAsistencia from "@/modules/asistencia/pages/GestionAsistencia";
import PlanillaEnConstruccion from "@/modules/planilla/pages/planilla";
import GestionVacaciones from "@/modules/Beneficios/Pages/GestionVacaciones";
import GestionBonos from "@/modules/Beneficios/Pages/GestionBonos";
import EditarTrabajador from "@/modules/trabajadores/pages/EditarTrabajador";
import GestionAdelantoSueldo from "@/modules/Beneficios/Pages/GestionAdelantosSueldo";
import PlanillaQuincenal from "@/modules/planilla/pages/PlanillaQuincenal";


// Lazy load components
const Login = lazy(() => import("@/modules/auth/pages/Login"));
const DashboardHome = lazy(() =>
   import("@/modules/dashboard/pages/DashboardHome")
);
const DashboardLayout = lazy(() =>
   import("@/modules/dashboard/pages/DashboardLayout")
);
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
const CrearTrabajador = lazy(() =>
   import("@/modules/trabajadores/pages/CrearTrabajador")
);
const CentroAtencion = lazy(() =>
   import("@/modules/centroAtencion/pages/CentroAtencion")
);
const RegistrarTarea = lazy(() =>
   import("@/modules/tareas/pages/RegistrarTarea")
);
const RegistrarCotizacionWizard = lazy(() =>
   import("@/modules/cotizaciones/pages/RegistrarCotizacionWizard")
);
const GestionCotizaciones = lazy(() =>
   import("../modules/cotizaciones/pages/GestionCotizaciones")
);
const GestionCondiciones = lazy(() =>
   import("../modules/condiciones/pages/GestionCondiciones")
);
const GestionStockPiezas = lazy(() =>
   import("../modules/stockPiezas/pages/GestionStockPiezas")
);
const GestionCts = lazy(() =>
   import("../modules/cts/pages/GestionCts")
);

//* Facturacion

const Facturacion = lazy(() =>
   import("../modules/facturacion/pages/Facturacion")
);

const FacturaBoleta = lazy(() =>
   import("../modules/facturacion/factura-boleta/FacturaBoleta")
);
const GuiaRemision = lazy(() =>
   import("../modules/facturacion/guia-de-remision/GuiaRemision")
);

const FacturasAnuladas = lazy(() =>
   import("../modules/facturacion/pages/FacturasAnuladas")
);

const ListaDocumentos = lazy(() =>
   import("../modules/facturacion/list-documentos/ListaDocumentos")
);

const FacturaBorradores = lazy(() =>
   import("../modules/facturacion/lista-borradores/ListaBorradores")
);

const GestionGratificacion = lazy(() =>
   import("../modules/gratificacion/pages/GestionGratificacion")
);

const GestionDataMantenimiento = lazy(() =>
   import("../modules/dataMantenimiento/pages/GestionDataMantenimiento")
);


export default function AppRoutes() {
   const Router =
      process.env.NODE_ENV === "production" ? HashRouter : BrowserRouter; // REVISAR PARA CAMBIAR SIEMPRE A BROWSER
   
   const LOGIN_PATH =
      process.env.NODE_ENV === "production" ? "/#/login" : "/login";

   return (
      <Router>
         {/* Aplicamos Suspense para que mientras se carga un módulo de forma perezosa (lazy), se muestre el LoaderInnova. */}
         <Suspense fallback={<LoaderInnova />}>
            <Routes>
               {/* Ruta pública */}
               <Route path = {LOGIN_PATH} element={<Login />} />
               {/* Rutas protegidas */}
               <Route path="/" element={<ProtectedRoute />}> {/* TODO EL DASHBOARD PROTEGIDO */}
                  <Route element={<DashboardLayout />}>

                     <Route index element={<DashboardHome />} />

                     <Route element={<RoleGuard roles={["Gerencia"]} />}>
                        <Route
                           path="gestion-usuarios"
                           element={<GestionUsuarios />}
                        />
                        <Route
                           path="gestion-empresas"
                           element={<GestionEmpresas />}
                        />
                        <Route
                           path="crear-trabajador"
                           element={<CrearTrabajador />}
                        />
                        <Route
                           path="editar-trabajador"
                           element={<EditarTrabajador />}
                        />
                        <Route
                           path="tabla-trabajadores"
                           element={<GestionTrabajadores />}
                        />
                        <Route
                           path="asistencia/:tipo"
                           element={<GestionAsistencia />}
                        />
                        <Route
                           path="planilla"
                           element={<PlanillaEnConstruccion />}
                        />
                        <Route
                           path="vacaciones"
                           element={<GestionVacaciones />}
                        />

                        <Route
                           path="data-mantenimiento"
                           element={<GestionDataMantenimiento />}
                        />
                     </Route>

                     <Route
                        element={<RoleGuard roles={["Gerencia", "Ventas"]} />}
                     >
                        <Route
                           path="gestion-clientes"
                           element={<GestionClientes />}
                        />
                        <Route
                           path="gestion-contactos"
                           element={<GestionContactos />}
                        />
                        <Route
                           path="gestion-obras"
                           element={<GestionObras />}
                        />
                        <Route
                           path="registrar-tarea"
                           element={<RegistrarTarea />}
                        />
                        <Route
                           path="cotizaciones"
                           element={<GestionCotizaciones />}
                        />
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
                        element={
                           <RoleGuard roles={["Gerencia", "Administracion", "Ventas"]} />
                        }
                     >
                        <Route
                           path="condiciones"
                           element={
                              <WizardProvider>
                                 <GestionCondiciones />
                              </WizardProvider>
                           }
                        />
                     </Route>

                     <Route
                        element={<RoleGuard roles={["Gerencia", "Ventas", "Oficina Técnica"]} />}
                     >
                        <Route
                           path="centro-atencion"
                           element={<CentroAtencion />}
                        />
                        <Route
                           path="stock/piezas"
                           element={<GestionStockPiezas />}
                        />

                        <Route
                           path="/cotizaciones/wizard/:id"
                           element={
                              <WizardProvider>
                                 <RegistrarCotizacionWizard />
                              </WizardProvider>
                           }
                        />

                     </Route>

                     {/*    //************************INICIO-FACTURACION************************* */}
                     <Route element={<RoleGuard roles={["Gerencia", "Ventas"]} />}>
                        <Route
                           path="facturacion/generar"
                           element={
                              <Facturacion />
                           }
                        />
                     </Route>
                     <Route element={<RoleGuard roles={["Gerencia", "Ventas"]} />}>
                        <Route
                           path="facturacion/generar/factura-boleta"
                           element={
                              <FacturaBoleta />
                           }
                        />
                     </Route>

                     <Route element={<RoleGuard roles={["Gerencia", "Ventas"]} />}>
                        <Route
                           path="facturacion/generar/guia-de-remision/:tipoGuia"
                           element={
                              <GuiaRemision />
                           }
                        />
                     </Route>

                     <Route element={<RoleGuard roles={["Gerencia", "Ventas"]} />}>
                        <Route
                           path="facturacion/facturas"
                           element={<ListaDocumentos />}
                        />
                     </Route>

                     <Route element={<RoleGuard roles={["Gerencia", "Ventas"]} />}>
                        <Route
                           path="facturacion/anuladas"
                           element={<FacturasAnuladas />}
                        />
                     </Route>

                     <Route element={<RoleGuard roles={["Gerencia", "Ventas"]} />}>
                        <Route
                           path="facturacion/borradores"
                           element={<FacturaBorradores />}
                        />
                     </Route>
                     {/*    //************************FINAL-FACTURACION************************* */}


                     <Route element={<RoleGuard roles={["Gerencia"]} />}>
                        <Route
                           path="crear-trabajador"
                           element={<CrearTrabajador />}
                        />
                     </Route>

                     <Route
                        element={<RoleGuard roles={["Gerencia", "Administracion"]} />}
                     >
                        <Route
                           path="condiciones"
                           element={
                              <WizardProvider>
                                 <GestionCondiciones />
                              </WizardProvider>
                           }
                        />
                     </Route>

                     <>
                        {/* Rutas para el modulo de aistencia */}
                      
                        <Route element={<RoleGuard roles={["Gerencia"]} />}>
                           <Route
                              path="asistencia/:tipo"
                              element={<GestionAsistencia />}
                           />
                        </Route>
                        <Route element={<RoleGuard roles={["Gerencia"]} />}>
                           <Route
                              path="planilla-quincenal"
                              element={<PlanillaQuincenal />}
                           />
                        </Route>
                        <Route element={<RoleGuard roles={["Gerencia"]} />}>
                           <Route
                              path="vacaciones"
                              element={<GestionVacaciones />}
                           />
                        </Route>
                        <Route element={<RoleGuard roles={["Gerencia"]} />}>

                           <Route path="bonos" element={<GestionBonos />} />
                           <Route path="adelanto-sueldo" element={<GestionAdelantoSueldo />} />
                           <Route path="gestion-cts" element={<GestionCts/>}/>

                           <Route
                              path="gratificacion"
                              element={<GestionGratificacion />}
                           />

                        </Route>
                     </>
                  </Route>
               </Route>

               {/* Catch-all */}
               <Route path="*" element={<Navigate to={"/"} replace />} />
            </Routes>
         </Suspense>
      </Router>
   );
}
