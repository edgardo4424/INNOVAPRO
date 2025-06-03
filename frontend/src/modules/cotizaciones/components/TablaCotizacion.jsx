export default function TablaCotizacion({ cotizaciones, onDownloadPDF, setCotizacionPrevisualizada }) {
  return (
    <div className="table-responsive">
      <table className="custom-table">
        <thead>
          <tr>
            <th>Cod. Doc</th>
            <th>Cliente</th>
            <th>Obra</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cotizaciones?.map((cotizacion, index) => (
            <tr key={cotizacion.id || index}>
              <td>{cotizacion?.codigo_documento || "—"}</td>
              <td>{cotizacion.cliente?.razon_social || "—"}</td>
              <td>{cotizacion.obra?.nombre || "—"}</td>
              <td>{cotizacion.tipo_cotizacion || "—"}</td>
              <td>{cotizacion.estados_cotizacion?.nombre || "—"}</td>
              <td>
                <div style={{ display: "flex", gap: "1px", justifyContent: "left" }}>
                  <button
                    onClick={() => onDownloadPDF(cotizacion.id)}
                    className="edit-button"
                  >
                    PDF
                  </button>
                  <button
                    onClick={() => setCotizacionPrevisualizada(cotizacion.id)}
                    className="edit-button"
                  >
                    Ver PDF
                  </button>
                  <button className="edit-button">✏️Editar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}