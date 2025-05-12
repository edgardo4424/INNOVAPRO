import React from "react";

export default function CheckboxGrupoPasePedido({ detalles, onChange }) {
  const crearCheckbox = (campo, opciones, titulo = "") => (
    <div className="sub-options">
      {titulo && <label className="sub-options-title">{titulo}</label>}
      <div className="checkbox-group">
        {opciones.map((opcion) => (
          <label className="checkbox-item" key={opcion}>
            <input
              type="checkbox"
              value={opcion}
              checked={detalles[campo]?.includes(opcion) || false}
              onChange={(e) => {
                const value = e.target.value;
                const actual = detalles[campo] || [];
                const updated = actual.includes(value)
                  ? actual.filter((v) => v !== value)
                  : [...actual, value];
                onChange(campo, updated);
              }}
            />
            <span>{opcion}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {crearCheckbox("despacho", ["Completo", "Parcial"], "Despacho")}
      {crearCheckbox("adaptarMotor", ["Adaptar", "No adaptar"], "¿Adaptar motor para energía trifásica 380?")}
      {crearCheckbox("tipoServicioColgante", ["Básico", "Intermedio", "Integral"], "Info ANDAMIO ELÉCTRICO")}
      {crearCheckbox("venta", ["Perno c/ argolla - M12x80", "Perno Expansion - M16x145"], "Venta")}
      {crearCheckbox("puntales", ["Con Puntales", "Sin Puntales"], "¿Pedido incluye puntales?")}
    </>
  );
}