import React from "react";

export default function TablaTareas({ tareas, ordenarTareas, columnaOrdenada, orden, onSeleccionarTarea }) {
  return (
    <div className="table-responsive">
      <table className="custom-table">
        <thead>
          <tr>
            {[
              { key: "id", label: "ID" },
              { key: "cliente.razon_social", label: "Cliente" },
              { key: "obra.nombre", label: "Obra" },
              { key: "usuario_solicitante", label: "Comercial" },
              { key: "tipoTarea", label: "Tarea" },
              { key: "fecha_creacion", label: "Fecha" },
            ].map(({ key, label }) => (
              <th
                key={key}
                onClick={() => ordenarTareas(key)}
                className={`sortable ${columnaOrdenada === key ? "active" : ""}`}
                data-order={
                  columnaOrdenada === key ? (orden === "asc" ? "⬆️" : "⬇️") : "↕️"
                }
              >
                {label}
              </th>
            ))}
            <th>Estado</th>
            <th>Asignada A</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tareas.length === 0 ? (
            <tr>
              <td colSpan="9">No hay tareas en este estado.</td>
            </tr>
          ) : (
            tareas.map((tarea) => (
              <tr key={tarea.id}>
                <td>{tarea.id}</td>
                <td>{tarea.cliente?.razon_social || "-"}</td>
                <td>{tarea.obra?.nombre || "-"}</td>
                <td>{tarea.usuario_solicitante?.nombre || "Desconocido"}</td>
                <td>{tarea.tipoTarea}</td>
                <td>{new Date(tarea.fecha_creacion).toLocaleString()}</td>
                <td>
                  <span className={`estado estado-${tarea.estado.toLowerCase().replace(" ", "-")}`}>
                    {tarea.estado}
                  </span>
                </td>
                <td>{tarea.tecnico_asignado?.nombre || "Sin asignar"}</td>
                <td>
                  <button onClick={() => onSeleccionarTarea(tarea)} className="edit-button">
                    Ver Detalles
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}