import useRegistrarTarea from "../hooks/useRegistrarTarea";
import "../../../styles/registroTarea.css";
import FormularioGeneral from "../components/FormularioGeneral";

export default function RegistrarTarea() {
  const {
    empresas,
    clientes,
    obras,
    formData,
    tipoTarea,
    errores,
    obraSeleccionada,
    registrarTarea,
    setTipoTarea,
    setFormData,
    handleInputChange,
    handleDetallesChange,
  } = useRegistrarTarea();

  return (
    <div className="registro-tarea-container">
      <h2 className="registro-tarea-titulo">📌 Registrar Nueva Tarea</h2>

      <div className="registro-tarea-mensaje">
        <p>
          🛠️ <strong>Estimado compañero comercial</strong>, brinde toda la información
          necesaria para completar su tarea en los tiempos que lo necesite.
        </p>
      </div>

      <FormularioGeneral
        empresas={empresas}
        clientes={clientes}
        obras={obras}
        formData={formData}
        setFormData={setFormData}
        tipoTarea={tipoTarea}
        setTipoTarea={setTipoTarea}
        errores={errores}
        obraSeleccionada={obraSeleccionada}
        onChangeCampo={handleInputChange}
        onChangeDetalles={handleDetallesChange}
        onSubmit={registrarTarea}
      />
    </div>
  );
}