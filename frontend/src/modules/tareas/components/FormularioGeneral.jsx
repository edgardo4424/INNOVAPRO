import Select from "react-select";
import DetallesApoyoTecnico from "./DetallesApoyoTecnico";
import DetallesApoyoAdmin from "./DetallesApoyoAdmin";
import DetallesPasePedido from "./DetallesPasePedido";
import DetallesServiciosAdicionales from "./DetallesServiciosAdicionales";

export default function FormularioGeneral({
  empresas,
  clientes,
  obras,
  formData,
  setFormData,
  tipoTarea,
  setTipoTarea,
  errores,
  obraSeleccionada,
  onChangeCampo,
  onChangeDetalles,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} className="registro-tarea-form">
      {/* Filial */}
      <div className="form-group">
        <label>Filial de Innova:</label>
        <Select
          value={
            formData.empresaProveedoraId
              ? {
                  value: formData.empresaProveedoraId,
                  label:
                    empresas.find((e) => e.id === formData.empresaProveedoraId)
                      ?.razon_social || "Seleccione...",
                }
              : null
          }
          onChange={(selected) =>
            onChangeCampo("empresaProveedoraId", selected?.value || "")
          }
          options={empresas.map((e) => ({
            value: e.id,
            label: e.razon_social,
          }))}
          placeholder="Seleccione..."
          isSearchable
        />
        {errores.empresaProveedoraId && (
          <p className="error-message">{errores.empresaProveedoraId}</p>
        )}
      </div>

      {/* Cliente */}
      <div className="form-group">
        <label>Cliente:</label>
        <Select
          value={
            formData.clienteId
              ? {
                  value: formData.clienteId,
                  label:
                    clientes.find((c) => c.id === formData.clienteId)
                      ?.razon_social || "Seleccione...",
                }
              : null
          }
          onChange={(selected) =>
            onChangeCampo("clienteId", selected?.value || "")
          }
          options={clientes.map((c) => ({
            value: c.id,
            label: c.razon_social,
          }))}
          placeholder="Seleccione..."
          isSearchable
        />
        {errores.clienteId && (
          <p className="error-message">{errores.clienteId}</p>
        )}
      </div>

      {/* Obra */}
      <div className="form-group">
        <label>Obra:</label>
        <Select
          value={
            formData.obraId
              ? {
                  value: formData.obraId,
                  label:
                    obras.find((o) => o.id === formData.obraId)?.nombre ||
                    "Seleccione...",
                }
              : null
          }
          onChange={(selected) =>
            onChangeCampo("obraId", selected?.value || "")
          }
          options={obras.map((o) => ({
            value: o.id,
            label: o.nombre,
          }))}
          placeholder="Seleccione..."
          isSearchable
        />
        {errores.obraId && <p className="error-message">{errores.obraId}</p>}
      </div>

      {/* Urgencia */}
      <div className="form-group">
        <label>Nivel de Urgencia:</label>
        <select
          value={formData.urgencia}
          onChange={(e) => onChangeCampo("urgencia", e.target.value)}
          required
        >
          <option value="">Seleccione...</option>
          <option value="Prioridad">Prioridad</option>
          <option value="Normal">Normal</option>
          <option value="Baja prioridad">Baja prioridad</option>
        </select>
        {errores.urgencia && <p className="error-message">{errores.urgencia}</p>}
      </div>

      {/* Tipo de tarea */}
      <div className="form-group">
        <label>Tipo de Tarea:</label>
        <select
          value={tipoTarea}
          onChange={(e) => setTipoTarea(e.target.value)}
          required
        >
          <option value="">Seleccione...</option>
          <option value="Apoyo Técnico">Apoyo Técnico</option>
          <option value="Apoyo Administrativo">Apoyo Administrativo</option>
          <option value="Pase de Pedido">Pase de Pedido</option>
          <option value="Servicios Adicionales">Servicios Adicionales</option>
          <option value="Tarea Interna">Tarea Interna</option>
        </select>
        {errores.tipoTarea && <p className="error-message">{errores.tipoTarea}</p>}
      </div>

      {/* Detalles según tipo */}
      {tipoTarea === "Apoyo Técnico" && (
        <DetallesApoyoTecnico detalles={formData.detalles} onChange={onChangeDetalles} />
      )}

      {tipoTarea === "Apoyo Administrativo" && (
        <DetallesApoyoAdmin detalles={formData.detalles} onChange={onChangeDetalles} />
      )}

      {tipoTarea === "Pase de Pedido" && (
        <DetallesPasePedido
          detalles={formData.detalles}
          onChange={onChangeDetalles}
          obra={obraSeleccionada}
        />
      )}

      {tipoTarea === "Servicios Adicionales" && (
        <DetallesServiciosAdicionales detalles={formData.detalles} onChange={onChangeDetalles} />
      )}

      <button type="submit" className="btn-registrar">Registrar Tarea</button>
    </form>
  );
}