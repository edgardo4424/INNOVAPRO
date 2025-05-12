import UsuarioForm from "../forms/UsuarioForm";

export default function ModalEditarUsuario({
  usuario,
  setUsuario,
  onCancel,
  onSubmit,
  errores,
}) {
  return (
    <div className="centro-modal">
      <div className="modal-content">
        <h3>Editar Usuario</h3>
        <UsuarioForm
          modo="editar"
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