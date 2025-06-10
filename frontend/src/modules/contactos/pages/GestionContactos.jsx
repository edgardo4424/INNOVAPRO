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
      contactoEditando,
      modalAgregar,
      nuevoContacto,
      setNuevoContacto,
      setContactoEditando,
      busqueda,
      setBusqueda,
      agregarContacto,
      guardarEdicion,
      eliminarContacto,
      abrirModalEditar,
      cerrarModalEditar,
      abrirModalAgregar,
      cerrarModalAgregar,
      contactosPorPagina,
      setContactosPorPagina
   } = useContactos();

   return (
      <div className="dashboard-main">
         <ModuloNavegacion />

         {/* 🔍 Buscador + botón */}
         <div className="flex flex-row-reverse md:flex-row justify-between px-4 my-4 md:my-8 items-center gap-4">
            <Button className="btn-agregar" onClick={abrirModalAgregar}>
               <BadgePlus />
               <span className="hidden md:block">Agregar Contacto</span>
            </Button>
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
            onEditar={abrirModalEditar}
            onEliminar={eliminarContacto}
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

         {/* 🧾 Modal Agregar */}
         {modalAgregar && (
            <ModalAgregarContacto
               contacto={nuevoContacto}
               setContacto={setNuevoContacto}
               clientes={clientes}
               obras={obras}
               onCancel={cerrarModalAgregar}
               onSubmit={agregarContacto}
            />
         )}

         {/* 🛠 Modal Editar */}
         {contactoEditando && (
            <ModalEditarContacto
               contacto={contactoEditando}
               setContacto={setContactoEditando}
               clientes={clientes}
               obras={obras}
               onCancel={cerrarModalEditar}
               onSubmit={guardarEdicion}
            />
         )}
      </div>
   );
}
