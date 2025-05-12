import EmpresaForm from "../forms/EmpresaForm";

export default function ModalAgregarEmpresa({ empresa, setEmpresa, onCancel, onSubmit }) {
  return (
    <div className="centro-modal">
      <div className="modal-content">
        <h3>Agregar Filial</h3>
        <EmpresaForm
          empresa={empresa}
          setEmpresa={setEmpresa}
          onCancel={onCancel}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}