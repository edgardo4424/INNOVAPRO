import React, { useRef } from "react";
import Notificaciones from "@/shared/components/Notificaciones";
import { SidebarTrigger } from "../../../components/ui/sidebar";
import { BadgeCheckIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import UserMenu from "./UserMenu";

export default function Header({ user, logout }) {
   return (
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 shadow-gray-200 shadow-sm  justify-between ">
         <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="" />

            <div className="flex items-center gap-2  ">
               <Badge className="bg-[#073c64]">
                  {" "}
                  <BadgeCheckIcon />
                  {user?.rol}
               </Badge>
            </div>
         </div>
         <div className="flex items-center gap-4  px-4">
            <Notificaciones />
            <UserMenu names={user.nombre} logout={logout} />
         </div>
      </header>
   );
}
