import useObras from "../hooks/useObras";
import TablaObras from "../components/TablaObras";
import ModalAgregarObra from "../components/ModalAgregarObra";
import ModalEditarObra from "../components/ModalEditarObra";
import ModuloNavegacion from "@/shared/components/ModuloNavegacion"
import Paginacion from "@/shared/components/Paginacion";

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
  } = useObras();

  return (
    <div className="dashboard-main">
      <ModuloNavegacion />
      <h2>Gestión de Obras</h2>

      {/* 🔍 Buscador + botón */}
      <div className="top-actions">
        <button className="btn-agregar" onClick={abrirModalAgregar}>
          ➕ Agregar Obra
        </button>
        <input
          type="text"
          placeholder="Buscar obra..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="busqueda-input"
        />
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
      />
    </div>
  );
}