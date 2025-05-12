export default function InfoPlataformado({ detalles, onChange }) {
    const opciones = ["Plataformado Superior", "Completo"];
  
    const toggle = (valor) => {
      const actuales = detalles.plataformado || [];
      const actualizados = actuales.includes(valor)
        ? actuales.filter((v) => v !== valor)
        : [...actuales, valor];
      onChange("plataformado", actualizados);
    };
  
    return (
      <div className="sub-options">
        <label className="sub-options-title">Info And.TRABAJO</label>
        <div className="checkbox-group">
          <span>Plataformado:</span>
          {opciones.map((opcion) => (
            <label className="checkbox-item" key={opcion}>
              <input
                type="checkbox"
                value={opcion}
                checked={detalles.plataformado?.includes(opcion) || false}
                onChange={() => toggle(opcion)}
              />
              <span>{opcion.replace("Plataformado ", "")}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }  