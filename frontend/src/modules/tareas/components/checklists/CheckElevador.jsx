// ✅ exportación correcta
export default function CheckElevador({ detalles, onChange }) {
    const toggleCheckbox = (campo, valor) => {
      const actual = detalles[campo] || [];
      const actualizado = actual.includes(valor)
        ? actual.filter((v) => v !== valor)
        : [...actual, valor];
      onChange(campo, actualizado);
    };
  
    return (
      <div className="sub-options">
        <label className="sub-options-title">Info Elevador:</label>
        <div className="checkbox-grid">
          <div className="checkbox-group">
            <label className="checkbox-item">
              <input
                type="checkbox"
                value="Plano"
                checked={detalles.elevador?.includes("Plano") || false}
                onChange={() => toggleCheckbox("elevador", "Plano")}
              />
              <span>Plano</span>
            </label>
          </div>
        </div>
      </div>
    );
  }  