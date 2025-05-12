export default function TablaEmpresas({ empresas, onEditar, onEliminar }) {
    if (empresas.length === 0) {
      return <p>No hay filiales registradas.</p>;
    }
  
    return (
      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Razón Social</th>
              <th>RUC</th>
              <th>Dirección Fiscal</th>
              <th>Representante</th>
              <th>Documento</th>
              <th>Cargo</th>
              <th>Teléfonos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empresas.map((e) => (
              <tr key={e.id}>
                <td>{e.razon_social}</td>
                <td>{e.ruc}</td>
                <td>{e.direccion_fiscal}</td>
                <td>{e.representante_legal}</td>
                <td>{e.tipo_documento} {e.numero_documento}</td>
                <td>{e.cargo_representante}</td>
                <td>
                  📞 {e.telefono_representante || "—"}
                  <br />
                  🏢 {e.telefono_oficina || "—"}
                </td>
                <td>
                  <div style={{ display: "flex", gap: "1px", justifyContent: "left" }}>
                    <button onClick={() => onEditar(e)} className="edit-button">✏️Editar</button>
                    <button onClick={() => onEliminar(e.id)} className="btn-eliminar">🗑Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }  