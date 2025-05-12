import EmpresaForm from "../forms/EmpresaForm";

export default function ModalEditarEmpresa({ empresa, setEmpresa, onCancel, onSubmit }) {
  return (
    <div className="centro-modal">
      <div className="modal-content">
        <h3>Editar Filial</h3>
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