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
   FileSignature,
   LayoutDashboard,
   Boxes,
   ChevronDown,
   LogOut,
   ShieldCheck,
   ScrollText,
   Receipt,
   Truck,
   Building,

   Shuffle,
   ReceiptText,

   Gift,
   HeartHandshake,
   FileMinus,
   FileSpreadsheet,
   ClipboardList,

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
   Contratos: ScrollText,
   "Registrar Contrato": FileSignature,
   "Stock de Piezas": Boxes,
   Trabajadores: Users,
   "Facturación": Receipt,
   "Gestión de Condiciones": ShieldCheck,
   "Gestión de Transporte": Truck,
   "Asistencia general":Building,
   "Pase Pedidos":Shuffle,
   "Emitir Guía":ReceiptText,

   "Beneficios":HeartHandshake,
   "Retenciones":FileMinus,
   "Planilla":ClipboardList 

};

const modulesByRole = {
   CEO: [
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
      { name: "Gestión de condiciones", path: "/condiciones" },
      { name: "Registrar Cotización", path: "/cotizaciones/registrar" },
      { name: "Contratos", path: "/contratos" },
      { name: "Registrar Contrato", path: "/contratos/registrar" },
      { name: "Stock de Piezas", path: "/stock/piezas" },
      {
         group: "Trabajadores",
         items: [
            { name: "Crear Trabajador", path: "/crear-trabajador" },
            { name: "Tabla de Trabajadores", path: "/tabla-trabajadores" },
            { name: "Dar de Baja", path: "/trabajadores-dados-de-baja" },
         ],
      },
      {
         group: "Gestión de Transporte",
         items: [
            { name: "Choferes", path: "/transporte/choferes" },
            { name: "Transportistas", path: "/transporte/transportistas" },
         ],
      },
      {
         group: "Beneficios",
         items: [
            { name: "Vacaciones", path: "/vacaciones" },
            { name: "Cts", path: "/gestion-cts" },
            { name: "Gratificacion", path: "/gratificacion" },
            { name: "Bonos", path: "/bonos" },
            { name: "Adelanto de sueldo", path: "/adelanto-sueldo" },

         ],
      },
      {
         group: "Retenciones",
         items: [
            { name: "Quinta Categoría", path: "/retenciones/calculoQuintaCategoria" },
         ],
      },
      { name: "Asistencia", path: "/asistencia-general" },
      { group: "Pase Pedidos", 
         items: [
            { name: "Pedidos Tv", path: "pedidos/pedidos-tv" },
            { name: "Pase Pedidos", path: "pedidos/pase-pedidos" },
         ]
       },
      {
         group: "Facturación",
         items: [
            { name: "Factura y Boleta", path: "/facturacion/emitir/factura-boleta" },
            { name: "Nota de Credito y Debito", path: "/facturacion/emitir/nota" },
            { name: "Guia de Remision", path: "/facturacion/emitir/guia" },
            { name: "Reporte", path: "/facturacion/reportes-venta" },
            { name: "Bandeja", path: "/facturacion/bandeja" },
            { name: "Borradores", path: "/facturacion/borradores?tipo_doc=todos&page=1&limit=10" },
         ],
      },
      {
         group: "Planilla",
         items: [
            { name: "Planilla quincenal", path: "/planilla-quincenal" },
            { name: "Planilla mensual", path: "/planilla-mensual" },

         ],
      },
      { name: "Datos de mantenimiento", path: "/data-mantenimiento" },

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
      { name: "Stock de Piezas", path: "/stock/piezas" },
   ],
   "Jefe de OT": [
      { name: "Asistencia",path: "/asistencia-area"},
   ],
   "OT": [
      { name: "Centro de Atención", path: "/centro-atencion" },
      { name: "Stock de Piezas", path: "/stock/piezas" },
   ],
   Administración: [
      { name: "Gestión de condiciones", path: "/condiciones" },
      {
         group: "Retenciones",
         items: [
            { name: "Quinta Categoría", path: "/retenciones/calculoQuintaCategoria" },
         ],
      },
   ],
   Contadora:[
      {
         group: "Trabajadores",
         items: [
            { name: "Crear Trabajador", path: "/crear-trabajador" },
            { name: "Tabla de Trabajadores", path: "/tabla-trabajadores" },
            { name: "Dar de Baja", path: "/trabajadores-dados-de-baja" },
         ],
      },
      {
         group: "Beneficios",
         items: [
            { name: "Vacaciones", path: "/vacaciones" },
            { name: "Cts", path: "/gestion-cts" },
            { name: "Gratificacion", path: "/gratificacion" },
            { name: "Bonos", path: "/bonos" },
            { name: "Adelanto de sueldo", path: "/adelanto-sueldo" },

         ],
      },
      {
         group: "Retenciones",
         items: [
            { name: "Quinta Categoría", path: "/retenciones/calculoQuintaCategoria" },
         ],
      },
      {
         group: "Planilla",
         items: [
            { name: "Planilla quincenal", path: "/planilla-quincenal" },
            { name: "Planilla mensual", path: "/planilla-mensual" },

         ],
      },
      { name: "Datos de mantenimiento", path: "/data-mantenimiento" },
      {
         group: "Facturación",
         items: [
            { name: "Factura y Boleta", path: "/facturacion/emitir/factura-boleta" },
            { name: "Nota de Credito y Debito", path: "/facturacion/emitir/nota" },
            { name: "Reporte", path: "/facturacion/reportes-venta" },
            { name: "Bandeja", path: "/facturacion/bandeja" },
            { name: "Borradores", path: "/facturacion/borradores?tipo_doc=todos&page=1&limit=10" },
         ],
      },
   ],
   "Contadora / RRHH":[
      {
         group: "Trabajadores",
         items: [
            { name: "Crear Trabajador", path: "/crear-trabajador" },
            { name: "Tabla de Trabajadores", path: "/tabla-trabajadores" },
            { name: "Dar de Baja", path: "/trabajadores-dados-de-baja" },
         ],
      },
      {
         group: "Beneficios",
         items: [
            { name: "Vacaciones", path: "/vacaciones" },
            { name: "Cts", path: "/gestion-cts" },
            { name: "Gratificacion", path: "/gratificacion" },
            { name: "Bonos", path: "/bonos" },
            { name: "Adelanto de sueldo", path: "/adelanto-sueldo" },

         ],
      },
      {
         group: "Retenciones",
         items: [
            { name: "Quinta Categoría", path: "/retenciones/calculoQuintaCategoria" },
         ],
      },
      {
         group: "Planilla",
         items: [
            { name: "Planilla quincenal", path: "/planilla-quincenal" },
            { name: "Planilla mensual", path: "/planilla-mensual" },

         ],
      },
      { name: "Datos de mantenimiento", path: "/data-mantenimiento" },
   ],
   "Asistente Facturación":[
      {
         group: "Facturación",
         items: [
            { name: "Factura y Boleta", path: "/facturacion/emitir/factura-boleta" },
            { name: "Nota de Credito y Debito", path: "/facturacion/emitir/nota" },
            { name: "Reporte", path: "/facturacion/reportes-venta" },
            { name: "Bandeja", path: "/facturacion/bandeja" },
            { name: "Borradores", path: "/facturacion/borradores?tipo_doc=todos&page=1&limit=10" },
         ],
      },
   ],
   "Jefa de Almacén":[
      {
         group: "Gestión de Transporte",
         items: [
            { name: "Choferes", path: "/transporte/choferes" },
            { name: "Transportistas", path: "/transporte/transportistas" },
         ],
      },
      {
         group: "Emitir Guía",
         items: [
              { name: "Guía de Remisión", path: "/facturacion/emitir/guia" },
            { name: "Lista de guías", path: "/facturacion/bandeja/guia-remision?page=1&limit=10" },
         ],
      },
      { name: "Asistencia",path: "/asistencia-area"},


   ],
      "Auxiliar de oficina":[
      {
         group: "Gestión de Transporte",
         items: [
            { name: "Choferes", path: "/transporte/choferes" },
            { name: "Transportistas", path: "/transporte/transportistas" },
         ],
      },
      {
         group: "Emitir Guía",
         items: [
              { name: "Guía de Remisión", path: "/facturacion/emitir/guia" },
            { name: "Lista de guías", path: "/facturacion/bandeja/guia-remision?page=1&limit=10" },
         ],
      },
      { name: "Asistencia",path: "/asistencia-area"},


   ],
   "Gerente de administración":[
      {
         group: "Facturación",
         items: [
            { name: "Factura y Boleta", path: "/facturacion/emitir/factura-boleta" },
            { name: "Guia de Remision", path: "/facturacion/emitir/guia" },
            { name: "Nota de Credito y Debito", path: "/facturacion/emitir/nota" },
            { name: "Reporte", path: "/facturacion/reportes-venta" },
            { name: "Bandeja", path: "/facturacion/bandeja" },
            { name: "Borradores", path: "/facturacion/borradores?tipo_doc=todos&page=1&limit=10" },
         ],
      },
      {
         group: "Gestión de Transporte",
         items: [
            { name: "Choferes", path: "/transporte/choferes" },
            { name: "Transportistas", path: "/transporte/transportistas" },
         ],
      },
      { name: "Asistencia general", path: "/asistencia-general" },
      {         
         name: "Asistencia del area",
         path: "/asistencia-area",
      },
      {
         group: "Trabajadores",
         items: [
            { name: "Crear Trabajador", path: "/crear-trabajador" },
            { name: "Tabla de Trabajadores", path: "/tabla-trabajadores" },
            { name: "Dar de Baja", path: "/trabajadores-dados-de-baja" },
         ],
      },
      {
         group: "Beneficios",
         items: [
            { name: "Vacaciones", path: "/vacaciones" },
            { name: "Cts", path: "/gestion-cts" },
            { name: "Gratificacion", path: "/gratificacion" },
            { name: "Bonos", path: "/bonos" },
            { name: "Adelanto de sueldo", path: "/adelanto-sueldo" },

         ],
      },
      {
         group: "Retenciones",
         items: [
            { name: "Quinta Categoría", path: "/retenciones/calculoQuintaCategoria" },
         ],
      },
      {
         group: "Planilla",
         items: [
            { name: "Planilla quincenal", path: "/planilla-quincenal" },
            { name: "Planilla mensual", path: "/planilla-mensual" },

         ],
      },
      { name: "Datos de mantenimiento", path: "/data-mantenimiento" },


   ],
   "Gerente de comercialización":[
        {         
         name: "Asistencia",
         path: "/asistencia-area",
      },
   ],
   "Jefe montadores y operadores":[
        {         
         name: "Asistencia",
         path: "/asistencia-area",
      },
   ],
      "Jefe TI":[
        {         
         name: "Asistencia",
         path: "/asistencia-area",
      },
   ],

};

// { name: "Guia de Remision", path: "/facturacion/emitir/guia" },

const isPathActive = (currentPath, itemPath) => {
   const itemUrl = new URL(itemPath, window.location.origin); // para extraer pathname de itemPath
   return currentPath.startsWith(itemUrl.pathname);
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
            className="group/collapsible scroll-hidden"
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
                                 className="cursor-pointer"
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
      <Sidebar collapsible="icon" variant="inset" className="no-scrollbar">
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

         <SidebarContent className="no-scrollbar">
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
