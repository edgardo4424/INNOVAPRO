import React from "react";
import TablaClientes from "../components/TablaClientes";
import ModalAgregarCliente from "../components/ModalAgregarCliente";
import ModalEditarCliente from "../components/ModalEditarCliente";
import { useGestionClientes } from "../hooks/useGestionClientes";
import { useModuloNavegacion } from "../../../hooks/useModuloNavegacion";
import "../../../styles/dashboard.css";

export default function GestionClientes() {
  const { irModuloAnterior, irModuloSiguiente, volverInicio, moduloSiguiente, moduloAnterior } = useModuloNavegacion();

  const {
    clientesPaginados,
    busqueda,
    setBusqueda,
    paginaActual,
    setPaginaActual,
    totalPaginas,
    abrirModalAgregar,
    cerrarModalAgregar,
    abrirModalEditar,
    cerrarModalEditar,
    clienteEditando,
    modalAgregar,
    eliminarCliente,
    agregarCliente,
    actualizarCliente,
  } = useGestionClientes();

  return (
    <div className="dashboard-main">
      
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
        
        {/* Botón Volver Inicio */}
        <button className="back-button" onClick={volverInicio}>
          ⬅ Volver al inicio
        </button>

        {/* Botón Módulo Anterior */}
        {moduloAnterior && (
          <button className="back-button" onClick={irModuloAnterior}>
            ⬅ {moduloAnterior.name}
          </button>
        )}

        {/* Botón Siguiente Módulo */}
        {moduloSiguiente && (
          <button className="next-button" onClick={irModuloSiguiente}>
            {moduloSiguiente.name} ➡
          </button>
        )}

      </div>

      <h2>Gestión de Clientes</h2>

      <div className="top-actions">
        <button className="btn-agregar" onClick={abrirModalAgregar}>➕ Agregar Cliente</button>
        <input
          type="text"
          placeholder="Buscar cliente..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="busqueda-input"
        />
      </div>

      <TablaClientes
        clientes={clientesPaginados}
        onEditar={abrirModalEditar}
        onEliminar={eliminarCliente}
      />

      {modalAgregar && <ModalAgregarCliente onClose={cerrarModalAgregar} agregarCliente={agregarCliente}/>}
      {clienteEditando && (
        <ModalEditarCliente
          cliente={clienteEditando}
          onClose={cerrarModalEditar}
          actualizarCliente={actualizarCliente}
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