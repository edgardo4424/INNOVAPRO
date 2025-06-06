import useUsuarios from "../hooks/useUsuarios";
import TablaUsuarios from "../components/TablaUsuarios";
import ModalAgregarUsuario from "../components/ModalAgregarUsuario";
import ModalEditarUsuario from "../components/ModalEditarUsuario";
import ModuloNavegacion from "@/shared/components/ModuloNavegacion"
import Paginacion from "@/shared/components/Paginacion";
import "../../../styles/dashboard.css";

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
  } = useUsuarios();

  return (
    <div className="container min-h-full">
      <ModuloNavegacion />
      <div className="mt-16"></div>
      {/* 🔍 Buscador + botón */}
      <div className="top-actions">
        <button className="btn-agregar" onClick={abrirModalAgregar}>
          ➕ Agregar Usuario
        </button>
        <input
          type="text"
          placeholder="Buscar usuario..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="busqueda-input"
        />
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
      />
    </div>
    
  );
}