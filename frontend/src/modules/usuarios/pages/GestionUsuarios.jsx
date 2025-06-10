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
      abrirModalAgregar,
      cerrarModalAgregar,
      modalAgregar,
      nuevoUsuario,
      setNuevoUsuario,
      agregarUsuario,
      usuarioEditando,
      abrirModalEditar,
      cerrarModalEditar,
      guardarEdicion,
      eliminarUsuario,
      setUsuarioEditando,
      errores,
      usuariosPorPagina,
      setUsuariosPorPagina,
   } = useUsuarios();

   return (
      <div className="container min-h-full ">
         <ModuloNavegacion />
         {/* 🔍 Buscador + botón */}
         <div className="flex flex-row-reverse md:flex-row justify-between px-4 my-4 md:my-8 items-center gap-4">
            <Button className="btn-agregar" onClick={abrirModalAgregar}>
               <UserPlus />
               <span className="hidden md:block">Agregar Usuario</span>
            </Button>
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
            onEditar={abrirModalEditar}
            onEliminar={eliminarUsuario}
         />
         

         {/* 🧾 Modal Agregar */}
         {modalAgregar && (
            <ModalAgregarUsuario
               usuario={nuevoUsuario}
               setUsuario={setNuevoUsuario}
               onCancel={cerrarModalAgregar}
               onSubmit={agregarUsuario}
               errores={errores}
            />
         )}

         {/* 🛠 Modal Editar */}
         {usuarioEditando && (
            <ModalEditarUsuario
               usuario={usuarioEditando}
               setUsuario={setUsuarioEditando}
               onCancel={cerrarModalEditar}
               onSubmit={guardarEdicion}
               errores={errores}
            />
         )}

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
