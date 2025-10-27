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
   FileSignature,
   Hammer,
   Headset,
   LayoutDashboard,
   UserCheck,
   Users,
   ScrollText
} from "lucide-react";

export default function ModuloNavegacion() {
   const { user } = useAuth();
   const navigate = useNavigate();
   const location = useLocation();

   const iconMap = {
      Dashboard: LayoutDashboard,
      "Gestión de Usuarios": Users,
      "Gestión de Filiales de Innova": Building2,
      "Gestión de Clientes": UserCheck,
      "Gestión de Contactos": Contact,
      "Gestión de Obras": Hammer,
      "Centro de Atención": Headset,
      "Registrar Tarea": ClipboardPlus,
      Cotizaciones: FileText,
      "Registrar Cotización": FileEdit,
      Contratos: ScrollText,
      "Registrar Contrato": FileSignature,
      "Contratos Documentos": FileSignature,
   };
   const modulesByRole = {
      CEO: [
         { name: "Gestión de Usuarios", path: "/gestion-usuarios" },
         { name: "Gestión de Filiales de Innova", path: "/gestion-empresas" },
         { name: "Gestión de Clientes", path: "/gestion-clientes" },
         { name: "Gestión de Contactos", path: "/gestion-contactos" },
         { name: "Gestión de Obras", path: "/gestion-obras" },
         { name: "Centro de Atención", path: "/centro-atencion" },
         { name: "Registrar Tarea", path: "/registrar-tarea" },
         { name: "Cotizaciones", path: "/cotizaciones" },
         { name: "Registrar Cotización", path: "/cotizaciones/registrar" },
         { name: "Contratos", path: "/contratos" },
         { name: "Registrar Contrato", path: "/contratos/registrar" },
         { name: "Contratos Documentos", path: "contratos/:contratoId/documentos" },
      ],
      "Técnico Comercial": [
         { name: "Gestión de Clientes", path: "/gestion-clientes" },
         { name: "Gestión de Contactos", path: "/gestion-contactos" },
         { name: "Gestión de Obras", path: "/gestion-obras" },
         { name: "Registrar Tarea", path: "/registrar-tarea" },
         { name: "Centro de Atención", path: "/centro-atencion" },
         { name: "Cotizaciones", path: "/cotizaciones" },
         { name: "Registrar Cotización", path: "/cotizaciones/registrar" },
         { name: "Contratos", path: "/contratos" },
         { name: "Registrar Contrato", path: "/contratos/registrar" },
         { name: "Contratos Documentos", path: "contratos/:contratoId/documentos" },
      ],
      "Jefe de OT": [
         { name: "Centro de Atención", path: "/centro-atencion" },
      ],
      "OT": [
         { name: "Centro de Atención", path: "/centro-atencion" },
      ],
      "Jefa de Almacén": [
         { name: "Centro de Atención", path: "/centro-atencion" },
      ],
      "Auxiliar de oficina": [
         { name: "Centro de Atención", path: "/centro-atencion" },
      ]
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
      <header className=" py-4 md:py-0 shadow-sm border-b border-slate-200 w-full ">
         <div className="max-w-7xl mx-auto px-4 ">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between min-h-16 gap-4 ">
               {/* Logo and Title */}
               <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                     <Icon className="w-6 h-6 text-white" />
                  </div>

                  <div>
                     <h1 className="text-xl font-bold text-slate-900">
                        {modules[currentIndex].name}
                     </h1>
                  </div>
               </div>

               {/* Navigation Buttons */}
               <div className="flex items-center md:space-x-3 flex-col   space-y-3 md:space-y-0 md:flex-row ">
                  {moduloAnterior && (
                     <Button
                        variant="outline"
                        className="flex items-center space-x-2 hover:bg-slate-50 transition-colors w-full md:w-auto"
                        onClick={irModuloAnterior}
                     >
                        <ArrowLeft className="w-4 h-4" />
                        <span>{moduloAnterior.name}</span>
                     </Button>
                  )}
                  {moduloSiguiente && (
                     <Button
                        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 transition-colors w-full md:w-auto"
                        onClick={irModuloSiguiente}
                     >
                        <span> {moduloSiguiente.name} </span>
                        <ArrowRight className="w-4 h-4" />
                     </Button>
                  )}
               </div>
            </div>
         </div>
      </header>
   );
}
