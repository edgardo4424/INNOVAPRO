// Este componente le permite al comercial decidir si desea incluir pernos o no en la cotización y en caso afirmativo,
// asignarle un precio de venta personalizado. Si se habilitan, se actualiza dinámicamente el despiece del formData
// con los valores ingresados. Ésto cumpliendo con la lógica de INNOVA y solicitud de Gerencia.

export default function BloquePernos({ formData, setFormData, errores }) {

  const pernos = formData.atributos_opcionales.pernos;

  // En caso no haya pernos disponibles en el despiece, no renderizamos nada
  if (pernos.tiene_pernos_disponibles === false) return;

  const incluirPernos = pernos.tiene_pernos;
  const perno = formData.uso.despiece.find(p => p.esPerno);

  
  return (
    <>
      {pernos.tiene_pernos_disponibles && (
        <div className="wizard-section">
          <label>¿Desea incluir a la cotización los PERNOS DE EXPANSIÓN?</label>
          <select
            value={
                incluirPernos === true
                ? "TRUE"
                : incluirPernos === false
                ? "FALSE"
                : ""
            }
            onChange={(e) =>
                setFormData((prev) => ({
                ...prev,
                atributos_opcionales:{
                  ...prev.atributos_opcionales,
                  pernos: {
                    ...prev.pernos,
                    tiene_pernos: e.target.value === "TRUE",
                    tiene_pernos_disponibles: true,
                  }
                }
                }))
            }
            >
            <option value="">Seleccionar una opción</option>
            <option value="TRUE">Sí</option>
            <option value="FALSE">No</option>
        </select>
        <div style={{ fontSize: "13px", marginTop: "1rem", color: "#666" }}>
          {errores?.tiene_pernos && <p className="error-text">{errores.tiene_pernos}</p>}
        </div>
        </div>
      )}

      {incluirPernos && perno && (
        <div className="wizard-section">
          <label>💸 Precio de venta de los PERNOS DE EXPANSIÓN (S/)</label>
          <input
            type="text"
            inputMode="decimal"
            pattern="^[0-9]*[.,]?[0-9]{0,2}$" // opcional, para móviles y validación ligera
            placeholder="0.00"
            className="border p-2 rounded w-[120px]"
            value={perno.precio_u_venta_soles ?? ""}
            onWheel={(e) => e.target.blur()} // Previene scroll accidental
            onChange={(e) => {
              const valor = e.target.value;

              // Permitimos campo vacío temporalmente
              if (valor === "") {
                const nuevoDespiece = formData.uso.despiece.map(p =>
                  p.esPerno ? { ...p, precio_u_venta_soles: "", precio_venta_soles: "" } : p
                );

                setFormData(prev => ({
                  ...prev,
                  uso: {
                    ...prev.uso,
                    despiece: nuevoDespiece,
                  }
                }));
                return;
              }

              // Validación en vivo
              const nuevoPrecio = parseFloat(valor.replace(",", "."));
              if (isNaN(nuevoPrecio) || nuevoPrecio < 0) return;

              const nuevoDespiece = formData.uso.despiece.map(p =>
                p.esPerno
                  ? {
                      ...p,
                      incluido: true,
                      precio_u_venta_soles: nuevoPrecio,
                      precio_venta_soles: nuevoPrecio * p.total,
                    }
                  : p
              );

              setFormData(prev => ({
                ...prev,
                uso: {
                  ...prev.uso,
                  despiece: nuevoDespiece,
                }
              }));
            }}
            onBlur={(e) => {
              const valor = e.target.value;

              const nuevoPrecio = parseFloat(valor.replace(",", "."));
              const precioFinal = isNaN(nuevoPrecio) ? 0 : nuevoPrecio;

              const nuevoDespiece = formData.uso.despiece.map(p =>
                p.esPerno
                  ? {
                      ...p,
                      incluido: true,
                      precio_u_venta_soles: precioFinal,
                      precio_venta_soles: precioFinal * p.total,
                    }
                  : p
              );

              setFormData(prev => ({
                ...prev,
                uso: {
                  ...prev.uso,
                  despiece: nuevoDespiece,
                }
              }));
            }}
          />

          <div style={{ fontSize: "13px", marginTop: "1rem", color: "#666" }}>
            {errores?.precio_pernos && <p className="error-text">{errores.precio_pernos}</p>}
          </div>
        </div>
      )}
    </>
  );
}