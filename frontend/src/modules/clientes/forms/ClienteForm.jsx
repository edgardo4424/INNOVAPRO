import React from "react";

export default function ClienteForm({
  cliente,
  setCliente,
  errores,
  onCancel,
  onSubmit,
  handleBuscarRUC,
  rucNoEncontrado,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente((prev) => ({ ...prev, [name]: value }));
  };

  const getError = (campo) => errores?.[campo] || "";

  return (
    <form onSubmit={onSubmit} className="gestion-form-global">
      {/* Tipo de cliente */}
      <div className="form-group">
        <label>Tipo de Cliente:</label>
        <select name="tipo" value={cliente.tipo} onChange={handleChange}>
          <option value="Persona Jurídica">Persona Jurídica</option>
          <option value="Persona Natural">Persona Natural</option>
        </select>
      </div>

      {/* Razon Social / Nombre */}
      <input
        name="razon_social"
        type="text"
        placeholder={
          cliente.tipo === "Persona Jurídica" ? "Razón Social" : "Nombre Completo"
        }
        value={cliente.razon_social}
        onChange={handleChange}
      />
      {getError("razon_social") && <p className="error-message">{getError("razon_social")}</p>}

      {cliente.tipo === "Persona Jurídica" ? (
        <>
          {/* RUC */}
          <input
            name="ruc"
            type="text"
            placeholder="RUC"
            value={cliente.ruc}
            onChange={(e) => setCliente({ ...cliente, ruc: e.target.value })}
            onBlur={handleBuscarRUC}
          />

            <small className="form-text-info">
            Ingresa el RUC y sal del campo para completar los datos automáticamente desde SUNAT.
            </small>
            
          {rucNoEncontrado && (
            <p className="error-message">
                Este RUC no se encuentra en SUNAT. Por favor complétalo manualmente.
            </p>
            )}


          {/* Representante Legal */}
          <input
            name="representante_legal"
            type="text"
            placeholder="Representante Legal"
            value={cliente.representante_legal}
            onChange={handleChange}
          />
          {getError("representante_legal") && (
            <p className="error-message">{getError("representante_legal")}</p>
          )}

          {/* Tipo de documento del representante */}
          <select
            name="tipo_documento"
            value={cliente.tipo_documento}
            onChange={handleChange}
          >
            <option value="DNI">DNI</option>
            <option value="CE">CE</option>
            <option value="Pasaporte">Pasaporte</option>
          </select>

          {/* Documento del representante */}
          <input
            name="dni_representante"
            type="text"
            placeholder="Documento del Representante"
            value={cliente.dni_representante}
            onChange={handleChange}
          />
          {getError("dni_representante") && (
            <p className="error-message">{getError("dni_representante")}</p>
          )}

          {/* Dirección */}
          <input
            name="domicilio_fiscal"
            type="text"
            placeholder="Domicilio Fiscal"
            value={cliente.domicilio_fiscal}
            onChange={handleChange}
          />
          {getError("domicilio_fiscal") && (
            <p className="error-message">{getError("domicilio_fiscal")}</p>
          )}
        </>
      ) : (
        <>
          {/* Tipo de documento */}
          <select
            name="tipo_documento"
            value={cliente.tipo_documento}
            onChange={handleChange}
          >
            <option value="DNI">DNI</option>
            <option value="CE">CE</option>
            <option value="Pasaporte">Pasaporte</option>
          </select>

          {/* Documento */}
          <input
            name="dni"
            type="text"
            placeholder="Número de Documento"
            value={cliente.dni}
            onChange={handleChange}
          />
          {getError("dni") && <p className="error-message">{getError("dni")}</p>}
        </>
      )}

      {/* Teléfono */}
      <input
        name="telefono"
        type="text"
        placeholder="Teléfono"
        value={cliente.telefono}
        onChange={handleChange}
      />
      {getError("telefono") && <p className="error-message">{getError("telefono")}</p>}

      {/* Correo */}
      <input
        name="email"
        type="email"
        placeholder="Correo Electrónico"
        value={cliente.email}
        onChange={handleChange}
      />
      {getError("email") && <p className="error-message">{getError("email")}</p>}

      {/* Botones */}
      
      <button type="submit" className="btn-guardar">Guardar</button>
      <button type="button" className="btn-cancelar" onClick={onCancel}>Cancelar</button>
      
    </form>
  );
}