import React from "react";

export default function EmpresaForm({ empresa, setEmpresa, onCancel, onSubmit }) {
  return (
    <form className="gestion-form-global" onSubmit={onSubmit}>
      {/* Razón Social */}
      <div className="form-group">
        <label>Razón Social *</label>
        <input
          type="text"
          value={empresa.razon_social || ""}
          onChange={(e) => setEmpresa({ ...empresa, razon_social: e.target.value })}
          required
        />
      </div>

      {/* RUC */}
      <div className="form-group">
        <label>RUC *</label>
        <input
          type="text"
          value={empresa.ruc || ""}
          maxLength={11}
          onChange={(e) =>
            setEmpresa({ ...empresa, ruc: e.target.value.replace(/[^0-9]/g, "") })
          }
          required
        />
      </div>

      {/* Dirección */}
      <div className="form-group">
        <label>Dirección Fiscal *</label>
        <input
          type="text"
          value={empresa.direccion || ""}
          onChange={(e) =>
            setEmpresa({ ...empresa, direccion: e.target.value })
          }
          required
        />
      </div>

      {/* Representante Legal */}
      <div className="form-group">
        <label>Representante Legal *</label>
        <input
          type="text"
          value={empresa.representante_legal || ""}
          onChange={(e) =>
            setEmpresa({ ...empresa, representante_legal: e.target.value })
          }
          required
        />
      </div>

      {/* Tipo Documento */}
      <div className="form-group">
        <label>Tipo de Documento *</label>
        <select
          value={empresa.tipo_documento}
          onChange={(e) =>
            setEmpresa({ ...empresa, tipo_documento: e.target.value })
          }
          required
        >
          <option value="">-- Seleccionar --</option>
          <option value="DNI">DNI</option>
          <option value="CE">CE</option>
          <option value="Pasaporte">Pasaporte</option>
        </select>
      </div>

      {/* DNI del Representante */}
      <div className="form-group">
        <label>Número de documento *</label>
        <input
          type="text"
          value={empresa.dni_representante || ""}
          maxLength={8}
          onChange={(e) =>
            setEmpresa({ ...empresa, dni_representante: e.target.value.replace(/[^0-9]/g, "") })
          }
          required
        />
      </div>

      {/* Cargo del Representante */}
      <div className="form-group">
        <label>Cargo del Representante *</label>
        <input
          type="text"
          value={empresa.cargo_representante || ""}
          onChange={(e) =>
            setEmpresa({ ...empresa, cargo_representante: e.target.value })
          }
          required
        />
      </div>

      {/* Teléfono Representante */}
      <div className="form-group">
        <label>Teléfono del Representante</label>
        <input
          type="text"
          maxLength={9}
          value={empresa.telefono_representante || ""}
          onChange={(e) =>
            setEmpresa({ ...empresa, telefono_representante: e.target.value.replace(/[^0-9]/g, "") })
          }
        />
      </div>

      {/* Teléfono Oficina */}
      <div className="form-group">
        <label>Teléfono de la Oficina</label>
        <input
          type="text"
          maxLength={9}
          value={empresa.telefono_oficina || ""}
          onChange={(e) =>
            setEmpresa({ ...empresa, telefono_oficina: e.target.value.replace(/[^0-9]/g, "") })
          }
        />
      </div>

      {/* Botones */}
      <button type="submit" className="btn-guardar">💾 Guardar</button>
      <button type="button" className="btn-cancelar" onClick={onCancel}>❌ Cancelar</button>
    </form>
  );
}
