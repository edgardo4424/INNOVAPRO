export default function UsuarioForm({
    modo = "crear",
    usuario,
    setUsuario,
    onSubmit,
    onCancel,
    errores = {},
  }) {
    const esCrear = modo === "crear";
  
    return (
      <form onSubmit={onSubmit} className="gestion-form-global" autoComplete="off">
        <div className="form-group">
          <label>Nombre *</label>
          <input
            type="text"
            value={usuario.nombre}
            onChange={(e) =>
              setUsuario((prev) => ({ ...prev, nombre: e.target.value }))
            }
            required
          />
          {errores.nombre && <p className="error-message">{errores.nombre}</p>}
        </div>

        <div className="form-group">
          <label>Teléfono Celular *</label>
          <input
            type="text"
            value={usuario.telefono}
            onChange={(e) =>
              setUsuario((prev) => ({ ...prev, telefono: e.target.value }))
            }
            required
          />
          {errores.telefono && <p className="error-message">{errores.telefono}</p>}
        </div>
  
        <div className="form-group">
          <label>Correo *</label>
          <input
            type="email"
            value={usuario.email}
            onChange={(e) =>
              setUsuario((prev) => ({ ...prev, email: e.target.value }))
            }
            required
            autoComplete="off"
          />
          {errores.email && <p className="error-message">{errores.email}</p>}
        </div>
  
        {esCrear && (
          <div className="form-group">
            <label>Contraseña *</label>
            <input
              type="password"
              value={usuario.password}
              onChange={(e) =>
                setUsuario((prev) => ({ ...prev, password: e.target.value }))
              }
              required
              autoComplete="new-password"
            />
            {errores.password && (
              <p className="error-message">{errores.password}</p>
            )}
          </div>
        )}
  
        <div className="form-group">
          <label>Rol *</label>
          <select
            value={usuario.rol}
            onChange={(e) =>
              setUsuario((prev) => ({ ...prev, rol: e.target.value }))
            }
            required
          >
            <option value="">Seleccione un rol</option>
            <option value="Clientes">Clientes</option>
            <option value="Gerencia">Gerencia</option>
            <option value="Ventas">Ventas</option>
            <option value="Oficina Técnica">Oficina Técnica</option>
            <option value="Almacén">Almacén</option>
            <option value="Administración">Administración</option>
          </select>
          {errores.rol && <p className="error-message">{errores.rol}</p>}
        </div>
  
        <button type="submit" className="btn-guardar">
          💾 Guardar
        </button>
        <button type="button" className="btn-cancelar" onClick={onCancel}>
          ❌ Cancelar
        </button>
      </form>
    );
  }  