import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { Sidebar, Header } from "../components";
import "../styles/dashboard.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/SidebarRol";
import { SidebarInset, SidebarTrigger } from "../../../components/ui/sidebar";

export default function DashboardLayout() {
   const { user, logout } = useAuth();
   console.log('user', user);
   const [sidebarOpen, setSidebarOpen] = useState(false);

   if (!user) return <p className="error">Error: Usuario no autenticado.</p>;

   return (
      <SidebarProvider>
         <AppSidebar />
         <SidebarInset className="overflow-hidden">
            <div className="w-full overflow-hidden rounded-md  h-full">
               <Header
                  user={user}
                  logout={logout}
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
               />
               <section className="h-full">
                  <Outlet />
               </section>
            </div>
         </SidebarInset>
      </SidebarProvider>

   );
}