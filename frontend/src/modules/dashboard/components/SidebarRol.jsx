import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
   Users,
   Building2,
   UserCheck,
   Contact,
   Hammer,
   Headset,
   ClipboardPlus,
   FileText,
   FileEdit,
   LayoutDashboard,
   EllipsisVertical,
   Boxes,
   ScrollText,
} from "lucide-react";
import {
   Sidebar,
   SidebarContent,
   SidebarFooter,
   SidebarGroup,
   SidebarGroupContent,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mapa de íconos
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
   "Stock de Piezas":Boxes,
   "Facturación":ScrollText
};

// Módulos por rol
const modulesByRole = {
   Gerencia: [
      { name: "Gestión de Usuarios", path: "/gestion-usuarios" },
      { name: "Gestión de Filiales de Innova", path: "/gestion-empresas" },
      { name: "Gestión de Clientes", path: "/gestion-clientes" },
      { name: "Gestión de Contactos", path: "/gestion-contactos" },
      { name: "Gestión de Obras", path: "/gestion-obras" },
      { name: "Centro de Atención", path: "/centro-atencion" },
      { name: "Registrar Tarea", path: "/registrar-tarea" },
      { name: "Cotizaciones", path: "/cotizaciones" },
      { name: "Registrar Cotización", path: "/cotizaciones/registrar" },
      { name: "Stock de Piezas", path: "/stock/piezas" },
      { name: "Facturación", path: "/facturacion" },

   ],
   Ventas: [
      { name: "Gestión de Clientes", path: "/gestion-clientes" },
      { name: "Gestión de Contactos", path: "/gestion-contactos" },
      { name: "Gestión de Obras", path: "/gestion-obras" },
      { name: "Registrar Tarea", path: "/registrar-tarea" },
      { name: "Centro de Atención", path: "/centro-atencion" },
      { name: "Cotizaciones", path: "/cotizaciones" },
      { name: "Registrar Cotización", path: "/cotizaciones/registrar" },
      { name: "Stock de Piezas", path: "/stock/piezas" },
   ],
   "Oficina Técnica": [
      { name: "Centro de Atención", path: "/centro-atencion" },
      { name: "Stock de Piezas", path: "/stock/piezas" },
   ],
   Almacén: [],
   Administración: [],
   Clientes: [],
};

export function AppSidebar() {
   const { user } = useAuth();
   const navigate = useNavigate();
   const location = useLocation(); // <-- Esto te da la ruta actual

   const modules = modulesByRole[user?.rol] || [];

   return (
      <Sidebar collapsible="icon" variant="inset">
         <SidebarHeader>
            <SidebarMenuButton
               size="lg"
               className="bg-gray-100/10 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground "
            >
               <Avatar className="h-8 w-8 rounded-lg grayscale">
                  <AvatarImage src="/images/shadcn.jpg" alt={user.nombre} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
               </Avatar>
               <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.nombre}</span>
                  <span className=" truncate text-xs">{user.email}</span>
               </div>
            </SidebarMenuButton>
         </SidebarHeader>

         <SidebarContent>
            <SidebarGroup>
               <SidebarGroupContent>
                  <SidebarMenu>
                     {/* Ítem fijo Dashboard */}
                     <SidebarMenuItem
                        key="Dashboard"
                        className={
                           location.pathname === "/"
                              ? "bg-gray-100/20 rounded-md"
                              : ""
                        }
                     >
                        <SidebarMenuButton onClick={() => navigate("/")}>
                           <LayoutDashboard className="mr-2" />
                           <span>Dashboard</span>
                        </SidebarMenuButton>
                     </SidebarMenuItem>

                     {modules.map((module) => {
                        const Icon = iconMap[module.name] || LayoutDashboard;
                        const isActive = location.pathname === module.path;

                        return (
                           <SidebarMenuItem
                              key={module.name}
                              className={
                                 isActive ? "bg-gray-100/20 rounded-md" : ""
                              }
                           >
                              <SidebarMenuButton
                                 onClick={() => navigate(module.path)}
                              >
                                 <Icon className="mr-2" />
                                 <span>{module.name}</span>
                              </SidebarMenuButton>
                           </SidebarMenuItem>
                        );
                     })}
                  </SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>
         </SidebarContent>

         <SidebarFooter className="opacity-50 flex items-center">
            <img
               src="/images/logo_white.png"
               alt="Logo Innova"
               className="w-[70%] aspect-[4/3] object-cover select-none"
            />
         </SidebarFooter>
      </Sidebar>
   );
}
