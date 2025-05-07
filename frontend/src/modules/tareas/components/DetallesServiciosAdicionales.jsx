export default function DetallesServiciosAdicionales({ detalles, onChange }) {
    return (
      <div className="tarea-detalles">
        <h3>Detalles de Servicios Adicionales</h3>
  
        {/* Tipo de servicio */}
        <label>Indique el servicio:</label>
        <select
          value={detalles.tipoServicio || ""}
          onChange={(e) => onChange("tipoServicio", e.target.value)}
        >
          <option value="">Seleccione...</option>
          <option value="Visita técnica">Visita técnica</option>
          <option value="Capacitación">Capacitación</option>
          <option value="Montaje">Montaje</option>
          <option value="Desmontaje">Desmontaje</option>
          <option value="Transporte">Transporte</option>
        </select>
  
        {/* Fecha y hora si hay servicio */}
        {detalles.tipoServicio && (
          <div className="entrega-container">
            <label>Fecha en obra:</label>
            <input
              type="date"
              value={detalles.fechaEntrega || ""}
              onChange={(e) => onChange("fechaEntrega", e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              required
            />
  
            <label>Hora en obra:</label>
            <input
              type="time"
              value={detalles.horaEntrega || ""}
              onChange={(e) => onChange("horaEntrega", e.target.value)}
              required
            />
          </div>
        )}
  
        {/* Número y versión de contrato */}
        <label>Número y versión de contrato:</label>
        <input
          type="text"
          value={detalles.numeroVersionContrato || ""}
          onChange={(e) => {
            let value = e.target.value.toUpperCase();
            if (value === "" || /^[0-9_]*$/.test(value)) {
              onChange("numeroVersionContrato", value);
            }
          }}
          onBlur={(e) => {
            const regex = /^\d{4}_\d{1,2}$/;
            if (!regex.test(e.target.value)) {
              alert("Formato incorrecto. Debe ser 0000_0 (Ejemplo: 0025_1)");
              onChange("numeroVersionContrato", "");
            }
          }}
          placeholder="Ejemplo: 0025_1"
          maxLength="7"
          className="input-contrato"
        />
        <small className="hint-text">Debe seguir el formato 0000_0 (Ejemplo: 0025_1)</small>
  
        {/* Nota */}
        <label>📝 Nota:</label>
        <textarea
          className="nota-textarea"
          value={detalles.nota || ""}
          onChange={(e) => onChange("nota", e.target.value)}
          placeholder="Escribe aquí los detalles adicionales..."
        />
      </div>
    );
  }  