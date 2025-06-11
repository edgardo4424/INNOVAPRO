import React from "react";
import TablaClientes from "../components/TablaClientes";
import ModalAgregarCliente from "../components/ModalAgregarCliente";
import ModalEditarCliente from "../components/ModalEditarCliente";
import { useGestionClientes } from "../hooks/useGestionClientes";
import ModuloNavegacion from "@/shared/components/ModuloNavegacion";
import Paginacion from "@/shared/components/Paginacion";
import { Button } from "@/components/ui/button";
import { BadgePlus, X } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function GestionClientes() {
   const {
      clientesPaginados,
      busqueda,
      setBusqueda,
      paginaActual,
      setPaginaActual,
      totalPaginas,
      abrirModalAgregar,
      cerrarModalAgregar,
      abrirModalEditar,
      cerrarModalEditar,
      clienteEditando,
      modalAgregar,
      eliminarCliente,
      agregarCliente,
      actualizarCliente,
      clientesPorPagina,
      setClientesPorPagina
   } = useGestionClientes();

   return (
      <div className="dashboard-main">
         <ModuloNavegacion />

         <div className="flex flex-row-reverse md:flex-row justify-between px-4 my-4 md:my-8 items-center gap-4">
            <Button className="btn-agregar" onClick={abrirModalAgregar}>
               <BadgePlus />
               <span className="hidden md:block">Agregar Cliente</span>
            </Button>
            <div className="relative flex-1 w-full md:max-w-80 ">
               <Input
                  type="text"
                  placeholder="Buscar cliente..."
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

         <TablaClientes
            clientes={clientesPaginados}
            onEditar={abrirModalEditar}
            onEliminar={eliminarCliente}
         />

         {modalAgregar && (
            <ModalAgregarCliente
               onClose={cerrarModalAgregar}
               agregarCliente={agregarCliente}
            />
         )}
         {clienteEditando && (
            <ModalEditarCliente
               cliente={clienteEditando}
               onClose={cerrarModalEditar}
               actualizarCliente={actualizarCliente}
            />
         )}

         <Paginacion
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            onPaginarAnterior={() => setPaginaActual(paginaActual - 1)}
            onPaginarSiguiente={() => setPaginaActual(paginaActual + 1)}
            setPaginaActual={setPaginaActual}
            usuariosPorPagina={clientesPorPagina}
            setUsuariosPorPagina={setClientesPorPagina}
         />
      </div>
   );
}
