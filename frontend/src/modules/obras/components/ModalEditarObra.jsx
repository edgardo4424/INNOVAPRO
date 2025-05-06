import ObraForm from "../forms/ObraForm";

export default function ModalEditarObra({ obra, setObra, onCancel, onSubmit }) {
  return (
    <div className="centro-modal">
      <div className="modal-content">
        <h3>Editar Obra</h3>
        <ObraForm
          obra={obra}
          setObra={setObra}
          onCancel={onCancel}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}