export default function TablaObras({ obras, onEditar, onEliminar }) {
    if (obras.length === 0) {
      return <p>No hay obras registradas.</p>;
    }
  
    return (
      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Ubicacion</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {obras.map((obra) => (
              <tr key={obra.id}>
                <td>{obra.nombre}</td>
                <td>{obra.direccion}</td>
                <td>{obra.ubicacion}</td>
                <td>{obra.estado}</td>
                <td>
                  <div style={{ display: "flex", gap: "1px", justifyContent: "left" }}>
                    <button onClick={() => onEditar(obra)} className="edit-button">✏️Editar</button>
                    <button onClick={() => onEliminar(obra.id)} className="btn-eliminar">🗑Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }  