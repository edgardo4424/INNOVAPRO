export default function InfoEscaleras({ detalles, onChange }) {
    const toggle = (campo, valor) => {
      const actuales = detalles[campo] || [];
      const actualizados = actuales.includes(valor)
        ? actuales.filter((v) => v !== valor)
        : [...actuales, valor];
      onChange(campo, actualizados);
    };
  
    return (
      <div className="sub-options">
        <label className="sub-options-title">Info ESCALERAS</label>
  
        <div className="checkbox-group">
          <span>Ingreso:</span>
          {["Lado LARGO - 3.07m", "Lado ANCHO - 1.57m"].map((op) => (
            <label className="checkbox-item" key={op}>
              <input
                type="checkbox"
                value={op}
                checked={detalles.ingreso?.includes(op) || false}
                onChange={() => toggle("ingreso", op)}
              />
              <span>{op}</span>
            </label>
          ))}
        </div>
  
        <div className="checkbox-group">
          <span>Habilitar pasadizo/balcón:</span>
          {["Con pasadizo", "Sin pasadizo"].map((op) => (
            <label className="checkbox-item" key={op}>
              <input
                type="checkbox"
                value={op}
                checked={detalles.pasadizo?.includes(op) || false}
                onChange={() => toggle("pasadizo", op)}
              />
              <span>{op.split(" ")[0]}</span>
            </label>
          ))}
        </div>
  
        <div className="checkbox-group">
          <span>Tipo de escalera:</span>
          {["Tipo FERMIN", "Tipo GURSAM 60", "Según STOCK"].map((op) => (
            <label className="checkbox-item" key={op}>
              <input
                type="checkbox"
                value={op}
                checked={detalles.tipoEscalera?.includes(op) || false}
                onChange={() => toggle("tipoEscalera", op)}
              />
              <span>{op.replace("Tipo ", "")}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }  