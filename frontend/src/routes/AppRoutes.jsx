// Este archivo es el sistema de rutas del frontend. 
// Controla toda la navegación interna del sistema: define rutas públicas y privadas, aplica protección por sesión, 
// restricciones por rol, y carga condicionalmente los módulos usando lazy loading.

import GestionAsistencia from "@/modules/asistencia/pages/GestionAsistencia";
import GestionAdelantoSueldo from "@/modules/Beneficios/Pages/GestionAdelantosSueldo";
import GestionBonos from "@/modules/Beneficios/Pages/GestionBonos";
import GestionVacaciones from "@/modules/Beneficios/Pages/GestionVacaciones";
import { WizardProvider } from "@/modules/cotizaciones/context/WizardCotizacionContext";
import { WizardContratoProvider } from "@/modules/contratos/context/WizardContratoContext";
import PlanillaEnConstruccion from "@/modules/planilla/pages/planilla";
import EditarTrabajador from "@/modules/trabajadores/pages/EditarTrabajador";
import GestionTrabajadores from "@/modules/trabajadores/pages/GestionTrabajadores";
import LoaderInnova from "@/shared/components/LoaderInnova";
import { Suspense, lazy } from "react";
import {
   BrowserRouter,
   HashRouter,
   Navigate,
   Route,
   Routes,
} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import RoleGuard from "./rol.guard";


import PlanillaMensual from "@/modules/planilla/pages/CalculoPlanillaMensual";
import GestionPlanillaMensual from "@/modules/planilla/pages/GestionPlanillaMensual";
import { BandejaProvider } from "@/modules/facturacion/context/BandejaContext";
import GestionAsistenciaAutomatica from "@/modules/asistencia/pages/GestionAsistenciaAutomatica";

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

/* RUTAS PARAS CONTRATOS */
const RegistrarContratoWizard = lazy(() =>
   import("@/modules/contratos/pages/RegistrarContratoWizard")
);
const GestionContratos = lazy(() =>
   import("@/modules/contratos/pages/GestionContratos")
);
const ContratoDocumentos = lazy(() =>
   import("@/modules/contratos/pages/ContratoDocumentos")
);

/* RUTAS PARA COTIZACIONES */
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
const EmitirRoutes = lazy(() =>
   import("../modules/facturacion/routes/EmitirRoutes")
);

const Reportes = lazy(() =>
   import("../modules/facturacion/pages/Reporte")
);

const BandejaRoutes = lazy(() =>
   import("../modules/facturacion/routes/BandejaRoutes")
);



const Borrador = lazy(() =>
   import("../modules/facturacion/pages/Borrador")
);

const TransporteRoutes = lazy(() =>
   import("../modules/transporte/routes/TransporteRoutes")
);

const GestionGratificacion = lazy(() =>
   import("../modules/gratificacion/pages/GestionGratificacion")
);

const GestionPlanillaQuincenal = lazy(() =>
   import("../modules/planilla/pages/GestionPlanillaQuincenal")
);

const PedidosRoutes = lazy(() =>
   import("../modules/pasePedidos/routes/PedidosRoutes")
);


const CalculoQuintaCategoria = lazy(() =>
   import("../modules/retenciones/pages/CalculoQuintaCategoria"))

const GestionDataMantenimiento = lazy(() =>
   import("../modules/dataMantenimiento/pages/GestionDataMantenimiento")
);

const GestionTrabajadoresDadosDeBaja = lazy(() => import("../modules/trabajadoresDadosDeBaja/pages/GestionTrabajadoresDadosDeBaja"));


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
               <Route path="/login" element={<Login />} />
               {/* Rutas protegidas */}
               <Route path="/" element={<ProtectedRoute />}> {/* TODO EL DASHBOARD PROTEGIDO */}
                  <Route element={<DashboardLayout />}>

                     <Route index element={<DashboardHome />} />

                     <Route element={<RoleGuard roles={["CEO","Gerente de administración","Contadora","Contadora / RRHH"]} />}>
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
                        element={<RoleGuard roles={["CEO", "Técnico Comercial"]} />}
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
                        <Route
                           path="/cotizaciones/wizard/:id"
                           element={
                              <WizardProvider>
                                 <RegistrarCotizacionWizard />
                              </WizardProvider>
                           }
                        />
                         {/* CONTRATOS */}
                        <Route
                           path="contratos"
                           element={<GestionContratos />}
                        />
                        <Route
                           path="contratos/registrar"
                           element={
                              <WizardContratoProvider>
                                 <RegistrarContratoWizard />
                              </WizardContratoProvider>}
                        />
                        <Route
                           path="contratos/wizard/:cotizacionId"
                           element={
                              <WizardContratoProvider>
                                 <RegistrarContratoWizard />
                              </WizardContratoProvider>
                           }
                        />
                        <Route
                           path="contratos/:contratoId/documentos"
                           element={<ContratoDocumentos />}
                        />
                     </Route>

                     <Route
                        element={
                           <RoleGuard roles={["CEO", "Gerente de administración ", "Técnico Comercial"]} />
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
                     //! -- Rutas asignada para OT 
                     <Route
                        element={<RoleGuard roles={["CEO", "Técnico Comercial", "Jefe de OT","OT"]} />}
                     >
                        <Route
                           path="centro-atencion"
                           element={<CentroAtencion />}
                        />
                        <Route
                           path="stock/piezas"
                           element={<GestionStockPiezas />}
                        />
                     </Route>

                     {/*    //************************INICIO-FACTURACION************************* */}


                     <Route element={<RoleGuard roles={["CEO", "Gerente de administración","Jefa de Almacén","Asistente Facturación","Contadora","Contadora / RRHH"]} />}>

                        <Route
                           path="facturacion/emitir/*"
                           element={
                              <EmitirRoutes />
                           }
                        />

                        <Route
                           path="facturacion/bandeja/*"
                           element={<BandejaRoutes />}
                        />

                        <Route
                           path="facturacion/reportes-venta"
                           element={
                                 <BandejaProvider>
                                    <Reportes />
                                 </BandejaProvider>
                                 }
                        />

                        <Route element={<RoleGuard roles={["CEO", "Gerente de administración","Asistente Facturación","Contadora","Contadora / RRHH"]} />}>

                           <Route
                           path="facturacion/borradores"
                           element={
                                 <BandejaProvider>
                                    <Borrador />
                                 </BandejaProvider>
                                 }
                        />
                        </Route>

                     </Route>
                     {/*    //************************FINAL-FACTURACION************************* */}

                     {/* // ! RUTAS DE TRANSPORTE */}
                     <Route element={<RoleGuard roles={["CEO","Jefa de Almacén","Gerente de administración"]} />}>
                        <Route
                           path="transporte/*"
                           element={
                              <TransporteRoutes />
                           }
                        />
                     </Route>
                     {/* // ! RUTAS DE TRANSPORTE FIN */}

                     <Route element={<RoleGuard roles={["CEO","Jefa de Almacén","Gerente de administración",,"Auxiliar de oficina"]} />}>
                        <Route
                           path="pedidos/*"
                           element={
                              <PedidosRoutes />
                           }
                        />
                     </Route>

                     <Route element={<RoleGuard roles={["CEO","Gerente de administración"]} />}>
                        <Route
                           path="crear-trabajador"
                           element={<CrearTrabajador />}
                        />
                     </Route>

                     <Route
                        element={<RoleGuard roles={["CEO", "Administracion","Gerente de administración","Contadora","Contadora / RRHH"]} />}
                     >
                        <Route
                           path="condiciones"
                           element={
                              <WizardProvider>
                                 <GestionCondiciones />
                              </WizardProvider>
                           }
                        />

                        <Route
                           path="retenciones/calculoQuintaCategoria"
                           element={<CalculoQuintaCategoria />}
                        />
                     </Route>

                     <>
                        {/* Rutas para el modulo de aistencia */}
                        <Route element={<RoleGuard roles={["CEO","Gerente de administración"]} />}>
                           <Route
                              path="asistencia-general"
                              element={<GestionAsistencia />}
                           />
                        </Route>
                         <Route
                              path="asistencia-area"
                              element={<GestionAsistenciaAutomatica />}
                           />
                        <Route element={<RoleGuard roles={["CEO","Gerente de administración","Contadora","Contadora / RRHH"]} />}>
                           <Route
                              path="planilla-quincenal"
                              element={<GestionPlanillaQuincenal />}
                           />
                           <Route
                              path="planilla-mensual"
                              element={<GestionPlanillaMensual />}
                           />
                        </Route>
                        <Route element={<RoleGuard roles={["CEO","Gerente de administración","Contadora","Contadora / RRHH"]} />}>
                           <Route
                              path="vacaciones"
                              element={<GestionVacaciones />}
                           />
                        </Route>
                        <Route element={<RoleGuard roles={["CEO","Gerente de administración","Contadora","Contadora / RRHH"]} />}>

                           <Route path="bonos" element={<GestionBonos />} />
                           <Route path="adelanto-sueldo" element={<GestionAdelantoSueldo />} />
                           <Route path="gestion-cts" element={<GestionCts />} />

                           <Route
                              path="gratificacion"
                              element={<GestionGratificacion />}
                           />

                           <Route
                              path="trabajadores-dados-de-baja"
                              element={<GestionTrabajadoresDadosDeBaja />}
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
