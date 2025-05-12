export default function CheckAFFachada({ detalles, onChange }) {
    const toggleCheckbox = (campo, valor) => {
      const actual = detalles[campo] || [];
      const actualizado = actual.includes(valor)
        ? actual.filter((v) => v !== valor)
        : [...actual, valor];
      onChange(campo, actualizado);
    };
  
    return (
      <div className="sub-options">
        <label className="sub-options-title">Detalles And. FACHADA:</label>
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
  
          {/* Rotaciones */}
          <div className="checkbox-group">
            <span>Rotaciones:</span>
            <label className="checkbox-item">
              <input
                type="checkbox"
                value="Con Rotaciones"
                checked={detalles.rotaciones?.includes("Con Rotaciones") || false}
                onChange={() => toggleCheckbox("rotaciones", "Con Rotaciones")}
              />
              <span>Con</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                value="Sin Rotaciones"
                checked={detalles.rotaciones?.includes("Sin Rotaciones") || false}
                onChange={() => toggleCheckbox("rotaciones", "Sin Rotaciones")}
              />
              <span>Sin</span>
            </label>
          </div>
  
          {/* Ménsulas */}
          <div className="checkbox-group">
            <span>Ménsulas:</span>
            <label className="checkbox-item">
              <input
                type="checkbox"
                value="Con Ménsulas"
                checked={detalles.mensulas?.includes("Con Ménsulas") || false}
                onChange={() => toggleCheckbox("mensulas", "Con Ménsulas")}
              />
              <span>Con</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                value="Sin Ménsulas"
                checked={detalles.mensulas?.includes("Sin Ménsulas") || false}
                onChange={() => toggleCheckbox("mensulas", "Sin Ménsulas")}
              />
              <span>Sin</span>
            </label>
          </div>
        </div>
      </div>
    );
  }  