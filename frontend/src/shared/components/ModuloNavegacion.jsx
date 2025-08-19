import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import {
   ArrowLeft,
   ArrowRight,
   Building2,
   ClipboardPlus,
   Contact,
   FileEdit,
   FileText,
   Hammer,
   Headset,
   LayoutDashboard,
   UserCheck,
   Users,
} from "lucide-react";
import Typography from "@/components/ui/Typography";

export default function ModuloNavegacion() {
   const { user } = useAuth();
   const navigate = useNavigate();
   const location = useLocation();

   const iconMap = {
      Dashboard: LayoutDashboard,
      "Gestión de Usuarios": Users,
      "Gestión de Filiales": Building2,
      "Gestión de Clientes": UserCheck,
      "Gestión de Contactos": Contact,
      "Gestión de Obras": Hammer,
      "Centro de Atención": Headset,
      "Registrar Tarea": ClipboardPlus,
      Cotizaciones: FileText,
      "Registrar Cotización": FileEdit,
   };
   const modulesByRole = {
      Gerencia: [
         { name: "Gestión de Usuarios", path: "/gestion-usuarios" },
         { name: "Gestión de Filiales", path: "/gestion-empresas" },
         { name: "Gestión de Clientes", path: "/gestion-clientes" },
         { name: "Gestión de Contactos", path: "/gestion-contactos" },
         { name: "Gestión de Obras", path: "/gestion-obras" },
         { name: "Centro de Atención", path: "/centro-atencion" },
         { name: "Registrar Tarea", path: "/registrar-tarea" },
         { name: "Cotizaciones", path: "/cotizaciones" },
         { name: "Registrar Cotización", path: "/cotizaciones/registrar" },
      ],
      Ventas: [
         { name: "Gestión de Clientes", path: "/gestion-clientes" },
         { name: "Gestión de Contactos", path: "/gestion-contactos" },
         { name: "Gestión de Obras", path: "/gestion-obras" },
         { name: "Registrar Tarea", path: "/registrar-tarea" },
         { name: "Centro de Atención", path: "/centro-atencion" },
         { name: "Cotizaciones", path: "/cotizaciones" },
         { name: "Registrar Cotización", path: "/cotizaciones/registrar" },
      ],
      "Oficina Técnica": [
         { name: "Centro de Atención", path: "/centro-atencion" },
      ],
      // Agrega otros roles si aplica
   };

   const modules = modulesByRole[user?.rol] || [];
   const currentPath = location.pathname;
   const currentIndex = modules.findIndex((mod) => mod.path === currentPath);

   const moduloAnterior = currentIndex > 0 ? modules[currentIndex - 1] : null;
   const moduloSiguiente =
      currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null;

   const irModuloAnterior = () => {
      if (moduloAnterior) navigate(moduloAnterior.path);
   };

   const irModuloSiguiente = () => {
      if (moduloSiguiente) navigate(moduloSiguiente.path);
   };

   const Icon = iconMap[modules[currentIndex].name] || LayoutDashboard;
   return (
      <header className=" p-5 md:py-0 shadow-xs border-b border-slate-200 w-full ">
        
            <div className="flex flex-col md:flex-row justify-between min-h-16 gap-4">
               {/* Logo and Title */}
               <div className="flex justify-center items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                     <Icon className="w-6 h-6 text-white" />
                  </div>

                  <Typography.Title> {modules[currentIndex].name}</Typography.Title>
               </div>

               {/* Navigation Buttons */}
               <div className="flex justify-center items-center gap-3">
                  {moduloAnterior && (
                     <Button
                        variant="outline"
                        className="flex items-center transition-colors md:w-[164px] text-xs"
                        onClick={irModuloAnterior}
                     >
                        <ArrowLeft className="w-4 h-4" />
                        <span>{moduloAnterior.name}</span>
                     </Button>
                  )}
                  {moduloSiguiente && (
                     <Button
                        className="flex items-center transition-colors md:w-[164px] text-xs"
                        onClick={irModuloSiguiente}
                     >
                        <span> {moduloSiguiente.name} </span>
                        <ArrowRight className="w-4 h-4" />
                     </Button>
                  )}
               </div>
            </div>
      
      </header>
   );
}
