import useObras from "../hooks/useObras";
import TablaObras from "../components/TablaObras";
import ModalAgregarObra from "../components/ModalAgregarObra";
import ModalEditarObra from "../components/ModalEditarObra";
import ModuloNavegacion from "@/shared/components/ModuloNavegacion";
import Paginacion from "@/shared/components/Paginacion";
import { Button } from "@/components/ui/button";
import { BadgePlus, X } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function GestionObras() {
   const {
      obrasPaginadas,
      totalPaginas,
      paginaActual,
      setPaginaActual,
      busqueda,
      setBusqueda,
      abrirModalAgregar,
      cerrarModalAgregar,
      modalAgregar,
      nuevaObra,
      setNuevaObra,
      agregarObra,
      obraEditando,
      abrirModalEditar,
      cerrarModalEditar,
      guardarEdicion,
      eliminarObra,
      setObraEditando,
      clientes,
      obrasPorPagina,
      setObrasPorPagina
   } = useObras();

   return (
      <div className="dashboard-main">
         <ModuloNavegacion />

         {/* 🔍 Buscador + botón */}
         <div className="flex flex-row-reverse md:flex-row justify-between px-4 my-4 md:my-8 items-center gap-4">
            <Button className="btn-agregar" onClick={abrirModalAgregar}>
               <BadgePlus />
               <span className="hidden md:block">Agregar Obra</span>
            </Button>
            <div className="relative flex-1 w-full md:max-w-80 ">
               <Input
                  type="text"
                  placeholder="Buscar obra..."
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
         <TablaObras
            obras={obrasPaginadas}
            onEditar={abrirModalEditar}
            onEliminar={eliminarObra}
         />

         {/* 🧾 Modal Agregar */}
         {modalAgregar && (
            <ModalAgregarObra
               obra={nuevaObra}
               setObra={setNuevaObra}
               clientes={clientes}
               onCancel={cerrarModalAgregar}
               onSubmit={agregarObra}
            />
         )}

         {/* 🛠 Modal Editar */}
         {obraEditando && (
            <ModalEditarObra
               obra={obraEditando}
               setObra={setObraEditando}
               clientes={clientes}
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
             usuariosPorPagina={obrasPorPagina}
            setUsuariosPorPagina={setObrasPorPagina}
            setPaginaActual={setPaginaActual}
         />
      </div>
   );
}
