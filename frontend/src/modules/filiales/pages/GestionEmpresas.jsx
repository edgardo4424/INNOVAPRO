import useEmpresas from "../hooks/useEmpresas";
import TablaEmpresas from "../components/TablaEmpresas";
import ModalAgregarEmpresa from "../components/ModalAgregarEmpresa";
import ModalEditarEmpresa from "../components/ModalEditarEmpresa";
import ModuloNavegacion from "../../shared/components/ModuloNavegacion";
import Paginacion from "../../shared/components/Paginacion";

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
  } = useEmpresas();

  return (
    <div className="dashboard-main">
      <ModuloNavegacion />
      <h2>Gestión de Filiales</h2>

      {/* 🔍 Buscador + botón */}
      <div className="top-actions">
        <button className="btn-agregar" onClick={abrirModalAgregar}>
          ➕ Agregar Filial
        </button>
        <input
          type="text"
          placeholder="Buscar por razón social, RUC, representante..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="busqueda-input"
        />
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
      />
    </div>
  );
}