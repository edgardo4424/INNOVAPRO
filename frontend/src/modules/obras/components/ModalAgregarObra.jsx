import ObraForm from "../forms/ObraForm";

export default function ModalAgregarObra({ obra, setObra, onCancel, onSubmit }) {
  return (
    <div className="centro-modal">
      <div className="modal-content">
        <h2>Agregar Obra</h2>
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