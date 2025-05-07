export default function CheckLiquidacion({ detalles, onChange }) {
    const toggleCheckbox = (valor) => {
      const actual = detalles.liquidacion || [];
      const actualizado = actual.includes(valor)
        ? actual.filter((v) => v !== valor)
        : [...actual, valor];
      onChange("liquidacion", actualizado);
    };
  
    const opciones = [
      "Liquidar",
      "Actualizar liquidación",
      "Stock de piezas en obra",
      "Resumen valorizado de faltantes",
      "Resumen valorizado de irreparables",
      "Sustento",
      "Stock por pedido",
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
                  checked={detalles.liquidacion?.includes(opcion) || false}
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