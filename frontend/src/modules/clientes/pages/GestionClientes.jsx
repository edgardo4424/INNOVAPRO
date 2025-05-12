import React from "react";
import TablaClientes from "../components/TablaClientes";
import ModalAgregarCliente from "../components/ModalAgregarCliente";
import ModalEditarCliente from "../components/ModalEditarCliente";
import { useGestionClientes } from "../hooks/useGestionClientes";
import ModuloNavegacion from "@/shared/components/ModuloNavegacion"
import Paginacion from "@/shared/components/Paginacion";


export default function GestionClientes() {
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
      
      <ModuloNavegacion />

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

      <Paginacion
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        onPaginarAnterior={() => setPaginaActual(paginaActual - 1)}
        onPaginarSiguiente={() => setPaginaActual(paginaActual + 1)}
      />
    </div>
  );
}