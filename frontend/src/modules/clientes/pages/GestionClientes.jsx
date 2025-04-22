import React from "react";
import TablaClientes from "../components/TablaClientes";
import ModalAgregarCliente from "../components/ModalAgregarCliente";
import ModalEditarCliente from "../components/ModalEditarCliente";
import { useGestionClientes } from "../hooks/useGestionClientes";

export default function GestionClientes() {
  const {
    clientesPaginados,
    busqueda,
    setBusqueda,
    paginaActual,
    totalPaginas,
    abrirModalAgregar,
    cerrarModalAgregar,
    abrirModalEditar,
    cerrarModalEditar,
    clienteEditando,
    modalAgregar,
    eliminarCliente,
  } = useGestionClientes();

  return (
    <div className="dashboard-main">
      <h2>Gestión de Clientes</h2>

      <div className="top-actions">
        <button onClick={abrirModalAgregar}>➕ Agregar Cliente</button>
        <input
          type="text"
          placeholder="Buscar cliente..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <TablaClientes
        clientes={clientesPaginados}
        onEditar={abrirModalEditar}
        onEliminar={eliminarCliente}
      />

      {modalAgregar && <ModalAgregarCliente onClose={cerrarModalAgregar} />}
      {clienteEditando && (
        <ModalEditarCliente
          cliente={clienteEditando}
          onClose={cerrarModalEditar}
        />
      )}

      <div className="pagination">
        <button disabled={paginaActual === 1} onClick={() => setPaginaActual(paginaActual - 1)}>
          ⬅ Anterior
        </button>
        <span>
          Página {paginaActual} de {totalPaginas}
        </span>
        <button disabled={paginaActual === totalPaginas} onClick={() => setPaginaActual(paginaActual + 1)}>
          Siguiente ➡
        </button>
      </div>
    </div>
  );
}