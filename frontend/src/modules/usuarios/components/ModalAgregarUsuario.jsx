import UsuarioForm from "../forms/UsuarioForm";

export default function ModalAgregarUsuario({
  usuario,
  setUsuario,
  onCancel,
  onSubmit,
  errores,
}) {
  return (
    <div className="centro-modal">
      <div className="modal-content">
        <h2>Agregar Usuario</h2>
        <UsuarioForm
          modo="crear"
          usuario={usuario}
          setUsuario={setUsuario}
          onCancel={onCancel}
          onSubmit={onSubmit}
          errores={errores}
        />
      </div>
    </div>
  );
}