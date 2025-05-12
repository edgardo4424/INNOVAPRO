import useContactos from "../hooks/useContactos";
import TablaContactos from "../components/TablaContactos";
import ModalAgregarContacto from "../components/ModalAgregarContacto";
import ModalEditarContacto from "../components/ModalEditarContacto";
import Paginacion from "@/shared/components/Paginacion";
import ModuloNavegacion from "@/shared/components/ModuloNavegacion"

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
  } = useContactos();

  return (
    <div className="dashboard-main">
      <ModuloNavegacion />

      <h2>Gestión de Contactos</h2>

      {/* 🔍 Buscador + botón */}
      <div className="top-actions">
        <button className="btn-agregar" onClick={abrirModalAgregar}>
          ➕ Agregar Contacto
        </button>
        <input
          type="text"
          placeholder="Buscar contacto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="busqueda-input"
        />
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