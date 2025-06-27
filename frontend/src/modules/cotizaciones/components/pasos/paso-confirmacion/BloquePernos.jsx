// Este componente le permite al comercial decidir si desea incluir pernos o no en la cotización y en caso afirmativo,
// asignarle un precio de venta personalizado. Si se habilitan, se actualiza dinámicamente el despiece del formData
// con los valores ingresados. Ésto cumpliendo con la lógica de INNOVA y solicitud de Gerencia.

export default function BloquePernos({ formData, setFormData, errores }) {


  const incluirPernos = formData.tiene_pernos;
  const perno = formData.despiece.find(p => p.esPerno);

  return (
    <>
      {formData.tiene_pernos_disponibles && (
        <div className="wizard-section">
          <label>¿Desea incluir a la cotización los PERNOS DE EXPANSIÓN?</label>
          <select
            value={
                formData.tiene_pernos === true
                ? "TRUE"
                : formData.tiene_pernos === false
                ? "FALSE"
                : ""
            }
            onChange={(e) =>
                setFormData((prev) => ({
                ...prev,
                tiene_pernos: e.target.value === "TRUE",
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
            type="number"
            min="0"
            value={perno.precio_u_venta_soles || 0}
            onChange={(e) => {
              const nuevoPrecio = parseFloat(e.target.value);
              if (isNaN(nuevoPrecio) || nuevoPrecio < 0) return;

              const nuevoDespiece = formData.despiece.map(p =>
                p.esPerno
                  ? {
                      ...p,
                      incluido: true,
                      precio_u_venta_soles: nuevoPrecio,
                      precio_venta_soles: nuevoPrecio * p.total
                    }
                  : p
              );

              setFormData((prev) => ({
                ...prev,
                despiece: nuevoDespiece
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