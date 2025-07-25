import Select from "react-select";
import DetallesApoyoTecnico from "./DetallesApoyoTecnico";
import DetallesApoyoAdmin from "./DetallesApoyoAdmin";
import DetallesPasePedido from "./DetallesPasePedido";
import DetallesServiciosAdicionales from "./DetallesServiciosAdicionales";
import DespieceTarea from "./DespieceTarea";
import styles from "./FormularioGeneral.module.css";

// Este es el componente principal del formulario de registro de tareas.
// Se divide por pasos: selección de contacto/cliente/obra/filial,
// tipo de tarea + detalles y zonas (si aplica).
// Carga y valida datos dinámicos de acuerdo al tipo de tarea

export default function FormularioGeneral({
  paso,
  setPaso,
  contactos,
  clientes,
  obras,
  empresas,
  clientesFiltrados,
  setClientesFiltrados,
  obrasFiltradas,
  setObrasFiltradas,
  obraSeleccionada,
  formData,
  setFormData,
  errores,
  onChangeCampo,
  onChangeDetalles,
  onSubmit,
}) {

  // Paso para seleccionar datos generales de la tarea
  const renderPaso1 = () => (
    <>
      <h3 className={styles.formStepContainer}>🏢 Paso 1: Contacto, Cliente, Obra y Filial</h3>
          {/* CONTACTO */}
          <div className="form-group">
            <label>Contacto:</label>
            <Select
              options={contactos.map(c => ({ label: `${c.nombre} — ${c.email}`, value: c.id }))}
              value={
                contactos.find(c => c.id === formData.contactoId)
                  ? {
                      label: `${contactos.find(c => c.id === formData.contactoId)?.nombre}`,
                      value: formData.contactoId,
                    }
                  : null
              }
              onChange={(option) => {
                const contacto = contactos.find(c => c.id === option.value);
                onChangeCampo("contactoId", option.value);
                onChangeCampo("clienteId", null);
                onChangeCampo("obraId", null);
                onChangeCampo("empresaProveedoraId", null);
                setClientesFiltrados(contacto?.clientes_asociados || []);
                setObrasFiltradas(contacto?.obras_asociadas || []);
              }}
              placeholder="— Seleccione un contacto —"
            />
          </div>

          {/* CLIENTE */}
          <div className="form-group">
            <label>Cliente:</label>
            <Select
              isDisabled={!formData.contactoId}
              options={clientesFiltrados.map(c => ({ label: c.razon_social, value: c.id }))}
              value={
                clientesFiltrados.find(c => c.id === formData.clienteId)
                  ? {
                      label: clientesFiltrados.find(c => c.id === formData.clienteId)?.razon_social,
                      value: formData.clienteId,
                    }
                  : null
              }
              onChange={(option) => onChangeCampo("clienteId", option.value)}
              placeholder="— Seleccione un cliente —"
            />
          </div>

          {/* OBRA */}
          <div className="form-group">
            <label>Obra:</label>
            <Select
              isDisabled={!formData.contactoId}
              options={obrasFiltradas.map(o => ({ label: o.nombre, value: o.id }))}
              value={
                obrasFiltradas.find(o => o.id === formData.obraId)
                  ? {
                      label: obrasFiltradas.find(o => o.id === formData.obraId)?.nombre,
                      value: formData.obraId,
                    }
                  : null
              }
              onChange={(option) => onChangeCampo("obraId", option.value)}
              placeholder="— Seleccione una obra —"
            />
          </div>

          {/* FILIAL */}
          <div className="form-group">
            <label>Filial:</label>
            <Select
              options={empresas.map(f => ({ label: f.razon_social, value: f.id }))}
              value={
                empresas.find(f => f.id === formData.empresaProveedoraId)
                  ? {
                      label: empresas.find(f => f.id === formData.empresaProveedoraId)?.razon_social,
                      value: formData.empresaProveedoraId,
                    }
                  : null
              }
              onChange={(option) => onChangeCampo("empresaProveedoraId", option.value)}
              placeholder="— Seleccione una filial —"
            />
          </div>
    </>
  );

  // Paso para seleccionar el tipo y detalles de la tarea dinámicamente
  const renderPaso2 = () => (
    <>
          <h3 className={styles.formStepContainer}>📝 Paso 2: Tipo de tarea y detalles</h3>
            {/* Tipo de tarea */}
            <div className="form-group">
              <label>Tipo de Tarea:</label>
              <select
                value={formData.tipoTarea || ""}
                onChange={(e) => onChangeCampo("tipoTarea", e.target.value)}
                required
              >
                <option value="">Seleccione...</option>
                <option value="Apoyo Técnico">Apoyo Técnico</option>
                <option value="Apoyo Administrativo">Apoyo Administrativo</option>
                <option value="Pase de Pedido">Pase de Pedido</option>
                <option value="Servicios Adicionales">Servicios Adicionales</option>
                <option value="Tarea Interna">Tarea Interna</option>
              </select>
              {errores.formData?.tipoTarea && <p className="error-message">{errores.formData.tipoTarea}</p>}
            </div>

            {/* Detalles según tipo */}
            {formData.tipoTarea === "Apoyo Técnico" && (
              <>
                <DetallesApoyoTecnico detalles={formData.detalles} onChange={onChangeDetalles} />
              </>
            )}

            {formData.tipoTarea === "Apoyo Administrativo" && (
              <DetallesApoyoAdmin detalles={formData.detalles} onChange={onChangeDetalles} />
            )}

            {formData.tipoTarea === "Pase de Pedido" && (
              <DetallesPasePedido
                detalles={formData.detalles}
                onChange={onChangeDetalles}
                obra={obraSeleccionada}
              />
            )}

            {formData.tipoTarea === "Servicios Adicionales" && (
              <DetallesServiciosAdicionales detalles={formData.detalles} onChange={onChangeDetalles} />
            )}
        </>
  );

  // Paso para definir las zonas y atributos de los equipos (si aplica)
  const renderPaso3Zonas = () => (
    <>
      <h3 className={styles.formStepContainer}>🧩 Paso 3: Zonas y Equipos</h3>
      <DespieceTarea formData={formData} setFormData={setFormData} />
    </>
  );

  return (
    <form onSubmit={onSubmit} className="registro-tarea-form">
      {paso === 1 && renderPaso1()}
      {paso === 2 && renderPaso2()}
      {paso === 3 && formData.tipoTarea === "Apoyo Técnico" && formData.detalles.apoyoTecnico?.includes("Despiece") && renderPaso3Zonas()}
     
      {paso === 3 && (
        <div className={styles.contenedorFinal}>
          <button type="submit" className={styles.btnSubmit} >
            Registrar Tarea
          </button>
        </div>
      )}

    </form>
    
  );
}