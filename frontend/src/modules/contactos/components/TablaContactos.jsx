export default function TablaContactos({ contactos, onEditar, onEliminar }) {
    return (
      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Cargo</th>
              <th>Clientes</th>
              <th>Obras</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {contactos.map((contacto) => (
              <tr key={contacto.id}>
                <td>{contacto.nombre || "—"}</td>
                <td>{contacto.email || "—"}</td>
                <td>{contacto.telefono || "—"}</td>
                <td>{contacto.cargo || "—"}</td>
                <td>
                  {contacto.clientes_asociados?.map((c) => c.razon_social).join(", ") || "—"}
                </td>
                <td>
                  {contacto.obras_asociadas?.map((o) => o.nombre).join(", ") || "—"}
                </td>
                <td>
                  <div style={{ display: "flex", gap: "1px", justifyContent: "left" }}>
                    <button onClick={() => onEditar(contacto)} className="edit-button">✏️Editar</button>
                    <button onClick={() => onEliminar(contacto.id)} className="btn-eliminar">🗑Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }  