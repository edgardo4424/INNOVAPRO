export default function CheckATTrabajo({ detalles, onChange }) {
    const toggleCheckbox = (campo, valor) => {
      const actual = detalles[campo] || [];
      const actualizado = actual.includes(valor)
        ? actual.filter((v) => v !== valor)
        : [...actual, valor];
      onChange(campo, actualizado);
    };
  
    return (
      <div className="sub-options">
        <label className="sub-options-title">Info. And. TRABAJO:</label>
        <div className="checkbox-grid">
          {/* Plataformado */}
          <div className="checkbox-group">
            <span>Plataformado:</span>
            <label className="checkbox-item">
              <input
                type="checkbox"
                value="Plataformado Superior"
                checked={detalles.plataformado?.includes("Plataformado Superior") || false}
                onChange={() => toggleCheckbox("plataformado", "Plataformado Superior")}
              />
              <span>Superior</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                value="Plataformado Completo"
                checked={detalles.plataformado?.includes("Plataformado Completo") || false}
                onChange={() => toggleCheckbox("plataformado", "Plataformado Completo")}
              />
              <span>Completo</span>
            </label>
          </div>
  
          {/* Anclajes */}
          <div className="checkbox-group">
            <span>Anclajes:</span>
            <label className="checkbox-item">
              <input
                type="checkbox"
                value="Con Anclajes"
                checked={detalles.anclajes?.includes("Con Anclajes") || false}
                onChange={() => toggleCheckbox("anclajes", "Con Anclajes")}
              />
              <span>Con</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                value="Sin Anclajes"
                checked={detalles.anclajes?.includes("Sin Anclajes") || false}
                onChange={() => toggleCheckbox("anclajes", "Sin Anclajes")}
              />
              <span>Sin</span>
            </label>
          </div>
  
          {/* Uso */}
          <div className="checkbox-group">
            <span>Uso en:</span>
            <label className="checkbox-item">
              <input
                type="checkbox"
                value="Uso en Interiores"
                checked={detalles.uso?.includes("Uso en Interiores") || false}
                onChange={() => toggleCheckbox("uso", "Uso en Interiores")}
              />
              <span>Interiores</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                value="Uso en Exteriores"
                checked={detalles.uso?.includes("Uso en Exteriores") || false}
                onChange={() => toggleCheckbox("uso", "Uso en Exteriores")}
              />
              <span>Exteriores</span>
            </label>
          </div>
        </div>
      </div>
    );
  }  