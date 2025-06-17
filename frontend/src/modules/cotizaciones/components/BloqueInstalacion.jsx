export default function BloqueInstalacion({ formData, setFormData, errores }) {
  const tipo = formData.tipo_instalacion || "";

  const limpiarInstalacion = () => {
    setFormData((prev) => ({
      ...prev,
      tiene_instalacion: false,
      precio_instalacion_completa: 0,
      precio_instalacion_parcial: 0,
      nota_instalacion: ""
    }));
  };

  return (
    <div className="wizard-section">
      <label>¿Desea incluir el servicio de instalación?</label>
      <select
        value={tipo}
        onChange={(e) => {
          const seleccion = e.target.value;
          setFormData((prev) => ({
            ...prev,
            tipo_instalacion: seleccion,
            tiene_instalacion: seleccion !== "NINGUNA"
          }));

          if (seleccion === "NINGUNA" || seleccion === "") limpiarInstalacion();
        }}
      >
        <option value="">Seleccionar opción...</option>
        <option value="NINGUNA">No incluir</option>
        <option value="COMPLETA">Instalación completa</option>
        <option value="PARCIAL">Instalación parcial</option>
      </select>

      {tipo === "COMPLETA" && (
        <div style={{ marginTop: "1rem" }}>
          <label>💸 Precio de instalación completa (S/)</label>
          <input
            type="number"
            min="0"
            value={formData.precio_instalacion_completa || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                precio_instalacion_completa: parseFloat(e.target.value),
              }))
            }
          />
        </div>
      )}

      {tipo === "PARCIAL" && (
        <>
          <div style={{ marginTop: "1rem" }}>
            <label>💰 Precio de instalación completa (S/)</label>
            <input
              type="number"
              min="0"
              value={formData.precio_instalacion_completa || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  precio_instalacion_completa: parseFloat(e.target.value),
                }))
              }
            />
          </div>

          <div style={{ marginTop: "1rem" }}>
            <label>💵 Precio de instalación parcial (S/)</label>
            <input
              type="number"
              min="0"
              value={formData.precio_instalacion_parcial || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  precio_instalacion_parcial: parseFloat(e.target.value),
                }))
              }
            />
          </div>

          <div style={{ marginTop: "1rem" }}>
            <label>📝 Nota sobre instalación parcial</label>
            <textarea
              rows="3"
              placeholder="Ej: Hasta 3 cuerpos de andamio..."
              value={formData.nota_instalacion || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  nota_instalacion: e.target.value,
                }))
              }
            />
          </div>
        </>
      )}
      
      <div style={{ fontSize: "13px", marginTop: "1rem", color: "#666" }}>
        {errores?.instalacion && <p className="error-text">{errores.instalacion}</p>}
      </div>
    </div>
  );
}