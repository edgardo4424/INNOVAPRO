// Este componente le permite al comercial decidir si desea incluir instalación o no en la cotización y en caso afirmativo,
// decidir si será parcial o completa. Si es completa, indica el precio personalizado. Si es parcial, aparte de indicar el 
// precio de la instalación completa deberá indicar el precio de la instalación parcial añadiendo una nota para que especifique
// a qué se está refiriendo con "parcial"

export default function BloqueInstalacion({ formData, setFormData, errores }) {
  // Almacenamos el tipo de cotización que puede ser Completa o Parcial
  const tipo = formData.atributos_opcionales.instalacion.tipo_instalacion || "";

  const limpiarInstalacion = () => {
    setFormData((prev) => ({
      ...prev,
      atributos_opcionales:{
        ...prev.atributos_opcionales,
        instalacion: {
          ...prev.atributos_opcionales.instalacion,
          tiene_instalacion: false,
          precio_instalacion_completa: 0,
          precio_instalacion_parcial: 0,
          nota_instalacion: ""
        }
      }
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
            atributos_opcionales:{
              ...prev.atributos_opcionales,
              instalacion: {
                ...prev.atributos_opcionales.instalacion,
                tipo_instalacion: seleccion,
                tiene_instalacion: seleccion !== "NINGUNA"
              }
            }
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
            onWheel={(e) => e.target.blur()} 
            min="0" 
            step="0.01" 
            placeholder="0.00" 
            value={formData.atributos_opcionales.instalacion.precio_instalacion_completa ?? ""} // Muestra el valor actual del campo, si es null o undefined, se muestra el placeholder
              onChange={(e) => {
                const valor = e.target.value;
                // Al escribir, se guarda el valor como string temporal para permitir escritura libre (incluso vacío)
                setFormData((prev) => ({
                  ...prev,
                  atributos_opcionales:{
                    ...prev.atributos_opcionales,
                    instalacion: {
                      ...prev.atributos_opcionales.instalacion,
                      precio_instalacion_completa: valor,
                    }
                  }
                }))
              }}
              onBlur={(e) => {
                const valor = e.target.value;
                // Cuando el usuario sale del campo (blur), validamos:
                // Si el campo quedó vacío, guardamos 0.00
                // Si tiene valor, lo convertimos (parseFloat)
                setFormData((prev) => ({
                  ...prev,
                  atributos_opcionales: {
                    ...prev.atributos_opcionales,
                    instalacion: {
                      ...prev.atributos_opcionales.instalacion,
                      precio_instalacion_completa: valor === "" ? 0.00 : parseFloat(valor)
                    }
                  }
                }));
              }}
            />
        </div>
      )}

      {tipo === "PARCIAL" && (
        <>
          <div style={{ marginTop: "1rem" }}>
            <label>💰 Precio de instalación completa (S/)</label>
            <input
            type="number"
            onWheel={(e) => e.target.blur()} 
            min="0" 
            step="0.01" 
            placeholder="0.00" 
            value={formData.atributos_opcionales.instalacion.precio_instalacion_completa ?? ""} // Muestra el valor actual del campo, si es null o undefined, se muestra el placeholder
              onChange={(e) => {
                const valor = e.target.value;
                // Al escribir, se guarda el valor como string temporal para permitir escritura libre (incluso vacío)
                setFormData((prev) => ({
                  ...prev,
                  atributos_opcionales:{
                    ...prev.atributos_opcionales,
                    instalacion: {
                      ...prev.atributos_opcionales.instalacion,
                      precio_instalacion_completa: valor,
                    }
                  }
                }))
              }}
              onBlur={(e) => {
                const valor = e.target.value;
                // Cuando el usuario sale del campo (blur), validamos:
                // Si el campo quedó vacío, guardamos 0.00
                // Si tiene valor, lo convertimos (parseFloat)
                setFormData((prev) => ({
                  ...prev,
                  atributos_opcionales: {
                    ...prev.atributos_opcionales,
                    instalacion: {
                      ...prev.atributos_opcionales.instalacion,
                      precio_instalacion_completa: valor === "" ? 0.00 : parseFloat(valor)
                    }
                  }
                }));
              }}
            />
          </div>

          <div style={{ marginTop: "1rem" }}>
            <label>💵 Precio de instalación parcial (S/)</label>
            <input
            type="number"
            onWheel={(e) => e.target.blur()} 
            min="0" 
            step="0.01" 
            placeholder="0.00" 
            value={formData.atributos_opcionales.instalacion.precio_instalacion_parcial ?? ""} // Muestra el valor actual del campo, si es null o undefined, se muestra el placeholder
              onChange={(e) => {
                const valor = e.target.value;
                // Al escribir, se guarda el valor como string temporal para permitir escritura libre (incluso vacío)
                setFormData((prev) => ({
                  ...prev,
                  atributos_opcionales:{
                    ...prev.atributos_opcionales,
                    instalacion: {
                      ...prev.atributos_opcionales.instalacion,
                      precio_instalacion_parcial: valor,
                    }
                  }
                }))
              }}
              onBlur={(e) => {
                const valor = e.target.value;
                // Cuando el usuario sale del campo (blur), validamos:
                // Si el campo quedó vacío, guardamos 0.00
                // Si tiene valor, lo convertimos (parseFloat)
                setFormData((prev) => ({
                  ...prev,
                  atributos_opcionales: {
                    ...prev.atributos_opcionales,
                    instalacion: {
                      ...prev.atributos_opcionales.instalacion,
                      precio_instalacion_parcial: valor === "" ? 0.00 : parseFloat(valor)
                    }
                  }
                }));
              }}
            />
          </div>

          <div className="wizard-section">
          <label htmlFor="nota_instalacion" style={{ fontWeight: 600, marginBottom: "0.5rem", display: "block" }}>
            📝 Nota sobre instalación parcial
          </label>
          <textarea
            id="nota_instalacion"
            rows="4"
            placeholder="Ej: El precio es referente a 3 cuerpos de andamios"
            value={formData.atributos_opcionales.instalacion.nota_instalacion || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                atributos_opcionales:{
                  ...prev.atributos_opcionales,
                  instalacion: {
                    ...prev.atributos_opcionales.instalacion,
                    nota_instalacion: e.target.value,
                  }
                }
              }))
            }
            style={{
              width: "100%",
              padding: "0.75rem",
              fontSize: "14px",
              lineHeight: "1.6",
              border: "1px solid #ccc",
              borderRadius: "8px",
              resize: "vertical",
              boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)",
              backgroundColor: "#f9f9f9",
              transition: "border-color 0.2s ease-in-out",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#007bff")}
            onBlur={(e) => (e.target.style.borderColor = "#ccc")}
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