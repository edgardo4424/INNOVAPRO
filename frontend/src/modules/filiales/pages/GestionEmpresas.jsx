import useEmpresas from "../hooks/useEmpresas";
import TablaEmpresas from "../components/TablaEmpresas";
import ModalAgregarEmpresa from "../components/ModalAgregarEmpresa";
import ModalEditarEmpresa from "../components/ModalEditarEmpresa";
import ModuloNavegacion from "@/shared/components/ModuloNavegacion";
import Paginacion from "@/shared/components/Paginacion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BadgePlus, UserPlus, X } from "lucide-react";

export default function GestionEmpresas() {
   const {
      empresasPaginadas,
      totalPaginas,
      paginaActual,
      setPaginaActual,
      busqueda,
      setBusqueda,
      modalAgregar,
      abrirModalAgregar,
      cerrarModalAgregar,
      empresaEditando,
      abrirModalEditar,
      cerrarModalEditar,
      nuevaEmpresa,
      setNuevaEmpresa,
      agregarEmpresa,
      eliminarEmpresa,
      guardarEdicion,
      setEmpresaEditando,
      empresasPorPagina,
      setEmpresasPorPagina,
   } = useEmpresas();

   return (
      <div className="container min-h-full ">
         <ModuloNavegacion />
         {/* 🔍 Buscador + botón */}
         <div className="flex flex-row-reverse md:flex-row justify-between px-4 my-4 md:my-8 items-center gap-4">
            <Button className="btn-agregar" onClick={abrirModalAgregar}>
               <BadgePlus />
               <span className="hidden md:block">Agregar Filial</span>
            </Button>
            <div className="relative flex-1 w-full md:max-w-80 ">
               <Input
                  type="text"
                  placeholder="Buscar por razón social, RUC, representante..."
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
         <TablaEmpresas
            empresas={empresasPaginadas}
            onEditar={abrirModalEditar}
            onEliminar={eliminarEmpresa}
         />

         {/* 🧾 Modal Agregar */}
         {modalAgregar && (
            <ModalAgregarEmpresa
               empresa={nuevaEmpresa}
               setEmpresa={setNuevaEmpresa}
               onCancel={cerrarModalAgregar}
               onSubmit={agregarEmpresa}
            />
         )}

         {/* 🛠 Modal Editar */}
         {empresaEditando && (
            <ModalEditarEmpresa
               empresa={empresaEditando}
               setEmpresa={setEmpresaEditando}
               onCancel={cerrarModalEditar}
               onSubmit={guardarEdicion}
            />
         )}

         {/* 📌 Paginación */}
         <Paginacion
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            onPaginarAnterior={() => setPaginaActual(paginaActual - 1)}
            onPaginarSiguiente={() => setPaginaActual(paginaActual + 1)}
            setPaginaActual={setPaginaActual}
            setUsuariosPorPagina={setEmpresasPorPagina}
            usuariosPorPagina={empresasPorPagina}
         />
      </div>
   );
}
