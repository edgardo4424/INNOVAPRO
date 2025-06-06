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
   const [sidebarOpen, setSidebarOpen] = useState(false);

   if (!user) return <p className="error">Error: Usuario no autenticado.</p>;

   return (
      <SidebarProvider>
         <AppSidebar />
         <SidebarInset>
            <div className="w-full overflow-hidden rounded-md  h-full">
               <Header
                  user={user}
                  logout={logout}
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
               />
               <section className="">
                  <Outlet />
               </section>
            </div>
         </SidebarInset>
      </SidebarProvider>

   );
}