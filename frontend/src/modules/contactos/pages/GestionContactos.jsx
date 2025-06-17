import useContactos from "../hooks/useContactos";
import TablaContactos from "../components/TablaContactos";
import ModalAgregarContacto from "../components/ModalAgregarContacto";
import ModalEditarContacto from "../components/ModalEditarContacto";
import Paginacion from "@/shared/components/Paginacion";
import ModuloNavegacion from "@/shared/components/ModuloNavegacion";
import { Button } from "@/components/ui/button";
import { BadgePlus, X } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function GestionContactos() {
   const {
      contactosPaginados,
      totalPaginas,
      paginaActual,
      setPaginaActual,
      clientes,
      obras,
      busqueda,
      setBusqueda,
      agregarContacto,
      guardarEdicion,
      eliminarContacto,
      contactosPorPagina,
      setContactosPorPagina,
   } = useContactos();

   return (
      <div className="dashboard-main">
         <ModuloNavegacion />

         {/* 🔍 Buscador + Moda de agregar oontacto */}
         <div className="flex flex-row-reverse md:flex-row justify-between px-4 my-4 md:my-8 items-center gap-4">
            <ModalAgregarContacto
               clientes={clientes}
               obras={obras}
               onSubmit={agregarContacto}
            />
            <div className="relative flex-1 w-full md:max-w-80 ">
               <Input
                  type="text"
                  placeholder="Buscar contacto"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pr-14 md:pr-0"
               />
               <X
                  onClick={() => setBusqueda("")}
                  className="absolute top-1/2 -translate-y-1/2 right-2 size-4"
               />
            </div>
         </div>

         {/* 📋 Tabla */}
         <TablaContactos
            contactos={contactosPaginados}
            onEliminar={eliminarContacto}
            clientes={clientes}
            obras={obras}
            onSubmit={guardarEdicion}
         />

         {/* 📌 Paginación */}
         <Paginacion
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            onPaginarAnterior={() => setPaginaActual(paginaActual - 1)}
            onPaginarSiguiente={() => setPaginaActual(paginaActual + 1)}
            setUsuariosPorPagina={setContactosPorPagina}
            setPaginaActual={setPaginaActual}
            usuariosPorPagina={contactosPorPagina}
         />
      </div>
   );
}
