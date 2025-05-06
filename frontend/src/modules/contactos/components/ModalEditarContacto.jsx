import ContactoForm from "../forms/ContactoForm";

export default function ModalEditarContacto({
  contacto,
  setContacto,
  clientes,
  obras,
  onSubmit,
  onCancel,
}) {
  return (
    <div className="centro-modal">
      <div className="modal-content">
        <h3>Editar Contacto</h3>
        <ContactoForm
          contacto={contacto}
          setContacto={setContacto}
          clientes={clientes}
          obras={obras}
          onSubmit={onSubmit}
          onCancel={onCancel}
          modo="editar"
        />
      </div>
    </div>
  );
}