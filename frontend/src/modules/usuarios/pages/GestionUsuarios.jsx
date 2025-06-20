import useUsuarios from "../hooks/useUsuarios";
import TablaUsuarios from "../components/TablaUsuarios";
import ModalAgregarUsuario from "../components/ModalAgregarUsuario";
import ModalEditarUsuario from "../components/ModalEditarUsuario";
import ModuloNavegacion from "@/shared/components/ModuloNavegacion";
import Paginacion from "@/shared/components/Paginacion";
import "../../../styles/dashboard.css";
import { PlusCircle, UserPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function GestionUsuarios() {
   const {
      usuariosPaginados,
      totalPaginas,
      paginaActual,
      setPaginaActual,
      busqueda,
      setBusqueda,
      agregarUsuario,
      guardarEdicion,
      eliminarUsuario,
      usuariosPorPagina,
      setUsuariosPorPagina,
   } = useUsuarios();

   return (
      <div className=" min-h-full flex-1  flex flex-col items-center">
         <ModuloNavegacion />
         {/* 🔍 Buscador + botón */}
         <div className="w-full max-w-7xl flex flex-row-reverse md:flex-row justify-between px-4 my-6 items-center gap-4">
            <ModalAgregarUsuario onSubmit={agregarUsuario} />
            <div className="relative flex-1 w-full md:max-w-80 ">
               <Input
                  type="text"
                  placeholder="Busca por usuario email o rol"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full"
               />
               <X
                  onClick={() => setBusqueda("")}
                  className="absolute top-1/2 -translate-y-1/2 right-2 size-4"
               />
            </div>
         </div>

         {/* 📋 Tabla */}
         <TablaUsuarios
            usuarios={usuariosPaginados}
            onEliminar={eliminarUsuario}
            onSubmit={guardarEdicion}
         />

         {/* 📌 Paginación */}
         <Paginacion
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            onPaginarAnterior={() => setPaginaActual(paginaActual - 1)}
            onPaginarSiguiente={() => setPaginaActual(paginaActual + 1)}
            usuariosPorPagina={usuariosPorPagina}
            setUsuariosPorPagina={setUsuariosPorPagina}
            setPaginaActual={setPaginaActual}
         />
      </div>
   );
}
