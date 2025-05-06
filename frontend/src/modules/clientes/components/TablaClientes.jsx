import React from "react";

export default function TablaClientes({ clientes, onEditar, onEliminar }) {
  if (clientes.length === 0) {
    return <p>No hay clientes para mostrar.</p>;
  }

  return (
    <div className="table-responsive">
      <table className="custom-table">
        <thead>
          <tr>
            <th>Razón Social / Nombre</th>
            <th>Tipo</th>
            <th>RUC / DNI</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Domicilio Fiscal</th>
            <th>Representante Legal</th>
            <th>DNI Representante</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id}>
              <td>{cliente.razon_social || "—"}</td>
              <td>{cliente.tipo || "—"}</td>
              <td>{cliente.ruc || cliente.dni || "—"}</td>
              <td>{cliente.telefono || "—"}</td>
              <td>{cliente.email || "—"}</td>
              <td>{cliente.domicilio_fiscal || "—"}</td>
              <td>{cliente.representante_legal || "—"}</td>
              <td>{cliente.dni_representante || "—"}</td>
              <td>
              <div style={{ display: "flex", gap: "1px", justifyContent: "left" }}>
                  <button onClick={() => onEditar(cliente)} className="edit-button">
                  ✏️Editar
                  </button>
                  <button onClick={() => onEliminar(cliente.id)} className="btn-eliminar">
                  🗑Eliminar
                  </button>
              </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}