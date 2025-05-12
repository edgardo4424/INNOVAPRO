export default function InfoOtros({ detalles, onChange }) {
    const toggle = (campo, valor) => {
      const actuales = detalles[campo] || [];
      const actualizados = actuales.includes(valor)
        ? actuales.filter((v) => v !== valor)
        : [...actuales, valor];
      onChange(campo, actualizados);
    };
  
    return (
      <div className="sub-options">
        <label className="sub-options-title">Otros</label>
  
        <div className="checkbox-group">
          <span>Venta:</span>
          {["Perno c/ argolla - M12x80", "Perno Expansion - M16x145"].map((item) => (
            <label className="checkbox-item" key={item}>
              <input
                type="checkbox"
                value={item}
                checked={detalles.venta?.includes(item) || false}
                onChange={() => toggle("venta", item)}
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
  
        <div className="checkbox-group">
          <span>¿Pedido incluye puntales?</span>
          {["Con Puntales", "Sin Puntales"].map((item) => (
            <label className="checkbox-item" key={item}>
              <input
                type="checkbox"
                value={item}
                checked={detalles.puntales?.includes(item) || false}
                onChange={() => toggle("puntales", item)}
              />
              <span>{item.split(" ")[0]}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }  