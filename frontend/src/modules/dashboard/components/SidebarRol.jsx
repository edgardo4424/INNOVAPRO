"use client";

import React from "react";

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
   Boxes,
   ChevronDown,
   LogOut,
   Settings,
   ScrollText,
} from "lucide-react";
import {
   Sidebar,
   SidebarContent,
   SidebarFooter,
   SidebarGroup,
   SidebarGroupContent,
   SidebarGroupLabel,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   SidebarMenuSub,
   SidebarMenuSubButton,
   SidebarMenuSubItem,
   SidebarRail,
} from "@/components/ui/sidebar";
import {
   Collapsible,
   CollapsibleContent,
   CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

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
   "Stock de Piezas": Boxes,
   Trabajadores: Users,
   "Facturación":ScrollText

};

const modulesByRole = {
   Gerencia: [
      {
         group: "Centro de gestión ",
         items: [
            { name: "Usuarios", path: "/gestion-usuarios" },
            {
               name: "Filiales de Innova",
               path: "/gestion-empresas",
            },
            { name: "Clientes", path: "/gestion-clientes" },
            { name: "Contactos", path: "/gestion-contactos" },
            { name: "Obras", path: "/gestion-obras" },
         ],
      },
      { name: "Centro de Atención", path: "/centro-atencion" },
      { name: "Registrar Tarea", path: "/registrar-tarea" },
      { name: "Cotizaciones", path: "/cotizaciones" },
      { name: "Registrar Cotización", path: "/cotizaciones/registrar" },
      { name: "Stock de Piezas", path: "/stock/piezas" },
      {
         group: "Trabajadores",
         items: [
            { name: "Crear Trabajador", path: "/crear-trabajador" },
            { name: "Tabla de Trabajadores", path: "/tabla-trabajadores" },
         ],
      },
      {
         group: "Asistencia",
         items: [
            { name: "Encofrados ", path: "/asistencia/encofrados" },
            {
               name: "Andamios Eléctricos",
               path: "/asistencia/andamios-electricos",
            },
            { name: "Indek Andina", path: "/asistencia/indek-andina" },
            {
               name: "Innova Rental",
               path: "/innova-rental",
            },
         ],
      },
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

const isPathActive = (currentPath, itemPath) => {
   if (itemPath === "/" && currentPath === "/") return true;
   if (itemPath !== "/" && currentPath.startsWith(itemPath)) return true;
   return false;
};

const getUserInitials = (name) => {
   return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
};

export function AppSidebar() {
   const { user, logout } = useAuth();
   const navigate = useNavigate();
   const location = useLocation();

   const modules = modulesByRole[user?.rol] || [];

   const renderMenuItem = (item) => {
      const Icon = iconMap[item.name] || LayoutDashboard;
      const isActive = isPathActive(location.pathname, item.path);

      return (
         <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
               onClick={() => navigate(item.path)}
               isActive={isActive}
               tooltip={item.name}
            >
               <Icon className="size-4" />
               <span>{item.name}</span>
            </SidebarMenuButton>
         </SidebarMenuItem>
      );
   };

   const renderMenuGroup = (group) => {
      const GroupIcon = iconMap[group.group] || Users;
      const hasActiveItem = group.items.some((item) =>
         isPathActive(location.pathname, item.path)
      );

      return (
         <Collapsible
            key={group.group}
            defaultOpen={hasActiveItem}
            className="group/collapsible"
         >
            <SidebarMenuItem>
               <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={group.group}>
                     <GroupIcon className="size-4" />
                     <span>{group.group}</span>
                     <ChevronDown className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                  </SidebarMenuButton>
               </CollapsibleTrigger>
               <CollapsibleContent>
                  <SidebarMenuSub>
                     {group.items.map((subItem) => {
                        const isActive = isPathActive(
                           location.pathname,
                           subItem.path
                        );
                        return (
                           <SidebarMenuSubItem key={subItem.name}>
                              <SidebarMenuSubButton
                                 onClick={() => navigate(subItem.path)}
                                 isActive={isActive}
                              >
                                 <span>{subItem.name}</span>
                              </SidebarMenuSubButton>
                           </SidebarMenuSubItem>
                        );
                     })}
                  </SidebarMenuSub>
               </CollapsibleContent>
            </SidebarMenuItem>
         </Collapsible>
      );
   };

   return (
      <Sidebar collapsible="icon" variant="inset">
         <SidebarHeader>
            <SidebarMenu>
               <SidebarMenuItem>
                  <DropdownMenu>
                     <SidebarMenuButton
                        size="lg"
                        className="bg-gray-100/10 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground "
                     >
                        <Avatar className="h-8 w-8 rounded-lg grayscale">
                           <AvatarImage
                              src="/images/shadcn.jpg"
                              alt={user.nombre}
                           />
                           <AvatarFallback className="rounded-lg">
                              CN
                           </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                           <span className="truncate font-medium">
                              {user.nombre}
                           </span>
                           <span className=" truncate text-xs">
                              {user.email}
                           </span>
                        </div>
                     </SidebarMenuButton>
                  </DropdownMenu>
               </SidebarMenuItem>
            </SidebarMenu>
         </SidebarHeader>

         <SidebarContent>
            <SidebarGroup>
               <SidebarGroupContent>
                  <SidebarMenu>
                     <SidebarMenuItem>
                        <SidebarMenuButton
                           onClick={() => navigate("/")}
                           isActive={location.pathname === "/"}
                           tooltip="Dashboard"
                        >
                           <LayoutDashboard className="size-4" />
                           <span>Dashboard</span>
                        </SidebarMenuButton>
                     </SidebarMenuItem>
                     {modules.map((module) => {
                        if ("group" in module) {
                           return renderMenuGroup(module);
                        }
                        return renderMenuItem(module);
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

         <SidebarRail />
      </Sidebar>
   );
}
