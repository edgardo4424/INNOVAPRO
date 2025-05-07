export default function CheckEscaleraAcceso({ detalles, onChange }) {
    const toggleCheckbox = (campo, valor) => {
      const actual = detalles[campo] || [];
      const actualizado = actual.includes(valor)
        ? actual.filter((v) => v !== valor)
        : [...actual, valor];
      onChange(campo, actualizado);
    };
  
    return (
      <div className="sub-options">
        <label className="sub-options-title">Detalles Escalera Acceso:</label>
        <div className="checkbox-grid">
  
          {/* Apoyado a */}
          <div className="checkbox-group">
            <span>Apoyado a:</span>
            <label className="checkbox-item">
              <input
                type="checkbox"
                value="Piso"
                checked={detalles.apoyadoA?.includes("Piso") || false}
                onChange={() => toggleCheckbox("apoyadoA", "Piso")}
              />
              <span>Piso</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                value="Volado"
                checked={detalles.apoyadoA?.includes("Volado") || false}
                onChange={() => toggleCheckbox("apoyadoA", "Volado")}
              />
              <span>Volado</span>
            </label>
          </div>
  
          {/* Ingreso */}
          <div className="checkbox-group">
            <span>Ingreso:</span>
            <label className="checkbox-item">
              <input
                type="checkbox"
                value="Lado LARGO - 3.07m"
                checked={detalles.ingreso?.includes("Lado LARGO - 3.07m") || false}
                onChange={() => toggleCheckbox("ingreso", "Lado LARGO - 3.07m")}
              />
              <span>Lado LARGO - 3.07m</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                value="Lado ANCHO - 1.57m"
                checked={detalles.ingreso?.includes("Lado ANCHO - 1.57m") || false}
                onChange={() => toggleCheckbox("ingreso", "Lado ANCHO - 1.57m")}
              />
              <span>Lado ANCHO - 1.57m</span>
            </label>
          </div>
  
          {/* Pasadizo */}
          <div className="checkbox-group">
            <span>Habilitar Pasadizo / Balcón:</span>
            <label className="checkbox-item">
              <input
                type="checkbox"
                value="Con pasadizo"
                checked={detalles.pasadizo?.includes("Con pasadizo") || false}
                onChange={() => toggleCheckbox("pasadizo", "Con pasadizo")}
              />
              <span>Con</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                value="Sin pasadizo"
                checked={detalles.pasadizo?.includes("Sin pasadizo") || false}
                onChange={() => toggleCheckbox("pasadizo", "Sin pasadizo")}
              />
              <span>Sin</span>
            </label>
          </div>
        </div>
      </div>
    );
  }  