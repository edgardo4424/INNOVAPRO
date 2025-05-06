import Select from "react-select";

export default function ContactoForm({
  contacto,
  setContacto,
  clientes,
  obras,
  onSubmit,
  onCancel,
  modo = "agregar", // "agregar" o "editar"
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setContacto((prev) => ({ ...prev, [name]: value }));
  };

  const handleTelefonoChange = (value) => {
    const limpio = value.replace(/[^0-9]/g, "").slice(0, 9);
    setContacto((prev) => ({ ...prev, telefono: limpio }));
  };

  const handleSoloTexto = (value, campo) => {
    const limpio = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ. ]/g, "");
    setContacto((prev) => ({ ...prev, [campo]: limpio }));
  };

  return (
    <form onSubmit={onSubmit} className="gestion-form-global">
      {/* Nombre */}
      <input
        type="text"
        name="nombre"
        placeholder="Nombre"
        value={contacto.nombre}
        onChange={(e) => handleSoloTexto(e.target.value, "nombre")}
      />

      {/* Correo */}
      <input
        type="email"
        name="email"
        placeholder="Correo"
        value={contacto.email}
        onChange={handleChange}
      />

      {/* Teléfono */}
      <input
        type="text"
        name="telefono"
        placeholder="Teléfono"
        value={contacto.telefono}
        onChange={(e) => handleTelefonoChange(e.target.value)}
      />

      {/* Cargo */}
      <input
        type="text"
        name="cargo"
        placeholder="Cargo"
        value={contacto.cargo}
        onChange={(e) => handleSoloTexto(e.target.value, "cargo")}
      />

      {/* Clientes asociados */}
      <div className="form-group">
        <label>Clientes</label>
        <Select
          isMulti
          options={clientes.map((c) => ({
            value: c.id,
            label: c.razon_social || c.nombre,
          }))}
          value={
            clientes
              .filter((c) => contacto.clientes_asociados?.includes(c.id))
              .map((c) => ({ value: c.id, label: c.razon_social || c.nombre }))
          }
          onChange={(selected) =>
            setContacto((prev) => ({
              ...prev,
              clientes_asociados: selected.map((s) => s.value),
            }))
          }
          placeholder="Selecciona clientes..."
        />
      </div>

      {/* Obras asociadas */}
      <div className="form-group">
        <label>Obras</label>
        <Select
          isMulti
          options={obras.map((o) => ({
            value: o.id,
            label: o.nombre,
          }))}
          value={
            obras
              .filter((o) => contacto.obras_asociadas?.includes(o.id))
              .map((o) => ({ value: o.id, label: o.nombre }))
          }
          onChange={(selected) =>
            setContacto((prev) => ({
              ...prev,
              obras_asociadas: selected.map((s) => s.value),
            }))
          }
          placeholder="Selecciona obras..."
        />
      </div>

      {/* Botones */}
      <button type="submit" className="btn-guardar">
        {modo === "editar" ? "Guardar Cambios" : "Guardar Contacto"}
      </button>
      <button type="button" className="btn-cancelar" onClick={onCancel}>
        Cancelar
      </button>
    </form>
  );
}