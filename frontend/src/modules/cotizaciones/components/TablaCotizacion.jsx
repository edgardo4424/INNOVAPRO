export default function TablaCotizacion({ cotizaciones, onDownloadPDF }) {
  return (
    <div className="table-responsive">
      <table className="custom-table">
        <thead>
          <tr>
            <th>Razón Social</th>
            <th>Contacto</th>
            <th>Tipo</th>
            <th>Obra</th>
            <th>Comercial</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cotizaciones?.map((cotizacion, index) => (
            <tr key={cotizacion.id || index}>
              <td>{cotizacion.cliente?.razon_social || "—"}</td>
              <td>{cotizacion.contacto?.nombre || "—"}</td>
              <td>{cotizacion.tipo_cotizacion || "—"}</td>
              <td>{cotizacion.obra?.nombre || "—"}</td>
              <td>{cotizacion.usuario?.nombre || "—"}</td>
              <td>
                <div
                  style={{ display: "flex", gap: "1px", justifyContent: "left" }}
                >
                  <button
                    onClick={() => onDownloadPDF(cotizacion)}
                    className="edit-button"
                  >
                    PDF
                  </button>
                  <button className="edit-button">✏️Editar</button>
                  <button className="btn-eliminar">🗑Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}