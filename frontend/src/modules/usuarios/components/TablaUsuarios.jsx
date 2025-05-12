export default function TablaUsuarios({ usuarios, onEditar, onEliminar }) {
    if (usuarios.length === 0) {
      return <p>No hay usuarios registrados.</p>;
    }
  
    return (
      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.nombre || "—"}</td>
                <td>{usuario.email || "—"}</td>
                <td>{usuario.rol || "—"}</td>
                <td>
                  <div style={{ display: "flex", gap: "1px", justifyContent: "left" }}>
                    <button onClick={() => onEditar(usuario)} className="edit-button">✏️Editar</button>
                    <button onClick={() => onEliminar(usuario.id)} className="btn-eliminar">🗑Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }  