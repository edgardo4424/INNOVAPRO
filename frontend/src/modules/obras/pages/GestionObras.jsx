import useObras from "../hooks/useObras";
import TablaObras from "../components/TablaObras";
import ModalAgregarObra from "../components/ModalAgregarObra";
import ModalEditarObra from "../components/ModalEditarObra";
import ModuloNavegacion from "@/shared/components/ModuloNavegacion";
import Paginacion from "@/shared/components/Paginacion";
import { X } from "lucide-react";
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
    setObrasPorPagina,
  } = useObras();

  return (
    <div className="min-h-full flex-1  flex flex-col items-center">
      <ModuloNavegacion />

      <div className="p-3 md:py-4 md:px-6 w-full">
        {/* 🔍 Buscador + botón */}
        <div className="w-full max-w-7xl flex flex-row-reverse md:flex-row justify-between items-center gap-4 mb-5">
          <ModalAgregarObra onSubmit={agregarObra} />

          <div className="relative flex-1 w-full md:max-w-80">
            <Input
              type="text"
              placeholder="Buscar obra..."
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
        <TablaObras
          obras={obrasPaginadas}
          onSubmit={guardarEdicion}
          onEditar={abrirModalEditar}
          onEliminar={eliminarObra}
        />

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
    </div>
  );
}
