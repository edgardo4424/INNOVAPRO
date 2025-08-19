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
      agregarEmpresa,
      eliminarEmpresa,
      guardarEdicion,
      empresasPorPagina,
      setEmpresasPorPagina,
   } = useEmpresas();

   return (
      <div className="min-h-full flex-1  flex flex-col items-center ">
         <ModuloNavegacion />
          <div className="p-3 md:py-4 md:px-6 w-full">
         {/* 🔍 Buscador + botón */}
         <div className="w-full max-w-7xl flex flex-row-reverse md:flex-row justify-between items-center gap-4 mb-5">
            <ModalAgregarEmpresa onSubmit={agregarEmpresa} />
            <div className="relative flex-1 w-full md:max-w-100">
               <Input
                  type="text"
                  placeholder="Buscar por razón social, RUC, representante..."
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
         <TablaEmpresas
            empresas={empresasPaginadas}
            onEditar={guardarEdicion}
            onEliminar={eliminarEmpresa}
         />

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
      </div>
   );
}
