export default function CheckEscuadras({ detalles, onChange }) {
    const toggleCheckbox = (campo, valor) => {
      const actual = detalles[campo] || [];
      const actualizado = actual.includes(valor)
        ? actual.filter((v) => v !== valor)
        : [...actual, valor];
      onChange(campo, actualizado);
    };
  
    return (
      <div className="sub-options">
        <label className="sub-options-title">Detalles Escuadras:</label>
        <div className="checkbox-grid">
  
          {/* Escuadras de */}
          <div className="checkbox-group">
            <span>Escuadras de:</span>
            <label className="checkbox-item">
              <input
                type="checkbox"
                value="Escuadras de 1.00m"
                checked={detalles.escuadras?.includes("Escuadras de 1.00m") || false}
                onChange={() => toggleCheckbox("escuadras", "Escuadras de 1.00m")}
              />
              <span>1.00m</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                value="Escuadras de 3.00m"
                checked={detalles.escuadras?.includes("Escuadras de 3.00m") || false}
                onChange={() => toggleCheckbox("escuadras", "Escuadras de 3.00m")}
              />
              <span>3.00m</span>
            </label>
          </div>
  
          {/* Sobrecarga */}
          <div className="checkbox-group">
            <span>Sobrecarga por:</span>
            <label className="checkbox-item">
              <input
                type="checkbox"
                value="Sobrecarga Innova"
                checked={detalles.sobrecarga?.includes("Sobrecarga Innova") || false}
                onChange={() => toggleCheckbox("sobrecarga", "Sobrecarga Innova")}
              />
              <span>Innova</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                value="Sobrecarga Cliente"
                checked={detalles.sobrecarga?.includes("Sobrecarga Cliente") || false}
                onChange={() => toggleCheckbox("sobrecarga", "Sobrecarga Cliente")}
              />
              <span>Cliente</span>
            </label>
          </div>
  
          {/* Plataformas */}
          <div className="checkbox-group">
            <span>Plataformas:</span>
            <label className="checkbox-item">
              <input
                type="checkbox"
                value="Con Plataformas"
                checked={detalles.plataformas?.includes("Con Plataformas") || false}
                onChange={() => toggleCheckbox("plataformas", "Con Plataformas")}
              />
              <span>Con</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                value="Sin Plataformas"
                checked={detalles.plataformas?.includes("Sin Plataformas") || false}
                onChange={() => toggleCheckbox("plataformas", "Sin Plataformas")}
              />
              <span>Sin</span>
            </label>
          </div>
        </div>
      </div>
    );
  }  