import ContactoForm from "../forms/ContactoForm";

export default function ModalAgregarContacto({
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
        <h3>Agregar Contacto</h3>
        <ContactoForm
          contacto={contacto}
          setContacto={setContacto}
          clientes={clientes}
          obras={obras}
          onSubmit={onSubmit}
          onCancel={onCancel}
          modo="agregar"
        />
      </div>
    </div>
  );
}