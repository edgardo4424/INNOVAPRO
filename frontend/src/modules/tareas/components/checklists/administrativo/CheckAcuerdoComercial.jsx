export default function CheckAcuerdoComercial({ detalles, onChange }) {
    const toggleCheckbox = (valor) => {
      const actual = detalles.acuerdoComercial || [];
      const actualizado = actual.includes(valor)
        ? actual.filter((v) => v !== valor)
        : [...actual, valor];
      onChange("acuerdoComercial", actualizado);
    };
  
    const opciones = [
      "Descuento en irreparables",
      "Descuento en faltantes",
      "Descontar fecha de alquiler",
      "Costo por reparación",
    ];
  
    return (
      <div className="sub-options">
        <label className="sub-options-title">Con respecto a:</label>
        <div className="checkbox-grid">
          {opciones.map((opcion) => (
            <div className="checkbox-group" key={opcion}>
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  value={opcion}
                  checked={detalles.acuerdoComercial?.includes(opcion) || false}
                  onChange={() => toggleCheckbox(opcion)}
                />
                <span>{opcion}</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  }  