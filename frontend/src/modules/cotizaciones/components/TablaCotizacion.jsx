export default function TablaCotizacion({ onDownloadPDF }) {

  return (
    <div className="table-responsive">


      <table className="custom-table">
        <thead>
          <tr>
            <th>Empresa</th>
            <th>Servicio</th>
            <th>Uso / piezas </th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Empresa 1</td>
            <td>Alquiler</td>
            <td>Escalera basica</td>
            <td>07/05/2025</td>
            <td>
              <div
                style={{ display: "flex", gap: "1px", justifyContent: "left" }}
              >
                <button
                  onClick={() => onDownloadPDF()}
                  className="edit-button"
                >
                  Descargar PDF
                </button>
                <button className="edit-button">✏️Editar</button>
                <button className="btn-eliminar">🗑Eliminar</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
