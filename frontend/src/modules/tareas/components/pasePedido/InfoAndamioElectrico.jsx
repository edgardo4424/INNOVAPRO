export default function InfoAndamioElectrico({ detalles, onChange }) {
    const opciones = ["Básico", "Intermedio", "Integral"];
  
    const toggle = (valor) => {
      const actuales = detalles.tipoServicioColgante || [];
      const actualizados = actuales.includes(valor)
        ? actuales.filter((v) => v !== valor)
        : [...actuales, valor];
      onChange("tipoServicioColgante", actualizados);
    };
  
    return (
      <div className="sub-options">
        <label className="sub-options-title">Info ANDAMIO ELÉCTRICO</label>
        <div className="checkbox-group">
          <span>Tipo de servicio:</span>
          {opciones.map((op) => (
            <label className="checkbox-item" key={op}>
              <input
                type="checkbox"
                value={op}
                checked={detalles.tipoServicioColgante?.includes(op) || false}
                onChange={() => toggle(op)}
              />
              <span>{op}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }  