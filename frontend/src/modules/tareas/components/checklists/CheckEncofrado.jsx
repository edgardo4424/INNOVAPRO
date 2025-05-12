export default function CheckEncofrado({ detalles, onChange }) {
    const toggleCheckbox = (campo, valor) => {
      const actual = detalles[campo] || [];
      const actualizado = actual.includes(valor)
        ? actual.filter((v) => v !== valor)
        : [...actual, valor];
      onChange(campo, actualizado);
    };
  
    return (
      <div className="sub-options">
        <label className="sub-options-title">Info ENCOFRADO:</label>
        <div className="checkbox-grid">
  
          <div className="checkbox-group">
            <label className="checkbox-item">
              <input
                type="checkbox"
                value="Placas y columnas"
                checked={detalles.encofrados?.includes("Placas y columnas") || false}
                onChange={() => toggleCheckbox("encofrados", "Placas y columnas")}
              />
              <span>Placas y columnas</span>
            </label>
  
            <label className="checkbox-item">
              <input
                type="checkbox"
                value="Cisterna"
                checked={detalles.encofrados?.includes("Cisterna") || false}
                onChange={() => toggleCheckbox("encofrados", "Cisterna")}
              />
              <span>Cisterna</span>
            </label>
  
            <label className="checkbox-item">
              <input
                type="checkbox"
                value="Vigas"
                checked={detalles.encofrados?.includes("Vigas") || false}
                onChange={() => toggleCheckbox("encofrados", "Vigas")}
              />
              <span>Vigas</span>
            </label>
  
            <label className="checkbox-item">
              <input
                type="checkbox"
                value="Losa"
                checked={detalles.encofrados?.includes("Losa") || false}
                onChange={() => toggleCheckbox("encofrados", "Losa")}
              />
              <span>Losa</span>
            </label>
          </div>
  
        </div>
      </div>
    );
  }  