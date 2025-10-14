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
      obras,
      contactos,
      paginaActual,
      setPaginaActual,
      totalPaginas,
      eliminarCliente,
      agregarCliente,
      actualizarCliente,
      clientesPorPagina,
      setClientesPorPagina,
   } = useGestionClientes();

   return (
      <div className="min-h-full flex-1  flex flex-col items-center">
         <ModuloNavegacion />

         <div className="w-full max-w-7xl flex flex-row-reverse md:flex-row justify-between px-4 my-6 items-center gap-4">
            <ModalAgregarCliente agregarCliente={agregarCliente} obras={obras} contactos={contactos}/>
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
            onEliminar={eliminarCliente}
            contactos={contactos}
            obras={obras}
            actualizarCliente={actualizarCliente}
         />
{/* 
         <Paginacion
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            onPaginarAnterior={() => setPaginaActual(paginaActual - 1)}
            onPaginarSiguiente={() => setPaginaActual(paginaActual + 1)}
            setPaginaActual={setPaginaActual}
            usuariosPorPagina={clientesPorPagina}
            setUsuariosPorPagina={setClientesPorPagina}
         /> */}
      </div>
   );
}
